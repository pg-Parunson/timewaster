import React, { useState, useEffect, useRef } from 'react';

// 컴포넌트 imports
import StatsBar from './components/StatsBar.jsx';
import TimerSection from './components/TimerSection.jsx';
import AdSection from './components/AdSection.jsx';
import ModernModal from './components/ModernModal.jsx';
import CelebrationEffect from './components/CelebrationEffect.jsx';
import ShareSection from './components/ShareSection.jsx';
import ExtremeMode from './components/ExtremeMode.jsx';
import EasterEgg from './components/EasterEgg.jsx';
import FloatingExitButton from './components/FloatingExitButton.jsx';
import MessageSection from './components/MessageSection.jsx';
import SiteHeader from './components/SiteHeader.jsx';
import MainActionButton from './components/MainActionButton.jsx';
import BackgroundEffects from './components/BackgroundEffects.jsx';

// 훅스 imports
import { useCelebrationSystem } from './hooks/useCelebrationSystem';

// 데이터 imports
import { ROAST_MESSAGES } from './data/roastMessages';
import { AD_MESSAGES } from './data/adMessages';
import { BUTTON_TEXTS } from './data/buttonTexts';
import { getTimeBasedActivity } from './data/timeBasedActivities';
import { getRecommendedProduct } from './data/coupangProducts';

// 유틸리티 imports
import { storage } from './utils/storage';
import { analytics } from './utils/analytics';
import { formatTime } from './utils/helpers';

function App() {
  // 기본 상태들
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("당신의 소중한 시간이 흘러가고 있습니다...");
  const [displayMessage, setDisplayMessage] = useState(""); // 타이핑 애니메이션용
  const [buttonText, setButtonText] = useState(BUTTON_TEXTS[0]);
  const [showAd, setShowAd] = useState(false);
  const [adMessage, setAdMessage] = useState(AD_MESSAGES[0]);
  const [visits, setVisits] = useState(1);
  const [totalTimeWasted, setTotalTimeWasted] = useState(0);
  const [adClicks, setAdClicks] = useState(0);
  const [messageShake, setMessageShake] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [extremeMode, setExtremeMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [concurrentUsers, setConcurrentUsers] = useState(3);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  
  const timerRef = useRef(null);
  const typingRef = useRef(null);
  
  // 축하 시스템 초기화
  const { showCelebration, currentCelebration, handleCelebrationComplete } = useCelebrationSystem(elapsedTime);

  // CSS 애니메이션 스타일 주입
  useEffect(() => {
    const celebrationStyles = `
      @keyframes celebration-float {
        0% {
          transform: translateY(100vh) rotate(0deg) scale(0);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        50% {
          transform: translateY(-20px) rotate(180deg) scale(1.2);
          opacity: 1;
        }
        100% {
          transform: translateY(-100vh) rotate(360deg) scale(0.5);
          opacity: 0;
        }
      }
      
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0) translateX(-50%);
        }
        40% {
          transform: translateY(-30px) translateX(-50%);
        }
        60% {
          transform: translateY(-15px) translateX(-50%);
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
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = celebrationStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // 실시간 동시 접속자 시뮬레이션
  useEffect(() => {
    const updateConcurrentUsers = () => {
      const hour = new Date().getHours();
      let baseUsers = 3;
      let timeWeight = 1;
      
      if (hour >= 9 && hour <= 12) timeWeight = 1.3;
      else if (hour >= 14 && hour <= 18) timeWeight = 1.5;
      else if (hour >= 19 && hour <= 23) timeWeight = 1.8;
      else if (hour >= 0 && hour <= 2) timeWeight = 1.2;
      else timeWeight = 0.8;

      const variation = (Math.random() - 0.5) * 4;
      const newUsers = Math.max(1, Math.min(15, Math.round(baseUsers * timeWeight + variation)));
      setConcurrentUsers(newUsers);
    };

    updateConcurrentUsers();
    const interval = setInterval(updateConcurrentUsers, 25000);
    return () => clearInterval(interval);
  }, []);

  // 세련된 모달 표시 함수
  const showModernModal = (title, message, type = 'info', showCancel = false) => {
    setModalConfig({ title, message, type, showCancel });
    setShowModal(true);
  };

  // 타이핑 애니메이션 함수
  const typeMessage = (message) => {
    if (typingRef.current) {
      clearTimeout(typingRef.current);
    }
    
    setIsTyping(true);
    setDisplayMessage("");
    
    let index = 0;
    const type = () => {
      if (index < message.length) {
        setDisplayMessage(prev => prev + message.charAt(index));
        index++;
        typingRef.current = setTimeout(type, 30 + Math.random() * 20);
      } else {
        setIsTyping(false);
      }
    };
    
    type();
  };

  // 로컬스토리지에서 데이터 로드
  useEffect(() => {
    const visits = storage.incrementVisits();
    const storedData = storage.getAllData();
    
    setVisits(visits);
    setTotalTimeWasted(storedData.totalTimeWasted);
    setAdClicks(storedData.adClicks);
    
    // Google Analytics 세션 시작 이벤트
    analytics.trackSessionStart(visits, storedData.totalTimeWasted);
  }, []);

  // 초기 메시지 타이핑
  useEffect(() => {
    typeMessage(currentMessage);
  }, []);

  // 타이머 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPageVisible) {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        setElapsedTime(elapsed);
        
        // 1분 후 광고 표시
        if (elapsed >= 60 && !showAd) {
          setShowAd(true);
        }
        
        // 5분 후 극한 모드
        if (elapsed >= 300 && !extremeMode) {
          setExtremeMode(true);
          analytics.trackExtremeMode();
        }
        
        // 광고 메시지 업데이트 (30초마다)
        if (elapsed >= 60) {
          const adIndex = Math.min(Math.floor((elapsed - 60) / 30), AD_MESSAGES.length - 1);
          setAdMessage(AD_MESSAGES[adIndex]);
        }
        
        // 자동 메시지 변경 (45초마다)
        if (elapsed > 0 && elapsed % 45 === 0) {
          refreshMessage();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isPageVisible, showAd, extremeMode]);

  // 페이지 가시성 감지
  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsPageVisible(visible);
      
      if (!visible) {
        document.title = "돌아와요... 🥺 - 시간낭비 계산기";
      } else {
        document.title = "🕒 당신이 낭비한 시간 계산기";
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // 페이지 떠나기 방지
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (elapsedTime > 60) {
        storage.updateTotalTimeWasted(elapsedTime);
        
        const message = '정말로 나가시겠어요? 이제 막 재미있어지려고 했는데...';
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [elapsedTime, totalTimeWasted]);

  // 메시지 새로고침 - 강화된 활동 매칭 시스템
  const refreshMessage = () => {
    if (elapsedTime < 10) {
      const newMessage = "시간 낭비의 여정이 시작되었습니다.";
      setCurrentMessage(newMessage);
      typeMessage(newMessage);
      return;
    }

    // 강화된 시간 매칭 시스템
    const currentActivity = getTimeBasedActivity(elapsedTime);
    const randomRoast = ROAST_MESSAGES[Math.floor(Math.random() * ROAST_MESSAGES.length)];
    
    // 다양한 메시지 패턴
    const messagePatterns = [
      `이 시간에 "${currentActivity.activity}" 할 수 있었는데... ${randomRoast}`,
      `${currentActivity.icon} ${currentActivity.activity}를 할 수 있었는 소중한 시간이었어요. ${randomRoast}`,
      `⏰ ${formatTime(elapsedTime)} 동안 "${currentActivity.activity}" 같은 ${currentActivity.category} 활동을 했다면... ${randomRoast}`,
      `${currentActivity.icon} 지금 이 순간에도 "${currentActivity.activity}"로 더 나은 자신이 될 수 있었는데... ${randomRoast}`
    ];
    
    const randomPattern = messagePatterns[Math.floor(Math.random() * messagePatterns.length)];
    setCurrentMessage(randomPattern);
    typeMessage(randomPattern);
    
    // 버튼 텍스트도 가끔 변경
    if (Math.random() < 0.4) {
      const randomButtonText = BUTTON_TEXTS[Math.floor(Math.random() * BUTTON_TEXTS.length)];
      setButtonText(randomButtonText);
    }
    
    // 메시지 흔들기 효과
    setMessageShake(true);
    setTimeout(() => setMessageShake(false), 500);
  };

  // 쿠팡 상품 클릭 (실제 파트너스 연동)
  const handleProductClick = () => {
    const product = getRecommendedProduct(elapsedTime);
    
    // Google Analytics 이벤트 추적
    analytics.trackCoupangClick(product.name, product.category, elapsedTime, adClicks + 1);
    
    // 쿠팡 파트너스 링크로 이동
    window.open(product.url, '_blank');
    
    const responses = [
      `${product.icon} ${product.name} 좋은 선택이에요! 🎉`,
      `훌륭해요! ${product.category} 분야 투자는 언제나 옳습니다!`,
      `${product.name}로 시간낭비를 생산적으로 만드셨네요!`,
      `감사합니다! ${product.category} 상품 클릭으로 사이트를 후원해주셨어요!`,
      `완벽한 선택! ${product.name}은 정말 추천하는 아이템이에요!`
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    showModernModal("쿠팡 파트너스 클릭!", randomResponse, 'success');
    
    const newAdClicks = storage.incrementAdClicks();
    setAdClicks(newAdClicks);
  };

  // 종료 확인
  const handleExit = () => {
    showModernModal(
      "현실로 돌아가시겠습니까?",
      "정말로 이 환상적인 시간낭비를 끝내시겠습니까? 지금까지의 모든 노력이 물거품이 될 수 있어요!",
      'exit',
      true // showCancel = true
    );
  };

  const confirmExit = () => {
    // Google Analytics 종료 이벤트 추적
    analytics.trackExit(elapsedTime);
    
    setShowModal(false);
    // 브라우저 창 닫기 시도
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.close();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* 현대적 배경 효과 */}
      <BackgroundEffects />

      {/* 메인 컨테이너 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 lg:p-8 w-full max-w-7xl">
          {/* 상단 통계 바 */}
          <StatsBar 
            visits={visits}
            adClicks={adClicks}
            totalTimeWasted={totalTimeWasted}
            concurrentUsers={concurrentUsers}
            extremeMode={extremeMode}
          />

          {/* 사이트 제목 헤더 */}
          <SiteHeader />

          {/* 메인 콘텐츠 영역 - 2단 레이아웃 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* 왼쪽: 타이머 + 활동 제안 */}
            <TimerSection 
              elapsedTime={elapsedTime}
              extremeMode={extremeMode}
            />

            {/* 오른쪽: 광고 영역 (항상 표시) */}
            <AdSection 
              showAd={showAd}
              adMessage={adMessage}
              extremeMode={extremeMode}
              elapsedTime={elapsedTime}
              onProductClick={handleProductClick}
            />
          </div>

          {/* 메시지 영역 */}
          <MessageSection 
            displayMessage={displayMessage}
            isTyping={isTyping}
            messageShake={messageShake}
            extremeMode={extremeMode}
            onRefreshMessage={refreshMessage}
          />

          {/* 메인 액션 버튼 */}
          <MainActionButton 
            buttonText={buttonText}
            isTyping={isTyping}
            extremeMode={extremeMode}
            onClick={refreshMessage}
          />

          {/* 공유 섹션 */}
          <ShareSection 
            elapsedTime={elapsedTime}
            formatTime={formatTime}
            showModernModal={showModernModal}
          />

          {/* 극한 모드 추가 경고 */}
          <ExtremeMode 
            extremeMode={extremeMode}
            elapsedTime={elapsedTime}
          />

          {/* 이스터에그 - 업그레이드된 버전 */}
          <EasterEgg elapsedTime={elapsedTime} />
        </div>
      </div>

      {/* 플로팅 액션 버튼 (개선된 디자인) */}
      <FloatingExitButton 
        elapsedTime={elapsedTime}
        onExit={handleExit}
      />

      {/* 축하 이팩트 컴포넌트 */}
      <CelebrationEffect 
        isActive={showCelebration}
        celebration={currentCelebration}
        onComplete={handleCelebrationComplete}
      />

      {/* 세련된 모달 */}
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
