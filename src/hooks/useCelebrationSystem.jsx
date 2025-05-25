import { useState, useEffect, useRef } from 'react';
import { CELEBRATION_EFFECTS } from '../data/celebrationEffects';

// 축하 시스템 훅 - 완전 수정 버전
export const useCelebrationSystem = (elapsedTime) => {
  const celebrationHistoryRef = useRef(new Set());
  const [currentCelebration, setCurrentCelebration] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const isShowingRef = useRef(false);
  const timeoutRef = useRef(null); // 강제 종료용 타이머
  
  // 상태 초기화 함수
  const clearCelebration = () => {
    setShowCelebration(false);
    setCurrentCelebration(null);
    isShowingRef.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  
  useEffect(() => {
    // 이미 축하 이팩트가 표시 중이면 새로운 체크 생략
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
      
      // 강제 종료 타이머 (5초 후 강제 종료)
      timeoutRef.current = setTimeout(() => {
        console.log('축하 이팩트 강제 종료:', celebration.message);
        clearCelebration();
      }, 5000); // 3초 + 2초 여유
      
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
    console.log('축하 이팩트 정상 종료');
    clearCelebration();
  };
  
  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      clearCelebration();
    };
  }, []);
  
  return {
    showCelebration,
    currentCelebration,
    handleCelebrationComplete
  };
};