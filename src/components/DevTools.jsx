import React, { useState } from 'react';
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
    console.log('🔥 Firebase 연결 상태 확인:');
    console.log('- 연결 상태:', rankingService.isFirebaseConnected);
    console.log('- 세션 ID:', rankingService.sessionId);
    console.log('- 사용자 닉네임:', rankingService.anonymousName);
    
    if (rankingService.isFirebaseConnected) {
      console.log('✅ Firebase 연결 정상');
    } else {
      console.log('❌ Firebase 연결 실패 - 로컬 모드로 동작');
    }
  };
  
  const handleCheckRankingData = async () => {
    console.log('🏆 현재 랭킹 데이터 확인:');
    try {
      const ranking = await rankingService.getRanking('daily');
      console.log('- 오늘의 랭킹 데이터:', ranking);
      console.log('- 랭킹 엔트리 수:', ranking.length);
    } catch (error) {
      console.error('❌ 랭킹 데이터 조회 실패:', error);
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
              onClick={handleCheckFirebaseStatus}
              className="bg-cyan-600 hover:bg-cyan-500 px-2 py-1 rounded text-xs
                         transition-colors duration-200 w-full"
            >
              🔥 Firebase 상태 확인
            </button>
            
            <button
              onClick={handleCheckRankingData}
              className="bg-purple-600 hover:bg-purple-500 px-2 py-1 rounded text-xs
                         transition-colors duration-200 w-full"
            >
              🏆 랭킹 데이터 확인
            </button>
          </div>
        </div>
        
        <div className="text-xs text-gray-300 mt-2 border-t border-white/20 pt-2">
          📝 F12 콘솔에서 로그 확인 | 랭킹 테스트: 닉네임과 소감 저장 테스트
        </div>
      </div>
    </div>
  );
};

export default DevTools;