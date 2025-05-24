import { useState, useEffect, useRef } from 'react';
import { CELEBRATION_EFFECTS } from '../data/celebrationEffects';

// 축하 시스템 훅 - 버그 수정 (중복 트리거 방지)
export const useCelebrationSystem = (elapsedTime) => {
  const celebrationHistoryRef = useRef(new Set());
  const [currentCelebration, setCurrentCelebration] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const isShowingRef = useRef(false); // 현재 축하 이펙트 표시 중인지 추적
  
  useEffect(() => {
    // 이미 축하 이펙트가 표시 중이면 새로운 체크 생략
    if (isShowingRef.current) {
      return;
    }
    
    // 새로운 마일스톤 체크
    const availableCelebrations = CELEBRATION_EFFECTS.filter(
      (effect) => elapsedTime >= effect.minSeconds && !celebrationHistoryRef.current.has(effect.minSeconds)
    );
    
    if (availableCelebrations.length > 0) {
      const celebration = availableCelebrations[availableCelebrations.length - 1];
      
      // 중복 방지 플래그 설정
      isShowingRef.current = true;
      
      // 먼저 히스토리에 추가 (중복 방지)
      celebrationHistoryRef.current.add(celebration.minSeconds);
      
      // 축하 이벤트 트리거
      setCurrentCelebration(celebration);
      setShowCelebration(true);
      
      // Google Analytics 이벤트
      if (typeof gtag !== 'undefined') {
        gtag('event', 'milestone_achieved', {
          event_category: 'engagement',
          milestone_seconds: celebration.minSeconds,
          milestone_message: celebration.message
        });
      }
    }
  }, [elapsedTime]);
  
  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    setCurrentCelebration(null);
    isShowingRef.current = false; // 축하 이펙트 완료, 새로운 체크 허용
  };
  
  return {
    showCelebration,
    currentCelebration,
    handleCelebrationComplete
  };
};
