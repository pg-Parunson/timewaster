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
      setIsVisible(true);
      
      timeoutRef.current = setTimeout(() => {
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
  
  if (!isActive || !celebration || !isVisible) {
    return null;
  }
  
  return (
    <>
      {/* 배경 플래시 */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: `rgba(147, 51, 234, 0.1)`,
          zIndex: 998,
          pointerEvents: 'none',
          animation: 'flash 3s ease-in-out'
        }}
      />
      
      {/* 중앙 메시지 */}
      <div 
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
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl shadow-2xl border border-white/30"
          style={{
            animation: 'bounce 1s ease-in-out infinite',
            fontSize: '1rem',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          🎉 {celebration.message} 🎉
        </div>
      </div>
      
      <style jsx>{`
        @keyframes flash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </>
  );
};

export default CelebrationEffect;
