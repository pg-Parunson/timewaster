import React, { useState, useEffect, useRef } from 'react';

// 축하 애니메이션 컴포넌트 - 완전 복원 및 강화 버전
// 추가 CSS 애니메이션 정의
const celebrationStyles = `
  @keyframes celebration-flash {
    0% { opacity: 0; }
    20% { opacity: 0.2; }
    50% { opacity: 0.15; }
    80% { opacity: 0.25; }
    100% { opacity: 0; }
  }
`;

// 스타일 주입
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = celebrationStyles;
  if (!document.head.querySelector('[data-celebration-styles]')) {
    styleElement.setAttribute('data-celebration-styles', 'true');
    document.head.appendChild(styleElement);
  }
}
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
        // 200ms 후 onComplete 호출 (DOM 정리 시간 확보)
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
        }, 200);
      }, 3000);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isActive, celebration, onComplete]);
  
  // 비활성화 시 null 반환 (완전 제거)
  if (!isActive || !celebration || !isVisible) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {/* 강화된 배경 효과 - 반짝거리는 화면 */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${celebration.color} pointer-events-none animate-pulse`}
        style={{ 
          opacity: 0.15, // 0.01 → 0.15로 강화
          zIndex: 1,
          animation: 'celebration-flash 3s ease-in-out'
        }}
      />
      
      {/* 중앙 축하 메시지 - 완전히 중앙 정렬 */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 2 }}
      >
        <div className={`animate-${celebration.animation || 'bounce'}`}>
          <div className={`
            bg-gradient-to-r ${celebration.color} text-white 
            px-8 py-6 rounded-3xl shadow-2xl
            backdrop-blur-lg border-2 border-white/30
            transform-gpu
          `}>
            <div className="text-2xl lg:text-3xl font-bold text-center flex items-center gap-3">
              <span className="text-3xl lg:text-4xl">{celebration.effects[0]}</span>
              <span className="whitespace-nowrap">{celebration.message}</span>
              <span className="text-3xl lg:text-4xl">{celebration.effects[1] || celebration.effects[0]}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 파티클 효과 복원 */}
      {celebration.effects.map((effect, index) => (
        <div
          key={index}
          className="absolute animate-celebration-float"
          style={{
            left: `${10 + (index * 15) % 80}%`,
            top: `${20 + (index * 10) % 60}%`,
            animationDelay: `${index * 0.2}s`,
            animationDuration: '3s',
            fontSize: '2rem',
            zIndex: 3
          }}
        >
          {effect}
        </div>
      ))}
    </div>
  );
};

export default CelebrationEffect;