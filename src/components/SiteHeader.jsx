import React from 'react';

// 사이트 헤더 컴포넌트 - 5:5 레이아웃으로 개편
const SiteHeader = ({ elapsedTime = 0, extremeMode = false }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}분 ${secs.toString().padStart(2, '0')}초`;
  };

  return (
    <div className="mb-8">
      {/* 5:5 그리드 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* 좌측: 타이틀 + 설명 */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
            <div className="text-3xl title-icon">🕒</div>
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-cyan-400 site-title retro-neon pixel-font">
              시간낭비 계산기
            </h1>
            <div className="text-3xl title-icon delay-150">⏰</div>
          </div>
          <p className="text-white/70 text-sm lg:text-base animate-fade-in pixel-font" 
             style={{ textShadow: '1px 1px 0px #000', letterSpacing: '1px' }}>
            당신이 이 사이트에서 낭비한 시간을 실시간으로 계산해드립니다 ✨
          </p>
        </div>
        
        {/* 우측: 타이머 */}
        <div className="flex justify-center lg:justify-end">
          <div className="bg-slate-900/80 border-2 border-cyan-400/50 px-8 py-6 rounded-2xl shadow-xl min-w-[200px]">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="text-center">
                <div className="text-xs text-white/60 uppercase tracking-wider mb-2">낭비한 시간</div>
                <div 
                  className={`text-4xl lg:text-5xl font-mono font-bold ${
                    extremeMode ? 'text-red-400' : 'text-cyan-400'
                  }`}
                  style={{
                    fontFamily: 'monospace, "Courier New", monospace',
                    textShadow: extremeMode 
                      ? '0 0 15px #ef4444, 2px 2px 0px #000'
                      : '0 0 15px #22d3ee, 2px 2px 0px #000',
                    letterSpacing: '3px'
                  }}
                >
                  {formatTime(elapsedTime)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteHeader;
