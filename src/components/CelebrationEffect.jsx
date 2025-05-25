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
      console.log('🎉 축하 이펙트 시작:', celebration.message);
      setIsVisible(true);
      
      timeoutRef.current = setTimeout(() => {
        console.log('🎉 축하 이펙트 종료');
        setIsVisible(false);
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
        }, 200);
      }, 4000); // 4초로 연장
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
      .celebration-flash {
        animation: celebration-flash 4s ease-in-out;
      }
      
      .celebration-bounce {
        animation: celebration-bounce 0.8s ease-in-out infinite;
      }
      
      @keyframes celebration-flash {
        0% { opacity: 0; }
        10% { opacity: 0.3; }
        20% { opacity: 0.2; }
        30% { opacity: 0.4; }
        90% { opacity: 0.2; }
        100% { opacity: 0; }
      }
      
      @keyframes celebration-bounce {
        0%, 100% { transform: translate(-50%, -50%) translateY(0px) scale(1); }
        50% { transform: translate(-50%, -50%) translateY(-15px) scale(1.05); }
      }
      
      @keyframes particle-float-0 {
        0% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(0.5); opacity: 0; }
        15% { opacity: 1; scale: 1; }
        100% { transform: translateY(-150px) translateX(-30px) rotate(360deg) scale(1.2); opacity: 0; }
      }
      
      @keyframes particle-float-1 {
        0% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(0.5); opacity: 0; }
        20% { opacity: 1; scale: 1.1; }
        100% { transform: translateY(-180px) translateX(40px) rotate(-270deg) scale(0.8); opacity: 0; }
      }
      
      @keyframes particle-float-2 {
        0% { transform: translateY(0px) translateX(0px) scale(0.3); opacity: 0; }
        25% { opacity: 1; scale: 1.3; }
        100% { transform: translateY(-120px) translateX(-50px) scale(1.5); opacity: 0; }
      }
      
      @keyframes particle-float-3 {
        0% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(0.7); opacity: 0; }
        30% { opacity: 1; scale: 1; }
        100% { transform: translateY(-200px) translateX(60px) rotate(450deg) scale(0.5); opacity: 0; }
      }
      
      @keyframes particle-float-4 {
        0% { transform: translateY(0px) translateX(0px) scale(0.4); opacity: 0; }
        35% { opacity: 1; scale: 1.4; }
        100% { transform: translateY(-160px) translateX(-70px) scale(0.3); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  if (!isActive || !celebration || !isVisible) {
    return null;
  }
  
  // 색상 매핑
  const getBackgroundColor = () => {
    if (celebration.color.includes('blue')) return 'rgba(59, 130, 246, 0.25)';
    if (celebration.color.includes('green')) return 'rgba(16, 185, 129, 0.25)';
    if (celebration.color.includes('yellow')) return 'rgba(245, 158, 11, 0.25)';
    if (celebration.color.includes('purple')) return 'rgba(147, 51, 234, 0.25)';
    return 'rgba(236, 72, 153, 0.25)';
  };
  
  const getGradientColors = () => {
    if (celebration.color.includes('blue')) return '#3b82f6, #06b6d4';
    if (celebration.color.includes('green')) return '#10b981, #059669';  
    if (celebration.color.includes('yellow')) return '#f59e0b, #f97316';
    if (celebration.color.includes('purple')) return '#9333ea, #ec4899';
    return '#9333ea, #ec4899';
  };
  
  return (
    <>
      {/* 배경 플래시 - 즉시 시작 */}
      <div 
        className="celebration-flash"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: getBackgroundColor(),
          zIndex: 998,
          pointerEvents: 'none'
        }}
      />
      
      {/* 중앙 메시지 - 즉시 시작 */}
      <div 
        className="celebration-bounce"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 999,
          pointerEvents: 'none'
        }}
      >
        <div 
          style={{
            background: `linear-gradient(to right, ${getGradientColors()})`,
            color: 'white',
            padding: '1.5rem 2.5rem',
            borderRadius: '1rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}
        >
          {celebration.effects?.[0] || '🎉'} {celebration.message} {celebration.effects?.[1] || celebration.effects?.[0] || '🎉'}
        </div>
      </div>
      
      {/* 파티클 이펙트 - 더 많고 크게 */}
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          style={{
            position: 'fixed',
            left: `${15 + (index * 12) % 70}%`,
            top: `${20 + (index * 8) % 60}%`,
            fontSize: '2.5rem',
            zIndex: 997,
            pointerEvents: 'none',
            animation: `particle-float-${index % 5} 4s ease-out forwards`,
            animationDelay: `${index * 0.2}s`
          }}
        >
          {celebration.effects?.[index % celebration.effects.length] || '✨'}
        </div>
      ))}
    </>
  );
};

export default CelebrationEffect;
