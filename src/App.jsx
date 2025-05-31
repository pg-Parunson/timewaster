import React, { useEffect, useState } from 'react';
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
import FlyingMessageManager from './components/flying-messages/FlyingMessageManager.jsx';
import FlyingChatMessage from './components/flying-messages/FlyingChatMessage.jsx'; // 테스트용 추가
import BGMManager from './components/BGMManager.jsx';
import Footer from './components/Footer.jsx';
import { Heart, Share2, MessageCircle, Copy } from 'lucide-react';

// 훅스 imports
import { useCelebrationSystem } from './hooks/useCelebrationSystem.jsx';
import { useTimerLogic } from './hooks/useTimerLogic.jsx';
import { useModalLogic } from './hooks/useModalLogic.jsx';

// 유틸리티 imports
import { formatTime } from './utils/helpers';

// 시간에 따른 타이머 색상 계산 함수
const getTimerColor = (elapsedTime) => {
  const minutes = Math.floor(elapsedTime / 60);
  
  if (minutes < 1) {
    // 1분 미만: 기본 주황색
    return {
      color: 'var(--pokemon-orange)',
      textShadow: '4px 4px 0px var(--pokemon-navy), -2px -2px 0px var(--pokemon-white)'
    };
  } else if (minutes < 3) {
    // 1-3분: 노란색으로 변화
    return {
      color: '#FFD700',
      textShadow: '4px 4px 0px #B8860B, -2px -2px 0px var(--pokemon-white)'
    };
  } else if (minutes < 5) {
    // 3-5분: 주황색
    return {
      color: '#FF8C00',
      textShadow: '4px 4px 0px #CC4400, -2px -2px 0px var(--pokemon-white)'
    };
  } else if (minutes < 10) {
    // 5-10분: 붉은색
    return {
      color: '#FF4444',
      textShadow: '4px 4px 0px #CC0000, -2px -2px 0px var(--pokemon-white)'
    };
  } else if (minutes < 15) {
    // 10-15분: 진한 붉은색
    return {
      color: '#CC0000',
      textShadow: '4px 4px 0px #800000, -2px -2px 0px var(--pokemon-white)'
    };
  } else {
    // 15분 이상: 자주색 (전설의 색상)
    return {
      color: '#8B00FF',
      textShadow: '4px 4px 0px #4B0080, -2px -2px 0px var(--pokemon-white)'
    };
  }
};

// 회전 부제목 배열
const rotatingSubtitles = [
  "당신의 소중한 인생이 녹고 있습니다",
  "시간은 금이라고? 지금 파산중", 
  "뇌세포 실시간 사망 알림",
  "하루 24시간 중 몇 시간을 날렸나요?",
  "엄마가 보면 울 사이트",
  "생산성 -100% 달성 중",
  "당신의 집중력이 산산조각나는 소리",
  "미래의 나에게 미안한 시간들",
  "프로급 시간낭비 스킬을 배워보세요",
  "시간 마스터가 되는 그 순간까지"
];

// 회전 부제목 훅
const useRotatingSubtitle = () => {
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentSubtitleIndex(prev => 
          (prev + 1) % rotatingSubtitles.length
        );
        setIsAnimating(false);
      }, 500); // 0.5초 페이드 아웃 후 변경
      
    }, 10000); // 10초마다 변경

    return () => clearInterval(interval);
  }, []);

  return {
    currentSubtitle: rotatingSubtitles[currentSubtitleIndex],
    isAnimating
  };
};

// 메시지 타입별 스타일 함수
const getMessageStyle = (messageType) => {
  const styles = {
    warning: 'bg-red-50 border-red-300 text-red-800',
    motivation: 'bg-blue-50 border-blue-300 text-blue-800', 
    funny: 'bg-green-50 border-green-300 text-green-800',
    sarcastic: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    urgent: 'bg-orange-50 border-orange-300 text-orange-800',
    default: 'bg-gray-50 border-gray-300 text-gray-800'
  };
  return styles[messageType] || styles.default;
};

function App() {
  // 🐛 광고 쿨다운 상태 관리
  const [adCooldownInfo, setAdCooldownInfo] = useState({ cooldown: 0, canGetToken: true });
  
  // 🎨 채팅 권한 시스템 상태 추가
  const [chatTokens, setChatTokens] = useState(0); // 일반 메시지 권한
  const [premiumTokens, setPremiumTokens] = useState(0); // 프리미엄 메시지 권한
  
  // 🏆 랭킹 테스트를 위한 상태 추가
  const [isRankingTestMode, setIsRankingTestMode] = useState(false);
  const [testElapsedTime, setTestElapsedTime] = useState(300); // 테스트용 시간 상태
  
  // 🔰 광고 쿨다운 타이머 추가
  useEffect(() => {
    if (adCooldownInfo.cooldown > 0) {
      const timer = setInterval(() => {
        setAdCooldownInfo(prev => {
          const newCooldown = Math.max(0, prev.cooldown - 1000);
          return {
            cooldown: newCooldown,
            canGetToken: newCooldown === 0
          };
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [adCooldownInfo.cooldown]);
  
  // 회전 부제목 훅
  const { currentSubtitle, isAnimating } = useRotatingSubtitle();
  
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
    handleRankingModalExit,
    confirmExit,
    setShowModal
  } = useModalLogic({
    elapsedTime,
    adClicks,
    setAdClicks,
    totalTimeWasted,
    visits,
    isRankingInitialized,
    currentUser,
    // 🎆 채팅 권한 시스템 연동
    premiumTokens,
    setPremiumTokens,
    // 🔰 광고 쿨다운 시스템 연동
    adCooldownInfo,
    setAdCooldownInfo
  });
  
  // 🏆 랭킹 테스트 함수 추가 - 시간 매개변수 추가
  const handleRankingTest = (customTime = 300) => {
    console.log(`🏆 랭킹 테스트 모드 활성화! 시간: ${customTime}초 (${Math.floor(customTime/60)}분)`);
    setIsRankingTestMode(true);
    // 테스트용 시간 저장
    setTestElapsedTime(customTime);
  };
  
  const handleRankingTestClose = () => {
    setIsRankingTestMode(false);
  };
  
  const handleRankingTestConfirm = () => {
    console.log('🏆 랭킹 테스트 완료!');
    setIsRankingTestMode(false);
    // 다른 입력이 없으면 그냥 종료
  };

  // 축하 시스템 초기화 (범위 제한)
  const { showCelebration, currentCelebration, handleCelebrationComplete } = useCelebrationSystem(elapsedTime);

  // 포켓몬 골드 버전 스타일 주입
  useEffect(() => {
    const pokemonStyles = `
      /* Galmuri 폰트가 이미 import 되어 있음 */
      
      /* 📝 텍스트 커서(캐릿) 깜빡거리는 것 숨기기 */
      * {
        caret-color: transparent !important;
      }
      
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
      
      /* 회전 부제목 스타일 */
      .pokemon-subtitle {
        font-family: 'Galmuri11', 'Galmuri9', monospace;
        font-size: 1.1rem;
        color: var(--pokemon-navy);
        text-shadow: 1px 1px 0px var(--pokemon-white);
        transition: opacity 0.5s ease, transform 0.5s ease;
        min-height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .pokemon-subtitle.animating {
        opacity: 0;
        transform: translateY(-10px);
      }
      
      .pokemon-subtitle:not(.animating) {
        opacity: 1;
        transform: translateY(0);
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
      
      /* 포켓몬 버튼 스타일 - 인터랙션 강화! */
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
        min-height: 44px; /* 터치 친화적 최소 크기 */
        box-shadow: 3px 3px 0px rgba(0,0,0,0.4);
        transition: all 0.15s ease;
        position: relative;
        overflow: hidden;
      }
      
      .pokemon-button:hover {
        transform: translateY(-2px);
        box-shadow: 5px 5px 0px rgba(0,0,0,0.4);
        background: linear-gradient(135deg, #FFDC00 0%, #FF8C42 100%); /* 약간 더 밝게 */
      }
      
      .pokemon-button:active {
        transform: translateY(1px);
        box-shadow: 2px 2px 0px rgba(0,0,0,0.4);
      }
      
      /* 버튼 클릭 피드백 애니메이션 */
      .pokemon-button:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.5), 3px 3px 0px rgba(0,0,0,0.4);
      }
      
      /* 위기 번쩍거림 효과 - 타이머용 (파란색) */
      @keyframes pokemon-danger-blink {
        0%, 50% { 
          background-color: rgba(59, 130, 246, 0.2);
          border-color: #3B82F6;
        }
        51%, 100% { 
          background-color: transparent;
          border-color: var(--pokemon-black);
        }
      }
      
      .pokemon-danger {
        animation: pokemon-danger-blink 1.5s infinite;
      }
      
      /* 광고 번쩍거림 효과 - 은은한 초록색 */
      @keyframes pokemon-ad-blink {
        0%, 50% { 
          background-color: rgba(34, 197, 94, 0.08);
          border-color: rgba(34, 197, 94, 0.2);
        }
        51%, 100% { 
          background-color: transparent;
          border-color: var(--pokemon-black);
        }
      }
      
      .pokemon-ad-blink {
        animation: pokemon-ad-blink 2.2s infinite;
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
      
      /* 포켓몬 게임 메인 윈도우 - 더 넓은 가로 크기 */
      .pokemon-window {
        background: var(--pokemon-white);
        border: 6px solid var(--pokemon-black);
        border-radius: 12px;
        box-shadow: 
          inset 4px 4px 0px rgba(255,255,255,0.5),
          inset -4px -4px 0px rgba(0,0,0,0.3),
          8px 8px 16px rgba(0,0,0,0.4);
      }
      
      /* PC 친화적 가로형 그리드 - 랭킹 섹션 비중 증가 */
      .pokemon-grid {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr 1.4fr; /* 타이머:광고:랭킹 = 1.2:0.8:1.4 비율 (타이머 줄임) */
        gap: 24px;
        padding: 28px;
      }
      
      @media (max-width: 1200px) {
        .pokemon-grid {
          grid-template-columns: 1fr;
          gap: 20px;
          padding: 20px;
        }
      }
      
      @media (max-width: 768px) {
        .pokemon-grid {
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
      
      /* 타이머 대형 디스플레이 - 반응형 개선 & 동적 색상! */
      .pokemon-timer {
        font-family: 'Galmuri14', 'Galmuri11', monospace;
        font-weight: bold;
        font-size: clamp(2.5rem, 5vw, 4rem); /* 반응형 크기 */
        /* color와 text-shadow는 JavaScript에서 동적으로 설정 */
        text-align: center;
        padding: 24px;
        background: var(--pokemon-white);
        border: 4px solid var(--pokemon-black);
        border-radius: 12px;
        min-height: 120px; /* 최소 높이 보장 */
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.5s ease, text-shadow 0.5s ease; /* 부드러운 색상 전환 */
        /* 타이머만 예외적으로 그림자 유지 */
        box-shadow: 4px 4px 0px rgba(0,0,0,0.4);
      }
      
      /* 랭킹 섹션 포켓몬 스타일 - 20위까지 보여주기 + 가로폭 확장 */
      .pokemon-ranking {
        background: var(--pokemon-white);
        border: 4px solid var(--pokemon-black);
        border-radius: 8px;
        max-height: 650px; /* 600px에서 650px로 증가 */
        max-width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        word-wrap: break-word;
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
      
      /* 메시지 섹션 스타일 강화 */
      .pokemon-message {
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      
      .pokemon-message::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        transition: left 0.5s ease;
      }
      
      .pokemon-message:hover::before {
        left: 100%;
      }
      
      /* 반응형 그리드 개선 */
      @media (max-width: 768px) {
        .pokemon-grid {
          padding: 12px;
          gap: 12px;
        }
        
        .pokemon-stats {
          flex-direction: column;
          gap: 8px;
          text-align: center;
          padding: 12px 16px;
        }
        
        .pokemon-title {
          font-size: 2rem;
        }
        
        .pokemon-button {
          width: 100%;
          justify-content: center;
        }
      }
      
      /* 날아가는 메시지 애니메이션 */
      @keyframes slide-in-right {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      .animate-slide-in-right {
        animation: slide-in-right 0.3s ease-out;
      }
      
      @keyframes fly-across {
        from {
          transform: translateX(-100vw);
        }
        to {
          transform: translateX(100vw);
        }
      }
      
      .animate-fly-across {
        animation: fly-across 8s linear;
      }
      
      @keyframes float {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
      }
      
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
      
      /* 🏆 VIP 랭킹 컨테이너 - 새로운 티어 이펙트 전용 */
      .vip-rank-container {
        overflow: hidden;
        position: relative;
      }
      
      /* 🎨 헤더 배경 이미지 스타일 */
      .header-with-background {
        background-image: url('/images/header-background.jpeg'); /* 메인 이미지 */
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        position: relative;
        overflow: hidden;
        
        /* 이미지가 없을 경우를 위한 fallback 배경 */
        background-color: var(--pokemon-white);
        
        /* 이미지 위에 반투명 오버레이 (텍스트 가독성을 위해) */
      }
      
      .header-with-background::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.7); /* 흰색 반투명 오버레이 */
        z-index: 1;
      }
      
      .header-with-background > * {
        position: relative;
        z-index: 2; /* 오버레이 위에 텍스트가 보이도록 */
      }
      
      /* 다크한 이미지일 경우를 위한 대체 스타일 (클래스 추가로 전환 가능) */
      .header-with-background.dark-image::before {
        background: rgba(0, 0, 0, 0.3); /* 검은색 반투명 오버레이 */
      }
      
      .header-with-background.dark-image .pokemon-title {
        color: var(--pokemon-white);
        text-shadow: 
          3px 3px 0px var(--pokemon-black),
          -1px -1px 0px rgba(255, 255, 255, 0.2);
      }
      
      .header-with-background.dark-image .pokemon-subtitle {
        color: var(--pokemon-white);
        text-shadow: 2px 2px 0px var(--pokemon-black);
      }
      
      .header-with-background.dark-image .pokemon-font {
        color: var(--pokemon-white);
        text-shadow: 1px 1px 0px var(--pokemon-black);
      }
      
      /* 🎵 플로팅 BGM 컴트롤러 스타일 */
      .floating-bgm-controller {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 50;
        transition: all 0.3s ease;
      }
      
      .floating-bgm-controller:hover {
        transform: scale(1.05);
        bottom: 22px;
      }
      
      /* 🎆 모달 애니메이션 추가 */
      @keyframes bounce-in {
        0% {
          transform: translate(-50%, -50%) scale(0.3);
          opacity: 0;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.05);
        }
        70% {
          transform: translate(-50%, -50%) scale(0.9);
        }
        100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
      }
      
      .animate-bounce-in {
        animation: bounce-in 0.5s ease-out;
      }
      

    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = pokemonStyles;
    document.head.appendChild(styleElement);
    
    // 키보드 단축키 지원
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // 🔥 브라우저 기본 동작 방지 (스페이스바 스크롤 등)
        refreshMessage();
      } else if (e.key === 'Escape') {
        e.preventDefault(); // ESC 기본 동작도 방지
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
      <div className="pokemon-window max-w-[1500px] mx-auto my-8 relative">
        
        {/* 🎮 시간 낭비 마스터 헤더 - 배경 이미지 적용 */}
        <div className="text-center py-6 border-b-4 border-black relative header-with-background">
          <h1 className="pokemon-title mb-3">
            시간 낭비 <span className="text-yellow-500">마스터</span>
          </h1>
          <p className={`pokemon-subtitle ${isAnimating ? 'animating' : ''}`}>
            {currentSubtitle}
          </p>
          
          {/* 키보드 단축키 안내 */}
          <div className="mt-4 pokemon-font text-sm text-gray-600">
            🔄 <kbd className="px-2 py-1 bg-gray-200 border border-gray-400 rounded text-xs">SPACE</kbd> 메시지 새로고침 | 
            💫 <kbd className="px-2 py-1 bg-gray-200 border border-gray-400 rounded text-xs ml-2">ESC</kbd> 게임 종료
          </div>
        </div>

        {/* 통계 바 */}
        <div className="pokemon-stats">
          <div className="pokemon-font">
            동시 접속자: <span className="text-yellow-300">{concurrentUsers}명</span>
          </div>
          <div className="pokemon-font">
            전체 방문 횟수: <span className="text-yellow-300">{visits}회</span>
          </div>
          <div className="pokemon-font">
            누적 낭비시간: <span className="text-yellow-300">{Math.floor(totalTimeWasted)}시간</span>
          </div>
        </div>

        {/* 🔥 PC 친화적 3열 그리드 레이아웃 */}
        <div className="pokemon-grid">
          
          {/* 왼쪽 컬럼: 타이머 + 메시지 + 현실로 돌아가기 */}
          <div className="space-y-6">
            {/* 타이머 섹션 */}
            <div className="pokemon-dialog pokemon-hover relative">
              <div className="text-center mb-4">
                <div className="pokemon-font text-xl text-gray-700 mb-2">
                  현재 낭비 시간
                </div>
                <div 
                  className={`pokemon-timer ${extremeMode ? 'pokemon-danger' : ''}`}
                  style={getTimerColor(elapsedTime)}
                >
                  {formatTime(elapsedTime)}
                </div>
              </div>
              
              {extremeMode && (
                <div className="text-center">
                  <div className="pokemon-font text-lg animate-bounce" style={{
                    color: getTimerColor(elapsedTime).color
                  }}>
                    ⚠️ 위험! 시간이 너무 많이 낭비되었습니다!
                  </div>
                </div>
              )}
            </div>

            {/* 비난 메시지 섹션 */}
            <div className="pokemon-dialog pokemon-hover relative">
              <div className="pokemon-font text-lg mb-4 text-gray-800">
                메시지:
              </div>
              
              <div className={`pokemon-message text-black text-lg font-bold leading-relaxed mb-6 p-4 rounded-lg border-2 ${getMessageStyle(currentMessageData?.type || 'default')} ${isTyping ? 'pokemon-typing' : ''}`}>
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

            {/* 현실로 돌아가기 - 메시지 섹션 아래로 이동! */}
            <div className="pokemon-dialog pokemon-hover text-center bg-red-50 border-red-300">
              <div className="pokemon-font text-xl mb-4 text-red-800 font-bold">
                🚨 현실로 돌아가기 🚨
              </div>
              
              <div className="flex justify-center">
                <FloatingExitButton 
                  elapsedTime={elapsedTime}
                  onExit={handleExit}
                  inline={true}
                  showAlways={true}
                />
              </div>
              
              <div className="mt-3 text-sm text-red-600 pokemon-font">
                너무 오래 있으면 정말 위험해요!
              </div>
            </div>
          </div>

          {/* 중앙 컬럼: 광고 + 공유 */}
          <div className="space-y-6">
            {/* 광고 섹션 - 🐛 쿨다운 정보 전달 */}
            <AdSection 
              showAd={showAd}
              adMessage={adMessage}
              extremeMode={extremeMode}
              elapsedTime={elapsedTime}
              onProductClick={handleProductClick}
              adCooldownInfo={adCooldownInfo} // 🐛 쿨다운 정보 전달
            />

            {/* 공유 섹션 */}
            <div className="pokemon-dialog pokemon-hover">
              <div className="pokemon-font text-lg mb-4 text-gray-800">
                😍 친구들도 시간낭비 시키기
              </div>
              
              <ShareSection 
                elapsedTime={elapsedTime}
                formatTime={formatTime}
                showModernModal={showModernModal}
              />
            </div>
          </div>

          {/* 오른쪽 컬럼: 랭킹 */}
          <div className="pokemon-dialog pokemon-hover">
            <div className="pokemon-font text-lg mb-4 text-gray-800">
              시간낭비 명예의 전당
            </div>
            
            <div className="pokemon-ranking overflow-hidden">
              <RankingSection 
                isVisible={true}
                currentUser={currentUser}
                elapsedTime={elapsedTime}
              />
            </div>
          </div>

        </div>

        {/* 하단 액션 바 */}
        <div className="pokemon-stats mt-6">
          <div className="pokemon-font text-sm">
            🌍 전 세계 시간낭비자들과 함께 하는 매직타임!
          </div>
          <div className="pokemon-font text-sm">
            💻 시간 낭비 마스터 v2.8
          </div>
        </div>

        {/* 푸터 */}
        <Footer />

      </div>

      {/* 🎵 독립적인 플로팅 BGM 컨트롤러 */}
      <div className="floating-bgm-controller">
        <BGMManager elapsedTime={elapsedTime} compact={true} />
      </div>

      {/* 이스터 에그 */}
      <EasterEgg elapsedTime={elapsedTime} />

      {/* 날아가는 메시지 시스템 - 🐛 쿨다운 콜백 + 🎆 권한 시스템 연동 */}
      <FlyingMessageManager 
        elapsedTime={elapsedTime} 
        onAdCooldownChange={setAdCooldownInfo} // 🐛 쿨다운 상태 콜백
        // 🎆 채팅 권한 시스템 연동
        chatTokens={chatTokens}
        setChatTokens={setChatTokens}
        premiumTokens={premiumTokens}
        setPremiumTokens={setPremiumTokens}
      />
      
      {/* 🧪 테스트용 강제 메시지 - 개발 확인용 */}
      {import.meta.env.DEV && (
        <>
          <FlyingChatMessage 
            id={9999} 
            message="💬 강제 테스트 메시지 - 내 메시지!" 
            isMyMessage={true} 
            onComplete={() => console.log('테스트 메시지 완료')} 
          />
          <FlyingChatMessage 
            id={9998} 
            message="💭 다른 사람 메시지 테스트!" 
            isMyMessage={false} 
            onComplete={() => console.log('테스트 메시지 완료')} 
          />
        </>
      )}
      
      {/* 개발자 도구 - 🏆 랭킹 테스트 버튼 추가 */}
      <DevTools 
        isVisible={import.meta.env.DEV} 
        onOpenRankingTest={handleRankingTest} // 🏆 랭킹 테스트 콜백
      />

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
        onExit={handleRankingModalExit}
        elapsedTime={elapsedTime}
        currentUser={currentUser}
        totalTimeWasted={totalTimeWasted}
        visits={visits}
        adClicks={adClicks}
      />
      
      {/* 🏆 랭킹 테스트 모달 추가 - 동적 시간 */}
      <RankingRegistrationModal
        isOpen={isRankingTestMode}
        onClose={handleRankingTestClose}
        onConfirm={handleRankingTestConfirm}
        onExit={handleRankingTestClose}
        elapsedTime={testElapsedTime} // 🏆 동적 테스트 시간
        currentUser={currentUser}
        totalTimeWasted={testElapsedTime * 3} // 테스트용 (3배)
        visits={Math.floor(testElapsedTime / 60) + 10} // 테스트용 (분 + 10)
        adClicks={Math.floor(testElapsedTime / 180) + 2} // 테스트용 (3분마다 1개 + 2)
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