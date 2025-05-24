import React from 'react';

// 사이트 헤더 컴포넌트
const SiteHeader = () => {
  return (
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
  );
};

export default SiteHeader;
