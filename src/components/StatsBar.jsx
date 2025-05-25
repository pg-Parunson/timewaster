import React, { useState, useEffect } from 'react';
import { Users, MousePointer, Clock } from 'lucide-react';
import { database, DB_PATHS } from '../config/firebase';
import { ref, onValue, off, set, get, runTransaction } from 'firebase/database';

const StatsBar = ({ visits, totalTimeWasted, extremeMode, currentElapsedTime }) => {
  const [realConcurrentUsers, setRealConcurrentUsers] = useState(1);
  const [totalSiteVisits, setTotalSiteVisits] = useState(0);
  
  // 시간을 "분:초" 형태로 포맷팅
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Firebase에서 실제 데이터 가져오기
  useEffect(() => {
    if (!database) {
      // Firebase 연결 안되면 기본값 사용
      setRealConcurrentUsers(Math.floor(Math.random() * 5) + 2);
      setTotalSiteVisits(1234 + visits); // 기본값
      return;
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const onlineUsersRef = ref(database, 'online_users');
    const totalVisitsRef = ref(database, 'site_stats/total_visits');
    const userSessionRef = ref(database, `online_users/${sessionId}`);
    
    // 현재 세션 등록
    const registerSession = async () => {
      try {
        await set(userSessionRef, {
          timestamp: Date.now(),
          lastSeen: Date.now()
        });
        
        // 총 방문자 수 증가
        await runTransaction(totalVisitsRef, (currentTotal) => {
          return (currentTotal || 0) + 1;
        });
      } catch (error) {
        console.error('세션 등록 실패:', error);
      }
    };
    
    registerSession();
    
    // 동시 접속자 수 실시간 감시
    const unsubscribeOnline = onValue(onlineUsersRef, (snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        const now = Date.now();
        const activeUsers = Object.values(users).filter(
          user => (now - user.lastSeen) < 60000 // 1분 이내 활동
        ).length;
        setRealConcurrentUsers(Math.max(1, activeUsers));
      } else {
        setRealConcurrentUsers(1);
      }
    });
    
    // 총 방문자 수 감시
    const unsubscribeVisits = onValue(totalVisitsRef, (snapshot) => {
      setTotalSiteVisits(snapshot.val() || 0);
    });
    
    // 주기적으로 마지막 접속 시간 업데이트
    const heartbeatInterval = setInterval(async () => {
      try {
        await set(userSessionRef, {
          timestamp: Date.now(), 
          lastSeen: Date.now()
        });
      } catch (error) {
        console.error('하트비트 실패:', error);
      }
    }, 30000); // 30초마다
    
    // 정리 함수
    return () => {
      off(onlineUsersRef);
      off(totalVisitsRef);
      clearInterval(heartbeatInterval);
      
      // 세션 제거
      set(userSessionRef, null).catch(console.error);
    };
  }, [visits]);

  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
      <div className="flex items-center gap-8">
        {/* 실시간 추적 표시등 */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
          <span className="text-white/80 text-sm">실시간 추적</span>
        </div>

        {/* 실제 동시 접속자 */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-white/80 text-sm">
            {realConcurrentUsers}명 접속 중
          </span>
        </div>

        {/* 전체 사이트 방문 횟수 */}
        <div className="flex items-center gap-2">
          <MousePointer className="w-4 h-4 text-purple-400" />
          <span className="text-white/80 text-sm">
            방문 {totalSiteVisits.toLocaleString()}회
          </span>
        </div>

        {/* 총 낭비 시간 - 실시간 업데이트 */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-400" />
          <span className="text-white/80 text-sm">
            총 낭비: {formatTime(totalTimeWasted + (currentElapsedTime || 0))}
          </span>
        </div>
      </div>

      {/* 극한 모드 배지 */}
      {extremeMode && (
        <div className="bg-red-500/20 backdrop-blur border border-red-500/30 rounded-lg px-3 py-1">
          <span className="text-red-300 text-sm font-medium animate-pulse">
            🔥 극한 모드
          </span>
        </div>
      )}
    </div>
  );
};

export default StatsBar;