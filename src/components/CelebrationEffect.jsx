import React, { useState, useEffect, useRef } from 'react';

const CelebrationEffect = ({ isActive, celebration, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);
  
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (isActive && celebration) {
      console.log('🎉 축하 이펙트 시작 (제한된 영역):', celebration.message);
      setIsVisible(true);
      
      timeoutRef.current = setTimeout(() => {
        console.log('🎉 축하 이펙트 종료');
        setIsVisible(false);
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
        }, 200);
      }, 4000); // 4초 지속
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isActive, celebration, onComplete]);
  
  // 축하 이펙트 CSS 스타일을 동적으로 추가
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .celebration-container {
        position: absolute !important;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        pointer-events: none;
        z-index: 10;
      }
      
      .celebration-flash-limited {
        animation: celebration-flash-limited 4s ease-in-out;
      }
      
      .celebration-bounce {
        animation: celebration-bounce 0.8s ease-in-out infinite;
      }
      
      @keyframes celebration-flash-limited {
        0% { opacity: 0; }
        10% { opacity: 0.2; }
        20% { opacity: 0.15; }
        30% { opacity: 0.25; }
        90% { opacity: 0.1; }
        100% { opacity: 0; }
      }
      
      @keyframes celebration-bounce {
        0%, 100% { transform: translate(-50%, -50%) translateY(0px) scale(1); }
        50% { transform: translate(-50%, -50%) translateY(-10px) scale(1.03); }
      }
      
      @keyframes particle-float-limited-0 {
        0% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(0.5); opacity: 0; }
        15% { opacity: 1; scale: 0.8; }
        100% { transform: translateY(-80px) translateX(-20px) rotate(360deg) scale(1); opacity: 0; }
      }
      
      @keyframes particle-float-limited-1 {
        0% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(0.5); opacity: 0; }
        20% { opacity: 1; scale: 0.9; }
        100% { transform: translateY(-100px) translateX(30px) rotate(-270deg) scale(0.6); opacity: 0; }
      }
      
      @keyframes particle-float-limited-2 {
        0% { transform: translateY(0px) translateX(0px) scale(0.3); opacity: 0; }
        25% { opacity: 1; scale: 1; }
        100% { transform: translateY(-70px) translateX(-35px) scale(1.2); opacity: 0; }
      }
      
      @keyframes particle-float-limited-3 {
        0% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(0.7); opacity: 0; }
        30% { opacity: 1; scale: 0.8; }
        100% { transform: translateY(-120px) translateX(40px) rotate(450deg) scale(0.4); opacity: 0; }
      }
      
      @keyframes particle-float-limited-4 {
        0% { transform: translateY(0px) translateX(0px) scale(0.4); opacity: 0; }
        35% { opacity: 1; scale: 1.1; }
        100% { transform: translateY(-90px) translateX(-45px) scale(0.3); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);
  
  if (!isActive || !celebration || !isVisible) {
    return null;
  }
  
  // 색상 매핑
  const getBackgroundColor = () => {
    if (celebration.color.includes('blue')) return 'rgba(59, 130, 246, 0.15)';
    if (celebration.color.includes('green')) return 'rgba(16, 185, 129, 0.15)';
    if (celebration.color.includes('yellow')) return 'rgba(245, 158, 11, 0.15)';
    if (celebration.color.includes('purple')) return 'rgba(147, 51, 234, 0.15)';
    return 'rgba(236, 72, 153, 0.15)';
  };
  
  const getGradientColors = () => {
    if (celebration.color.includes('blue')) return '#3b82f6, #06b6d4';
    if (celebration.color.includes('green')) return '#10b981, #059669';  
    if (celebration.color.includes('yellow')) return '#f59e0b, #f97316';
    if (celebration.color.includes('purple')) return '#9333ea, #ec4899';
    return '#9333ea, #ec4899';
  };
  
  return (
    <div className="celebration-container">
      {/* 제한된 배경 플래시 */}
      <div 
        className="celebration-flash-limited"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: getBackgroundColor(),
          borderRadius: '1rem',
          pointerEvents: 'none'
        }}
      />
      
      {/* 중앙 메시지 */}
      <div 
        className="celebration-bounce"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }}
      >
        <div 
          style={{
            background: `linear-gradient(to right, ${getGradientColors()})`,
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            maxWidth: '280px'
          }}
        >
          {celebration.effects?.[0] || '🎉'} {celebration.message} {celebration.effects?.[1] || celebration.effects?.[0] || '🎉'}
        </div>
      </div>
      
      {/* 제한된 파티클 이펙트 */}
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${10 + (index * 15) % 80}%`,
            top: `${15 + (index * 12) % 70}%`,
            fontSize: '1.8rem',
            zIndex: 5,
            pointerEvents: 'none',
            animation: `particle-float-limited-${index % 5} 4s ease-out forwards`,
            animationDelay: `${index * 0.15}s`
          }}
        >
          {celebration.effects?.[index % celebration.effects.length] || '✨'}
        </div>
      ))}
    </div>
  );
};

export default CelebrationEffect;