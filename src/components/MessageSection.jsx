import React, { useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { BUTTON_TEXTS } from '../data/buttonTexts';

// 메시지 섹션 컴포넌트 - 메인 화면용으로 강화
const MessageSection = ({ 
  displayMessage, 
  messageData, 
  isTyping, 
  messageShake, 
  extremeMode, 
  onRefreshMessage,
  onActivitySelect = () => {},
  compact = false
}) => {
  // 🔍 디버그: props 값들 확인
  console.log('MessageSection props:', {
    displayMessage: displayMessage || 'EMPTY!',
    messageData,
    isTyping,
    compact,
    displayMessageLength: displayMessage?.length || 0
  });
  const messageRef = useRef(null);
  const [refreshButtonText, setRefreshButtonText] = useState(BUTTON_TEXTS[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 더 이상 필요없는 활동 추천 기능 제거

  // 갱신 버튼 클릭 핸들러
  const handleRefreshClick = async (e) => {
    e.stopPropagation();
    setIsRefreshing(true);
    
    const newButtonText = BUTTON_TEXTS[Math.floor(Math.random() * BUTTON_TEXTS.length)];
    setRefreshButtonText(newButtonText);
    
    setTimeout(() => {
      onRefreshMessage();
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className={`relative ${compact ? 'mb-2' : 'mb-6'} w-full`}>
      {/* 💬 비난 메시지 제목 (메인으로 올라왔을 때 - 동적) */}
      {!compact && (
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
            😤 현실직시 메시지 
            <span className={`animate-pulse ${
              isTyping ? 'text-green-400' : 'text-red-400'
            }`}>●</span>
          </h2>
          <p className="text-white/70 text-sm mt-1">
            {isTyping ? '새로운 메시지를 생성하고 있습니다...' : '지금 이 순간도 시간이 흘러가고 있습니다...'}
          </p>
        </div>
      )}

      {/* 완전히 작동하는 메시지 박스 */}
      <div className="w-full mb-4">
        <div className="bg-purple-900/80 border-2 border-purple-400 rounded-lg p-6 min-h-[100px] flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="text-white text-lg font-bold mb-2">
              {displayMessage || '오류: 메시지 없음'}
              {isTyping && (
                <span className="animate-ping text-cyan-400 ml-2 inline-block font-bold">█</span>
              )}
            </p>
          </div>
          
          <div className="ml-4">
            <button 
              onClick={handleRefreshClick}
              disabled={isRefreshing}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 min-w-[80px]"
            >
              {isRefreshing ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>생성중...</span>
                </div>
              ) : (
                refreshButtonText
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* 활동 추천 카드 - 완전 제거 */}
      {/* 더 이상 사용하지 않음 - 현실직시 메시지에 집중 */}
      
      {/* 메인 모드일 때 추가 정보 */}
      {!compact && (
        <div className="mt-4 text-center">
          <button 
            onClick={onRefreshMessage}
            className="text-white/60 hover:text-white/90 text-sm transition-colors duration-200 hover:underline cursor-pointer"
          >
            💡 클릭하면 새로운 메시지가 나타납니다
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageSection;