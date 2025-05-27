import { useState, useEffect, useRef, useCallback } from 'react';
import { storage } from '../utils/storage';
import { analytics } from '../utils/analytics';
import { rankingService } from '../services/rankingService.jsx';
import { statsService } from '../services/statsService.jsx'; // 📊 실제 통계 서비스 import
import { addMilestoneNotification, addRankingNotification, addActivityNotification } from '../services/liveFeedService.jsx';
import { getTimeBasedActivityRecommendation } from '../data/timeBasedActivities';
import { 
  ROAST_MESSAGES, 
  getRankingMessage, 
  getTimeBasedMessage, 
  getRandomRoastMessage,
  getIntegratedMessage 
} from '../data/roastMessages';
import { AD_MESSAGES } from '../data/adMessages';
import { BUTTON_TEXTS } from '../data/buttonTexts';

// 메인 타이머 및 상태 관리 훅
export const useTimerLogic = () => {
  // 기본 상태들
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("당신의 소중한 시간이 흘러가고 있습니다...");
  const [currentMessageData, setCurrentMessageData] = useState(null);
  const [displayMessage, setDisplayMessage] = useState("당신의 소중한 시간이 흘러가고 있습니다..."); // 초기값 설정
  const [userHistory, setUserHistory] = useState({ visits: 1, patterns: {} });
  const [buttonText, setButtonText] = useState(BUTTON_TEXTS[0]);
  const [showAd, setShowAd] = useState(false);
  const [adMessage, setAdMessage] = useState(AD_MESSAGES[0]);
  const [visits, setVisits] = useState(1);
  const [totalTimeWasted, setTotalTimeWasted] = useState(0);
  const [adClicks, setAdClicks] = useState(0);
  const [messageShake, setMessageShake] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [extremeMode, setExtremeMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [concurrentUsers, setConcurrentUsers] = useState(1); // 📊 기본값 1로 변경
  const [currentUser, setCurrentUser] = useState(null);
  const [isRankingInitialized, setIsRankingInitialized] = useState(false);
  const [currentRank, setCurrentRank] = useState(null);
  const [lastRankCheckTime, setLastRankCheckTime] = useState(0);
  
  const typingRef = useRef(null);

  // 타이핑 애니메이션 함수 - 속도 개선
  const typeMessage = useCallback((message) => {
    if (typingRef.current) {
      clearTimeout(typingRef.current);
      typingRef.current = null;
    }
    
    if (!message || typeof message !== 'string') {
      console.warn('Invalid message:', message);
      setDisplayMessage("오류가 발생했습니다. 다시 시도해주세요.");
      setIsTyping(false);
      return;
    }
    
    setIsTyping(true);
    setDisplayMessage("");
    
    const chars = Array.from(message);
    let currentText = "";
    let index = 0;
    
    const type = () => {
      if (index < chars.length) {
        currentText += chars[index];
        setDisplayMessage(currentText);
        index++;
        // 타이핑 속도를 빠르게 조정 (20-35ms)
        typingRef.current = setTimeout(type, 20 + Math.random() * 15);
      } else {
        setIsTyping(false);
      }
    };
    
    type();
  }, []);

  // 현재 랭킹 확인 함수
  const checkCurrentRanking = useCallback(async (timeInSeconds) => {
    if (!isRankingInitialized) return;
    
    try {
      const rank = await rankingService.getExpectedRank(timeInSeconds);
      const previousRank = currentRank;
      setCurrentRank(rank);
      
      if (previousRank && rank < previousRank && rank <= 10) {
        const minutes = Math.floor(timeInSeconds / 60);
        addRankingNotification(rank, minutes, currentUser?.anonymousName);
        
        if (Math.random() < 0.3) {
          const rankingMessage = getRankingMessage(rank, timeInSeconds);
          setCurrentMessage(rankingMessage);
          typeMessage(rankingMessage);
        }
      }
    } catch (error) {
      console.error('랭킹 확인 실패:', error);
    }
  }, [isRankingInitialized, currentRank, currentUser, typeMessage]);

  // 메시지 새로고침
  const refreshMessage = useCallback(() => {
    if (elapsedTime < 10) {
      const newMessage = "시간 낭비의 여정이 시작되었습니다.";
      setCurrentMessage(newMessage);
      setCurrentMessageData(null);
      typeMessage(newMessage);
      return;
    }

    const history = {
      visits,
      timeSpent: elapsedTime,
      adClicks,
      patterns: {
        frequentVisitor: visits >= 3,
        longTimeUser: elapsedTime >= 1800,
        extremeUser: extremeMode
      }
    };
    setUserHistory(history);

    const messageResult = getIntegratedMessage(elapsedTime, currentRank, history);
    
    setCurrentMessage(messageResult.message);
    setCurrentMessageData(messageResult);
    typeMessage(messageResult.message);
    
    if (Math.random() < 0.4) {
      const randomButtonText = BUTTON_TEXTS[Math.floor(Math.random() * BUTTON_TEXTS.length)];
      setButtonText(randomButtonText);
    }
    
    setMessageShake(true);
    setTimeout(() => setMessageShake(false), 500);
  }, [elapsedTime, visits, adClicks, extremeMode, currentRank, typeMessage]);

  // 📊 초기화 효과들 - 실제 Firebase 통계 사용
  useEffect(() => {
    const initializeStats = async () => {
      try {
        // 📊 Firebase 방문 횟수 증가 및 통계 업데이트
        const newVisits = await statsService.incrementVisits();
        setVisits(newVisits);
        
        // 📊 전체 통계 가져오기
        const globalStats = await statsService.getGlobalStats();
        setTotalTimeWasted(Math.floor(globalStats.totalTimeWasted / 60)); // 분 단위로 표시
        
        // 로컬 광고 클릭 수는 여전히 로컬에서 관리
        const storedData = storage.getAllData();
        setAdClicks(storedData.adClicks);
        
        // 📊 실시간 통계 리스너 등록
        const unsubscribeStats = statsService.onStatsChange((stats) => {
          setVisits(stats.totalVisits);
          setTotalTimeWasted(Math.floor(stats.totalTimeWasted / 60));
        });
        
        // 📊 동시 접속자 리스너 등록
        const unsubscribeSessions = statsService.onActiveSessionsChange((activeSessions) => {
          setConcurrentUsers(activeSessions);
        });
        
        analytics.trackSessionStart(newVisits, globalStats.totalTimeWasted);
        
        // 정리 함수 반환
        return () => {
          unsubscribeStats();
          unsubscribeSessions();
        };
      } catch (error) {
        console.error('통계 초기화 실패:', error);
        // 폴백: 로컬 데이터 사용
        const visits = storage.incrementVisits();
        const storedData = storage.getAllData();
        
        setVisits(visits);
        setTotalTimeWasted(storedData.totalTimeWasted);
        setAdClicks(storedData.adClicks);
        
        analytics.trackSessionStart(visits, storedData.totalTimeWasted);
      }
    };
    
    initializeStats();
  }, []);

  // Firebase 랭킹 시스템 초기화
  useEffect(() => {
    const initializeRanking = async () => {
      try {
        const user = await rankingService.initializeSession();
        setCurrentUser(user);
        setIsRankingInitialized(true);
      } catch (error) {
        console.error('Firebase 랭킹 시스템 초기화 실패:', error);
        setIsRankingInitialized(false);
      }
    };

    initializeRanking();

    return () => {
      if (isRankingInitialized) {
        rankingService.endSession();
        // 📊 세션 종료 시 통계 업데이트
        statsService.updateOnSessionEnd(elapsedTime);
      }
    };
  }, []);

  // 초기 메시지 타이핑 - 안전하게 수정
  useEffect(() => {
    // 첫 로드시에만 실행
    const timer = setTimeout(() => {
      typeMessage(currentMessage);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []); // 의도적으로 빈 배열 사용

  // 타이머 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPageVisible) {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        setElapsedTime(elapsed);
        
        if (isRankingInitialized && elapsed > 0) {
          rankingService.updateTime(elapsed);
          
          if (elapsed === 60 || elapsed === 180 || elapsed === 300 || elapsed === 600 || elapsed === 900 || elapsed === 1800 || elapsed === 3600) {
            const minutes = Math.floor(elapsed / 60);
            addMilestoneNotification(minutes, currentUser?.anonymousName);
          }
          
          if (elapsed > 60 && elapsed % 30 === 0 && elapsed !== lastRankCheckTime) {
            setLastRankCheckTime(elapsed);
            checkCurrentRanking(elapsed);
          }
          
          if (elapsed > 30 && elapsed % 30 === 0 && Math.random() < 0.3) {
            const activityRecommendation = getTimeBasedActivityRecommendation(elapsed);
            const activityName = activityRecommendation.activities[0] || '생산적인 일';
            addActivityNotification(`${elapsed}초 동안 "${activityName}" 생각 중...`, currentUser?.anonymousName);
          }
        }
        
        if (elapsed >= 60 && !showAd) {
          setShowAd(true);
        }
        
        if (elapsed >= 300 && !extremeMode) {
          setExtremeMode(true);
          analytics.trackExtremeMode();
        }
        
        if (elapsed > 0 && elapsed % 45 === 0) {
          refreshMessage();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isPageVisible, showAd, extremeMode, isRankingInitialized, currentUser, lastRankCheckTime, checkCurrentRanking, refreshMessage]);

  // 광고 메시지 업데이트
  useEffect(() => {
    if (!showAd || isTyping) return;
    
    const currentMinute = Math.floor(elapsedTime / 60);
    const adIndex = Math.min(currentMinute - 1, AD_MESSAGES.length - 1);
    
    if (adIndex >= 0 && adIndex < AD_MESSAGES.length) {
      const newAdMessage = AD_MESSAGES[adIndex];
      setAdMessage(newAdMessage);
    }
  }, [showAd, isTyping, Math.floor(elapsedTime / 60)]);

  // 페이지 가시성 감지
  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsPageVisible(visible);
      
      if (!visible) {
        document.title = "돌아와요... 🥺 - 시간낭비 계산기";
      } else {
        document.title = "🕒 당신이 낭비한 시간 계산기";
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // 페이지 떠나기 방지
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (elapsedTime > 60) {
        storage.updateTotalTimeWasted(elapsedTime);
        // 📊 Firebase 통계에도 시간 추가
        statsService.updateOnSessionEnd(elapsedTime);
        
        const message = '정말로 나가시겠어요? 이제 막 재미있어지려고 했는데...';
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [elapsedTime]);

  return {
    // 상태들
    startTime,
    elapsedTime,
    currentMessage,
    currentMessageData,
    displayMessage,
    userHistory,
    buttonText,
    showAd,
    adMessage,
    visits,
    totalTimeWasted,
    adClicks,
    messageShake,
    isPageVisible,
    extremeMode,
    isTyping,
    concurrentUsers,
    currentUser,
    isRankingInitialized,
    currentRank,
    
    // 함수들
    typeMessage,
    refreshMessage,
    checkCurrentRanking,
    
    // 세터들 (필요한 경우)
    setCurrentMessage,
    setCurrentMessageData,
    setDisplayMessage,
    setButtonText,
    setAdMessage,
    setAdClicks,
    setMessageShake
  };
};
