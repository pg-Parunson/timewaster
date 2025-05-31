// Firebase 실시간 랭킹 서비스
import { 
  ref, 
  push, 
  set, 
  get, 
  onValue, 
  off, 
  serverTimestamp,
  query,
  orderByChild,
  limitToLast,
  remove,
  onDisconnect,
  update
} from 'firebase/database';
import { database, ANONYMOUS_NAMES, DB_PATHS, RANKING_PERIODS, isFirebaseConnected } from '../config/firebase.js';
import { logger } from '../utils/logger.js';

class RankingService {
  constructor() {
    this.sessionId = null;
    this.anonymousName = null;
    this.heartbeatInterval = null;
    this.listeners = new Map();
    this.isFirebaseConnected = isFirebaseConnected;
    this.localRanking = []; // Firebase 연결 실패 시 로컬 랭킹
    

  }

  // 세션 초기화 (사용자 접속 시) - 🔥 중복 세션 방지 추가
  async initializeSession() {
    try {
      // 🔥 브라우저 세션 ID 생성 (탭 단위로 고유)
      const tabId = sessionStorage.getItem('timewaster_tab_id') || `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('timewaster_tab_id', tabId);
      
      // 고유 세션 ID 생성
      this.sessionId = `session_${tabId}_${Date.now()}`;
      
      // 랜덤 익명 닉네임 선택
      this.anonymousName = ANONYMOUS_NAMES[Math.floor(Math.random() * ANONYMOUS_NAMES.length)];
      
      if (this.isFirebaseConnected) {
        // 🔥 기존 동일 탭의 세션 정리 (새로고침 대비)
        const existingSessionRef = ref(database, DB_PATHS.SESSIONS);
        const existingSnapshot = await get(existingSessionRef);
        
        if (existingSnapshot.exists()) {
          const sessions = Object.entries(existingSnapshot.val());
          for (const [sessionKey, sessionData] of sessions) {
            if (sessionData.sessionId && sessionData.sessionId.includes(tabId)) {
              // 동일 탭의 이전 세션 비활성화
              await set(ref(database, `${DB_PATHS.SESSIONS}/${sessionKey}/isActive`), false);
              await set(ref(database, `${DB_PATHS.SESSIONS}/${sessionKey}/endTime`), serverTimestamp());
            }
          }
        }
        
        // Firebase 모드 - 새 세션 생성
        const sessionData = {
          sessionId: this.sessionId,
          anonymousName: this.anonymousName,
          startTime: serverTimestamp(),
          currentTime: 0,
          isActive: true,
          lastHeartbeat: serverTimestamp(),
          userAgent: navigator.userAgent.substring(0, 100)
        };

        const sessionRef = ref(database, `${DB_PATHS.SESSIONS}/${this.sessionId}`);
        await set(sessionRef, sessionData);
        
        // 🔥 중요: 브라우저 닫힘/새로고침 시 세션 자동 정리
        await onDisconnect(ref(database, `${DB_PATHS.SESSIONS}/${this.sessionId}/isActive`)).set(false);
        await onDisconnect(ref(database, `${DB_PATHS.SESSIONS}/${this.sessionId}/endTime`)).set(serverTimestamp());
        
        this.startHeartbeat();
        await this.addLiveFeedEvent('join', `${this.anonymousName}님이 접속했습니다`);
      } else {
        // 로컬 모드
        const sessionData = {
          sessionId: this.sessionId,
          anonymousName: this.anonymousName,
          startTime: Date.now(),
          currentTime: 0,
          isActive: true,
          lastHeartbeat: Date.now()
        };
        
        // 로컬 스토리지에 저장
        this.localRanking = [sessionData];
        localStorage.setItem('timewaster_local_ranking', JSON.stringify(this.localRanking));
        this.startLocalHeartbeat();
      }

      return { sessionId: this.sessionId, anonymousName: this.anonymousName };

    } catch (error) {
      logger.error('세션 초기화 실패:', error);
      throw error;
    }
  }

  // 하트비트 시작 (Firebase 모드) - 🔥 실시간급 처리
  startHeartbeat() {
    if (!this.isFirebaseConnected) return;
    
    this.heartbeatInterval = setInterval(async () => {
      if (this.sessionId) {
        try {
          await set(ref(database, `${DB_PATHS.SESSIONS}/${this.sessionId}/lastHeartbeat`), serverTimestamp());
          await set(ref(database, `${DB_PATHS.SESSIONS}/${this.sessionId}/isActive`), true);
        } catch (error) {
          logger.error('하트비트 실패:', error);
        }
      }
    }, 2000); // 🔥 2초마다 (실시간에 가깝게, 하지만 Firebase 요금 고려)
  }

  // 로컬 하트비트 시작 (로컬 모드) - 🔥 실시간급 처리
  startLocalHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.sessionId) {
        try {
          const stored = JSON.parse(localStorage.getItem('timewaster_local_ranking') || '[]');
          const sessionIndex = stored.findIndex(s => s.sessionId === this.sessionId);
          if (sessionIndex >= 0) {
            stored[sessionIndex].lastHeartbeat = Date.now();
            stored[sessionIndex].isActive = true;
            localStorage.setItem('timewaster_local_ranking', JSON.stringify(stored));
            this.localRanking = stored;
          }
        } catch (error) {
          logger.error('로컬 하트비트 실패:', error);
        }
      }
    }, 1000); // 🔥 1초마다 (로컬은 제한 없으니 진짜 실시간)
  }

  // 시간 업데이트 (매초 호출)
  async updateTime(currentTimeInSeconds) {
    if (!this.sessionId) return;

    try {
      if (this.isFirebaseConnected) {
        // Firebase 모드
        const sessionRef = ref(database, `${DB_PATHS.SESSIONS}/${this.sessionId}/currentTime`);
        await set(sessionRef, currentTimeInSeconds);
        await this.checkMilestones(currentTimeInSeconds);
      } else {
        // 로컬 모드
        const stored = JSON.parse(localStorage.getItem('timewaster_local_ranking') || '[]');
        const sessionIndex = stored.findIndex(s => s.sessionId === this.sessionId);
        if (sessionIndex >= 0) {
          stored[sessionIndex].currentTime = currentTimeInSeconds;
          localStorage.setItem('timewaster_local_ranking', JSON.stringify(stored));
          this.localRanking = stored;
        }
        // 로컬 모드에서는 마일스톤 찴크 생략 (알림 기능 없음)
      }
    } catch (error) {
      logger.error('시간 업데이트 실패:', error);
    }
  }

  // 마일스톤 체크 및 라이브 피드 알림
  async checkMilestones(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const milestones = [5, 10, 15, 30, 60, 120]; // 분 단위

    if (milestones.includes(minutes) && timeInSeconds % 60 === 0) {
      const message = minutes >= 60 
        ? `${this.anonymousName}님이 ${Math.floor(minutes/60)}시간 돌파! 😱`
        : `${this.anonymousName}님이 ${minutes}분 달성! 🎉`;
      
      await this.addLiveFeedEvent('milestone', message);
    }
  }

  // 라이브 피드 이벤트 추가
  async addLiveFeedEvent(type, message) {
    try {
      const feedRef = ref(database, DB_PATHS.LIVE_FEED);
      const newEventRef = push(feedRef);
      
      await set(newEventRef, {
        type,
        message,
        timestamp: serverTimestamp(),
        sessionId: this.sessionId,
        anonymousName: this.anonymousName
      });

      // 피드는 최근 20개만 유지
      await this.cleanupLiveFeed();

    } catch (error) {
      logger.error('라이브 피드 추가 실패:', error);
    }
  }

  // 라이브 피드 정리 (최근 20개만 유지)
  async cleanupLiveFeed() {
    try {
      const feedRef = ref(database, DB_PATHS.LIVE_FEED);
      const snapshot = await get(feedRef);
      
      if (snapshot.exists()) {
        const events = Object.entries(snapshot.val());
        if (events.length > 20) {
          // 오래된 이벤트 삭제
          const eventsToDelete = events
            .sort(([,a], [,b]) => (a.timestamp || 0) - (b.timestamp || 0))
            .slice(0, events.length - 20);
          
          for (const [key] of eventsToDelete) {
            await remove(ref(database, `${DB_PATHS.LIVE_FEED}/${key}`));
          }
        }
      }
    } catch (error) {
      logger.error('라이브 피드 정리 실패:', error);
    }
  }

  // 실시간 랭킹 조회 (기간별 지원) - 🔍 디버깅 강화
  async getRanking(period = RANKING_PERIODS.DAILY) {
    try {
      if (this.isFirebaseConnected) {
        // Firebase 모드
        const sessionsRef = ref(database, DB_PATHS.SESSIONS);
        const sessionsSnapshot = await get(sessionsRef);

        if (!sessionsSnapshot.exists()) {
          return [];
        }

        const allSessions = Object.values(sessionsSnapshot.val());

        // 랭킹용 세션 필터링 (더 관대하게)
        const validSessions = allSessions.filter(session => {
          const hasValidTime = (session.finalTime > 0) || (session.currentTime > 0);
          const hasValidNickname = session.finalNickname || session.anonymousName;
          const isSubmitted = session.submittedToRanking === true;
          
          logger.debug('랭킹 세션 필터링:', {
            sessionId: session.sessionId,
            hasValidTime,
            hasValidNickname,
            isSubmitted,
            finalTime: session.finalTime,
            currentTime: session.currentTime
          });
          
          return hasValidTime && hasValidNickname && isSubmitted;
        });
        
        logger.ranking('유효한 랭킹 세션:', validSessions.length, '개');

        // 시간순 정렬
        const sessions = validSessions
          .filter(session => this.isSessionInPeriod(session, period))
          .sort((a, b) => {
            // finalTime이 있으면 우선, 없으면 currentTime 사용
            const timeA = a.finalTime || a.currentTime || 0;
            const timeB = b.finalTime || b.currentTime || 0;
            return timeB - timeA;
          })
          .slice(0, 20); // TOP 20으로 증가!

        const ranking = sessions.map((session, index) => ({
          rank: index + 1,
          anonymousName: session.finalNickname || session.anonymousName, // 🐛 사용자 닉네임 우선 사용
          comment: session.finalComment || '', // 🐛 소감 데이터 추가
          timeInSeconds: session.finalTime || session.currentTime, // 🐛 finalTime 우선 사용
          timeDisplay: this.formatTime(session.finalTime || session.currentTime),
          isCurrentUser: session.sessionId === this.sessionId
        }));
        
        return ranking;
      } else {
        // 로컬 모드
        const stored = JSON.parse(localStorage.getItem('timewaster_local_ranking') || '[]');
        
        // 로컬 랭킹 생성 (기간별 필터링) - 🔥 랭킹용으로 모든 유효 세션 포함
        const sessions = stored
          .filter(session => {
            // 랭킹용: 유효한 시간이 있는 모든 세션 포함 (활성 상태 무관)
            const hasValidTime = (session.currentTime > 0) || (session.finalTime > 0);
            return hasValidTime;
          })
          .filter(session => this.isSessionInPeriod(session, period))
          .sort((a, b) => {
            // finalTime이 있으면 우선, 없으면 currentTime 사용
            const timeA = a.finalTime || a.currentTime || 0;
            const timeB = b.finalTime || b.currentTime || 0;
            return timeB - timeA;
          })
          .slice(0, 20); // 로컬 모드도 TOP 20

        return sessions.map((session, index) => ({
          rank: index + 1,
          anonymousName: session.finalNickname || session.anonymousName, // 🐛 로컬 모드에도 사용자 닉네임 우선
          comment: session.finalComment || '', // 🐛 로컬 모드에도 소감 추가
          timeInSeconds: session.finalTime || session.currentTime, // 🐛 로컬 finalTime 우선
          timeDisplay: this.formatTime(session.finalTime || session.currentTime),
          isCurrentUser: session.sessionId === this.sessionId
        }));
      }

    } catch (error) {
      logger.error('랭킹 조회 실패:', error);
      return [];
    }
  }

  // 세션이 해당 기간에 포함되는지 확인
  isSessionInPeriod(session, period) {
    const sessionTime = session.startTime;
    const now = Date.now();
    
    // Firebase timestamp 처리
    const sessionDate = typeof sessionTime === 'object' && sessionTime.seconds 
      ? new Date(sessionTime.seconds * 1000)
      : new Date(sessionTime);
    
    const currentDate = new Date(now);
    
    switch (period) {
      case RANKING_PERIODS.DAILY:
        // 오늘 날짜와 같은지 확인
        return sessionDate.toDateString() === currentDate.toDateString();
        
      case RANKING_PERIODS.WEEKLY:
        // 이번 주에 포함되는지 확인 (월요일 기준)
        const startOfWeek = this.getStartOfWeek(currentDate);
        const endOfWeek = this.getEndOfWeek(currentDate);
        return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
        
      case RANKING_PERIODS.MONTHLY:
        // 이번 달에 포함되는지 확인
        return sessionDate.getMonth() === currentDate.getMonth() && 
               sessionDate.getFullYear() === currentDate.getFullYear();
               
      case RANKING_PERIODS.ALL_TIME:
        // 전체 기간 (모든 세션 포함)
        return true;
        
      default:
        return true;
    }
  }

  // 주 시작일 (월요일) 계산
  getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay(); // 0: 일요일, 1: 월요일
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 월요일로 조정
    const startOfWeek = new Date(d.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }

  // 주 마지막일 (일요일) 계산
  getEndOfWeek(date) {
    const startOfWeek = this.getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
  }

  // 실시간 랭킹 리스너 등록
  onRankingChange(callback, period = RANKING_PERIODS.DAILY) {
    if (this.isFirebaseConnected) {
      // Firebase 모드
      const sessionsRef = ref(database, DB_PATHS.SESSIONS);
      
      const listener = onValue(sessionsRef, async (snapshot) => {
        if (snapshot.exists()) {
          const ranking = await this.getRanking(period);
          callback(ranking);
        } else {
          callback([]);
        }
      });

      this.listeners.set(`ranking_${period}`, listener);
      return () => this.removeListener(`ranking_${period}`);
    } else {
      // 로컬 모드 - 초기 랭킹 로드 후 정기적 업데이트
      const updateRanking = async () => {
        const ranking = await this.getRanking(period);
        callback(ranking);
      };
      
      // 초기 로드
      updateRanking();
      
      // 5초마다 랭킹 업데이트 (로컬 모드)
      const intervalId = setInterval(updateRanking, 5000);
      
      this.listeners.set(`ranking_${period}`, intervalId);
      return () => {
        clearInterval(intervalId);
        this.listeners.delete(`ranking_${period}`);
      };
    }
  }

  // 라이브 피드 리스너 등록
  onLiveFeedChange(callback) {
    const feedRef = ref(database, DB_PATHS.LIVE_FEED);
    
    const listener = onValue(feedRef, (snapshot) => {
      if (snapshot.exists()) {
        const events = Object.values(snapshot.val())
          .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
          .slice(0, 5); // 최근 5개
        callback(events);
      } else {
        callback([]);
      }
    });

    this.listeners.set('liveFeed', listener);
    return () => this.removeListener('liveFeed');
  }

  // 리스너 제거
  removeListener(key) {
    if (this.listeners.has(key)) {
      const listener = this.listeners.get(key);
      off(ref(database), 'value', listener);
      this.listeners.delete(key);
    }
  }

  // 모든 리스너 제거
  removeAllListeners() {
    this.listeners.forEach((listener, key) => {
      this.removeListener(key);
    });
  }

  // 세션 종료
  async endSession() {
    try {
      if (this.sessionId) {
        // 하트비트 중지
        if (this.heartbeatInterval) {
          clearInterval(this.heartbeatInterval);
        }

        // Firebase 모드에서만 세션 비활성화
        if (this.isFirebaseConnected) {
          await set(ref(database, `${DB_PATHS.SESSIONS}/${this.sessionId}/isActive`), false);
          await set(ref(database, `${DB_PATHS.SESSIONS}/${this.sessionId}/endTime`), serverTimestamp());
          
          // 라이브 피드에 이탈 알림
          await this.addLiveFeedEvent('leave', `${this.anonymousName}님이 현실로 돌아갔습니다`);
        } else {
          // 로컬 모드에서 세션 비활성화
          const stored = JSON.parse(localStorage.getItem('timewaster_local_ranking') || '[]');
          const sessionIndex = stored.findIndex(s => s.sessionId === this.sessionId);
          if (sessionIndex >= 0) {
            stored[sessionIndex].isActive = false;
            stored[sessionIndex].endTime = Date.now();
            localStorage.setItem('timewaster_local_ranking', JSON.stringify(stored));
          }
        }

        // 모든 리스너 제거
        this.removeAllListeners();


      }
    } catch (error) {
      logger.error('세션 종료 실패:', error);
    }
  }

  // 시간 포맷팅 (초 → 분:초)
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}분 ${remainingSeconds.toString().padStart(2, '0')}초`;
  }

  // 예상 랭킹 순위 확인
  async getExpectedRank(timeInSeconds) {
    try {
      if (this.isFirebaseConnected) {
        // Firebase 모드
        const sessionsRef = ref(database, DB_PATHS.SESSIONS);
        const sessionsSnapshot = await get(query(
          sessionsRef,
          orderByChild('isActive'),
          limitToLast(100)
        ));

        if (!sessionsSnapshot.exists()) {
          return 1; // 첫 번째 기록
        }

        const sessions = Object.values(sessionsSnapshot.val())
          .filter(session => session.isActive && session.currentTime > 0)
          .filter(session => this.isSessionInPeriod(session, RANKING_PERIODS.DAILY))
          .sort((a, b) => b.currentTime - a.currentTime);

        // 현재 시간보다 높은 기록의 개수 + 1
        const higherScores = sessions.filter(session => session.currentTime > timeInSeconds).length;
        return higherScores + 1;
      } else {
        // 로컬 모드
        const stored = JSON.parse(localStorage.getItem('timewaster_local_ranking') || '[]');
        const sessions = stored
          .filter(session => session.isActive && session.currentTime > 0)
          .filter(session => this.isSessionInPeriod(session, RANKING_PERIODS.DAILY))
          .sort((a, b) => b.currentTime - a.currentTime);

        const higherScores = sessions.filter(session => session.currentTime > timeInSeconds).length;
        return higherScores + 1;
      }
    } catch (error) {
      logger.error('예상 순위 확인 실패:', error);
      return null;
    }
  }

  // 랭킹에 점수 제출 (종료 시) - 🐛 소감 저장 추가 + 강화된 디버깅
  async submitScore(timeInSeconds, customNickname = null, customComment = '') {
    try {
      if (!this.sessionId) {
        throw new Error('활성 세션이 없습니다');
      }

      const finalNickname = customNickname || this.anonymousName;
      
      logger.ranking('랭킹 등록 시작:', {
        timeInSeconds,
        finalNickname,
        customComment,
        sessionId: this.sessionId
      });
      
      if (this.isFirebaseConnected) {
        // Firebase 모드 - 트랜잭션처럼 한 번에 모든 데이터 업데이트
        const updates = {};
        updates[`${DB_PATHS.SESSIONS}/${this.sessionId}/finalTime`] = timeInSeconds;
        updates[`${DB_PATHS.SESSIONS}/${this.sessionId}/finalNickname`] = finalNickname;
        updates[`${DB_PATHS.SESSIONS}/${this.sessionId}/finalComment`] = customComment;
        updates[`${DB_PATHS.SESSIONS}/${this.sessionId}/submittedToRanking`] = true;
        updates[`${DB_PATHS.SESSIONS}/${this.sessionId}/endTime`] = serverTimestamp();
        updates[`${DB_PATHS.SESSIONS}/${this.sessionId}/isActive`] = false; // 세션 종료

        // 한 번에 업데이트 (원자적 연산)
        await update(ref(database), updates);
        
        logger.firebase('랭킹 데이트 Firebase 업데이트 완료');
        
        // 라이브 피드에 랭킹 등록 알림
        const rank = await this.getExpectedRank(timeInSeconds);
        await this.addLiveFeedEvent('ranking', 
          `${finalNickname}님이 ${this.formatTime(timeInSeconds)}로 ${rank}위 달성! 🏆`
        );
        
        return true;
      } else {
        // 로컬 모드
        const stored = JSON.parse(localStorage.getItem('timewaster_local_ranking') || '[]');
        const sessionIndex = stored.findIndex(s => s.sessionId === this.sessionId);
        
        if (sessionIndex >= 0) {
          stored[sessionIndex].finalTime = timeInSeconds;
          stored[sessionIndex].finalNickname = finalNickname;
          stored[sessionIndex].finalComment = customComment; // 🐛 로컬 모드에도 소감 저장
          stored[sessionIndex].submittedToRanking = true;
          stored[sessionIndex].endTime = Date.now();
          
          localStorage.setItem('timewaster_local_ranking', JSON.stringify(stored));
          return true;
        }
        
        throw new Error('세션을 찾을 수 없습니다');
      }
    } catch (error) {
      logger.error('랭킹 제출 실패:', error);
      throw error;
    }
  }

  // 현재 사용자 정보 반환
  getCurrentUser() {
    return {
      sessionId: this.sessionId,
      anonymousName: this.anonymousName
    };
  }
}

// 싱글톤 인스턴스
export const rankingService = new RankingService();
export default RankingService;
