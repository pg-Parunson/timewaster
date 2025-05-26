// 🎉 포켓몬 골드 스타일 축하 이펙트 컴포넌트
// UI 레이아웃에 전혀 영향을 주지 않는 오버레이 방식

import React, { useState, useEffect, useRef } from 'react';

const PokemonCelebrationEffect = ({ isActive, celebration, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);
  const timeoutRef = useRef(null);
  
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (isActive && celebration) {
      console.log('🎉 포켓몬 축하 이펙트 시작:', celebration.message);
      setIsVisible(true);
      
      // 포켓몬 스타일 파티클 생성
      const pokemonEmojis = ['⭐', '✨', '🎉', '🎊', '💫', '🌟', '💥', '🔥'];
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: 15 + Math.random() * 70, // 15%~85% 범위
        y: 20 + Math.random() * 60, // 20%~80% 범위
        emoji: pokemonEmojis[i % pokemonEmojis.length],
        delay: i * 0.15,
        duration: 3 + Math.random() * 1.5
      }));
      setParticles(newParticles);
      
      timeoutRef.current = setTimeout(() => {
        console.log('🎉 포켓몬 축하 이펙트 종료');
        setIsVisible(false);
        setParticles([]);
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
        }, 300);
      }, 3500);
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
      {/* 포켓몬 스타일 축하 이펙트 CSS */}
      <style jsx>{`
        @keyframes pokemon-flash {
          0% { opacity: 0; background-color: rgba(255, 215, 0, 0); }
          15% { opacity: 1; background-color: rgba(255, 215, 0, 0.1); }
          30% { opacity: 0.5; background-color: rgba(255, 107, 53, 0.05); }
          85% { opacity: 0.2; background-color: rgba(255, 215, 0, 0.02); }
          100% { opacity: 0; background-color: rgba(255, 215, 0, 0); }
        }
        
        @keyframes pokemon-bounce {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1) rotate(0deg); 
          }
          25% { 
            transform: translate(-50%, -50%) scale(1.1) rotate(-1deg); 
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.05) rotate(1deg); 
          }
          75% { 
            transform: translate(-50%, -50%) scale(1.08) rotate(-0.5deg); 
          }
        }
        
        @keyframes pokemon-particle-float {
          0% { 
            transform: translateY(0px) scale(0.3) rotate(0deg);
            opacity: 0;
          }
          20% { 
            opacity: 1;
            transform: translateY(-15px) scale(0.7) rotate(45deg);
          }
          60% { 
            opacity: 0.8;
            transform: translateY(-40px) scale(1) rotate(180deg);
          }
          100% { 
            transform: translateY(-80px) scale(1.3) rotate(360deg);
            opacity: 0;
          }
        }
        
        .pokemon-celebration-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          z-index: 9999 !important;
          pointer-events: none !important;
          overflow: hidden !important;
          font-family: 'Galmuri11', 'Galmuri9', monospace !important;
        }
        
        .pokemon-flash-bg {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          animation: pokemon-flash 3.5s ease-in-out !important;
          pointer-events: none !important;
        }
        
        .pokemon-message-container {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          animation: pokemon-bounce 1.5s ease-in-out infinite !important;
          pointer-events: none !important;
          z-index: 10000 !important;
        }
        
        .pokemon-message-box {
          background: linear-gradient(135deg, #FFD700 0%, #FF6B35 100%) !important;
          color: #000000 !important;
          border: 4px solid #000000 !important;
          border-radius: 12px !important;
          padding: 20px 28px !important;
          font-size: 20px !important;
          font-weight: bold !important;
          text-align: center !important;
          max-width: 350px !important;
          box-shadow: 
            4px 4px 0px rgba(0, 0, 0, 0.4),
            inset 2px 2px 0px rgba(255, 255, 255, 0.3) !important;
          text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.8) !important;
          line-height: 1.3 !important;
        }
        
        .pokemon-particle {
          position: absolute !important;
          font-size: 28px !important;
          pointer-events: none !important;
          animation: pokemon-particle-float 4s ease-out forwards !important;
          z-index: 9998 !important;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3) !important;
        }
        
        .pokemon-celebration-title {
          font-size: 24px !important;
          margin-bottom: 8px !important;
          display: block !important;
        }
        
        .pokemon-celebration-message {
          font-size: 16px !important;
          color: #003366 !important;
          font-weight: normal !important;
        }
      `}</style>
      
      {/* 포켓몬 골드 스타일 축하 오버레이 */}
      <div className="pokemon-celebration-overlay">
        {/* 포켓몬 골드 컬러 배경 플래시 */}
        <div className="pokemon-flash-bg" />
        
        {/* 포켓몬 대화창 스타일 축하 메시지 */}
        <div className="pokemon-message-container">
          <div className="pokemon-message-box">
            <div className="pokemon-celebration-title">
              🎉 축하합니다! 🎉
            </div>
            <div className="pokemon-celebration-message">
              {celebration.message}
            </div>
          </div>
        </div>
        
        {/* 포켓몬 스타일 파티클 효과 */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="pokemon-particle"
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

export default PokemonCelebrationEffect;