// Firebase 실시간 통계 서비스 - 🔥 동시접속자 버그 수정 버전
import { 
  ref, 
  get, 
  set, 
  onValue, 
  off, 
  serverTimestamp,
  increment
} from 'firebase/database';
import { database, DB_PATHS, isFirebaseConnected } from '../config/firebase.js';
import { logger } from '../utils/logger.js';
import { errorReporter } from '../utils/errorReporter.js';

class StatsService {
  constructor() {
    this.listeners = new Map();
    this.isFirebaseConnected = isFirebaseConnected;
    this.localStats = {
      totalVisits: 0,
      totalTimeWasted: 0,
      activeSessions: 0
    };
  }

  // 📊 총 방문 횟수 증가
  async incrementVisits() {
    try {
      if (this.isFirebaseConnected) {
        const visitsRef = ref(database, 'global-stats/totalVisits');
        
        // 먼저 값을 읽어서 현재 값 확인
        const snapshot = await get(visitsRef);
        const currentValue = snapshot.val() || 0;
        
        // 직접 수치를 설정 (귛등 문제 방지)
        const newValue = currentValue + 1;
        await set(visitsRef, newValue);
        
        return newValue;
      } else {
        // 로컬 모드
        this.localStats.totalVisits += 1;
        localStorage.setItem('global_stats', JSON.stringify(this.localStats));
        return this.localStats.totalVisits;
      }
    } catch (error) {
      // 방문 횟수 증가 실패 (콘솔 로그 제거됨)
      // 실패해도 기본값 반환
      return this.localStats.totalVisits || 1;
    }
  }

  // 📊 총 시간낭비 증가
  async addTimeWasted(seconds) {
    try {
      if (this.isFirebaseConnected) {
        const timeRef = ref(database, 'global-stats/totalTimeWasted');
        await set(timeRef, increment(seconds));
        
        // 현재 값 반환
        const snapshot = await get(timeRef);
        return snapshot.val() || 0;
      } else {
        // 로컬 모드
        this.localStats.totalTimeWasted += seconds;
        localStorage.setItem('global_stats', JSON.stringify(this.localStats));
        return this.localStats.totalTimeWasted;
      }
    } catch (error) {
      // 시간낭비 추가 실패 (콘솔 로그 제거됨)
      return 0;
    }
  }

  // 📊 활성 세션 수 계산 (동시 접속자) - 🔥 PC 안정성 개선
  async getActiveSessions() {
    try {
      if (this.isFirebaseConnected) {
        const sessionsRef = ref(database, DB_PATHS.SESSIONS);
        const snapshot = await get(sessionsRef);
        
        if (!snapshot.exists()) {
          return 1; // 기본값
        }

        const sessions = Object.values(snapshot.val());
        const now = Date.now();
        
        // 🔥 더 관대한 시간 기준 (30초 → 45초)
        const fortyFiveSecondsAgo = now - (45 * 1000);
        
        // 활성 세션 필터링 개선
        const activeSessions = sessions.filter((session) => {
          if (!session.isActive) {
            return false;
          }
          
          // 하트비트 시간 처리 개선
          const lastHeartbeat = session.lastHeartbeat;
          let heartbeatTime = 0;
          
          if (typeof lastHeartbeat === 'object' && lastHeartbeat.seconds) {
            // Firebase serverTimestamp 형식
            heartbeatTime = lastHeartbeat.seconds * 1000;
          } else if (typeof lastHeartbeat === 'number') {
            // 일반 timestamp
            heartbeatTime = lastHeartbeat;
          } else {
            // 🔥 하트비트가 없는 경우, 세션 시작 시간 사용
            const startTime = session.startTime;
            if (typeof startTime === 'object' && startTime.seconds) {
              heartbeatTime = startTime.seconds * 1000;
            } else if (typeof startTime === 'number') {
              heartbeatTime = startTime;
            }
          }
          
          // 🔥 PC 브라우저를 위한 더 관대한 기준
          const isRecent = heartbeatTime > fortyFiveSecondsAgo;
          
          // 🔥 추가 검증: 세션이 너무 오래된 것은 제외 (2시간 이상)
          const twoHoursAgo = now - (2 * 60 * 60 * 1000);
          const isNotTooOld = heartbeatTime > twoHoursAgo;
          
          return isRecent && isNotTooOld;
        });
        
        const result = Math.max(1, activeSessions.length);
        
        // 🔥 디버깅 로그 (개발 환경에서만)
        if (process.env.NODE_ENV === 'development') {
          console.log('동시접속자 계산:', {
            전체세션: sessions.length,
            활성세션: activeSessions.length,
            최종결과: result,
            기준시간: new Date(fortyFiveSecondsAgo).toLocaleTimeString()
          });
        }
        
        return result; // 최소 1명
      } else {
        // 로컬 모드 - 시뮬레이션
        const hour = new Date().getHours();
        let baseUsers = 2;
        let timeWeight = 1;
        
        if (hour >= 9 && hour <= 12) timeWeight = 1.3;
        else if (hour >= 14 && hour <= 18) timeWeight = 1.5;
        else if (hour >= 19 && hour <= 23) timeWeight = 1.8;
        else if (hour >= 0 && hour <= 2) timeWeight = 1.2;
        else timeWeight = 0.8;

        const variation = (Math.random() - 0.5) * 3;
        return Math.max(1, Math.min(12, Math.round(baseUsers * timeWeight + variation)));
      }
    } catch (error) {
      return 1;
    }
  }

  // 📊 전체 통계 가져오기
  async getGlobalStats() {
    try {
      if (this.isFirebaseConnected) {
        const statsRef = ref(database, 'global-stats');
        const snapshot = await get(statsRef);
        
        if (!snapshot.exists()) {
          // 초기값 설정 - 더 안전하게
          const initialStats = {
            totalVisits: 1,
            totalTimeWasted: 0,
            lastUpdated: Date.now() // serverTimestamp 대신 일반 타임스탬프
          };
          await set(statsRef, initialStats).catch(err => {
            // 초기 통계 설정 실패 (콘솔 로그 제거됨)
          });
          return { ...initialStats, activeSessions: 1 };
        }

        const stats = snapshot.val();
        const activeSessions = await this.getActiveSessions();
        
        return {
          totalVisits: stats.totalVisits || 0,
          totalTimeWasted: stats.totalTimeWasted || 0,
          activeSessions,
          lastUpdated: stats.lastUpdated
        };
      } else {
        // 로컬 모드
        const stored = localStorage.getItem('global_stats');
        if (stored) {
          this.localStats = JSON.parse(stored);
        }
        
        const activeSessions = await this.getActiveSessions();
        
        return {
          totalVisits: this.localStats.totalVisits || 0,
          totalTimeWasted: this.localStats.totalTimeWasted || 0,
          activeSessions,
          lastUpdated: Date.now()
        };
      }
    } catch (error) {
      // 전체 통계 조회 실패 (콘솔 로그 제거됨)
      return {
        totalVisits: 1,
        totalTimeWasted: 0,
        activeSessions: 1,
        lastUpdated: Date.now()
      };
    }
  }

  // 📊 실시간 통계 리스너 등록
  onStatsChange(callback) {
    if (this.isFirebaseConnected) {
      const statsRef = ref(database, 'global-stats');
      
      const listener = onValue(statsRef, async (snapshot) => {
        const stats = snapshot.val() || {};
        const activeSessions = await this.getActiveSessions();
        
        callback({
          totalVisits: stats.totalVisits || 0,
          totalTimeWasted: stats.totalTimeWasted || 0,
          activeSessions,
          lastUpdated: stats.lastUpdated || Date.now()
        });
      });

      this.listeners.set('stats', listener);
      return () => this.removeListener('stats');
    } else {
      // 로컬 모드 - 주기적 업데이트
      const updateStats = async () => {
        const stats = await this.getGlobalStats();
        callback(stats);
      };
      
      // 초기 로드
      updateStats();
      
      // 30초마다 업데이트
      const intervalId = setInterval(updateStats, 30000);
      
      this.listeners.set('stats', intervalId);
      return () => {
        clearInterval(intervalId);
        this.listeners.delete('stats');
      };
    }
  }

  // 📊 활성 세션 수 실시간 리스너 - 🔥 PC 안정성 개선
  onActiveSessionsChange(callback) {
    if (this.isFirebaseConnected) {
      // 🔥 디바운싱 및 캐싱 추가 + 강제 업데이트
      let lastResult = null;
      let debounceTimer = null;
      let forceUpdateTimer = null;
      
      const sessionsRef = ref(database, DB_PATHS.SESSIONS);
      
      const listener = onValue(sessionsRef, async (snapshot) => {
        // 디바운싱: 0.5초 내에 여러 변경이 있으면 마지막것만 처리
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }
        
        debounceTimer = setTimeout(async () => {
          try {
            const activeSessions = await this.getActiveSessions();
            
            // 값이 변경되었을 때만 콜백 호출 (캐싱)
            if (lastResult !== activeSessions) {
              lastResult = activeSessions;
              callback(activeSessions);
            }
          } catch (error) {
            // 에러 발생 시 기본값 반환
            if (lastResult !== 1) {
              lastResult = 1;
              callback(1);
            }
          }
        }, 500); // 🔥 0.5초 디바운싱 (더 빠른 반응)
      });
      
      // 🔥 PC 안정성용: 3초마다 강제 업데이트
      forceUpdateTimer = setInterval(async () => {
        try {
          const activeSessions = await this.getActiveSessions();
          if (lastResult !== activeSessions) {
            lastResult = activeSessions;
            callback(activeSessions);
          }
        } catch (error) {
          // 에러 무시
        }
      }, 3000);

      this.listeners.set('activeSessions', listener);
      return () => {
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }
        if (forceUpdateTimer) {
          clearInterval(forceUpdateTimer);
        }
        this.removeListener('activeSessions');
      };
    } else {
      // 로컬 모드 - 주기적 업데이트
      const updateActiveSessions = async () => {
        const activeSessions = await this.getActiveSessions();
        callback(activeSessions);
      };
      
      // 초기 로드
      updateActiveSessions();
      
      // 5초마다 업데이트
      const intervalId = setInterval(updateActiveSessions, 5000);
      
      this.listeners.set('activeSessions', intervalId);
      return () => {
        clearInterval(intervalId);
        this.listeners.delete('activeSessions');
      };
    }
  }

  // 리스너 제거
  removeListener(key) {
    if (this.listeners.has(key)) {
      const listener = this.listeners.get(key);
      if (this.isFirebaseConnected) {
        off(ref(database), 'value', listener);
      } else {
        clearInterval(listener);
      }
      this.listeners.delete(key);
    }
  }

  // 모든 리스너 제거
  removeAllListeners() {
    this.listeners.forEach((listener, key) => {
      this.removeListener(key);
    });
  }

  // 세션 종료 시 통계 업데이트
  async updateOnSessionEnd(elapsedTime) {
    try {
      if (elapsedTime > 0) {
        await this.addTimeWasted(elapsedTime);
      }
    } catch (error) {
      // 세션 종료 통계 업데이트 실패 (콘솔 로그 제거됨)
    }
  }
}

// 싱글톤 인스턴스
export const statsService = new StatsService();
export default StatsService;