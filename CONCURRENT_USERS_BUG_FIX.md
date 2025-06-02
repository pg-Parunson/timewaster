# 🐛 동시접속자 카운팅 버그 수정 방안

## 🔍 문제 분석

### 1. 세션 중복 생성 문제
- 브라우저 새로고침 시 이전 세션이 완전히 정리되지 않음
- 같은 사용자가 여러 활성 세션을 가질 수 있음

### 2. 하트비트 타이밍 불일치
- Firebase 하트비트: 2초 간격
- 활성 세션 판정: 10초 기준
- 이로 인한 급격한 증감 현상

### 3. 실시간 리스너 충돌
- statsService와 StatsBar에서 중복 계산
- Firebase 데이터를 여러 곳에서 동시 처리

## 🔧 수정 방안

### 1. 세션 정리 강화 (rankingService.jsx)

```javascript
// initializeSession() 함수 개선
async initializeSession() {
  try {
    // 🔥 더 강력한 세션 정리
    const tabId = sessionStorage.getItem('timewaster_tab_id') || 
      `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('timewaster_tab_id', tabId);
    
    this.sessionId = `session_${tabId}_${Date.now()}`;
    this.anonymousName = ANONYMOUS_NAMES[Math.floor(Math.random() * ANONYMOUS_NAMES.length)];
    
    if (this.isFirebaseConnected) {
      // 🔥 기존 모든 세션 비활성화 (더 철저하게)
      const existingSessionRef = ref(database, DB_PATHS.SESSIONS);
      const existingSnapshot = await get(existingSessionRef);
      
      if (existingSnapshot.exists()) {
        const sessions = Object.entries(existingSnapshot.val());
        const updates = {};
        
        for (const [sessionKey, sessionData] of sessions) {
          // 동일 브라우저의 모든 세션 비활성화
          if (sessionData.sessionId && 
              (sessionData.sessionId.includes(tabId) || 
               sessionData.userAgent === navigator.userAgent.substring(0, 100))) {
            updates[`${DB_PATHS.SESSIONS}/${sessionKey}/isActive`] = false;
            updates[`${DB_PATHS.SESSIONS}/${sessionKey}/endTime`] = serverTimestamp();
          }
        }
        
        if (Object.keys(updates).length > 0) {
          await update(ref(database), updates);
        }
      }
      
      // 새 세션 생성...
    }
  }
}
```

### 2. 하트비트 간격 통일 (rankingService.jsx)

```javascript
// 하트비트를 5초로 통일, 활성 판정을 15초로 조정
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
  }, 5000); // 🔥 5초로 변경
}
```

### 3. 동시접속자 계산 로직 수정 (statsService.jsx)

```javascript
async getActiveSessions() {
  try {
    if (this.isFirebaseConnected) {
      const sessionsRef = ref(database, DB_PATHS.SESSIONS);
      const snapshot = await get(sessionsRef);
      
      if (!snapshot.exists()) {
        return 1;
      }

      const sessions = Object.values(snapshot.val());
      const now = Date.now();
      const fifteenSecondsAgo = now - (15 * 1000); // 🔥 15초로 변경
      
      // 🔥 더 엄격한 필터링
      const activeSessions = sessions.filter(session => {
        if (!session.isActive) return false;
        
        // lastHeartbeat 시간 계산
        let heartbeatTime = 0;
        if (typeof session.lastHeartbeat === 'object' && session.lastHeartbeat.seconds) {
          heartbeatTime = session.lastHeartbeat.seconds * 1000;
        } else if (typeof session.lastHeartbeat === 'number') {
          heartbeatTime = session.lastHeartbeat;
        }
        
        // 15초 이내 + isActive가 true인 세션만
        return heartbeatTime > fifteenSecondsAgo;
      });
      
      // 🔥 중복 제거 (동일 userAgent는 1개만)
      const uniqueSessions = [];
      const seenUserAgents = new Set();
      
      for (const session of activeSessions) {
        const userAgent = session.userAgent || 'unknown';
        if (!seenUserAgents.has(userAgent)) {
          seenUserAgents.add(userAgent);
          uniqueSessions.push(session);
        }
      }
      
      return Math.max(1, uniqueSessions.length);
    }
  } catch (error) {
    return 1;
  }
}
```

### 4. StatsBar 단순화 (StatsBar.jsx)

```javascript
// StatsBar에서는 statsService만 사용하도록 단순화
const StatsBar = ({ visits, totalTimeWasted, extremeMode, currentElapsedTime }) => {
  const [stats, setStats] = useState({
    activeSessions: 1,
    totalVisits: 0
  });
  
  useEffect(() => {
    // 🔥 하나의 리스너만 사용
    const unsubscribe = statsService.onStatsChange((newStats) => {
      setStats({
        activeSessions: newStats.activeSessions,
        totalVisits: newStats.totalVisits
      });
    });
    
    return unsubscribe;
  }, []);

  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
      {/* 동시접속자는 stats.activeSessions만 사용 */}
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-blue-400" />
        <span className="text-white/80 text-sm">
          {stats.activeSessions}명 접속 중
        </span>
      </div>
      {/* ... 나머지 UI */}
    </div>
  );
};
```

## 🚀 즉시 적용 가능한 임시 수정

### 1. 하트비트 간격만 수정하기
- `rankingService.jsx`의 `startHeartbeat()` 함수에서 2000을 5000으로 변경
- `statsService.jsx`의 `getActiveSessions()` 함수에서 10초를 15초로 변경

### 2. 세션 중복 방지
- 브라우저 새로고침 시 기존 세션을 더 철저히 정리

### 3. 리스너 단순화
- StatsBar에서 중복 리스너 제거, statsService 하나만 사용

## 🎯 기대 효과

1. **안정적인 카운팅**: 급격한 증감 현상 해결
2. **중복 제거**: 같은 사용자의 여러 세션 방지
3. **성능 향상**: 불필요한 Firebase 호출 감소
4. **일관성**: 모든 곳에서 동일한 카운트 표시

이 수정을 통해 동시접속자가 1로 초기화되는 현상이 크게 줄어들 것입니다.
