import React, { useState, useEffect, useRef } from 'react';

// 축하 애니메이션 컴포넌트 - 완전 재설계 버전 (UI 간섭 방지)
const CelebrationEffect = ({ isActive, celebration, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);
  
  useEffect(() => {
    // 기존 타이머 정리
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (isActive && celebration) {
      setIsVisible(true);
      
      // 정확히 3초 후 완전 정리
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          // 약간의 지연을 두고 onComplete 호출
          setTimeout(onComplete, 100);
        }
      }, 3000);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isActive, celebration, onComplete]);
  
  // 비활성화 시 null 반환
  if (!isActive || !celebration || !isVisible) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[60] flex items-center justify-center">
      {/* 단순한 축하 메시지만 표시 (파티클 제거) */}
      <div className="animate-bounce">
        <div className={`
          bg-gradient-to-r ${celebration.color} text-white 
          px-8 py-4 rounded-3xl shadow-2xl 
          backdrop-blur-xl border-2 border-white/20
          transform scale-110
        `}>
          <div className="text-2xl font-bold text-center whitespace-nowrap flex items-center gap-3">
            <span className="text-3xl">{celebration.effects[0]}</span>
            {celebration.message}
            <span className="text-3xl">{celebration.effects[1] || celebration.effects[0]}</span>
          </div>
        </div>
      </div>
      
      {/* 매우 미세한 배경 효과만 */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${celebration.color}`}
        style={{ 
          opacity: 0.02,
          zIndex: -1
        }}
      />
    </div>
  );
};

export default CelebrationEffect;