import React, { useRef } from 'react';
import { Sparkles } from 'lucide-react';

// 메시지 섹션 컴포넌트 - 프레임 밖 튀어나가기 문제 해결
const MessageSection = ({ 
  displayMessage, 
  isTyping, 
  messageShake, 
  extremeMode, 
  onRefreshMessage 
}) => {
  const messageRef = useRef(null);

  return (
    <div className="relative mb-6 w-full">
      <div 
        ref={messageRef}
        className={`message-container cursor-pointer group transition-all duration-300 w-full ${
          messageShake ? 'animate-bounce' : ''
        }`}
        onClick={onRefreshMessage}
      >
        {/* 카드 배경 - 완전 안정화된 컨테이너 */}
        <div className="
          bg-gradient-to-r from-white/10 to-white/5 
          backdrop-blur-xl border border-white/20 
          p-4 sm:p-6 lg:p-8 
          min-h-[120px] sm:min-h-[140px] lg:min-h-[160px]
          w-full
          rounded-2xl lg:rounded-3xl
          flex items-center justify-center 
          relative 
          overflow-hidden
          contain-layout contain-style
        ">
          
          {/* 배경 패턴 */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full animate-ping"></div>
            <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full animate-ping delay-1000"></div>
            <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-white rounded-full animate-ping delay-2000"></div>
          </div>
          
          {/* 메인 텍스트 - 완전 안정화된 텍스트 영역 */}
          <div className="relative z-10 text-center w-full">
            <div className="
              px-2 sm:px-4 lg:px-6
              mx-auto
              w-full
              box-border
            ">
              <p className={`
                text-sm sm:text-base lg:text-xl xl:text-2xl 
                leading-relaxed font-medium text-white 
                transition-all duration-300 
                break-words 
                text-center
                w-full
                block
                ${
                  isTyping ? 'animate-pulse' : ''
                }
              `}
              style={{ 
                wordBreak: 'keep-all',
                overflowWrap: 'break-word',
                hyphens: 'auto',
                whiteSpace: 'pre-wrap',
                minHeight: '1.5em',
                lineHeight: '1.6',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {displayMessage}
                {isTyping && (
                  <span className="animate-ping text-red-400 ml-1 inline-block">|</span>
                )}
              </p>
            </div>
            
            {/* 호버 효과 표시 - 위치 안정화 */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-3 sm:mt-4">
              <div className="flex items-center justify-center gap-2 text-white/50 text-xs sm:text-sm">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>클릭해서 새로운 메시지 보기</span>
              </div>
            </div>
          </div>
          
          {/* 극한 모드 효과 - 위치 고정 */}
          {extremeMode && (
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20">
              <div className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold transform-none">
                🚨 극한!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageSection;