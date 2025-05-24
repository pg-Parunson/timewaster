import React, { useState, useEffect, useRef } from 'react';
import { Clock, Share2, MessageCircle, Copy, ExternalLink, Zap, Heart, Skull } from 'lucide-react';

// 비난 멘트 데이터베이스
const ROAST_MESSAGES = [
  "이 시간에 이메일 한 통은 보낼 수 있었어요.",
  "지금까지 냉동피자 1/2개를 해동할 수 있었습니다.",
  "엄마가 널 이렇게 키우지 않았어.",
  "이 사이트 만든 사람보다 오래 있네요.",
  "이 시간에 유튜브 쇼츠 17개는 봤겠어요.",
  "지금까지 라면 하나 정도는 끓일 수 있었어요.",
  "친구들은 지금 뭐 하고 있을까요?",
  "이 정도면 짧은 낮잠도 잘 수 있었는데...",
  "계속 있으실 거예요? 정말로요?",
  "이제 진짜로 뭔가 생산적인 일을 해보는 건 어떨까요?",
  "놀랍게도 아직도 여기 계시네요.",
  "이 집착력을 다른 곳에 쓰시면 좋겠어요.",
  "혹시 이 사이트에 중독된 건 아니죠?",
  "이제 정말 진지하게 나가세요.",
  "당신의 인생이 아까워요.",
  "시간은 돈이라고 했는데... 지금 얼마나 잃고 계신지 아세요?",
  "이 시간에 새로운 취미라도 배워보는 건 어떨까요?",
  "진짜 할 일이 없으신 거예요?",
  "이 정도 시간이면 운동도 할 수 있었어요.",
  "당신의 미래 자신이 지금 상황을 보면 뭐라고 할까요?",
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
  "이제 정말 광고 말고는 살 길이 없어요!",
];

// 버튼 텍스트 변형
const BUTTON_TEXTS = [
  "내가 지금 뭐 하는 거지?",
  "더 많은 시간을 낭비하기",
  "또 다른 비난 듣기",
  "계속 여기 있기",
  "시간 낭비 레벨업",
  "더 심한 말 듣기",
  "현실 도피 계속하기",
  "생산성 포기하기",
];

function App() {
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("당신의 소중한 시간이 흘러가고 있습니다...");
  const [buttonText, setButtonText] = useState(BUTTON_TEXTS[0]);
  const [showAd, setShowAd] = useState(false);
  const [adMessage, setAdMessage] = useState(AD_MESSAGES[0]);
  const [visits, setVisits] = useState(1);
  const [totalTimeWasted, setTotalTimeWasted] = useState(0);
  const [adClicks, setAdClicks] = useState(0);
  const [messageShake, setMessageShake] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [extremeMode, setExtremeMode] = useState(false);
  
  const timerRef = useRef(null);
  const messageRef = useRef(null);

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
        // 총 시간 업데이트
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

  // 메시지 새로고침
  const refreshMessage = () => {
    if (elapsedTime < 10) {
      setCurrentMessage("시간 낭비의 여정이 시작되었습니다.");
      return;
    }

    const randomMessage = ROAST_MESSAGES[Math.floor(Math.random() * ROAST_MESSAGES.length)];
    setCurrentMessage(randomMessage);
    
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
      "광고 클릭으로 이 사이트를 후원해주셨습니다!",
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
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-slow animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-slow animation-delay-4000"></div>
      </div>

      {/* 메인 컨테이너 */}
      <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full text-center overflow-hidden">
        {/* 상단 통계 */}
        <div className="absolute top-4 right-4 text-xs text-gray-500 bg-white/80 px-3 py-1 rounded-full">
          방문: {visits}회 | 광고: {adClicks}회
        </div>

        {/* 극한 모드 표시 */}
        {extremeMode && (
          <div className="absolute top-4 left-4 text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full animate-pulse">
            <Skull className="inline w-3 h-3 mr-1"/>
            극한모드
          </div>
        )}

        {/* 상단 테두리 애니메이션 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 animate-pulse"></div>

        {/* 타이머 */}
        <div className={`mb-8 ${extremeMode ? 'animate-wiggle' : ''}`}>
          <Clock className="mx-auto mb-4 text-red-500 animate-spin-slow" size={48} />
          <div 
            ref={timerRef}
            className={`text-5xl font-bold font-mono timer-glow ${
              extremeMode ? 'text-red-600 animate-pulse' : 'text-red-500'
            } ${elapsedTime > 300 ? 'animate-bounce' : ''}`}
          >
            {formatTime(elapsedTime)}
          </div>
        </div>

        {/* 메시지 영역 */}
        <div 
          ref={messageRef}
          className={`bg-gray-50 border-l-4 border-red-500 p-6 mb-6 rounded-lg min-h-[100px] flex items-center justify-center ${
            messageShake ? 'shake' : ''
          } ${extremeMode ? 'bg-red-50 border-red-600' : ''}`}
        >
          <p className={`text-lg leading-relaxed ${extremeMode ? 'text-red-800 font-semibold' : 'text-gray-700'}`}>
            {currentMessage}
          </p>
        </div>

        {/* 메인 버튼 */}
        <button
          onClick={refreshMessage}
          className={`w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-full mb-6 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl ${
            extremeMode ? 'animate-glow' : ''
          }`}
        >
          {buttonText}
        </button>

        {/* 광고 섹션 */}
        {showAd && (
          <div className={`bg-yellow-50 border-2 border-dashed border-yellow-400 rounded-xl p-6 mb-6 animate-pulse-slow ${
            extremeMode ? 'bg-red-50 border-red-400' : ''
          }`}>
            <div className="flex items-center justify-center mb-3">
              <Zap className="text-yellow-500 mr-2 animate-bounce" size={20} />
              <span className={`font-bold ${extremeMode ? 'text-red-700' : 'text-yellow-700'}`}>
                {adMessage}
              </span>
              <Zap className="text-yellow-500 ml-2 animate-bounce" size={20} />
            </div>
            <button
              onClick={handleAdClick}
              className={`w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-full transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl ${
                extremeMode ? 'animate-bounce' : ''
              }`}
            >
              👉 광고 누르기 👈
            </button>
          </div>
        )}

        {/* 공유 섹션 */}
        <div className="border-t-2 border-gray-200 pt-6">
          <div className="flex items-center justify-center mb-4">
            <Heart className="text-pink-500 mr-2 animate-pulse" size={20} />
            <span className="text-gray-600 font-medium">"친구도 시간 낭비시켜보자"</span>
            <Share2 className="text-blue-500 ml-2 animate-bounce" size={20} />
          </div>
          
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={shareToTwitter}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transform hover:scale-105 transition-all duration-200"
            >
              <ExternalLink size={16} />
              트위터
            </button>
            
            <button
              onClick={shareToKakao}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-4 py-2 rounded-full flex items-center gap-2 transform hover:scale-105 transition-all duration-200"
            >
              <MessageCircle size={16} />
              카카오톡
            </button>
            
            <button
              onClick={() => copyToClipboard()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full flex items-center gap-2 transform hover:scale-105 transition-all duration-200"
            >
              <Copy size={16} />
              링크 복사
            </button>
          </div>
        </div>

        {/* 극한 모드 추가 메시지 */}
        {extremeMode && (
          <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg animate-pulse">
            <p className="text-red-800 font-bold text-sm">
              🚨 경고: 5분을 넘겼습니다! 이제 정말로 심각한 시간낭비입니다! 🚨
            </p>
          </div>
        )}

        {/* 숨겨진 이스터에그 */}
        {elapsedTime > 600 && (
          <div className="mt-4 text-xs text-gray-400 animate-fade-in">
            <p>축하합니다. 당신은 이제 공식적으로 시간낭비의 달인입니다. 🏆</p>
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
          className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg animate-bounce z-50"
          title="긴급 탈출"
        >
          🚨
        </button>
      )}
    </div>
  );
}

export default App;