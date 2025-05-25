import React, { useRef, useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import ActivityRecommendationCard from './ActivityRecommendationCard';
import { BUTTON_TEXTS } from '../data/buttonTexts';

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
  const [refreshButtonText, setRefreshButtonText] = useState(BUTTON_TEXTS[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 스마트 메시지인지 확인
  const hasRecommendation = messageData && messageData.type === 'smart' && messageData.recommendation;

  const handleActivitySelect = (activity) => {
    onActivitySelect(activity);
    // 활동 선택 시 자동으로 추천 카드 닫기
    setShowRecommendation(false);
  };

  // 갱신 버튼 클릭 핸들러
  const handleRefreshClick = async (e) => {
    e.stopPropagation();
    setIsRefreshing(true);
    
    // 버튼 텍스트 바로 바꿀기
    const newButtonText = BUTTON_TEXTS[Math.floor(Math.random() * BUTTON_TEXTS.length)];
    setRefreshButtonText(newButtonText);
    
    // 잘짠 메시지 표시
    setTimeout(() => {
      onRefreshMessage();
      setIsRefreshing(false);
    }, 800);
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
        {/* 레트로 게임 스타일 메시지 박스 */}
        <div className="
          bg-gradient-to-r from-slate-900/95 to-slate-800/95
          backdrop-blur-xl
          p-2 sm:p-3 lg:p-4 
          min-h-[60px] sm:min-h-[80px] lg:min-h-[100px]
          w-full
          flex items-center justify-between
          relative 
          overflow-hidden
          contain-layout contain-style
          retro-message-box
        "
        style={{
          border: '3px solid',
          borderImage: 'linear-gradient(45deg, #8b5cf6, #ec4899, #06b6d4) 1',
          borderRadius: '0px',
          boxShadow: `
            0 0 0 2px #1e293b,
            inset 0 0 0 2px #334155,
            0 4px 8px rgba(0,0,0,0.3),
            0 0 20px rgba(139, 92, 246, 0.3)
          `
        }}>
          
          {/* 레트로 게임 배경 패턴 - 픽셀 아트 스타일 */}
          <div className="absolute inset-0 opacity-20">
            {/* 픽셀 코너 */}
            <div className="absolute top-2 left-2 w-1 h-1 bg-cyan-400 pixel-corner"></div>
            <div className="absolute top-2 right-2 w-1 h-1 bg-pink-400 pixel-corner"></div>
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-purple-400 pixel-corner"></div>
            <div className="absolute bottom-2 right-2 w-1 h-1 bg-yellow-400 pixel-corner"></div>
            
            {/* 스캔라인 효과 */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent animate-pulse delay-1000"></div>
            </div>
          </div>
          
          {/* 메인 텍스트 - 완전 안정화된 텍스트 영역 */}
          <div className="relative z-10 text-center flex-1">
            <div className="
              px-2 sm:px-4 lg:px-6
              mx-auto
              w-full
              box-border
            ">
              <p className={`
                text-xs sm:text-sm lg:text-base xl:text-lg 
                leading-relaxed font-bold text-white 
                transition-all duration-300 
                break-words 
                text-center
                w-full
                block
                retro-text
                ${
                  isTyping ? 'animate-pulse' : ''
                }
              `}
              style={{
                fontFamily: 'monospace, "Courier New", monospace',
                textShadow: `
                  1px 1px 0px #000,
                  0 0 10px rgba(139, 92, 246, 0.8),
                  0 0 20px rgba(236, 72, 153, 0.6)
                `,
                letterSpacing: '0.5px',
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
                  <span className="animate-ping text-cyan-400 ml-1 inline-block font-bold">█</span>
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
          
          {/* 레트로 게임 스타일 갱신 버튼 - 우측 배치 */}
          <div className="relative z-10 ml-3">
            <button
              onClick={handleRefreshClick}
              disabled={isRefreshing}
              className="flex flex-col items-center justify-center gap-1 px-2 py-2 text-white text-xs font-bold transition-all duration-200 hover:scale-105 disabled:opacity-50 min-w-[80px] retro-button"
              style={{
                background: 'linear-gradient(135deg, #dc2626, #ec4899)',
                border: '2px solid #1e293b',
                borderRadius: '0px',
                boxShadow: `
                  inset 2px 2px 0px rgba(255,255,255,0.2),
                  inset -2px -2px 0px rgba(0,0,0,0.2),
                  0 4px 0px #7f1d1d,
                  0 6px 8px rgba(0,0,0,0.3),
                  0 0 20px rgba(220, 38, 38, 0.5)
                `,
                fontFamily: 'monospace, "Courier New", monospace',
                textShadow: '1px 1px 0px #000',
                letterSpacing: '0.5px'
              }}
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span className="text-center">메시지<br/>생성중...</span>
                </>
              ) : (
                <span className="text-center leading-tight">{refreshButtonText}</span>
              )}
            </button>
          </div>
          
          {/* 레트로 극한 모드 표시 - 사용자 피드백으로 제거 */}
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
      
      {/* 호버 효과 표시 - 축소 모드에서는 숨김 (비난 메시지 갱신 버튼이 내부로 이동했으므로 삭제) */}
    </div>
  );
};

export default MessageSection;