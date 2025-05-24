import React, { useRef } from 'react';
import { Sparkles } from 'lucide-react';

// 메시지 섹션 컴포넌트
const MessageSection = ({ 
  displayMessage, 
  isTyping, 
  messageShake, 
  extremeMode, 
  onRefreshMessage 
}) => {
  const messageRef = useRef(null);

  return (
    <div 
      ref={messageRef}
      className={`message-container relative mb-6 cursor-pointer group transition-all duration-300 ${messageShake ? 'animate-bounce' : ''}`}
      onClick={onRefreshMessage}
    >
      {/* 카드 배경 - transform 제거로 위치 버그 해결 */}
      <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-6 lg:p-8 min-h-[120px] flex items-center justify-center relative overflow-hidden" style={{ borderRadius: '1.5rem' }}>
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full animate-ping"></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full animate-ping delay-1000"></div>
          <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-white rounded-full animate-ping delay-2000"></div>
        </div>
        
        {/* 메인 텍스트 - 긴 메시지 대응 개선 */}
        <div className="relative z-10 text-center w-full max-w-full px-2">
          <p className={`text-base lg:text-xl xl:text-2xl leading-relaxed font-medium text-white transition-all duration-300 break-words ${
            isTyping ? 'animate-pulse' : ''
          }`}
          style={{ 
            wordBreak: 'keep-all',
            overflowWrap: 'break-word',
            hyphens: 'auto',
            maxWidth: '100%'
          }}>
            {displayMessage}
            {isTyping && <span className="animate-ping text-red-400 ml-1">|</span>}
          </p>
          
          {/* 호버 효과 표시 */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-4">
            <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>클릭해서 새로운 메시지 보기</span>
            </div>
          </div>
        </div>
        
        {/* 극한 모드 효과 - 위치 조정 */}
        {extremeMode && (
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold extreme-badge">
              🚨 극한!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageSection;
