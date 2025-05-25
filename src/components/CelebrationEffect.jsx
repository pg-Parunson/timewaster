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
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        zIndex: 999, // z-index 더 높게
        pointerEvents: 'none'
      }}
    >
      {/* 강화된 배경 효과 - 반짝거리는 화면 복원 */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${celebration.color} pointer-events-none`}
        style={{ 
          opacity: 0.15, // 더 은은하게
          zIndex: 1,
          animation: 'celebration-flash 3s ease-in-out infinite'
        }}
      />
      
      {/* 중앙 축하 메시지 - 완전 중앙 정렬 고정 */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          pointerEvents: 'none'
        }}
      >
        <div className={`animate-${celebration.animation || 'bounce'}`}>
          <div className={`
            bg-gradient-to-r ${celebration.color} text-white 
            px-4 py-3 rounded-xl shadow-2xl
            backdrop-blur-lg border border-white/30
            transform-gpu
            whitespace-nowrap
            text-center
          `}
          style={{
            maxWidth: '320px',
            fontSize: '0.9rem' // 크기 축소
          }}>
            <div className="font-bold flex items-center justify-center gap-2">
              <span className="text-lg">{celebration.effects[0]}</span>
              <span>{celebration.message}</span>
              <span className="text-lg">{celebration.effects[1] || celebration.effects[0]}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 파티클 효과 복원 - 크기 조정 */}
      {celebration.effects.slice(0, 2).map((effect, index) => (
        <div
          key={index}
          className="absolute animate-celebration-float"
          style={{
            left: `${20 + (index * 25) % 60}%`,
            top: `${30 + (index * 15) % 40}%`,
            animationDelay: `${index * 0.3}s`,
            animationDuration: '3s',
            fontSize: '1.2rem', // 크기 축소
            zIndex: 5,
            pointerEvents: 'none'
          }}
        >
          {effect}
        </div>
      ))}
    </div>
  );
};

export default CelebrationEffect;