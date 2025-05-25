import React, { useState, useEffect, useRef, useCallback } from 'react';

// 컴포넌트 imports
import StatsBar from './components/StatsBar.jsx';
import TimerSection from './components/TimerSection.jsx';
import AdSection from './components/AdSection.jsx';
import ModernModal from './components/ModernModal.jsx';
import RankingRegistrationModal from './components/RankingRegistrationModal.jsx';
import CelebrationEffect from './components/CelebrationEffect.jsx';
import ShareSection from './components/ShareSection.jsx';
import ExtremeMode from './components/ExtremeMode.jsx';
import EasterEgg from './components/EasterEgg.jsx';
import FloatingExitButton from './components/FloatingExitButton.jsx';
import MessageSection from './components/MessageSection.jsx';
import SiteHeader from './components/SiteHeader.jsx';
import MainActionButton from './components/MainActionButton.jsx';
import BackgroundEffects from './components/BackgroundEffects.jsx';
import RankingSection from './components/RankingSection.jsx';
import LiveFeedNotifications from './components/LiveFeedNotifications.jsx';
import DevTools from './components/DevTools.jsx';

// 훅스 imports
import { useCelebrationSystem } from './hooks/useCelebrationSystem';

// 데이터 imports
import { 
  ROAST_MESSAGES, 
  getRankingMessage, 
  getTimeBasedMessage, 
  getRandomRoastMessage,
  getIntegratedMessage // 새로운 통합 메시지 시스템
} from './data/roastMessages';
import { AD_MESSAGES } from './data/adMessages';
import { BUTTON_TEXTS } from './data/buttonTexts';
import { getTimeBasedActivity } from './data/timeBasedActivities';
import { getRecommendedProduct } from './data/coupangProducts';

// 유틸리티 imports
import { storage } from './utils/storage';
import { analytics } from './utils/analytics';
import { formatTime, getParticle } from './utils/helpers';

// Firebase 랭킹 서비스
import { rankingService } from './services/rankingService.js';

// 실시간 피드 서비스
import { addMilestoneNotification, addRankingNotification, addActivityNotification } from './services/liveFeedService.js';

function App() {
  // 기본 상태들
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("당신의 소중한 시간이 흘러가고 있습니다...");
  const [currentMessageData, setCurrentMessageData] = useState(null); // 새로운 상태: 스마트 메시지 데이터
  const [displayMessage, setDisplayMessage] = useState(""); // 타이핑 애니메이션용
  const [userHistory, setUserHistory] = useState({ visits: 1, patterns: {} }); // 사용자 히스토리
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
  const [currentUser, setCurrentUser] = useState(null);
  const [isRankingInitialized, setIsRankingInitialized] = useState(false);
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [currentRank, setCurrentRank] = useState(null);
  const [lastRankCheckTime, setLastRankCheckTime] = useState(0);
  
  const timerRef = useRef(null);
  const typingRef = useRef(null);
  
  // 축하 시스템 초기화
  const { showCelebration, currentCelebration, handleCelebrationComplete } = useCelebrationSystem(elapsedTime);

  // handleCelebrationComplete를 useCallback으로 안정화
  const stableHandleCelebrationComplete = useCallback(() => {
    handleCelebrationComplete();
  }, [handleCelebrationComplete]);

  // CSS 애니메이션 스타일 주입
  useEffect(() => {
    const celebrationStyles = `
      @keyframes celebration-float {
        0% {
          transform: translateY(50px) rotate(0deg);
          opacity: 0;
          scale: 0.5;
        }
        10% {
          opacity: 1;
          scale: 1;
        }
        50% {
          transform: translateY(-30px) rotate(180deg);
          opacity: 1;
          scale: 1.1;
        }
        100% {
          transform: translateY(-80px) rotate(360deg);
          opacity: 0;
          scale: 0.3;
        }
      }
      
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateX(-50%) translateY(-50%);
        }
        40% {
          transform: translateX(-50%) translateY(-50%) translateY(-30px);
        }
        60% {
          transform: translateX(-50%) translateY(-50%) translateY(-15px);
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
      
      /* 메시지 박스 완전 안정화 */
      .message-container {
        position: relative;
        width: 100%;
        max-width: 100%;
        overflow: visible; /* hidden → visible로 변경 */
        border-radius: 1.5rem !important;
        transform: none !important; /* transform 완전 차단 */
        contain: layout style;
      }
      
      /* 메시지 애니메이션 완전 안정화 */
      .message-container * {
        max-width: 100%;
        word-wrap: break-word;
        overflow-wrap: break-word;
        box-sizing: border-box;
        transform: none !important;
      }
      
      /* 메시지 텍스트 영역 안정화 */
      .message-container p {
        transform: none !important;
        position: relative !important;
        left: auto !important;
        right: auto !important;
        margin: 0 auto !important;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      /* 실시간 알림 애니메이션 */
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
      
      /* 스크롤바 숨기기 */
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      
      /* 모달 애니메이션 */
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

  // 현재 랭킹 확인 함수
  const checkCurrentRanking = async (timeInSeconds) => {
    if (!isRankingInitialized) return;
    
    try {
      const rank = await rankingService.getExpectedRank(timeInSeconds);
      const previousRank = currentRank;
      setCurrentRank(rank);
      
      // 랭킹 상승 시 특별 알림
      if (previousRank && rank < previousRank && rank <= 10) {
        const minutes = Math.floor(timeInSeconds / 60);
        addRankingNotification(rank, minutes, currentUser?.anonymousName);
        
        // 랭킹 기반 특별 메시지 표시 (낮은 확률로)
        if (Math.random() < 0.3) {
          const rankingMessage = getRankingMessage(rank, timeInSeconds);
          setCurrentMessage(rankingMessage);
          typeMessage(rankingMessage);
        }
      }
    } catch (error) {
      console.error('랭킹 확인 실패:', error);
    }
  };

  // 타이핑 애니메이션 함수 - 중복 문자 버그 수정
  const typeMessage = (message) => {
    // 이전 타이머 완전 정리
    if (typingRef.current) {
      clearTimeout(typingRef.current);
      typingRef.current = null;
    }
    
    // 메시지 유효성 검사
    if (!message || typeof message !== 'string') {
      console.warn('Invalid message:', message);
      setDisplayMessage("오류가 발생했습니다. 다시 시도해주세요.");
      setIsTyping(false);
      return;
    }
    
    setIsTyping(true);
    setDisplayMessage(""); // 완전 초기화
    
    // 문자열을 배열로 변환하여 한글 문자 처리 개선
    const chars = Array.from(message);
    let currentText = ""; // 로컬 변수로 현재 텍스트 추적
    let index = 0;
    
    const type = () => {
      if (index < chars.length) {
        currentText += chars[index]; // 로컬 변수에 추가
        setDisplayMessage(currentText); // 전체 대체
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

  // Firebase 랭킹 시스템 초기화
  useEffect(() => {
    const initializeRanking = async () => {
      try {
        console.log('🚀 Firebase 랭킹 시스템 초기화 시작...');
        const user = await rankingService.initializeSession();
        setCurrentUser(user);
        setIsRankingInitialized(true);
        console.log(`✅ 랭킹 시스템 초기화 완료: ${user.anonymousName}`);
      } catch (error) {
        console.error('❌ Firebase 랭킹 시스템 초기화 실패:', error);
        // Firebase 연결 실패시도 기본 기능은 사용 가능
        setIsRankingInitialized(false);
      }
    };

    initializeRanking();

    // 컴포넌트 언마운트 시 랭킹 세션 종료
    return () => {
      if (isRankingInitialized) {
        rankingService.endSession();
      }
    };
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
        
        // Firebase 랭킹 시스템에 시간 업데이트
        if (isRankingInitialized && elapsed > 0) {
          rankingService.updateTime(elapsed);
          
          // 마일스톤 달성 시 알림 추가 (1분, 3분, 5분, 10분, 15분, 30분...)
          if (elapsed === 60 || elapsed === 180 || elapsed === 300 || elapsed === 600 || elapsed === 900 || elapsed === 1800 || elapsed === 3600) {
            const minutes = Math.floor(elapsed / 60);
            addMilestoneNotification(minutes, currentUser?.anonymousName);
          }
          
          // 랭킹 확인 (30초마다)
          if (elapsed > 60 && elapsed % 30 === 0 && elapsed !== lastRankCheckTime) {
            setLastRankCheckTime(elapsed);
            checkCurrentRanking(elapsed);
          }
          
          // 활동 알림 (30초마다 랜덤하게)
          if (elapsed > 30 && elapsed % 30 === 0 && Math.random() < 0.3) {
            const currentActivity = getTimeBasedActivity(elapsed);
            addActivityNotification(`${elapsed}초 동안 "${currentActivity.activity}" 생각 중...`, currentUser?.anonymousName);
          }
        }
        
        // 1분 후 광고 표시
        if (elapsed >= 60 && !showAd) {
          setShowAd(true);
        }
        
        // 5분 후 극한 모드
        if (elapsed >= 300 && !extremeMode) {
          setExtremeMode(true);
          analytics.trackExtremeMode();
        }
        
        // 자동 메시지 변경 (45초마다)
        if (elapsed > 0 && elapsed % 45 === 0) {
          refreshMessage();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isPageVisible, showAd, extremeMode, isRankingInitialized]);

  // 광고 메시지 업데이트 (버그 완전 해결 버전)
  useEffect(() => {
    if (!showAd) return; // 광고가 안 보이면 업데이트 안 함
    if (isTyping) return; // 타이핑 중이면 업데이트 안 함
    
    // 1분마다 광고 메시지 변경 (단순하게)
    const currentMinute = Math.floor(elapsedTime / 60);
    const adIndex = Math.min(currentMinute - 1, AD_MESSAGES.length - 1); // 1분부터 시작이니까 -1
    
    if (adIndex >= 0 && adIndex < AD_MESSAGES.length) {
      const newAdMessage = AD_MESSAGES[adIndex];
      console.log(`광고 업데이트: ${currentMinute}분, 인덱스: ${adIndex}, 메시지: ${newAdMessage}`);
      setAdMessage(newAdMessage);
    }
  }, [showAd, isTyping, Math.floor(elapsedTime / 60)]); // 분 단위로만 업데이트

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

  // 메시지 새로고침 - 새로운 통합 스마트 메시지 시스템
  const refreshMessage = () => {
    if (elapsedTime < 10) {
      const newMessage = "시간 낭비의 여정이 시작되었습니다.";
      setCurrentMessage(newMessage);
      setCurrentMessageData(null);
      typeMessage(newMessage);
      return;
    }

    // 사용자 히스토리 업데이트
    const history = {
      visits,
      timeSpent: elapsedTime,
      adClicks,
      patterns: {
        frequentVisitor: visits >= 3,
        longTimeUser: elapsedTime >= 1800, // 30분 이상
        extremeUser: extremeMode
      }
    };
    setUserHistory(history);

    // 통합 메시지 시스템 사용
    const messageResult = getIntegratedMessage(elapsedTime, currentRank, history);
    
    setCurrentMessage(messageResult.message);
    setCurrentMessageData(messageResult);
    typeMessage(messageResult.message);
    
    console.log('🎯 새로운 메시지 시스템:', messageResult.type, messageResult.category);
    
    // 버튼 텍스트도 가끔 변경
    if (Math.random() < 0.4) {
      const randomButtonText = BUTTON_TEXTS[Math.floor(Math.random() * BUTTON_TEXTS.length)];
      setButtonText(randomButtonText);
    }
    
    // 메시지 흔들기 효과
    setMessageShake(true);
    setTimeout(() => setMessageShake(false), 500);
  };

  // 활동 선택 핸들러 - 새로운 기능
  const handleActivitySelect = (activity) => {
    console.log('🎯 사용자가 활동을 선택했습니다:', activity);
    
    if (activity === 'start_activity') {
      // "지금 바로 시작하기" 버튼 클릭
      showModernModal(
        '🚀 대단해요!',
        '드디어 생산적인 일을 시작하시는군요! 이 의지를 계속 유지해보세요. 아니면... 조금 더 여기 있어도 괜찮아요 😏',
        'success'
      );
      
      // 새로운 동기부여 메시지 표시
      const motivationalMessage = '정말 시작하실 건가요? 아니면 조금 더...?';
      setCurrentMessage(motivationalMessage);
      typeMessage(motivationalMessage);
    } else {
      // 특정 활동 선택
      showModernModal(
        '✨ 훌륭한 선택!',
        `"${activity}" 정말 좋은 아이디어네요! 지금 당장 시작해보세요. 더 늦기 전에 말이에요...`,
        'info'
      );
      
      // Google Analytics 이벤트 추적
      analytics.trackActivitySelect(activity, elapsedTime);
    }
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
    // 랭킹 등록 모달을 먼저 표시
    setShowRankingModal(true);
  };

  const handleRankingModalClose = () => {
    setShowRankingModal(false);
    // 랭킹 모달을 닫으면 다시 기본 종료 확인 모달 표시
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
    
    // 시간 저장
    storage.updateTotalTimeWasted(elapsedTime);
    
    // 모든 모달 닫기
    setShowModal(false);
    setShowRankingModal(false);
    
    // Firebase 세션 종료
    if (isRankingInitialized) {
      rankingService.endSession();
    }
    
    // beforeunload 이벤트 비활성화 (더블 모달 방지)
    window.removeEventListener('beforeunload', handleBeforeUnload);
    
    // 지연을 두고 페이지 나가기 (더 안정적)
    setTimeout(() => {
      // 브라우저 창 닫기 시도
      if (window.history.length > 1) {
        window.history.back();
      } else {
        // 페이지 리로드로 초기화 (대안)
        window.location.reload();
      }
    }, 100);
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
            currentElapsedTime={elapsedTime}
          />

          {/* 사이트 제목 헤더 */}
          <SiteHeader />

          {/* 비난 메시지 영역 - 상단 배치 및 축소 */}
          <div className="mb-4">
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
          </div>

          {/* 메인 콘텐츠 영역 - 새로운 2단 레이아웃: 타이머+활동제안+광고 | 랭킹 */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 mb-4">
            {/* 왼쪽: 타이머 + 활동 제안 + 광고 (2칸 차지) */}
            <div className="lg:col-span-3 space-y-4">
              {/* 타이머 섹션 */}
              <TimerSection 
                elapsedTime={elapsedTime}
                extremeMode={extremeMode}
              />
              
              {/* 광고 섹션 - 활동 제안 아래로 이동 */}
              <AdSection 
                showAd={showAd}
                adMessage={adMessage}
                extremeMode={extremeMode}
                elapsedTime={elapsedTime}
                onProductClick={handleProductClick}
              />
            </div>

            {/* 오른쪽: 랭킹 영역 (확장) */}
            <div className="lg:col-span-4">
              <div className="w-full max-h-80 overflow-y-auto scrollbar-hide">
                <RankingSection 
                  isVisible={true}
                  currentUser={currentUser}
                />
              </div>
            </div>
          </div>

          {/* 메시지 영역이 상단으로 이동됨 */}

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
        onComplete={stableHandleCelebrationComplete}
      />

      {/* 실시간 피드 알림 */}
      <LiveFeedNotifications />
      
      {/* 개발 도구 (개발 모드에서만 표시) */}
      <DevTools isVisible={import.meta.env.DEV} />

      {/* 랭킹 등록 모달 */}
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