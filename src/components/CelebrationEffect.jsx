// 🎉 완전히 안전한 축하 이펙트 컴포넌트
// UI 레이아웃에 전혀 영향을 주지 않는 오버레이 방식

import React, { useState, useEffect, useRef } from 'react';

const SafeCelebrationEffect = ({ isActive, celebration, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);
  const timeoutRef = useRef(null);
  
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (isActive && celebration) {
      console.log('🎉 안전한 축하 이펙트 시작:', celebration.message);
      setIsVisible(true);
      
      // 파티클 위치 생성 (안전한 범위 내)
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: 20 + Math.random() * 60, // 20%~80% 안전 범위
        y: 30 + Math.random() * 40, // 30%~70% 안전 범위
        emoji: celebration.effects?.[i % celebration.effects.length] || '✨',
        delay: i * 0.2,
        duration: 3 + Math.random() * 2
      }));
      setParticles(newParticles);
      
      timeoutRef.current = setTimeout(() => {
        console.log('🎉 안전한 축하 이펙트 종료');
        setIsVisible(false);
        setParticles([]);
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
        }, 300);
      }, 4000);
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
  
  // 색상 및 그라디언트 안전하게 정의
  const colorConfig = {
    blue: { bg: 'rgba(59, 130, 246, 0.1)', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
    green: { bg: 'rgba(16, 185, 129, 0.1)', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
    yellow: { bg: 'rgba(245, 158, 11, 0.1)', gradient: 'linear-gradient(135deg, #f59e0b, #f97316)' },
    purple: { bg: 'rgba(147, 51, 234, 0.1)', gradient: 'linear-gradient(135deg, #9333ea, #ec4899)' },
    red: { bg: 'rgba(239, 68, 68, 0.1)', gradient: 'linear-gradient(135deg, #ef4444, #f97316)' },
    pink: { bg: 'rgba(236, 72, 153, 0.1)', gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)' }
  };
  
  const getColorConfig = () => {
    if (celebration.color.includes('blue')) return colorConfig.blue;
    if (celebration.color.includes('green')) return colorConfig.green;
    if (celebration.color.includes('yellow')) return colorConfig.yellow;
    if (celebration.color.includes('purple')) return colorConfig.purple;
    if (celebration.color.includes('red')) return colorConfig.red;
    return colorConfig.pink;
  };
  
  const colors = getColorConfig();
  
  return (
    <>
      {/* 축하 이펙트 전용 CSS 스타일 */}
      <style jsx>{`
        @keyframes safe-flash {
          0% { opacity: 0; }
          10% { opacity: 0.8; }
          20% { opacity: 0.3; }
          30% { opacity: 0.6; }
          90% { opacity: 0.2; }
          100% { opacity: 0; }
        }
        
        @keyframes safe-bounce {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1) rotate(0deg); 
          }
          25% { 
            transform: translate(-50%, -50%) scale(1.05) rotate(-2deg); 
          }
          75% { 
            transform: translate(-50%, -50%) scale(1.05) rotate(2deg); 
          }
        }
        
        @keyframes safe-particle-float {
          0% { 
            transform: translateY(0px) scale(0.5) rotate(0deg);
            opacity: 0;
          }
          20% { 
            opacity: 1;
            transform: translateY(-10px) scale(0.8) rotate(90deg);
          }
          100% { 
            transform: translateY(-60px) scale(1.2) rotate(360deg);
            opacity: 0;
          }
        }
        
        .safe-celebration-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          z-index: 9999 !important;
          pointer-events: none !important;
          overflow: hidden !important;
        }
        
        .safe-flash-bg {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          animation: safe-flash 4s ease-in-out !important;
          pointer-events: none !important;
        }
        
        .safe-message-container {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          animation: safe-bounce 2s ease-in-out infinite !important;
          pointer-events: none !important;
          z-index: 10000 !important;
        }
        
        .safe-message-box {
          padding: 16px 24px !important;
          border-radius: 12px !important;
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.4) !important;
          border: 2px solid rgba(255, 255, 255, 0.4) !important;
          font-size: 18px !important;
          font-weight: bold !important;
          text-align: center !important;
          color: white !important;
          max-width: 320px !important;
          white-space: nowrap !important;
          backdrop-filter: blur(10px) !important;
        }
        
        .safe-particle {
          position: absolute !important;
          font-size: 24px !important;
          pointer-events: none !important;
          animation: safe-particle-float 4s ease-out forwards !important;
          z-index: 9998 !important;
        }
      `}</style>
      
      {/* 완전 독립된 오버레이 - 다른 UI에 절대 영향 없음 */}
      <div className="safe-celebration-overlay">
        {/* 부드러운 배경 플래시 - 전체 화면 덮지만 투명도 낮음 */}
        <div 
          className="safe-flash-bg"
          style={{ backgroundColor: colors.bg }}
        />
        
        {/* 중앙 축하 메시지 - 완전 고정 위치 */}
        <div className="safe-message-container">
          <div 
            className="safe-message-box"
            style={{ background: colors.gradient }}
          >
            {celebration.message}
          </div>
        </div>
        
        {/* 안전한 범위 내 파티클들 */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="safe-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          >
            {particle.emoji}
          </div>
        ))}
      </div>
    </>
  );
};

export default SafeCelebrationEffect;