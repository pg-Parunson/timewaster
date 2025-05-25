import React from 'react';

// 사이트 헤더 컴포넌트 - 시간 표시 통합
const SiteHeader = ({ elapsedTime = 0, extremeMode = false }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}분 ${secs.toString().padStart(2, '0')}초`;
  };

  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-4 mb-2">
        <div className="text-4xl title-icon">🕒</div>
        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-cyan-400 site-title retro-neon pixel-font">
          시간낭비 계산기
        </h1>
        
        {/* 실시간 시간 표시 - 타이틀 옆에 배치 */}
        <div className="flex items-center gap-2 bg-slate-900/80 border-2 border-cyan-400/50 px-4 py-2 rounded-lg">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <div 
            className={`text-lg lg:text-xl font-mono font-bold ${
              extremeMode ? 'text-red-400' : 'text-cyan-400'
            }`}
            style={{
              fontFamily: 'monospace, "Courier New", monospace',
              textShadow: extremeMode 
                ? '0 0 10px #ef4444, 1px 1px 0px #000'
                : '0 0 10px #22d3ee, 1px 1px 0px #000',
              letterSpacing: '1px'
            }}
          >
            {formatTime(elapsedTime)}
          </div>
        </div>
        
        <div className="text-4xl title-icon delay-150">⏰</div>
      </div>
      <p className="text-white/70 text-base lg:text-lg animate-fade-in pixel-font" style={{ textShadow: '1px 1px 0px #000', letterSpacing: '1px' }}>
        당신이 이 사이트에서 낭비한 시간을 실시간으로 계산해드립니다 ✨
      </p>
    </div>
  );
};

export default SiteHeader;
