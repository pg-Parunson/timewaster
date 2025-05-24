import React, { useState, useEffect, useCallback, useRef } from 'react';

// 축하 애니메이션 컴포넌트
const CelebrationEffect = ({ isActive, celebration, onComplete }) => {
  const [particles, setParticles] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const timerRef = useRef(null);
  
  // onComplete를 useCallback으로 안정화
  const stableOnComplete = useCallback(() => {
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);
  
  // 상태 초기화 함수
  const clearStates = useCallback(() => {
    setShowMessage(false);
    setParticles([]);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  useEffect(() => {
    // 이전 타이머 정리
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (isActive && celebration) {
      // 파티클 생성
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        emoji: celebration.effects[Math.floor(Math.random() * celebration.effects.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 1000,
        duration: 2000 + Math.random() * 1000,
        size: 1 + Math.random() * 2
      }));
      
      setParticles(newParticles);
      setShowMessage(true);
      
      // 3초 후 정리 (강제 정리)
      timerRef.current = setTimeout(() => {
        clearStates();
        stableOnComplete();
      }, 3000);
      
    } else {
      // isActive가 false면 즉시 정리
      clearStates();
    }
    
    // cleanup
    return () => {
      clearStates();
    };
  }, [isActive, celebration, stableOnComplete, clearStates]);
  
  if (!isActive || !celebration) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* 메인 축하 메시지 */}
      {showMessage && (
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-${celebration.animation}`}>
          <div className={`bg-gradient-to-r ${celebration.color} text-white px-6 lg:px-8 py-3 lg:py-4 rounded-3xl shadow-2xl backdrop-blur-xl border-2 border-white/30`}>
            <div className="text-xl lg:text-3xl font-bold text-center animate-pulse">
              {celebration.message}
            </div>
          </div>
        </div>
      )}
      
      {/* 파티클 효과 */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute text-2xl lg:text-4xl animate-celebration-float`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}ms`,
            animationDuration: `${particle.duration}ms`,
            fontSize: `${particle.size}rem`,
            transform: `scale(${particle.size})`
          }}
        >
          {particle.emoji}
        </div>
      ))}
      
      {/* 화면 전체 글로우 효과 */}
      {showMessage && (
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${celebration.color} opacity-10 animate-pulse`}
          style={{ mixBlendMode: 'overlay' }}
        />
      )}
    </div>
  );
};

export default CelebrationEffect;
