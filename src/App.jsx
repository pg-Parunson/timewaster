import React, { useState, useEffect, useRef } from 'react';
import { Clock, Share2, MessageCircle, Copy, ExternalLink, Zap, Heart, Skull, Sparkles, Target, Brain, Users, DoorOpen, AlertTriangle } from 'lucide-react';

// 축하 이펙트 데이터베이스 - 간격 조정 및 화려함 점진적 증가
const CELEBRATION_EFFECTS = [
  {
    minSeconds: 120, // 2분 (첫 번째를 늦춤)
    message: "2분 달성! 👏 시작이 좋네요! 👏",
    effects: ["👏", "✨"],
    color: "from-blue-400 to-cyan-400",
    animation: "bounce"
  },
  {
    minSeconds: 300, // 5분 (3분 간격)
    message: "5분 돌파! 🎉 집중력 대단해요! 🎉",
    effects: ["🎉", "🎊", "✨", "🌟"],
    color: "from-green-400 to-emerald-400",
    animation: "spin"
  },
  {
    minSeconds: 600, // 10분 (5분 간격) - 더 화려하게
    message: "10분 완주! 🏆 진정한 챔피언! 🏆",
    effects: ["🏆", "👑", "⭐", "✨", "🎆"],
    color: "from-yellow-400 to-orange-400",
    animation: "pulse"
  },
  {
    minSeconds: 900, // 15분 (5분 간격) - 레벨업!
    message: "15분 신기록! 🚀 우주급 집중력! 🚀",
    effects: ["🚀", "🌟", "💫", "⚡", "🌙"],
    color: "from-purple-400 to-pink-400",
    animation: "float"
  },
  {
    minSeconds: 1500, // 25분 (10분 간격) - 포모도로 완성!
    message: "25분 마스터! 💎 포모도로 레전드! 💎",
    effects: ["💎", "👑", "🌟", "✨", "🎆", "🔥"],
    color: "from-indigo-400 to-purple-400",
    animation: "rainbow"
  },
  {
    minSeconds: 2400, // 40분 (15분 간격) - 진정한 달인
    message: "40분 달인! 🔥 불타는 의지력! 🔥",
    effects: ["🔥", "⚡", "💥", "🌟", "👑", "💪"],
    color: "from-red-400 to-orange-400",
    animation: "shake"
  },
  {
    minSeconds: 3600, // 1시간 (20분 간격) - 역사적 순간!
    message: "1시간 영웅! 💪 역사적인 순간! 💪",
    effects: ["💪", "👑", "🔥", "⚡", "💥", "🏆", "🌟"],
    color: "from-pink-400 to-red-400",
    animation: "mega"
  },
  {
    minSeconds: 5400, // 1시간 30분 (30분 간격) - 전설 등극!
    message: "90분 전설! 🦄 유니콘급 끈기! 🦄",
    effects: ["🦄", "🌈", "✨", "💖", "🌟", "👑", "🔥"],
    color: "from-cyan-400 to-pink-400",
    animation: "unicorn"
  },
  {
    minSeconds: 7200, // 2시간 (30분 간격) - 신화 창조!
    message: "2시간 신화! 🐉 드래곤 엠페러! 🐉",
    effects: ["🐉", "👑", "🔥", "⚡", "💎", "🌟", "💥", "🏆"],
    color: "from-purple-600 to-red-600",
    animation: "dragon"
  }
];

// 시간별 실제 활동 매칭 데이터베이스 - 강화버전
const TIME_BASED_ACTIVITIES = [
  { minSeconds: 0, activity: "심호흡 3번", category: "건강", icon: "🫁" },
  { minSeconds: 5, activity: "물 한 컵 마시기", category: "건강", icon: "💧" },
  { minSeconds: 10, activity: "목 스트레칭 한 동작", category: "운동", icon: "🤸" },
  { minSeconds: 15, activity: "창문 열고 환기", category: "환경", icon: "🌬️" },
  { minSeconds: 20, activity: "내일 계획 메모 한 줄", category: "계획", icon: "📝" },
  { minSeconds: 30, activity: "팔굽혀펴기 10개", category: "운동", icon: "💪" },
  { minSeconds: 45, activity: "책 한 페이지 읽기", category: "학습", icon: "📖" },
  { minSeconds: 60, activity: "간단한 명상 (1분)", category: "멘탈", icon: "🧘" },
  { minSeconds: 90, activity: "냉장고 자리 정리", category: "집안일", icon: "🚀" },
  { minSeconds: 120, activity: "친구에게 안부 문자", category: "인간관계", icon: "💬" },
  { minSeconds: 150, activity: "열 가지 영어 단어 외우기", category: "학습", icon: "🌎" },
  { minSeconds: 180, activity: "라면 끓여서 어머니께 대접", category: "효도", icon: "🍜" },
  { minSeconds: 240, activity: "방 정리 한 모서리", category: "집안일", icon: "🧹" },
  { minSeconds: 300, activity: "새로운 단어 20개 외우기", category: "학습", icon: "📚" },
  { minSeconds: 360, activity: "기초 요가 따라하기", category: "운동", icon: "🧘‍♀️" },
  { minSeconds: 420, activity: "유튜브 하나 보고 뭔가 배우기", category: "학습", icon: "📺" },
  { minSeconds: 480, activity: "간단한 요리 작품 만들기", category: "요리", icon: "👨‍🍳" },
  { minSeconds: 600, activity: "진짜 생산적인 일 시작하기", category: "생산성", icon: "⚡" },
  { minSeconds: 720, activity: "스킬 한 가지 연습하기", category: "자기계발", icon: "🎯" },
  { minSeconds: 900, activity: "취업 지원서 한 개 쓰기", category: "취업", icon: "💼" },
  { minSeconds: 1080, activity: "가계부 정리하기", category: "재정", icon: "💰" },
  { minSeconds: 1200, activity: "새로운 취미 찾아보기", category: "취미", icon: "🎨" },
  { minSeconds: 1500, activity: "건강검진 예약 잡기", category: "건강", icon: "🏥" },
  { minSeconds: 1800, activity: "인생에 대해 진지하게 고민하기", category: "철학", icon: "🤔" },
  { minSeconds: 2100, activity: "부모님께 안부 전화 드리기", category: "가족", icon: "📞" },
  { minSeconds: 2400, activity: "새로운 도전 목표 세우기", category: "목표", icon: "🎯" }
];

// 세련된 카테고리별 색상 매핑
const CATEGORY_COLORS = {
  "건강": "from-emerald-500 to-teal-500 text-white",
  "운동": "from-blue-500 to-cyan-500 text-white",
  "환경": "from-green-500 to-emerald-500 text-white",
  "계획": "from-purple-500 to-violet-500 text-white",
  "학습": "from-indigo-500 to-blue-500 text-white",
  "멘탈": "from-pink-500 to-rose-500 text-white",
  "집안일": "from-orange-500 to-amber-500 text-white",
  "인간관계": "from-yellow-500 to-orange-500 text-white",
  "효도": "from-red-500 to-pink-500 text-white",
  "생산성": "from-gray-600 to-slate-600 text-white",
  "자기계발": "from-cyan-500 to-blue-500 text-white",
  "취업": "from-amber-500 to-orange-500 text-white",
  "재정": "from-lime-500 to-green-500 text-white",
  "취미": "from-fuchsia-500 to-pink-500 text-white",
  "철학": "from-slate-500 to-gray-500 text-white",
  "가족": "from-rose-500 to-red-500 text-white",
  "목표": "from-violet-500 to-purple-500 text-white",
  "요리": "from-teal-500 to-cyan-500 text-white",
  "기본": "from-gray-500 to-slate-500 text-white"
};

// 비난 멘트 데이터베이스 - 강화된 버전
const ROAST_MESSAGES = [
  "정말 대단한 시간 활용 능력이네요.",
  "지금까지 얼마나 많은 기회를 놓쳤을까요?",
  "이 집중력을 다른 곳에 쏟으면 얼마나 좋을까요?",
  "시간은 흘러가는데 여전히 여기 계시네요.",
  "친구들은 지금 뭘 하고 있을까요?",
  "이 정도 시간이면... 정말 많은 걸 할 수 있었는데요.",
  "혹시 시간이 무한하다고 생각하시나요?",
  "당신의 미래 자신이 지금을 보면 뭐라고 할까요?",
  "이만큼 끈기가 있다면 뭐든 할 수 있을 텐데...",
  "시간 낭비의 새로운 경지를 보여주고 계시네요.",
  "이 시간을 투자했다면 벌써 전문가가 되었을 텐데요.",
  "당신의 생산성은 어디로 갔을까요?",
  "지금 이 순간도 소중한 시간이 사라지고 있어요.",
  "미래의 당신이 현재의 당신에게 고마워할까요?",
  "시간은 금이라는 말을 들어본 적 있나요?",
  "이 정도 인내력이면 마라톤도 완주하겠어요.",
  "당신의 시간 관리 스킬은 정말... 독특하네요.",
  "이런 것도 하나의 재능일까요?"
];

// 광고 유도 메시지
const AD_MESSAGES = [
  "1분 넘었어요. 이 정도면 광고 한 번 눌러줘도 되지 않나요?",
  "저희는 당신보다 집요합니다. 광고 한 번만요.",
  "이 사이트에서의 모든 낭비는 광고 수익으로 보상받습니다.",
  "광고 안 누른 지 너무 오래됐어요. 한 번만 제발?",
  "이제 진짜 광고 눌러주세요. 간절해요.",
  "광고 수익으로 더 좋은 시간낭비 사이트를 만들 수 있어요!",
  "마지막 경고입니다. 광고를 누르세요.",
  "광고를 누르면 당신의 시간낭비가 의미있어집니다.",
  "제발요... 광고 한 번만... 🥺",
  "이제 정말 광고 말고는 살 길이 없어요!"
];

// 버튼 텍스트 변형
const BUTTON_TEXTS = [
  "지금 내가 뭐 하는 거지?",
  "더 깊은 현실 직시하기",
  "시간 낭비 레벨업",
  "더 뼈아픈 진실 듣기",
  "생산성 완전 포기하기",
  "현실 도피 계속하기",
  "또 다른 핑계 찾기",
  "시간의 소중함 무시하기"
];

// 축하 애니메이션 컴포넌트
const CelebrationEffect = ({ isActive, celebration, onComplete }) => {
  const [particles, setParticles] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  
  useEffect(() => {
    if (isActive && celebration) {
      // 파티클 생성
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        emoji: celebration.effects[Math.floor(Math.random() * celebration.effects.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 1000,
        duration: 2000 + Math.random() * 1000,
        size: 1 + Math.random() * 2
      }));
      
      setParticles(newParticles);
      setShowMessage(true);
      
      // 3초 후 정리
      const timer = setTimeout(() => {
        setShowMessage(false);
        setParticles([]);
        onComplete();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, celebration, onComplete]);
  
  if (!isActive || !celebration) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* 메인 축하 메시지 */}
      {showMessage && (
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-${celebration.animation}`}>
          <div className={`bg-gradient-to-r ${celebration.color} text-white px-6 lg:px-8 py-3 lg:py-4 rounded-3xl shadow-2xl backdrop-blur-xl border-2 border-white/30`}>
            <div className="text-xl lg:text-3xl font-bold text-center animate-pulse">
              {celebration.message}
            </div>
          </div>
        </div>
      )}
      
      {/* 파티클 효과 */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute text-2xl lg:text-4xl animate-celebration-float`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}ms`,
            animationDuration: `${particle.duration}ms`,
            fontSize: `${particle.size}rem`,
            transform: `scale(${particle.size})`
          }}
        >
          {particle.emoji}
        </div>
      ))}
      
      {/* 화면 전체 글로우 효과 */}
      {showMessage && (
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${celebration.color} opacity-10 animate-pulse`}
          style={{ mixBlendMode: 'overlay' }}
        />
      )}
    </div>
  );
};

// 세련된 모달 컴포넌트
const ModernModal = ({ isOpen, onClose, onConfirm, title, message, type = 'info', showCancel = false }) => {
  // ESC 키 이벤트 처리
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc, false);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc, false);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const iconMap = {
    success: '🎉',
    warning: '⚠️',
    info: 'ℹ️',
    exit: '🚪'
  };

  const colorMap = {
    success: 'from-green-500 to-emerald-500',
    warning: 'from-yellow-500 to-orange-500',
    info: 'from-blue-500 to-cyan-500',
    exit: 'from-red-500 to-pink-500'
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose} // 바깥 클릭시 닫기
    >
      <div 
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭시 이벤트 전파 중단
      >
        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">{iconMap[type]}</div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        </div>
        
        {/* 메시지 */}
        <div className="text-center mb-6">
          <p className="text-white/90 text-base leading-relaxed">{message}</p>
        </div>
        
        {/* 버튼 */}
        <div className={`flex justify-center gap-3 ${showCancel ? 'flex-row' : ''}`}>
          {showCancel && (
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              취소
            </button>
          )}
          <button
            onClick={onConfirm || onClose}
            className={`px-6 py-3 bg-gradient-to-r ${colorMap[type]} text-white font-semibold rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg`}
          >
            {showCancel ? '확인' : '확인'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 축하 시스템 훅
const useCelebrationSystem = (elapsedTime) => {
  const celebrationHistoryRef = useRef(new Set());
  const [currentCelebration, setCurrentCelebration] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  
  useEffect(() => {
    // 새로운 마일스톤 체크
    const availableCelebrations = CELEBRATION_EFFECTS.filter(
      (effect) => elapsedTime >= effect.minSeconds && !celebrationHistoryRef.current.has(effect.minSeconds)
    );
    
    if (availableCelebrations.length > 0) {
      const celebration = availableCelebrations[availableCelebrations.length - 1];
      
      // 먼저 히스토리에 추가 (중복 방지)
      celebrationHistoryRef.current.add(celebration.minSeconds);
      
      // 축하 이벤트 트리거
      setCurrentCelebration(celebration);
      setShowCelebration(true);
      
      // Google Analytics 이벤트
      if (typeof gtag !== 'undefined') {
        gtag('event', 'milestone_achieved', {
          event_category: 'engagement',
          milestone_seconds: celebration.minSeconds,
          milestone_message: celebration.message
        });
      }
    }
  }, [elapsedTime]);
  
  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    setCurrentCelebration(null);
  };
  
  return {
    showCelebration,
    currentCelebration,
    handleCelebrationComplete
  };
};

function App() {
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
  const messageRef = useRef(null);
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
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
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
          filter: hue-rotate(0deg) brightness(1);
        }
        50% { 
          transform: translateX(-50%) translateY(-50%) rotate(5deg);
          filter: hue-rotate(180deg) brightness(1.2);
        }
        100% { 
          transform: translateX(-50%) translateY(-50%) rotate(0deg);
          filter: hue-rotate(360deg) brightness(1);
        }
      }
      
      @keyframes dragon {
        0% { 
          transform: translateX(-50%) translateY(-50%) scale(1);
          filter: drop-shadow(0 0 20px rgba(255, 0, 0, 0.8));
        }
        50% { 
          transform: translateX(-50%) translateY(-50%) scale(1.2);
          filter: drop-shadow(0 0 40px rgba(255, 0, 0, 1));
        }
        100% { 
          transform: translateX(-50%) translateY(-50%) scale(1);
          filter: drop-shadow(0 0 20px rgba(255, 0, 0, 0.8));
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

  // 실제 시간에 따른 활동 가져오기 - 강화된 버전
  const getTimeBasedActivity = (seconds) => {
    const activities = TIME_BASED_ACTIVITIES.filter(act => seconds >= act.minSeconds);
    const currentActivity = activities.length > 0 ? activities[activities.length - 1] : {
      activity: "잠깐의 휴식", 
      category: "기본", 
      icon: "⏰"
    };
    return currentActivity;
  };

  // 로컬스토리지에서 데이터 로드
  useEffect(() => {
    const storedVisits = parseInt(localStorage.getItem('timewaster_visits') || '0') + 1;
    const storedTotalTime = parseInt(localStorage.getItem('timewaster_total_time') || '0');
    const storedAdClicks = parseInt(localStorage.getItem('timewaster_ad_clicks') || '0');
    
    setVisits(storedVisits);
    setTotalTimeWasted(storedTotalTime);
    setAdClicks(storedAdClicks);
    
    localStorage.setItem('timewaster_visits', storedVisits.toString());
    
    // Google Analytics 세션 시작 이벤트
    if (typeof gtag !== 'undefined') {
      gtag('event', 'session_start', {
        event_category: 'engagement',
        visits_count: storedVisits,
        total_time_wasted: storedTotalTime,
        returning_visitor: storedVisits > 1
      });
    }
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
          // Google Analytics 극한 모드 진입 이벤트
          if (typeof gtag !== 'undefined') {
            gtag('event', 'extreme_mode_entered', {
              event_category: 'engagement',
              event_label: 'time_milestone',
              value: 300
            });
          }
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
        const newTotalTime = totalTimeWasted + elapsedTime;
        localStorage.setItem('timewaster_total_time', newTotalTime.toString());
        
        const message = '정말로 나가시겠어요? 이제 막 재미있어지려고 했는데...';
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [elapsedTime, totalTimeWasted]);

  // 시간 포맷팅
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}분 ${secs.toString().padStart(2, '0')}초`;
  };

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

  // 광고 클릭
  const handleAdClick = () => {
    // Google Analytics 이벤트 추적
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ad_click', {
        event_category: 'engagement',
        event_label: 'ad_button',
        value: adClicks + 1,
        time_wasted_seconds: elapsedTime
      });
    }
    
    const responses = [
      "우와! 정말 눌러주셨네요! 고마워요! 🎉",
      "훌륭한 선택입니다! 시간낭비의 달인이시네요!",
      "광고 클릭으로 이 사이트를 후원해주셨습니다!",
      "감사합니다! 더 나은 시간낭비 경험을 제공하겠어요!",
      "완벽합니다! 이제 더 많은 시간을 낭비해보세요!"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    showModernModal("광고 클릭 완료!", randomResponse, 'success');
    
    const newAdClicks = adClicks + 1;
    setAdClicks(newAdClicks);
    localStorage.setItem('timewaster_ad_clicks', newAdClicks.toString());
  };

  // 공유 기능들
  const shareToTwitter = () => {
    // Google Analytics 이벤트 추적
    if (typeof gtag !== 'undefined') {
      gtag('event', 'share', {
        method: 'twitter',
        content_type: 'time_wasted',
        time_wasted_seconds: elapsedTime
      });
    }
    
    const text = `나는 이 시간낭비 사이트에서 ${formatTime(elapsedTime)}를 날렸습니다. 너도 똑같이 당해보시겠어요?`;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`, '_blank');
  };

  const shareToKakao = () => {
    // Google Analytics 이벤트 추적
    if (typeof gtag !== 'undefined') {
      gtag('event', 'share', {
        method: 'kakao',
        content_type: 'time_wasted',
        time_wasted_seconds: elapsedTime
      });
    }
    
    // 카카오 SDK가 로드되었는지 확인
    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
      try {
        Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: '🕒 시간낭비 계산기',
            description: `나는 이 사이트에서 ${formatTime(elapsedTime)}를 날렸습니다! 너도 똑같이 당해보시겠어요? 😂`,
            imageUrl: 'https://pg-parunson.github.io/timewaster/timer-icon.svg',
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
          buttons: [
            {
              title: '시간낭비 시작하기',
              link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
              },
            },
          ],
        });
        
        // 성공 메시지
        showModernModal("카카오톡 공유 완료!", "카카오톡으로 친구들에게 시간낭비를 공유했습니다! 🎉", 'success');
        
      } catch (error) {
        console.error('카카오톡 공유 오류:', error);
        // 오류 시 기본 공유로 폴백
        fallbackKakaoShare();
      }
    } else {
      // SDK가 로드되지 않았을 때 폴백
      fallbackKakaoShare();
    }
  };
  
  // 폴백 공유 방법
  const fallbackKakaoShare = () => {
    const text = `🕒 시간낭비 계산기\n\n나는 이 사이트에서 ${formatTime(elapsedTime)}를 날렸습니다! 너도 똑같이 당해보시겠어요? 😂\n\n${window.location.href}`;
    
    if (navigator.share) {
      navigator.share({
        title: '🕒 시간낭비 계산기',
        text: text,
        url: window.location.href
      });
    } else {
      copyToClipboard(text);
      showModernModal("공유 완료!", "공유 메시지가 클립보드에 복사되었습니다!", 'success');
    }
  };

  const copyToClipboard = (text) => {
    const shareText = text || `나는 이 시간낭비 사이트에서 ${formatTime(elapsedTime)}를 날렸습니다. 너도 똑같이 당해보시겠어요?\n\n${window.location.href}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    showModernModal("복사 완료!", "공유 메시지가 클립보드에 복사되었습니다!", 'success');
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
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exit_confirmed', {
        event_category: 'engagement',
        time_wasted_seconds: elapsedTime,
        exit_method: 'button'
      });
    }
    
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
      <div className="absolute inset-0">
        {/* 글로우 효과 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full filter blur-3xl animate-pulse delay-2000"></div>
        
        {/* 그리드 패턴 */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* 메인 컨테이너 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 lg:p-8 w-full max-w-7xl">
          {/* 상단 통계 바 */}
          <div className="flex items-center justify-between mb-6 p-4 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full status-indicator"></div>
                <span className="text-white/80 text-sm">실시간 추적</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-white/70">동시 접속 <span className="text-blue-400 font-semibold">{concurrentUsers}</span></span>
              </div>
              {extremeMode && (
                <div className="flex items-center gap-2">
                  <Skull className="w-4 h-4 text-red-500" />
                  <span className="text-red-400 text-sm font-medium">극한 모드</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-white/70">방문 <span className="text-blue-400 font-semibold">{visits}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-white/70">광고 <span className="text-yellow-400 font-semibold">{adClicks}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-400" />
                <span className="text-white/70">총 낭비 <span className="text-red-400 font-semibold">{Math.floor(totalTimeWasted / 60)}분</span></span>
              </div>
            </div>
          </div>

          {/* 사이트 제목 헤더 */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="text-4xl title-icon">🕒</div>
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent site-title">
                시간낭비 계산기
              </h1>
              <div className="text-4xl title-icon delay-150">⏰</div>
            </div>
            <p className="text-white/70 text-base lg:text-lg animate-fade-in">
              당신이 이 사이트에서 낭비한 시간을 실시간으로 계산해드립니다 ✨
            </p>
          </div>

          {/* 메인 콘텐츠 영역 - 2단 레이아웃 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* 왼쪽: 타이머 + 활동 제안 */}
            <div className="lg:col-span-2">
              {/* 타이머 디스플레이 */}
              <div className="text-center mb-6">
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full filter blur-2xl opacity-50 animate-pulse"></div>
                      <div 
                        className={`relative text-5xl md:text-7xl lg:text-8xl font-mono font-bold ${
                          extremeMode 
                            ? 'text-red-400 animate-pulse' 
                            : 'bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent'
                        }`}
                        style={{
                          textShadow: extremeMode 
                            ? '0 0 30px rgba(239, 68, 68, 0.8)' 
                            : '0 0 20px rgba(239, 68, 68, 0.5)'
                        }}
                      >
                        {formatTime(elapsedTime)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 활동 제안 카드 */}
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span className="text-white/80 font-medium text-sm">지금 이 시간에 할 수 있었던 일</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="text-2xl">{getTimeBasedActivity(elapsedTime).icon}</div>
                    <div className="text-xl lg:text-2xl font-bold text-white">
                      {getTimeBasedActivity(elapsedTime).activity}
                    </div>
                  </div>
                  
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${
                    CATEGORY_COLORS[getTimeBasedActivity(elapsedTime).category] || CATEGORY_COLORS["기본"]
                  } shadow-lg`}>
                    <span className="font-medium text-sm">{getTimeBasedActivity(elapsedTime).category}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽: 광고 영역 (항상 표시) */}
            <div className="lg:col-span-1">
              {showAd ? (
                <div className={`bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur border border-yellow-500/30 rounded-2xl p-4 h-full flex flex-col justify-center ${
                  extremeMode ? 'animate-pulse' : ''
                }`}>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-yellow-400 animate-bounce" />
                    <span className="text-yellow-200 font-medium text-center text-sm leading-tight">{adMessage}</span>
                    <Zap className="w-4 h-4 text-yellow-400 animate-bounce" />
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      onClick={handleAdClick}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-6 py-3 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg w-full"
                    >
                      💰 광고 클릭하기 💰
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 h-full flex items-center justify-center">
                  <div className="text-center text-white/50">
                    <Clock className="w-8 h-8 mx-auto mb-2 animate-spin-slow" />
                    <p className="text-sm">1분 후 광고가 나타납니다</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 메시지 영역 - 폰트 크기 조정 */}
          <div 
            ref={messageRef}
            className={`relative mb-6 cursor-pointer group ${messageShake ? 'animate-bounce' : ''}`}
            onClick={refreshMessage}
          >
            {/* 카드 배경 */}
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 lg:p-8 min-h-[120px] flex items-center justify-center relative overflow-hidden">
              {/* 배경 패턴 */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full animate-ping"></div>
                <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full animate-ping delay-1000"></div>
                <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-white rounded-full animate-ping delay-2000"></div>
              </div>
              
              {/* 메인 텍스트 - 폰트 크기 줄임 */}
              <div className="relative z-10 text-center">
                <p className={`text-base lg:text-xl xl:text-2xl leading-relaxed font-medium text-white ${
                  isTyping ? 'animate-pulse' : ''
                }`}>
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

          {/* 메인 액션 버튼 */}
          <div className="flex justify-center mb-6">
            <button
              onClick={refreshMessage}
              disabled={isTyping}
              className={`
                group relative px-6 lg:px-8 py-3 lg:py-4 
                bg-gradient-to-r from-red-500 to-pink-500 
                hover:from-red-600 hover:to-pink-600
                text-white font-bold text-base lg:text-lg
                rounded-2xl shadow-2xl
                transform hover:scale-105 active:scale-95
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${extremeMode ? 'animate-pulse shadow-red-500/50' : ''}
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl filter blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <span className="relative">
                {isTyping ? '메시지 생성 중...' : buttonText}
              </span>
            </button>
          </div>

          {/* 공유 섹션 */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Heart className="w-5 h-5 text-pink-400 animate-pulse" />
              <span className="text-white/80 text-base font-medium">친구들도 시간 낭비시켜보자</span>
              <Share2 className="w-5 h-5 text-blue-400" />
            </div>
            
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={shareToTwitter}
                className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-200 px-4 py-2 rounded-xl flex items-center gap-2 transform hover:scale-105 transition-all duration-200 backdrop-blur text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>X에 공유</span>
              </button>
              
              <button
                onClick={shareToKakao}
                className="bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-200 px-4 py-2 rounded-xl flex items-center gap-2 transform hover:scale-105 transition-all duration-200 backdrop-blur text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>카카오톡</span>
              </button>
              
              <button
                onClick={() => copyToClipboard()}
                className="bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/50 text-gray-200 px-4 py-2 rounded-xl flex items-center gap-2 transform hover:scale-105 transition-all duration-200 backdrop-blur text-sm"
              >
                <Copy className="w-4 h-4" />
                <span>링크 복사</span>
              </button>
            </div>
          </div>

          {/* 극한 모드 추가 경고 */}
          {extremeMode && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-2xl backdrop-blur">
              <div className="flex items-center justify-center gap-2">
                <Skull className="w-5 h-5 text-red-400 animate-bounce" />
                <p className="text-red-200 font-bold text-base">
                  경고: 5분을 넘겼습니다! 이제 정말로 심각한 시간낭비입니다!
                </p>
                <Skull className="w-5 h-5 text-red-400 animate-bounce" />
              </div>
            </div>
          )}

          {/* 이스터에그 - 업그레이드된 버전 */}
          {elapsedTime >= 1800 && (
            <div className="mt-4 text-center animate-fade-in">
              <div className="bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-yellow-500/30 border-2 border-purple-400/50 rounded-3xl px-6 py-4 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                {/* 배경 애니메이션 */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse"></div>
                <div className="absolute top-2 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute top-4 right-6 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-500"></div>
                <div className="absolute bottom-3 right-8 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping delay-1000"></div>
                
                {/* 메인 콘텐츠 */}
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <div className="text-2xl animate-bounce">🏆</div>
                  <p className="text-xl font-bold bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-pulse">
                    축하합니다! 당신은 이제 공식적으로 시간낭비의 달인입니다!
                  </p>
                  <div className="text-2xl animate-bounce delay-200">🏆</div>
                </div>
                
                {/* 다이냅믹 이팩트 */}
                <div className="absolute -top-2 -right-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg">
                    🎆 레전드!
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 플로팅 액션 버튼 (개선된 디자인) */}
      {elapsedTime > 180 && (
        <button
          onClick={handleExit}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white p-4 rounded-full shadow-2xl animate-bounce z-50 backdrop-blur border border-red-400 group floating-button"
          title="현실로 돌아가기"
        >
          <div className="flex items-center gap-2">
            <DoorOpen className="w-6 h-6" />
            <span className="hidden group-hover:block text-sm font-medium whitespace-nowrap bg-black/70 px-2 py-1 rounded absolute bottom-full mb-2 right-0">
              현실로 돌아가기
            </span>
          </div>
        </button>
      )}

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