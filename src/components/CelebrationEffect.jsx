import React, { useState, useEffect, useRef } from 'react';

// 축하 애니메이션 컴포넌트 - UI 간섭 완전 방지 버전
const CelebrationEffect = ({ isActive, celebration, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);
  
  useEffect(() => {
    // 기존 타이머 정리
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (isActive && celebration) {
      setIsVisible(true);
      
      // 정확히 3초 후 완전 정리
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        // 200ms 후 onComplete 호출 (DOM 정리 시간 확보)
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
  
  // 비활성화 시 null 반환 (완전 제거)
  if (!isActive || !celebration || !isVisible) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[45] overflow-hidden">
      {/* 중앙 축하 메시지 - 크기 정규화 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="animate-bounce">
          <div className={`
            bg-gradient-to-r ${celebration.color} text-white 
            px-6 py-3 rounded-2xl shadow-xl
            backdrop-blur-md border border-white/20
            max-w-md mx-auto
          `}>
            <div className="text-lg font-bold text-center whitespace-nowrap flex items-center gap-2">
              <span className="text-xl">{celebration.effects[0]}</span>
              <span className="text-base">{celebration.message}</span>
              <span className="text-xl">{celebration.effects[1] || celebration.effects[0]}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 극도로 미세한 배경 효과 */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${celebration.color} pointer-events-none`}
        style={{ 
          opacity: 0.01,
          zIndex: -1
        }}
      />
    </div>
  );
};

export default CelebrationEffect;