import { database, DB_PATHS, ANONYMOUS_NAMES } from '../config/firebase';
import { ref, push, set, get, update } from 'firebase/database';

// 실시간 피드에 알림 추가
export const addLiveFeedNotification = async (type, message, additionalData = {}) => {
  if (!database) {
    console.warn('Firebase가 초기화되지 않았습니다.');
    return;
  }

  try {
    const liveFeedRef = ref(database, DB_PATHS.LIVE_FEED);
    const newNotificationRef = push(liveFeedRef);
    
    const notificationData = {
      type,
      message,
      timestamp: Date.now(), // serverTimestamp() 대신 클라이언트 타임스탬프 사용
      ...additionalData
    };

    await set(newNotificationRef, notificationData);
  } catch (error) {
    console.error('❌ 실시간 피드 알림 추가 실패:', error);
  }
};

// 마일스톤 달성 알림
export const addMilestoneNotification = async (minutes, nickname) => {
  const displayName = nickname || getRandomAnonymousName();
  const message = `${displayName}님이 ${minutes}분 달성! 🎉`;
  
  await addLiveFeedNotification('milestone', message, {
    minutes,
    nickname: displayName
  });
};

// 랭킹 진입 알림
export const addRankingNotification = async (rank, minutes, nickname, period = 'daily') => {
  const displayName = nickname || getRandomAnonymousName();
  const periodText = {
    daily: '일간',
    weekly: '주간', 
    monthly: '월간',
    allTime: '전체'
  }[period];
  
  let message;
  if (rank === 1) {
    message = `🏆 ${displayName}님이 ${periodText} 랭킹 1위 달성! (${minutes}분)`;
  } else if (rank <= 3) {
    message = `🥉 ${displayName}님이 ${periodText} 랭킹 ${rank}위 진입! (${minutes}분)`;
  } else {
    message = `📈 ${displayName}님이 ${periodText} 랭킹 ${rank}위 진입! (${minutes}분)`;
  }
  
  await addLiveFeedNotification('ranking', message, {
    rank,
    minutes,
    nickname: displayName,
    period
  });
};

// 특별 업적 달성 알림
export const addAchievementNotification = async (achievement, nickname) => {
  const displayName = nickname || getRandomAnonymousName();
  const message = `⭐ ${displayName}님이 "${achievement}" 업적 달성!`;
  
  await addLiveFeedNotification('achievement', message, {
    achievement,
    nickname: displayName
  });
};

// 일반 활동 알림
export const addActivityNotification = async (activity, nickname) => {
  const displayName = nickname || getRandomAnonymousName();
  const message = `💫 ${displayName}님: ${activity}`;
  
  await addLiveFeedNotification('activity', message, {
    activity,
    nickname: displayName
  });
};

// 랜덤 익명 닉네임 생성
const getRandomAnonymousName = () => {
  return ANONYMOUS_NAMES[Math.floor(Math.random() * ANONYMOUS_NAMES.length)];
};

// 특정 시간 간격별 자동 알림 생성 (테스트용)
export const generateTestNotifications = async () => {
  const testNotifications = [
    { type: 'milestone', message: '몽상가님이 5분 달성! 🎉' },
    { type: 'ranking', message: '🏆 시간여행자님이 일간 랭킹 1위 달성! (42분)' },
    { type: 'achievement', message: '⭐ 우주탐험가님이 "시간의 마법사" 업적 달성!' },
    { type: 'activity', message: '💫 현실도피자님: 창밖을 바라보며 멍하니...' }
  ];

  for (let i = 0; i < testNotifications.length; i++) {
    const notification = testNotifications[i];
    await addLiveFeedNotification(
      notification.type, 
      notification.message,
      { isTest: true }
    );
    
    // 각 알림 사이에 1초 간격
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};

// 피드 정리 (오래된 알림 삭제)
export const cleanupOldNotifications = async (maxAge = 24 * 60 * 60 * 1000) => {
  if (!database) return;

  try {
    const liveFeedRef = ref(database, DB_PATHS.LIVE_FEED);
    const snapshot = await get(liveFeedRef);
    
    if (snapshot.exists()) {
      const feedData = snapshot.val();
      const now = Date.now();
      const updates = {};
      
      Object.entries(feedData).forEach(([key, data]) => {
        if (now - data.timestamp > maxAge) {
          updates[key] = null; // 삭제 마크
        }
      });
      
      if (Object.keys(updates).length > 0) {
        await update(liveFeedRef, updates);
      }
    }
  } catch (error) {
    console.error('❌ 피드 정리 실패:', error);
  }
};