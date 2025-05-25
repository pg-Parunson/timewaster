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
            background: 'linear-gradient(to right, #9333ea, #ec4899)',
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
          🎉 {celebration.message} 🎉
        </div>
      </div>
    </>
  );
};

export default CelebrationEffect;
