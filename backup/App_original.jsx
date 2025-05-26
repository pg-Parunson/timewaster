import React, { useEffect } from 'react';

// 컴포넌트 imports
import StatsBar from './components/StatsBar.jsx';
import AdSection from './components/AdSection.jsx';
import ModernModal from './components/ModernModal.jsx';
import RankingRegistrationModal from './components/RankingRegistrationModal.jsx';
import CelebrationEffect from './components/CelebrationEffect.jsx';
import ShareSection from './components/ShareSection.jsx';
import EasterEgg from './components/EasterEgg.jsx';
import FloatingExitButton from './components/FloatingExitButton.jsx';
import MessageSection from './components/MessageSection.jsx';
import SiteHeader from './components/SiteHeader.jsx';
import BackgroundEffects from './components/BackgroundEffects.jsx';
import RankingSection from './components/RankingSection.jsx';
import LiveFeedNotifications from './components/LiveFeedNotifications.jsx';
import DevTools from './components/DevTools.jsx';
import TimerSection from './components/TimerSection.jsx';

// 훅스 imports
import { useCelebrationSystem } from './hooks/useCelebrationSystem.jsx';
import { useTimerLogic } from './hooks/useTimerLogic.jsx';
import { useModalLogic } from './hooks/useModalLogic.jsx';

// 유틸리티 imports
import { formatTime } from './utils/helpers';

function App() {
  // 타이머 로직 훅
  const {
    elapsedTime,
    currentMessage,
    currentMessageData,
    displayMessage,
    buttonText,
    showAd,
    adMessage,
    visits,
    totalTimeWasted,
    adClicks,
    messageShake,
    extremeMode,
    isTyping,
    concurrentUsers,
    currentUser,
    isRankingInitialized,
    refreshMessage,
    setAdClicks
  } = useTimerLogic();

  // 모달 로직 훅
  const {
    showModal,
    modalConfig,
    showRankingModal,
    showModernModal,
    handleActivitySelect,
    handleProductClick,
    handleExit,
    handleRankingModalClose,
    confirmExit,
    setShowModal
  } = useModalLogic({
    elapsedTime,
    adClicks,
    setAdClicks,
    totalTimeWasted,
    visits,
    isRankingInitialized,
    currentUser
  });
  
  // 축하 시스템 초기화 (범위 제한)
  const { showCelebration, currentCelebration, handleCelebrationComplete } = useCelebrationSystem(elapsedTime);

  // 기본 UI 스타일 주입 (축하 이펙트는 별도 컴포넌트에서 처리)
  useEffect(() => {
    const safeUIStyles = `
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      
      .ranking-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      
      .ranking-scrollbar::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 3px;
      }
      
      .ranking-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
      }
      
      .ranking-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      
      @keyframes fadeIn {
        0% {
          opacity: 0;
          transform: scale(0.9) translateY(20px);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
      }
      
      @keyframes slideInRight {
        0% {
          transform: translateX(100%);
          opacity: 0;
        }
        100% {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      .animate-slideInRight {
        animation: slideInRight 0.5s ease-out;
      }
      
      @keyframes retro-blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0.3; }
      }
      
      /* 안전한 레이아웃 보장 */
      .safe-layout {
        position: relative;
        isolation: isolate;
        transform: none !important;
      }
      
      .safe-ad-section {
        position: relative !important;
        transform: none !important;
        z-index: 1 !important;
        contain: layout style;
      }
      
      .safe-timer {
        position: relative;
        z-index: 2;
        isolation: isolate;
      }
      
      .safe-message {
        position: relative;
        z-index: 2;
        isolation: isolate;
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = safeUIStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <BackgroundEffects />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="safe-layout bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 lg:p-8 w-full max-w-7xl">
          
          {/* 📊 통계 바 - 최상단 고정 */}
          <div className="safe-layout">
            <StatsBar 
              visits={visits}
              totalTimeWasted={totalTimeWasted}
              extremeMode={extremeMode}
              currentElapsedTime={elapsedTime}
            />
          </div>

          {/* 🎯 헤더 - 사이트 제목 */}
          <div className="safe-layout">
            <SiteHeader 
              elapsedTime={elapsedTime}
              extremeMode={extremeMode}
            />
          </div>

          {/* 🔥 핵심 영역 - 타이머 + 비난 메시지 (가로 분할) */}
          <div className="safe-layout grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* 왼쪽: 타이머 영역 - 안전하게 격리 */}
            <div className="safe-timer space-y-4">
              <TimerSection 
                elapsedTime={elapsedTime}
                extremeMode={extremeMode}
              />
            </div>

            {/* 오른쪽: 비난 메시지 - 안전하게 격리 */}
            <div className="safe-message space-y-4">
              <MessageSection 
                displayMessage={displayMessage}
                messageData={currentMessageData}
                isTyping={isTyping}
                messageShake={messageShake}
                extremeMode={extremeMode}
                onRefreshMessage={refreshMessage}
                onActivitySelect={handleActivitySelect}
                compact={false}
              />
            </div>
          </div>

          {/* 💰 광고 영역 - 완전 안전한 고정 */}
          <div className="safe-ad-section mb-6">
            <AdSection 
              showAd={showAd}
              adMessage={adMessage}
              extremeMode={extremeMode}
              elapsedTime={elapsedTime}
              onProductClick={handleProductClick}
            />
          </div>

          {/* 🏆 랭킹 + 공유 영역 (가로 분할) - 안전하게 격리 */}
          <div className="safe-layout grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* 왼쪽: 랭킹 (크기 축소) */}
            <div className="safe-layout h-[400px] overflow-y-auto ranking-scrollbar bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
              <RankingSection 
                isVisible={true}
                currentUser={currentUser}
              />
            </div>

            {/* 오른쪽: 공유 섹션 */}
            <div className="safe-layout flex items-center justify-center">
              <ShareSection 
                elapsedTime={elapsedTime}
                formatTime={formatTime}
                showModernModal={showModernModal}
              />
            </div>
          </div>

          {/* 🎮 액션 버튼들 - 하단 고정 */}
          <div className="safe-layout flex flex-wrap gap-4 justify-center items-center pt-4 border-t border-white/10">
            <FloatingExitButton 
              elapsedTime={elapsedTime}
              onExit={handleExit}
              inline={true}
              showAlways={true}
            />
            
            <div className="text-white/70 text-sm">
              💡 생산적인 활동을 시작해보세요!
            </div>
          </div>

          <div className="safe-layout">
            <EasterEgg elapsedTime={elapsedTime} />
          </div>
        </div>
      </div>

      <div className="safe-layout">
        <LiveFeedNotifications />
      </div>
      
      <div className="safe-layout">
        <DevTools isVisible={import.meta.env.DEV} />
      </div>

      {/* 🎉 완전히 안전한 축하 이펙트 - 다른 UI에 절대 영향 없음 */}
      <CelebrationEffect 
        isActive={showCelebration}
        celebration={currentCelebration}
        onComplete={handleCelebrationComplete}
      />

      <RankingRegistrationModal
        isOpen={showRankingModal}
        onClose={handleRankingModalClose}
        onConfirm={confirmExit}
        elapsedTime={elapsedTime}
        currentUser={currentUser}
        totalTimeWasted={totalTimeWasted}
        visits={visits}
        adClicks={adClicks}
      />

      <ModernModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={modalConfig.type === 'exit' ? confirmExit : () => setShowModal(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        showCancel={modalConfig.showCancel}
      />
    </div>
  );
}

export default App;