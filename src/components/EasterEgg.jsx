import React from 'react';

// 이스터에그 컴포넌트 - 업그레이드된 버전
const EasterEgg = ({ elapsedTime }) => {
  if (elapsedTime < 1800) return null; // 30분 미만이면 표시하지 않음

  return (
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
  );
};

export default EasterEgg;
