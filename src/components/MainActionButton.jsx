import React from 'react';

// 메인 액션 버튼 컴포넌트
const MainActionButton = ({ 
  buttonText, 
  isTyping, 
  extremeMode, 
  onClick 
}) => {
  return (
    <div className="flex justify-center mb-6">
      <button
        onClick={onClick}
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
  );
};

export default MainActionButton;
