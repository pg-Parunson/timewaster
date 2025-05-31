import React, { useState } from 'react';
import { logger } from '../utils/logger.js';
import { generateTestNotifications } from '../services/liveFeedService';
import { rankingService } from '../services/rankingService.jsx';

const DevTools = ({ isVisible, onOpenRankingTest }) => {
  const [testTime, setTestTime] = useState(1800); // 기본값 30분 (1800초)
  
  if (!isVisible) return null;

  const handleGenerateTestNotifications = () => {
    generateTestNotifications();
  };
  
  const handleRankingTest = () => {
    onOpenRankingTest(testTime); // 시간을 매개변수로 전달
  };
  
  // 🔍 Firebase 디버깅 기능 추가
  const handleCheckFirebaseStatus = () => {
    logger.critical('🔥 Firebase 연결 상태 상세:', {
      isConnected: rankingService.isFirebaseConnected,
      sessionId: rankingService.sessionId,
      anonymousName: rankingService.anonymousName,
      databaseURL: 'https://timewaster-ranking-default-rtdb.asia-southeast1.firebasedatabase.app',
      heartbeatInterval: rankingService.heartbeatInterval ? '✅ 활성' : '❌ 중지',
      브라우저탭ID: sessionStorage.getItem('timewaster_tab_id')
    });
    
    // Firebase 실제 연결 테스트
    if (rankingService.isFirebaseConnected) {
      import('../config/firebase.js').then(firebase => {
        logger.critical('🌍 Firebase 실제 연결 테스트:', {
          database객체: !!firebase.database,
          연결상태: firebase.isFirebaseConnected
        });
      });
    }
  };
  
  const handleCheckRankingData = async () => {
    logger.ranking('랭킹 데이터 확인 시작...');
    try {
      const ranking = await rankingService.getRanking('daily');
      logger.ranking('일일 랭킹 데이터:', ranking);
      
      const weeklyRanking = await rankingService.getRanking('weekly');
      logger.ranking('주간 랭킹 데이터:', weeklyRanking);
    } catch (error) {
      logger.error('럭킹 데이터 조회 실패:', error);
    }
  };
  
  const formatTimeDisplay = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}분 ${remainingSeconds.toString().padStart(2, '0')}초`;
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/80 backdrop-blur-md 
                    border border-white/20 rounded-lg p-4 text-white text-sm">
      <h3 className="font-bold mb-2">🛠️ 개발자 도구</h3>
      <div className="space-y-2">
        <button
          onClick={handleGenerateTestNotifications}
          className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-xs
                     transition-colors duration-200 w-full"
        >
          테스트 알림 생성
        </button>
        
        {/* 🏆 랭킹 테스트 섹션 */}
        <div className="border-t border-white/20 pt-2 mt-2">
          <div className="text-xs text-yellow-300 mb-2 font-bold">
            🏆 랭킹 테스트 설정
          </div>
          
          {/* 시간 입력 필드 */}
          <div className="mb-2">
            <label className="block text-xs text-gray-300 mb-1">
              테스트 시간 (분)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="300"
                value={Math.floor(testTime / 60)}
                onChange={(e) => setTestTime(parseInt(e.target.value || 1) * 60)}
                className="bg-black/50 border border-white/30 rounded px-2 py-1 text-xs text-white w-16
                          focus:outline-none focus:border-yellow-400"
              />
              <span className="text-xs text-gray-300 self-center">분</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              설정된 시간: {formatTimeDisplay(testTime)}
            </div>
          </div>
          
          {/* 빠른 설정 버튼들 */}
          <div className="flex gap-1 mb-2">
            <button
              onClick={() => setTestTime(300)}
              className="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-xs transition-colors"
            >
              5분
            </button>
            <button
              onClick={() => setTestTime(900)}
              className="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-xs transition-colors"
            >
              15분
            </button>
            <button
              onClick={() => setTestTime(1800)}
              className="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-xs transition-colors"
            >
              30분
            </button>
            <button
              onClick={() => setTestTime(3600)}
              className="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-xs transition-colors"
            >
              1시간
            </button>
          </div>
        </div>
        
        {/* 랭킹 테스트 버튼 */}
        <button
          onClick={handleRankingTest}
          className="bg-yellow-500 hover:bg-yellow-600 px-3 py-2 rounded text-xs
                     transition-colors duration-200 w-full font-bold"
        >
          🏆 랭킹 등록 테스트 ({Math.floor(testTime / 60)}분)
        </button>
        
        {/* 🔍 디버깅 도구들 */}
        <div className="border-t border-white/20 pt-2 mt-2">
          <div className="text-xs text-cyan-300 mb-2 font-bold">
            🔍 디버깅 도구
          </div>
          
          <div className="space-y-1">
            <button
              onClick={() => {
                logger.critical('🔥 Firebase 연결 상태:', {
                  connected: rankingService.isFirebaseConnected,
                  sessionId: rankingService.sessionId ? '✅ 있음' : '❌ 없음',
                  anonymousName: rankingService.anonymousName
                });
              }}
              className="bg-cyan-600 hover:bg-cyan-500 px-2 py-1 rounded text-xs
                         transition-colors duration-200 w-full"
            >
              🚨 Firebase 상태 (중요)
            </button>
            
            <button
              onClick={async () => {
                const stats = await import('../services/statsService.jsx');
                const activeSessions = await stats.statsService.getActiveSessions();
                logger.critical('👥 동시 접속자 수 체크:', {
                  현재수: activeSessions,
                  Firebase모드: rankingService.isFirebaseConnected ? '✅' : '❌ 로컬모드',
                  시간: new Date().toLocaleTimeString()
                });
              }}
              className="bg-green-600 hover:bg-green-500 px-2 py-1 rounded text-xs
                         transition-colors duration-200 w-full"
            >
              🚨 동시접속자 체크
            </button>
            
            <button
              onClick={async () => {
                // Firebase 세션 데이터 직접 조회
                const { database, DB_PATHS } = await import('../config/firebase.js');
                const { ref, get } = await import('firebase/database');
                
                try {
                  const sessionsRef = ref(database, DB_PATHS.SESSIONS);
                  const snapshot = await get(sessionsRef);
                  
                  if (snapshot.exists()) {
                    const sessions = Object.entries(snapshot.val());
                    logger.critical('🚨 Firebase 세션 데이터 직접 조회:', {
                      전체세션수: sessions.length,
                      세션목록: sessions.map(([key, session]) => ({
                        key: key.substring(0, 15) + '...',
                        이름: session.anonymousName,
                        활성: session.isActive ? '✅' : '❌',
                        마지막하트비트: session.lastHeartbeat ? 
                          (typeof session.lastHeartbeat === 'object' ? 
                            new Date(session.lastHeartbeat.seconds * 1000).toLocaleTimeString() :
                            new Date(session.lastHeartbeat).toLocaleTimeString()) : '없음'
                      }))
                    });
                  } else {
                    logger.critical('🚨 Firebase 세션 데이터 없음!');
                  }
                } catch (error) {
                  logger.critical('🚨 Firebase 세션 조회 실패:', error);
                }
              }}
              className="bg-yellow-600 hover:bg-yellow-500 px-2 py-1 rounded text-xs
                         transition-colors duration-200 w-full"
            >
              🚨 Firebase 세션 데이터
            </button>
            
            <button
              onClick={async () => {
                // Firebase 방화벽 및 권한 테스트
                const { database, DB_PATHS } = await import('../config/firebase.js');
                const { ref, set, get } = await import('firebase/database');
                
                try {
                  // 테스트 데이터 쓰기 시도
                  const testRef = ref(database, 'test-connection');
                  const testData = {
                    timestamp: Date.now(),
                    test: '연결 테스트'
                  };
                  
                  logger.critical('🚨 Firebase 쓰기 권한 테스트 시작...');
                  await set(testRef, testData);
                  logger.critical('✅ Firebase 쓰기 성공!');
                  
                  // 테스트 데이터 읽기 시도
                  const snapshot = await get(testRef);
                  logger.critical('✅ Firebase 읽기 성공:', snapshot.val());
                  
                  // 세션 경로 쓰기 테스트
                  const sessionTestRef = ref(database, `${DB_PATHS.SESSIONS}/test-session`);
                  await set(sessionTestRef, {
                    test: true,
                    timestamp: Date.now()
                  });
                  logger.critical('✅ 세션 경로 쓰기 성공!');
                  
                } catch (error) {
                  logger.critical('❌ Firebase 권한 테스트 실패:', {
                    error: error.message,
                    code: error.code,
                    상세: error
                  });
                }
              }}
              className="bg-red-600 hover:bg-red-500 px-2 py-1 rounded text-xs
                         transition-colors duration-200 w-full"
            >
              🚨 Firebase 권한 테스트
            </button>
          </div>
        </div>
        
        <div className="text-xs text-gray-300 mt-2 border-t border-white/20 pt-2">
          📝 개발자 도구 | 랭킹 테스트: 닉네임과 소감 저장 테스트
        </div>
      </div>
    </div>
  );
};

export default DevTools;