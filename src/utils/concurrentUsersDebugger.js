// 동시접속자 수 디버깅 전용 도구
import { ref, get, onValue } from 'firebase/database';
import { database, DB_PATHS } from '../config/firebase.js';

export const concurrentUsersDebugger = {
  // 🔍 모든 세션 상세 분석
  async analyzeAllSessions() {
    try {
      const sessionsRef = ref(database, DB_PATHS.SESSIONS);
      const snapshot = await get(sessionsRef);
      
      if (!snapshot.exists()) {
        console.log('🚨 세션 데이터 없음');
        return { totalSessions: 0, activeSessions: 0, details: [] };
      }

      const sessions = Object.values(snapshot.val());
      const now = Date.now();
      const fiveSecondsAgo = now - (5 * 1000);
      const thirtySecondsAgo = now - (30 * 1000);
      
      console.log('🔍 전체 세션 분석 시작:', {
        전체세션수: sessions.length,
        현재시간: new Date().toLocaleTimeString(),
        '5초전기준': new Date(fiveSecondsAgo).toLocaleTimeString(),
        '30초전기준': new Date(thirtySecondsAgo).toLocaleTimeString()
      });

      const analysis = {
        totalSessions: sessions.length,
        activeSessions: 0,
        details: [],
        timeRanges: {
          within5sec: 0,
          within30sec: 0,
          older: 0,
          noHeartbeat: 0
        }
      };

      sessions.forEach((session, index) => {
        let heartbeatTime = 0;
        let isActiveFlag = session.isActive;
        
        // 다양한 heartbeat 형식 처리
        if (session.lastHeartbeat) {
          if (typeof session.lastHeartbeat === 'object' && session.lastHeartbeat.seconds) {
            heartbeatTime = session.lastHeartbeat.seconds * 1000;
          } else if (typeof session.lastHeartbeat === 'number') {
            heartbeatTime = session.lastHeartbeat;
          }
        }
        
        const timeDiff = now - heartbeatTime;
        const isRecent = heartbeatTime > fiveSecondsAgo;
        const isWithin30sec = heartbeatTime > thirtySecondsAgo;
        
        // 시간대별 분류
        if (heartbeatTime === 0) {
          analysis.timeRanges.noHeartbeat++;
        } else if (isRecent) {
          analysis.timeRanges.within5sec++;
        } else if (isWithin30sec) {
          analysis.timeRanges.within30sec++;
        } else {
          analysis.timeRanges.older++;
        }
        
        // 활성 세션 판단
        const isActive = isActiveFlag && isRecent;
        if (isActive) {
          analysis.activeSessions++;
        }
        
        const detail = {
          index,
          sessionId: session.sessionId?.substring(0, 20) + '...',
          anonymousName: session.anonymousName,
          isActiveFlag,
          heartbeatTime: heartbeatTime ? new Date(heartbeatTime).toLocaleTimeString() : '없음',
          timeDiffSec: Math.round(timeDiff / 1000),
          계산결과: isActive ? '✅ 활성' : '❌ 비활성',
          이유: !isActiveFlag ? 'isActive=false' : !isRecent ? '하트비트 오래됨' : '정상'
        };
        
        analysis.details.push(detail);
      });

      console.log('📊 동시접속자 분석 결과:', analysis);
      console.table(analysis.details.slice(0, 10)); // 최근 10개만 테이블로 표시
      
      return analysis;
    } catch (error) {
      console.error('❌ 세션 분석 실패:', error);
      return null;
    }
  },

  // 🔄 실시간 모니터링 시작
  startRealtimeMonitoring() {
    const sessionsRef = ref(database, DB_PATHS.SESSIONS);
    
    return onValue(sessionsRef, async (snapshot) => {
      console.log('🔄 세션 데이터 변경 감지 - 재분석 시작');
      await this.analyzeAllSessions();
    });
  },

  // 📈 통계 서비스의 계산 방식 테스트
  async testStatsServiceLogic() {
    try {
      const sessionsRef = ref(database, DB_PATHS.SESSIONS);
      const snapshot = await get(sessionsRef);
      
      if (!snapshot.exists()) {
        console.log('🚨 세션 없음');
        return 0;
      }

      const sessions = Object.values(snapshot.val());
      const now = Date.now();
      const fiveSecondsAgo = now - (5 * 1000);
      
      // statsService와 동일한 로직 재현
      const activeSessions = sessions.filter((session) => {
        if (!session.isActive) {
          return false;
        }
        
        const lastHeartbeat = session.lastHeartbeat;
        let heartbeatTime = 0;
        
        if (typeof lastHeartbeat === 'object' && lastHeartbeat.seconds) {
          heartbeatTime = lastHeartbeat.seconds * 1000;
        } else if (typeof lastHeartbeat === 'number') {
          heartbeatTime = lastHeartbeat;
        }
        
        return heartbeatTime > fiveSecondsAgo;
      });

      const result = Math.max(1, activeSessions.length);
      
      console.log('🧮 StatsService 로직 테스트:', {
        전체세션: sessions.length,
        필터후세션: activeSessions.length,
        최종결과: result,
        기준시간: new Date(fiveSecondsAgo).toLocaleTimeString()
      });
      
      return result;
    } catch (error) {
      console.error('❌ StatsService 로직 테스트 실패:', error);
      return 1;
    }
  }
};

// 전역 접근 가능하도록 등록
if (typeof window !== 'undefined') {
  window.debugConcurrentUsers = concurrentUsersDebugger;
}
