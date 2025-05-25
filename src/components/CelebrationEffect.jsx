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
      }, 3000);
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
        animation: celebration-flash 3s ease-in-out;
      }
      
      .celebration-bounce {
        animation: celebration-bounce 1s ease-in-out infinite;
      }
      
      @keyframes celebration-flash {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
      }
      
      @keyframes celebration-bounce {
        0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
        50% { transform: translate(-50%, -50%) translateY(-10px); }
      }
      
      @keyframes celebration-float-0 {
        0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
        20% { opacity: 1; }
        100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
      }
      
      @keyframes celebration-float-1 {
        0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
        25% { opacity: 1; }
        100% { transform: translateY(-120px) rotate(-360deg); opacity: 0; }
      }
      
      @keyframes celebration-float-2 {
        0% { transform: translateY(0px) scale(0.5); opacity: 0; }
        30% { opacity: 1; }
        100% { transform: translateY(-80px) scale(1.5); opacity: 0; }
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
  
  return (
    <>
      {/* 배경 플래시 */}
      <div 
        className="celebration-flash"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(147, 51, 234, 0.15)',
          zIndex: 998,
          pointerEvents: 'none'
        }}
      />
      
      {/* 중앙 메시지 */}
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
            background: `linear-gradient(to right, ${celebration.color.includes('blue') ? '#3b82f6, #06b6d4' : celebration.color.includes('green') ? '#10b981, #059669' : '#9333ea, #ec4899'})`,
            color: 'white',
            padding: '1.5rem 2rem',
            borderRadius: '0.75rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}
        >
          {celebration.effects[0]} {celebration.message} {celebration.effects[1] || celebration.effects[0]}
        </div>
      </div>
      
      {/* 파티클 이펙트 추가 */}
      {celebration.effects.map((effect, index) => (
        <div
          key={index}
          style={{
            position: 'fixed',
            left: `${20 + (index * 20) % 60}%`,
            top: `${25 + (index * 15) % 50}%`,
            fontSize: '2rem',
            zIndex: 997,
            pointerEvents: 'none',
            animation: `celebration-float-${index} 3s ease-out forwards`
          }}
        >
          {effect}
        </div>
      ))}
    </>
  );
};

export default CelebrationEffect;
