// 🔧 동시접속자 디버깅 도구 - 재활성화
import { 
  ref, 
  get
} from 'firebase/database';
import { database, DB_PATHS } from '../config/firebase.js';

export const concurrentUsersDebugger = {
  async analyzeAllSessions() {
    try {
      const sessionsRef = ref(database, DB_PATHS.SESSIONS);
      const snapshot = await get(sessionsRef);
      
      if (!snapshot.exists()) {
        console.log('🔍 세션 없음');
        return;
      }
      
      const sessions = Object.entries(snapshot.val());
      const now = Date.now();
      
      console.log('🔍 전체 세션 분석:');
      console.table(sessions.map(([key, session]) => {
        const lastHeartbeat = session.lastHeartbeat;
        let heartbeatTime = 0;
        
        if (typeof lastHeartbeat === 'object' && lastHeartbeat.seconds) {
          heartbeatTime = lastHeartbeat.seconds * 1000;
        } else if (typeof lastHeartbeat === 'number') {
          heartbeatTime = lastHeartbeat;
        }
        
        const secondsAgo = Math.floor((now - heartbeatTime) / 1000);
        
        return {
          세션ID: key.slice(-8),
          닉네임: session.anonymousName,
          활성여부: session.isActive ? '✅' : '❌',
          마지막하트비트: secondsAgo < 0 ? '미래' : `${secondsAgo}초 전`,
          현재시간: session.currentTime || 0,
          브라우저: session.userAgent?.includes('Chrome') ? 'Chrome' : 
                   session.userAgent?.includes('Safari') ? 'Safari' : 
                   session.userAgent?.includes('Firefox') ? 'Firefox' : 
                   session.userAgent?.includes('Edge') ? 'Edge' : '기타'
        };
      }));
      
      // 🔥 활성 세션 필터링 테스트
      const fortyFiveSecondsAgo = now - (45 * 1000);
      const activeSessions = sessions.filter(([key, session]) => {
        if (!session.isActive) return false;
        
        const lastHeartbeat = session.lastHeartbeat;
        let heartbeatTime = 0;
        
        if (typeof lastHeartbeat === 'object' && lastHeartbeat.seconds) {
          heartbeatTime = lastHeartbeat.seconds * 1000;
        } else if (typeof lastHeartbeat === 'number') {
          heartbeatTime = lastHeartbeat;
        } else {
          const startTime = session.startTime;
          if (typeof startTime === 'object' && startTime.seconds) {
            heartbeatTime = startTime.seconds * 1000;
          } else if (typeof startTime === 'number') {
            heartbeatTime = startTime;
          }
        }
        
        const isRecent = heartbeatTime > fortyFiveSecondsAgo;
        const twoHoursAgo = now - (2 * 60 * 60 * 1000);
        const isNotTooOld = heartbeatTime > twoHoursAgo;
        
        return isRecent && isNotTooOld;
      });
      
      console.log(`🔥 필터링 결과: 전체 ${sessions.length}개 → 활성 ${activeSessions.length}개`);
      console.log(`📊 최종 동시접속자: ${Math.max(1, activeSessions.length)}명`);
      
    } catch (error) {
      console.error('❌ 세션 분석 실패:', error);
    }
  },
  
  async testStatsServiceLogic() {
    // statsService import 방지용 동적 import
    const { statsService } = await import('../services/statsService.jsx');
    
    console.log('🧪 statsService 로직 테스트:');
    const result = await statsService.getActiveSessions();
    console.log(`📊 현재 동시접속자: ${result}명`);
    
    await this.analyzeAllSessions();
  },
  
  // 🔥 PC 브라우저 감지 테스트
  testBrowserDetection() {
    const userAgent = navigator.userAgent;
    const isChrome = userAgent.includes('Chrome');
    const isEdge = userAgent.includes('Edge');
    const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome');
    const isFirefox = userAgent.includes('Firefox');
    
    console.log('🌐 브라우저 감지 결과:', {
      userAgent: userAgent.substring(0, 100),
      Chrome: isChrome,
      Edge: isEdge,
      Safari: isSafari,
      Firefox: isFirefox,
      권장하트비트간격: isChrome || isEdge ? '2.5초' : 
                      isFirefox ? '3초' : 
                      isSafari ? '4초' : '3초(기타)'
    });
  },
  
  // 🔥 실시간 모니터링 시작
  startMonitoring() {
    console.log('🚀 실시간 동시접속자 모니터링 시작...');
    
    const monitor = async () => {
      const result = await this.testStatsServiceLogic();
      console.log(`⏰ ${new Date().toLocaleTimeString()} - 동시접속자: ${result}명`);
    };
    
    // 초기 실행
    monitor();
    
    // 5초마다 모니터링
    const intervalId = setInterval(monitor, 5000);
    
    console.log('✋ 모니터링 중지하려면: clearInterval(' + intervalId + ')');
    return intervalId;
  }
};

// 🔧 브라우저 콘솔에서 사용법:
// concurrentUsersDebugger.testStatsServiceLogic()      // 현재 상태 분석
// concurrentUsersDebugger.analyzeAllSessions()         // 모든 세션 상세 분석  
// concurrentUsersDebugger.testBrowserDetection()       // 브라우저 감지 테스트
// concurrentUsersDebugger.startMonitoring()            // 실시간 모니터링 시작