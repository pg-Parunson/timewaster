import React, { useRef, useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import ActivityRecommendationCard from './ActivityRecommendationCard';

// 메시지 섹션 컴포넌트 - 스마트 메시지 시스템 통합
const MessageSection = ({ 
  displayMessage, 
  messageData, // 새로운 prop: 스마트 메시지 데이터
  isTyping, 
  messageShake, 
  extremeMode, 
  onRefreshMessage,
  onActivitySelect = () => {}, // 새로운 prop: 활동 선택 콜백
  compact = false // 새로운 prop: 축소 모드
}) => {
  const messageRef = useRef(null);
  const [showRecommendation, setShowRecommendation] = useState(false);

  // 스마트 메시지인지 확인
  const hasRecommendation = messageData && messageData.type === 'smart' && messageData.recommendation;

  const handleActivitySelect = (activity) => {
    onActivitySelect(activity);
    // 활동 선택 시 자동으로 추천 카드 닫기
    setShowRecommendation(false);
  };

  return (
    <div className={`relative ${compact ? 'mb-2' : 'mb-6'} w-full`}>
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
          p-2 sm:p-3 lg:p-4 
          min-h-[60px] sm:min-h-[80px] lg:min-h-[100px]
          w-full
          rounded-lg lg:rounded-xl
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
                text-xs sm:text-sm lg:text-base xl:text-lg 
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
            
            {/* 활동 추천 버튼 - 축소 모드에서는 숨김 */}
            {hasRecommendation && !compact && (
              <div className="mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRecommendation(!showRecommendation);
                  }}
                  className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 rounded-lg border border-cyan-300/30 text-cyan-300 text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  <span>🎯 대안 활동 추천</span>
                  {showRecommendation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            )}
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
      
      {/* 활동 추천 카드 - 축소 모드에서는 숨김 */}
      {hasRecommendation && showRecommendation && !compact && (
        <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
          <ActivityRecommendationCard
            recommendation={messageData.recommendation}
            theme={messageData.theme}
            onActivitySelect={handleActivitySelect}
          />
        </div>
      )}
      
      {/* 호버 효과 표시 - 축소 모드에서는 숨김 */}
      {!compact && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2 text-center">
          <div className="flex items-center justify-center gap-2 text-white/50 text-xs sm:text-sm">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>클릭해서 새로운 메시지 보기</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageSection;