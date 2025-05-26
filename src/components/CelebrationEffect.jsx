// 🎉 압도적인 포켓몬 골드 스타일 축하 이펙트 컴포넌트
// 화면을 완전히 장악하는 오버레이 방식

import React, { useState, useEffect, useRef } from 'react';

const EpicPokemonCelebrationEffect = ({ isActive, celebration, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);
  const [phase, setPhase] = useState(0); // 0: 준비, 1: 폭발, 2: 메시지, 3: 피날레
  const timeoutRef = useRef(null);
  
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (isActive && celebration) {
      console.log('🎉 압도적인 포켓몬 축하 이펙트 시작:', celebration.message);
      setIsVisible(true);
      setPhase(1);
      
      // 압도적인 파티클 생성 (30개!)
      const epicEmojis = ['⭐', '✨', '🎉', '🎊', '💫', '🌟', '💥', '🔥', '🎆', '🎇', '💎', '👑', '🏆', '🎖️', '🥇'];
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // 전체 화면
        y: Math.random() * 100, 
        emoji: epicEmojis[i % epicEmojis.length],
        delay: i * 0.05,
        duration: 4 + Math.random() * 2,
        size: 0.8 + Math.random() * 0.4 // 크기 다양화
      }));
      setParticles(newParticles);
      
      // 단계별 전환
      setTimeout(() => setPhase(2), 800);   // 메시지 등장
      setTimeout(() => setPhase(3), 3000);  // 피날레
      
      timeoutRef.current = setTimeout(() => {
        console.log('🎉 압도적인 축하 이펙트 종료');
        setIsVisible(false);
        setParticles([]);
        setPhase(0);
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
        }, 500);
      }, 5000);
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
      {/* 압도적인 포켓몬 축하 이펙트 CSS */}
      <style jsx>{`
        @keyframes epic-screen-flash {
          0% { 
            background: radial-gradient(circle, rgba(255, 215, 0, 0) 0%, rgba(255, 215, 0, 0) 100%);
          }
          10% { 
            background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, rgba(255, 107, 53, 0.2) 100%);
          }
          20% { 
            background: radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, rgba(255, 107, 53, 0.3) 100%);
          }
          40% { 
            background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, rgba(255, 107, 53, 0.15) 100%);
          }
          100% { 
            background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, rgba(255, 107, 53, 0.05) 100%);
          }
        }
        
        @keyframes epic-message-entrance {
          0% { 
            transform: translate(-50%, -50%) scale(0.3) rotate(-15deg);
            opacity: 0;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.2) rotate(5deg);
            opacity: 1;
          }
          100% { 
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        
        @keyframes epic-message-pulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
          }
          25% { 
            transform: translate(-50%, -50%) scale(1.05) rotate(-1deg);
          }
          75% { 
            transform: translate(-50%, -50%) scale(1.05) rotate(1deg);
          }
        }
        
        @keyframes epic-particle-explosion {
          0% { 
            transform: translateY(0px) scale(0.2) rotate(0deg);
            opacity: 0;
          }
          10% { 
            opacity: 1;
            transform: translateY(-20px) scale(0.6) rotate(90deg);
          }
          50% { 
            opacity: 1;
            transform: translateY(-80px) scale(1.2) rotate(270deg);
          }
          100% { 
            transform: translateY(-150px) scale(1.5) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes epic-border-glow {
          0%, 100% {
            box-shadow: 
              4px 4px 0px rgba(0, 0, 0, 0.4),
              inset 2px 2px 0px rgba(255, 255, 255, 0.3),
              0 0 20px rgba(255, 215, 0, 0.5);
          }
          50% {
            box-shadow: 
              4px 4px 0px rgba(0, 0, 0, 0.4),
              inset 2px 2px 0px rgba(255, 255, 255, 0.3),
              0 0 40px rgba(255, 215, 0, 0.8),
              0 0 60px rgba(255, 107, 53, 0.6);
          }
        }
        
        .epic-celebration-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          z-index: 99999 !important;
          pointer-events: none !important;
          overflow: hidden !important;
          font-family: 'Galmuri11', 'Galmuri9', monospace !important;
        }
        
        .epic-flash-bg {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          animation: epic-screen-flash 5s ease-in-out !important;
          pointer-events: none !important;
        }
        
        .epic-message-container {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          pointer-events: none !important;
          z-index: 100000 !important;
        }
        
        .epic-message-container.phase-1 {
          animation: epic-message-entrance 1s ease-out !important;
        }
        
        .epic-message-container.phase-2 {
          animation: epic-message-pulse 1.5s ease-in-out infinite !important;
        }
        
        .epic-message-box {
          background: linear-gradient(135deg, #FFD700 0%, #FF6B35 50%, #FFD700 100%) !important;
          color: #000000 !important;
          border: 6px solid #000000 !important;
          border-radius: 20px !important;
          padding: 40px 60px !important;
          font-size: 28px !important;
          font-weight: bold !important;
          text-align: center !important;
          max-width: 80vw !important;
          min-width: 400px !important;
          text-shadow: 2px 2px 0px rgba(255, 255, 255, 0.8) !important;
          line-height: 1.4 !important;
          animation: epic-border-glow 2s ease-in-out infinite !important;
        }
        
        .epic-title {
          font-size: 36px !important;
          margin-bottom: 16px !important;
          display: block !important;
          text-shadow: 3px 3px 0px rgba(255, 255, 255, 0.9) !important;
        }
        
        .epic-message {
          font-size: 22px !important;
          color: #003366 !important;
          font-weight: bold !important;
        }
        
        .epic-particle {
          position: absolute !important;
          font-size: 32px !important;
          pointer-events: none !important;
          animation: epic-particle-explosion 5s ease-out forwards !important;
          z-index: 99998 !important;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5) !important;
        }
        
        .epic-particle.large {
          font-size: 48px !important;
        }
        
        .epic-particle.medium {
          font-size: 40px !important;
        }
        
        .epic-particle.small {
          font-size: 28px !important;
        }
        
        /* 반응형 */
        @media (max-width: 768px) {
          .epic-message-box {
            padding: 30px 40px !important;
            font-size: 24px !important;
            min-width: 300px !important;
          }
          
          .epic-title {
            font-size: 30px !important;
          }
          
          .epic-message {
            font-size: 18px !important;
          }
        }
      `}</style>
      
      {/* 압도적인 포켓몬 골드 스타일 축하 오버레이 */}
      <div className="epic-celebration-overlay">
        {/* 화면 전체 플래시 */}
        <div className="epic-flash-bg" />
        
        {/* 압도적인 메시지 */}
        {phase >= 2 && (
          <div className={`epic-message-container ${phase === 2 ? 'phase-1' : 'phase-2'}`}>
            <div className="epic-message-box">
              <div className="epic-title">
                🎉 대단합니다! 🎉
              </div>
              <div className="epic-message">
                {celebration.message}
              </div>
            </div>
          </div>
        )}
        
        {/* 압도적인 파티클 폭발 효과 */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`epic-particle ${
              particle.size > 1.1 ? 'large' : 
              particle.size > 0.9 ? 'medium' : 'small'
            }`}
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

export default EpicPokemonCelebrationEffect;