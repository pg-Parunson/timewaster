import React, { useEffect } from 'react';
import "galmuri/dist/galmuri.css";

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

  // 포켓몬 골드 버전 스타일 주입
  useEffect(() => {
    const pokemonStyles = `
      /* Galmuri 폰트가 이미 import 되어 있음 */
      
      /* 포켓몬 골드 진짜 컬러 팔레트 - 더 선명하게! */
      :root {
        --pokemon-gold: #FFD700;
        --pokemon-orange: #FF6B35;
        --pokemon-navy: #003366;
        --pokemon-black: #000000;
        --pokemon-white: #FFFFFF;
        --pokemon-bg: #E8F4FD;
        --pokemon-shadow: #2C5AA0;
        --pokemon-border: #1E3A8A;
        --pokemon-text: #1A1A1A;
        --pokemon-light-blue: #B3D9FF;
      }
      
      /* 레트로 픽셀 폰트 - Galmuri (깔끔하게 수정) */
      .pokemon-font {
        font-family: 'Galmuri11', 'Galmuri9', monospace;
        font-weight: normal;
        /* 그림자 제거 - 깔끔하게 */
      }
      
      .pokemon-title {
        font-family: 'Galmuri14', 'Galmuri11', monospace;
        font-weight: bold;
        font-size: 2.5rem;
        color: var(--pokemon-orange);
        text-shadow: 
          3px 3px 0px var(--pokemon-navy),
          -1px -1px 0px var(--pokemon-white);
        letter-spacing: 2px;
      }
      
      /* 포켓몬 대화창 스타일 - 깔끔하게 단순화! */
      .pokemon-dialog {
        background: var(--pokemon-white);
        color: var(--pokemon-text);
        border: 3px solid var(--pokemon-black);
        border-radius: 8px;
        padding: 20px;
        /* 복잡한 그림자 제거 - 깔끔하게 */
        box-shadow: 4px 4px 0px rgba(0,0,0,0.3);
      }
      
      /* 포켓몬 버튼 스타일 - 깔끔하게 단순화! */
      .pokemon-button {
        background: linear-gradient(135deg, var(--pokemon-gold) 0%, var(--pokemon-orange) 100%);
        color: var(--pokemon-black);
        border: 3px solid var(--pokemon-black);
        border-radius: 8px;
        padding: 12px 24px;
        font-family: 'Galmuri11', 'Galmuri9', monospace;
        font-weight: bold;
        font-size: 1rem;
        cursor: pointer;
        /* 복잡한 그림자 제거 - 깔끔하게 */
        box-shadow: 3px 3px 0px rgba(0,0,0,0.4);
        transition: all 0.1s ease;
      }
      
      .pokemon-button:hover {
        transform: translateY(-2px);
        /* 간단한 호버 효과만 */
        box-shadow: 5px 5px 0px rgba(0,0,0,0.4);
      }
      
      .pokemon-button:active {
        transform: translateY(0px);
        box-shadow: 2px 2px 0px rgba(0,0,0,0.4);
      }
      
      /* 위기 번쩍거림 효과 */
      @keyframes pokemon-danger-blink {
        0%, 50% { 
          background-color: rgba(220, 38, 38, 0.3);
          border-color: #DC2626;
        }
        51%, 100% { 
          background-color: transparent;
          border-color: var(--pokemon-black);
        }
      }
      
      .pokemon-danger {
        animation: pokemon-danger-blink 1s infinite;
      }
      
      /* 레트로 타이핑 효과 */
      @keyframes pokemon-typing {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
      
      .pokemon-typing::after {
        content: "▋";
        animation: pokemon-typing 0.8s infinite;
        color: var(--pokemon-black);
      }
      
      /* 포켓몬 게임 화면 배경 - 더 밝고 선명하게! */
      .pokemon-screen {
        background: 
          linear-gradient(135deg, var(--pokemon-bg) 0%, #F0F8FF 50%, var(--pokemon-light-blue) 100%),
          radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.1) 0%, transparent 50%);
        min-height: 100vh;
        position: relative;
      }
      
      /* 포켓몬 게임 메인 윈도우 */
      .pokemon-window {
        background: var(--pokemon-white);
        border: 6px solid var(--pokemon-black);
        border-radius: 12px;
        box-shadow: 
          inset 4px 4px 0px rgba(255,255,255,0.5),
          inset -4px -4px 0px rgba(0,0,0,0.3),
          8px 8px 16px rgba(0,0,0,0.4);
      }
      
      /* PC 친화적 가로형 그리드 */
      .pokemon-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 24px;
        padding: 24px;
      }
      
      @media (max-width: 1024px) {
        .pokemon-grid {
          grid-template-columns: 1fr;
          gap: 16px;
          padding: 16px;
        }
      }
      
      /* 통계 바 포켓몬 스타일 - 깔끔하게 단순화! */
      .pokemon-stats {
        background: linear-gradient(90deg, var(--pokemon-navy) 0%, var(--pokemon-border) 100%);
        color: var(--pokemon-white);
        border: 3px solid var(--pokemon-black);
        border-radius: 8px;
        padding: 16px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        /* 간단한 그림자만 */
        box-shadow: 3px 3px 0px rgba(0,0,0,0.3);
      }
      
      /* 타이머 대형 디스플레이 - 깔끔하게 유지! */
      .pokemon-timer {
        font-family: 'Galmuri14', 'Galmuri11', monospace;
        font-weight: bold;
        font-size: 4rem;
        color: var(--pokemon-orange);
        text-shadow: 
          4px 4px 0px var(--pokemon-navy),
          -2px -2px 0px var(--pokemon-white);
        text-align: center;
        padding: 24px;
        background: var(--pokemon-white);
        border: 4px solid var(--pokemon-black);
        border-radius: 12px;
        /* 타이머만 예외적으로 그림자 유지 */
        box-shadow: 4px 4px 0px rgba(0,0,0,0.4);
      }
      
      /* 랭킹 섹션 포켓몬 스타일 */
      .pokemon-ranking {
        background: var(--pokemon-white);
        border: 4px solid var(--pokemon-black);
        border-radius: 8px;
        max-height: 400px;
        overflow-y: auto;
      }
      
      .pokemon-ranking::-webkit-scrollbar {
        width: 8px;
      }
      
      .pokemon-ranking::-webkit-scrollbar-track {
        background: var(--pokemon-white);
        border: 1px solid var(--pokemon-black);
      }
      
      .pokemon-ranking::-webkit-scrollbar-thumb {
        background: var(--pokemon-orange);
        border: 1px solid var(--pokemon-black);
        border-radius: 4px;
      }
      
      /* 축하 이펙트 포켓몬 스타일 */
      .pokemon-celebration {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        text-align: center;
        background: var(--pokemon-white);
        border: 6px solid var(--pokemon-black);
        border-radius: 16px;
        padding: 32px;
        box-shadow: 
          inset 4px 4px 0px rgba(255,255,255,0.5),
          inset -4px -4px 0px rgba(0,0,0,0.3),
          12px 12px 24px rgba(0,0,0,0.6);
      }
      
      /* 마우스 호버 효과 - 간단하게! */
      .pokemon-hover:hover {
        transform: translateY(-2px);
        /* 간단한 호버 효과만 */
        box-shadow: 6px 6px 0px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
      }
      
      /* 키보드 단축키 표시 */
      .pokemon-shortcut {
        position: absolute;
        top: 8px;
        right: 8px;
        background: var(--pokemon-black);
        color: var(--pokemon-white);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-family: 'Galmuri9', monospace;
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = pokemonStyles;
    document.head.appendChild(styleElement);
    
    // 키보드 단축키 지원
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        refreshMessage();
      } else if (e.key === 'Escape') {
        handleExit();
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [refreshMessage, handleExit]);

  return (
    <div className="pokemon-screen">
      {/* 포켓몬 스타일 메인 윈도우 */}
      <div className="pokemon-window max-w-[1400px] mx-auto my-8">
        
        {/* 🎮 시간낭비 계산기 헤더 */}
        <div className="text-center py-6 border-b-4 border-black">
          <h1 className="pokemon-title mb-2">
            시간낭비 <span className="text-yellow-500">계산기</span>
          </h1>
          <p className="pokemon-font text-lg text-gray-700">
            당신의 소중한 시간이 흘러가고 있습니다!
          </p>
        </div>

        {/* 통계 바 */}
        <div className="pokemon-stats">
          <div className="pokemon-font">
            동시 접속자: <span className="text-yellow-300">{concurrentUsers || 1}명</span>
          </div>
          <div className="pokemon-font">
            총 방문 횟수: <span className="text-yellow-300">{visits}회</span>
          </div>
          <div className="pokemon-font">
            누적 시간낭비: <span className="text-yellow-300">{Math.floor(totalTimeWasted / 60)}시간</span>
          </div>
        </div>

        {/* 🔥 PC 친화적 3열 그리드 레이아웃 */}
        <div className="pokemon-grid">
          
          {/* 왼쪽 컬럼: 타이머 + 메시지 */}
          <div className="space-y-6">
            {/* 타이머 섹션 */}
            <div className="pokemon-dialog pokemon-hover relative">
              <div className="pokemon-shortcut">SPACE</div>
              <div className="text-center mb-4">
                <div className="pokemon-font text-xl text-gray-700 mb-2">
                  현재 낭비 시간
                </div>
                <div className={`pokemon-timer ${extremeMode ? 'pokemon-danger' : ''}`}>
                  {formatTime(elapsedTime)}
                </div>
              </div>
              
              {extremeMode && (
                <div className="text-center">
                  <div className="pokemon-font text-red-600 text-lg animate-bounce">
                    ⚠️ 위험! 시간이 너무 많이 낭비되었습니다!
                  </div>
                </div>
              )}
            </div>

            {/* 비난 메시지 섹션 */}
            <div className="pokemon-dialog pokemon-hover">
              <div className="pokemon-font text-lg mb-4 text-gray-800">
                메시지:
              </div>
              
              <div className={`text-black text-lg font-bold leading-relaxed mb-6 p-4 bg-gray-50 rounded border-2 border-gray-300 ${isTyping ? 'pokemon-typing' : ''}`}>
                {displayMessage}
              </div>
              
              <div className="text-center">
                <button 
                  onClick={refreshMessage}
                  className="pokemon-button"
                >
                  다른 메시지 듣기
                </button>
              </div>
            </div>
          </div>

          {/* 중앙 컬럼: 광고 + 공유 */}
          <div className="space-y-6">
            {/* 광고 섹션 */}
            <AdSection 
              showAd={showAd}
              adMessage={adMessage}
              extremeMode={extremeMode}
              elapsedTime={elapsedTime}
              onProductClick={handleProductClick}
            />

            {/* 공유 섹션 */}
            <div className="pokemon-dialog pokemon-hover">
              <div className="pokemon-font text-lg mb-4 text-gray-800">
                친구도 시간낭비시키기
              </div>
              
              <ShareSection 
                elapsedTime={elapsedTime}
                formatTime={formatTime}
                showModernModal={showModernModal}
              />
            </div>

            {/* 탈출 버튼 */}
            <div className="pokemon-dialog pokemon-hover text-center">
              <div className="pokemon-shortcut">ESC</div>
              <div className="pokemon-font text-lg mb-4 text-gray-800">
                현실로 돌아가기
              </div>
              
              <FloatingExitButton 
                elapsedTime={elapsedTime}
                onExit={handleExit}
                inline={true}
                showAlways={true}
              />
            </div>
          </div>

          {/* 오른쪽 컬럼: 랭킹 */}
          <div className="pokemon-dialog pokemon-hover">
            <div className="pokemon-font text-lg mb-4 text-gray-800">
              시간낭비 명예의 전당
            </div>
            
            <div className="pokemon-ranking">
              <RankingSection 
                isVisible={true}
                currentUser={currentUser}
              />
            </div>
          </div>

        </div>

        {/* 하단 액션 바 */}
        <div className="pokemon-stats mt-6">
          <div className="pokemon-font text-sm">
            💡 SPACE: 메시지 새로고침 | ESC: 게임 종료
          </div>
          <div className="pokemon-font text-sm">
            💻 시간낭비 계산기 v2.0
          </div>
        </div>

      </div>

      {/* 이스터 에그 */}
      <EasterEgg elapsedTime={elapsedTime} />

      {/* 라이브 피드 */}
      <LiveFeedNotifications />
      
      {/* 개발자 도구 */}
      <DevTools isVisible={import.meta.env.DEV} />

      {/* 🎉 축하 이펙트 - 포켓몬 스타일 */}
      <CelebrationEffect 
        isActive={showCelebration}
        celebration={currentCelebration}
        onComplete={handleCelebrationComplete}
      />

      {/* 모달들 */}
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