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
  
  // 축하 시스템 초기화
  const { showCelebration, currentCelebration, handleCelebrationComplete } = useCelebrationSystem(elapsedTime);

  // CSS 애니메이션 스타일 주입
  useEffect(() => {
    const celebrationStyles = `
      @keyframes celebration-float {
        0% {
          transform: translateY(30px) rotate(0deg);
          opacity: 0;
          scale: 0.8;
        }
        20% {
          opacity: 1;
          scale: 1;
        }
        80% {
          transform: translateY(-20px) rotate(180deg);
          opacity: 1;
          scale: 1;
        }
        100% {
          transform: translateY(-50px) rotate(360deg);
          opacity: 0;
          scale: 0.5;
        }
      }
      
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: scale(1);
        }
        40% {
          transform: scale(1.1) translateY(-10px);
        }
        60% {
          transform: scale(1.05) translateY(-5px);
        }
      }
      
      @keyframes spin {
        from {
          transform: rotate(0deg) translateX(-50%) translateY(-50%);
        }
        to {
          transform: rotate(360deg) translateX(-50%) translateY(-50%);
        }
      }
      
      @keyframes pulse {
        0%, 100% {
          transform: translateX(-50%) translateY(-50%) scale(1);
          opacity: 1;
        }
        50% {
          transform: translateX(-50%) translateY(-50%) scale(1.05);
          opacity: 0.9;
        }
      }
      
      @keyframes float {
        0%, 100% {
          transform: translateY(0px) translateX(-50%) translateY(-50%);
        }
        50% {
          transform: translateY(-20px) translateX(-50%) translateY(-50%);
        }
      }
      
      @keyframes rainbow {
        0% { opacity: 1; }
        50% { opacity: 0.8; }
        100% { opacity: 1; }
      }
      
      @keyframes shake {
        0%, 100% { transform: translateX(-50%) translateY(-50%); }
        25% { transform: translateX(-50%) translateY(-50%) translateX(5px); }
        75% { transform: translateX(-50%) translateY(-50%) translateX(-5px); }
      }
      
      @keyframes mega {
        0% { transform: scale(1) translateX(-50%) translateY(-50%); }
        50% { transform: scale(1.3) translateX(-50%) translateY(-50%); }
        100% { transform: scale(1) translateX(-50%) translateY(-50%); }
      }
      
      @keyframes unicorn {
        0% { 
          transform: translateX(-50%) translateY(-50%) rotate(0deg);
        }
        50% { 
          transform: translateX(-50%) translateY(-50%) rotate(5deg);
        }
        100% { 
          transform: translateX(-50%) translateY(-50%) rotate(0deg);
        }
      }
      
      @keyframes dragon {
        0% { 
          transform: translateX(-50%) translateY(-50%) scale(1);
        }
        50% { 
          transform: translateX(-50%) translateY(-50%) scale(1.2);
        }
        100% { 
          transform: translateX(-50%) translateY(-50%) scale(1);
        }
      }
      
      .animate-celebration-float {
        animation: celebration-float linear forwards;
      }
      
      .message-container {
        position: relative;
        width: 100%;
        max-width: 100%;
        overflow: hidden;
        border-radius: 0 !important;
        transform: none !important;
        contain: layout style size;
      }
      
      .message-container * {
        max-width: 100%;
        word-wrap: break-word;
        overflow-wrap: break-word;
        box-sizing: border-box;
        transform: none !important;
      }
      
      .message-container p {
        transform: none !important;
        position: relative !important;
        left: auto !important;
        right: auto !important;
        margin: 0 auto !important;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100% !important;
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
      
      @keyframes retro-blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0.3; }
      }
      
      @keyframes celebration-flash {
        0%, 100% { opacity: 0.05; }
        20% { opacity: 0.3; }
        50% { opacity: 0.2; }
        80% { opacity: 0.25; }
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = celebrationStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <BackgroundEffects />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 lg:p-8 w-full max-w-7xl">
          <StatsBar 
            visits={visits}
            adClicks={adClicks}
            totalTimeWasted={totalTimeWasted}
            concurrentUsers={concurrentUsers}
            extremeMode={extremeMode}
            currentElapsedTime={elapsedTime}
          />

          <SiteHeader 
            elapsedTime={elapsedTime}
            extremeMode={extremeMode}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-1 space-y-4">
              {/* 비난 메시지 섹션을 여기로 이동 */}
              <MessageSection 
                displayMessage={displayMessage}
                messageData={currentMessageData}
                isTyping={isTyping}
                messageShake={messageShake}
                extremeMode={extremeMode}
                onRefreshMessage={refreshMessage}
                onActivitySelect={handleActivitySelect}
                compact={true}
              />
              
              <TimerSection 
                elapsedTime={elapsedTime}
                extremeMode={extremeMode}
              />
              
              <AdSection 
                showAd={showAd}
                adMessage={adMessage}
                extremeMode={extremeMode}
                elapsedTime={elapsedTime}
                onProductClick={handleProductClick}
              />
            </div>

            <div className="lg:col-span-2">
              <div className="w-full h-[500px] overflow-y-auto ranking-scrollbar bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) rgba(255,255,255,0.05)' }}>
                <RankingSection 
                  isVisible={true}
                  currentUser={currentUser}
                />
              </div>
            </div>
          </div>

          <ShareSection 
            elapsedTime={elapsedTime}
            formatTime={formatTime}
            showModernModal={showModernModal}
          />

          <EasterEgg elapsedTime={elapsedTime} />
        </div>
      </div>

      <FloatingExitButton 
        elapsedTime={elapsedTime}
        onExit={handleExit}
      />

      <CelebrationEffect 
        isActive={showCelebration}
        celebration={currentCelebration}
        onComplete={handleCelebrationComplete}
      />

      <LiveFeedNotifications />
      
      <DevTools isVisible={import.meta.env.DEV} />

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
