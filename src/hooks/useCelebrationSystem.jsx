import { useState, useEffect, useRef } from 'react';
import { CELEBRATION_EFFECTS } from '../data/celebrationEffects';

// 안전한 축하 시스템 훅 - UI 레이아웃에 전혀 영향 없음
export const useCelebrationSystem = (elapsedTime) => {
  const celebrationHistoryRef = useRef(new Set());
  const [currentCelebration, setCurrentCelebration] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const isShowingRef = useRef(false);
  const timeoutRef = useRef(null); // 강제 종료용 타이머
  const lastElapsedTimeRef = useRef(0); // 중복 실행 방지
  
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
    // 동일한 elapsedTime에 대한 중복 실행 방지
    if (lastElapsedTimeRef.current === elapsedTime) {
      return;
    }
    lastElapsedTimeRef.current = elapsedTime;
    
    console.log('안전한 축하 시스템 - 현재 elapsedTime:', elapsedTime, '초');
    
    // 이미 축하 이팩트가 표시 중이면 새로운 체크 생략
    if (isShowingRef.current) {
      console.log('이미 안전한 축하 이팩트 표시 중...');
      return;
    }
    
    // 새로운 마일스톤 체크
    const availableCelebrations = CELEBRATION_EFFECTS.filter(
      (effect) => elapsedTime >= effect.minSeconds && !celebrationHistoryRef.current.has(effect.minSeconds)
    );
    
    console.log('사용 가능한 안전한 축하 이팩트:', availableCelebrations.length, '개');
    
    if (availableCelebrations.length > 0) {
      const celebration = availableCelebrations[availableCelebrations.length - 1];
      
      console.log('안전한 축하 이팩트 실행:', celebration.message);
      
      // 중복 방지 플래그 설정
      isShowingRef.current = true;
      
      // 먼저 히스토리에 추가 (중복 방지)
      celebrationHistoryRef.current.add(celebration.minSeconds);
      
      // 안전한 축하 이벤트 트리거
      setCurrentCelebration(celebration);
      setShowCelebration(true);
      
      // 강제 종료 타이머 (4초 후 강제 종료)
      timeoutRef.current = setTimeout(() => {
        console.log('안전한 축하 이팩트 자동 종료:', celebration.message);
        clearCelebration();
      }, 4500); // 4.5초 안전 마진
      
      // Google Analytics 이벤트 (안전하게 처리)
      try {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'safe_milestone_achieved', {
            event_category: 'engagement',
            milestone_seconds: celebration.minSeconds,
            milestone_message: celebration.message
          });
        }
      } catch (error) {
        console.log('Analytics 이벤트 실패 (무시):', error);
      }
    }
  }, [elapsedTime]);
  
  const handleCelebrationComplete = () => {
    console.log('안전한 축하 이팩트 정상 종료');
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