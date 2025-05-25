import React, { useState, useEffect, useCallback, useRef } from 'react';

// 축하 애니메이션 컴포넌트 - UI 깨짐 수정 버전
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
      // 파티클 생성 - 크기 및 위치 수정
      const newParticles = Array.from({ length: 15 }, (_, i) => ({ // 20개 → 15개로 줄임
        id: i,
        emoji: celebration.effects[Math.floor(Math.random() * celebration.effects.length)],
        x: 10 + Math.random() * 80, // 10% ~ 90% 범위로 제한
        y: 10 + Math.random() * 80, // 10% ~ 90% 범위로 제한
        delay: Math.random() * 500, // 1000ms → 500ms로 줄임
        duration: 1500 + Math.random() * 500, // 더 짧게
        size: 0.8 + Math.random() * 0.4 // 0.8 ~ 1.2 범위로 제한
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
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* 메인 축하 메시지 - 안정화된 위치 */}
      {showMessage && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className={`
            bg-gradient-to-r ${celebration.color} text-white 
            px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 
            rounded-2xl sm:rounded-3xl shadow-2xl 
            backdrop-blur-xl border border-white/30
            animate-bounce
          `}>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-center whitespace-nowrap">
              {celebration.message}
            </div>
          </div>
        </div>
      )}
      
      {/* 파티클 효과 - 크기 수정 */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-celebration-float select-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}ms`,
            animationDuration: `${particle.duration}ms`,
            fontSize: `${particle.size * 1.5}rem`,
            zIndex: 35
          }}
        >
          {particle.emoji}
        </div>
      ))}
      
      {/* 화면 전체 글로우 효과 - 약하게 수정 */}
      {showMessage && (
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${celebration.color} animate-pulse`}
          style={{ 
            opacity: 0.03,
            mixBlendMode: 'overlay',
            zIndex: 30
          }}
        />
      )}
    </div>
  );
};

export default CelebrationEffect;