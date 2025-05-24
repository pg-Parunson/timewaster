import React, { useState, useEffect, useRef } from 'react';
import { Clock, Share2, MessageCircle, Copy, ExternalLink, Zap, Heart, Skull } from 'lucide-react';

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

// 카테고리별 색상 매핑
const CATEGORY_COLORS = {
  "건강": "text-green-600 bg-green-50 border-green-200",
  "운동": "text-blue-600 bg-blue-50 border-blue-200",
  "환경": "text-emerald-600 bg-emerald-50 border-emerald-200",
  "계획": "text-purple-600 bg-purple-50 border-purple-200",
  "학습": "text-indigo-600 bg-indigo-50 border-indigo-200",
  "멘탈": "text-pink-600 bg-pink-50 border-pink-200",
  "집안일": "text-orange-600 bg-orange-50 border-orange-200",
  "인간관계": "text-yellow-600 bg-yellow-50 border-yellow-200",
  "효도": "text-red-600 bg-red-50 border-red-200",
  "생산성": "text-gray-700 bg-gray-50 border-gray-200",
  "자기계발": "text-cyan-600 bg-cyan-50 border-cyan-200",
  "취업": "text-amber-600 bg-amber-50 border-amber-200",
  "재정": "text-lime-600 bg-lime-50 border-lime-200",
  "취미": "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200",
  "철학": "text-slate-600 bg-slate-50 border-slate-200",
  "가족": "text-rose-600 bg-rose-50 border-rose-200",
  "목표": "text-violet-600 bg-violet-50 border-violet-200",
  "요리": "text-teal-600 bg-teal-50 border-teal-200",
  "기본": "text-gray-600 bg-gray-50 border-gray-200"
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
  "내가 지금 뭐 하는 거지?",
  "더 많은 시간을 낭비하기",
  "또 다른 현실 직시하기",
  "계속 여기 있기",
  "시간 낭비 레벨업",
  "더 뼈아픈 진실 듣기",
  "현실 도피 계속하기",
  "생산성 완전 포기하기"
];

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
  
  const timerRef = useRef(null);
  const messageRef = useRef(null);
  const typingRef = useRef(null);

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
        typingRef.current = setTimeout(type, 50 + Math.random() * 30);
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
      `🕰️ ${formatTime(elapsedTime)} 동안 "${currentActivity.activity}" 같은 ${currentActivity.category} 활동을 했다면... ${randomRoast}`,
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
    const responses = [
      "광고를 클릭해주셔서 감사합니다! (실제 광고는 아니에요)",
      "우와! 정말 눌러주셨네요! 고마워요! 🎉",
      "광고 클릭 완료! 이제 더 많은 시간을 낭비해보세요!",
      "훌륭한 선택입니다! 시간낭비의 달인이시네요!",
      "광고 클릭으로 이 사이트를 후원해주셨습니다!"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    alert(randomResponse);
    
    const newAdClicks = adClicks + 1;
    setAdClicks(newAdClicks);
    localStorage.setItem('timewaster_ad_clicks', newAdClicks.toString());
  };

  // 공유 기능들
  const shareToTwitter = () => {
    const text = `나는 이 시간낭비 사이트에서 ${formatTime(elapsedTime)}를 날렸습니다. 너도 똑같이 당해보시겠어요?`;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`, '_blank');
  };

  const shareToKakao = () => {
    const text = `나는 이 시간낭비 사이트에서 ${formatTime(elapsedTime)}를 날렸습니다. 너도 똑같이 당해보시겠어요?\n\n${window.location.href}`;
    
    if (navigator.share) {
      navigator.share({
        title: '시간 낭비 계산기',
        text: text,
        url: window.location.href
      });
    } else {
      copyToClipboard(text);
      alert('카카오톡 공유 메시지가 클립보드에 복사되었습니다!');
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
    alert('공유 메시지가 클립보드에 복사되었습니다!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-600 flex items-center justify-center p-4">
      {/* 배경 애니메이션 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-slow"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-slow"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-slow"></div>
      </div>

      {/* PC 친화적 메인 컨테이너 */}
      <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 w-full max-w-6xl text-center overflow-hidden">
        {/* 향상된 상단 통계 - PC에 적합한 디자인 */}
        <div className="absolute top-6 right-6 bg-white/90 px-6 py-4 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex flex-col items-end text-sm text-gray-600 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-green-600">📊</span>
              <span>방문: <strong className="text-green-700">{visits}회</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600">📱</span>
              <span>광고: <strong className="text-blue-700">{adClicks}회</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-600">⏱️</span>
              <span>총 낭비: <strong className="text-red-700">{Math.floor(totalTimeWasted / 60)}분</strong></span>
            </div>
          </div>
        </div>

        {/* 극한 모드 표시 */}
        {extremeMode && (
          <div className="absolute top-6 left-6 text-sm text-red-600 bg-red-100 px-3 py-2 rounded-full animate-pulse border border-red-300">
            <Skull className="inline w-4 h-4 mr-1"/>
            🔥 극한모드 활성화 🔥
          </div>
        )}

        {/* 상단 테두리 애니메이션 */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 animate-pulse rounded-t-3xl"></div>

        {/* PC 최적화된 타이머 섹션 */}
        <div className={`mb-16 ${extremeMode ? 'animate-wiggle' : ''}`}>
          <div className="flex items-center justify-center mb-8">
            <Clock className="text-red-500 animate-spin-slow mr-6" size={80} />
            <div 
              ref={timerRef}
              className={`text-9xl md:text-[10rem] font-bold font-mono timer-glow ${
                extremeMode ? 'text-red-600 animate-pulse' : 'text-red-500'
              } ${elapsedTime > 300 ? 'animate-bounce' : ''}`}
            >
              {formatTime(elapsedTime)}
            </div>
          </div>
          
          {/* PC 최적화된 활동 제안 - 더 큰 화면 활용 */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-12 py-6 rounded-3xl border-2 border-blue-200 shadow-xl">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-4xl">{getTimeBasedActivity(elapsedTime).icon}</span>
              <span className="text-2xl font-semibold text-gray-700">지금까지 이런 것들을 할 수 있었어요:</span>
            </div>
            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-blue-700 mb-2">
                "{getTimeBasedActivity(elapsedTime).activity}"
              </div>
              <div className={`inline-block px-4 py-2 rounded-full text-base font-medium border-2 shadow-sm ${
                CATEGORY_COLORS[getTimeBasedActivity(elapsedTime).category] || "text-gray-600 bg-gray-50 border-gray-200"
              }`}>
                {getTimeBasedActivity(elapsedTime).category} 활동
              </div>
            </div>
          </div>
        </div>

        {/* 개선된 메시지 영역 - 가시성 대폭 강화 */}
        <div 
          ref={messageRef}
          className={`bg-gradient-to-r from-yellow-50 via-red-50 to-orange-50 border-4 border-red-500 p-10 mb-8 rounded-3xl min-h-[220px] flex items-center justify-center shadow-2xl message-box-hover cursor-pointer ${
            messageShake ? 'shake animate-wiggle-strong' : ''
          } ${extremeMode ? 'from-red-100 to-red-200 border-red-700 animate-pulse-slow neon-text-extreme' : 'animate-glow-soft shimmer-bg'}`}
          onClick={refreshMessage}
        >
          <div className="text-center relative">
            {/* 메시지 백그라운드 강조 */}
            <div className="absolute inset-0 bg-white/80 rounded-2xl transform rotate-1 shadow-lg"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-100/50 to-orange-100/50 rounded-2xl transform -rotate-1 shadow-lg"></div>
            
            {/* 메인 텍스트 - 가시성 대폭 강화 */}
            <p className={`relative z-10 text-4xl md:text-5xl leading-relaxed font-bold text-center ${
              extremeMode ? 'text-red-900 drop-shadow-lg' : 'text-gray-900 drop-shadow-md'
            } ${isTyping ? 'glow-text-strong animate-pulse' : 'glow-text-strong'}`}
              style={{
                textShadow: extremeMode 
                  ? '3px 3px 6px rgba(220, 38, 38, 0.3), 0 0 20px rgba(220, 38, 38, 0.2)'
                  : '2px 2px 4px rgba(0, 0, 0, 0.1), 0 0 15px rgba(59, 130, 246, 0.1)'
              }}
            >
              {displayMessage}
              {isTyping && <span className="animate-ping text-red-600 ml-1 text-6xl">|</span>}
            </p>
            
            {/* 추가 강조 효과들 */}
            {!isTyping && (
              <div className="absolute -top-4 -right-4 animate-bounce-slow">
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg transform rotate-12">
                  📢 주목!
                </div>
              </div>
            )}
            
            {extremeMode && (
              <div className="absolute -bottom-4 -left-4 animate-wiggle">
                <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg transform -rotate-12">
                  🚨 긴급!
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PC 최적화된 메인 버튼 */}
        <button
          onClick={refreshMessage}
          className={`w-full max-w-4xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-8 px-12 rounded-full mb-12 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl text-3xl ${
            extremeMode ? 'animate-glow' : ''
          }`}
          disabled={isTyping}
        >
          {isTyping ? '메시지 생성 중...' : buttonText}
        </button>

        {/* 광고 섹션 */}
        {showAd && (
          <div className={`bg-yellow-50 border-3 border-dashed border-yellow-400 rounded-2xl p-8 mb-8 animate-pulse-slow ${
            extremeMode ? 'bg-red-50 border-red-400' : ''
          }`}>
            <div className="flex items-center justify-center mb-4">
              <Zap className="text-yellow-500 mr-3 animate-bounce" size={24} />
              <span className={`font-bold text-xl ${extremeMode ? 'text-red-700' : 'text-yellow-700'}`}>
                {adMessage}
              </span>
              <Zap className="text-yellow-500 ml-3 animate-bounce" size={24} />
            </div>
            <button
              onClick={handleAdClick}
              className={`w-full max-w-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-full transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-xl ${
                extremeMode ? 'animate-bounce' : ''
              }`}
            >
              👉 광고 누르기 👈
            </button>
          </div>
        )}

        {/* PC 최적화된 공유 섹션 */}
        <div className="border-t-2 border-gray-200 pt-10">
          <div className="flex items-center justify-center mb-8">
            <Heart className="text-pink-500 mr-4 animate-pulse" size={32} />
            <span className="text-gray-600 font-medium text-2xl">"친구도 시간 낭비시켜보자"</span>
            <Share2 className="text-blue-500 ml-4 animate-bounce" size={32} />
          </div>
          
          <div className="flex gap-6 justify-center flex-wrap">
            <button
              onClick={shareToTwitter}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl flex items-center gap-3 transform hover:scale-105 transition-all duration-200 text-xl font-medium shadow-lg hover:shadow-xl"
            >
              <ExternalLink size={24} />
              트위터에 공유
            </button>
            
            <button
              onClick={shareToKakao}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-8 py-4 rounded-2xl flex items-center gap-3 transform hover:scale-105 transition-all duration-200 text-xl font-medium shadow-lg hover:shadow-xl"
            >
              <MessageCircle size={24} />
              카카오톡 공유
            </button>
            
            <button
              onClick={() => copyToClipboard()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-2xl flex items-center gap-3 transform hover:scale-105 transition-all duration-200 text-xl font-medium shadow-lg hover:shadow-xl"
            >
              <Copy size={24} />
              링크 복사
            </button>
          </div>
        </div>

        {/* 극한 모드 추가 메시지 */}
        {extremeMode && (
          <div className="mt-8 p-6 bg-red-100 border border-red-300 rounded-2xl animate-pulse">
            <p className="text-red-800 font-bold text-lg">
              🚨 경고: 5분을 넘겼습니다! 이제 정말로 심각한 시간낭비입니다! 🚨
            </p>
          </div>
        )}

        {/* 숨겨진 이스터에그 */}
        {elapsedTime > 600 && (
          <div className="mt-6 text-gray-500 animate-fade-in">
            <p className="text-lg">🏆 축하합니다. 당신은 이제 공식적으로 시간낭비의 달인입니다. 🏆</p>
          </div>
        )}
      </div>

      {/* 플로팅 액션 버튼 (긴급 탈출용) */}
      {elapsedTime > 180 && (
        <button
          onClick={() => {
            if (confirm('정말로 이 환상적인 시간낭비를 끝내시겠습니까?')) {
              window.close();
            }
          }}
          className="fixed bottom-8 right-8 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-xl animate-bounce z-50 text-xl"
          title="긴급 탈출"
        >
          🚨
        </button>
      )}
    </div>
  );
}

export default App;