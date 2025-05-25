import React, { useState, useEffect } from 'react';
import { database, DB_PATHS } from '../config/firebase';
import { ref, onValue, off } from 'firebase/database';

const LiveFeedNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!database) return;

    const liveFeedRef = ref(database, DB_PATHS.LIVE_FEED);
    
    // 실시간 피드 리스너 설정
    const unsubscribe = onValue(liveFeedRef, (snapshot) => {
      if (snapshot.exists()) {
        const feedData = snapshot.val();
        const feedArray = Object.entries(feedData)
          .map(([key, data]) => ({
            id: key,
            ...data,
            timestamp: data.timestamp || Date.now()
          }))
          .sort((a, b) => b.timestamp - a.timestamp) // 최신순 정렬
          .slice(0, 5); // 최근 5개만 표시

        setNotifications(feedArray);
      }
    });

    // 컴포넌트 언마운트 시 리스너 해제
    return () => {
      off(liveFeedRef);
    };
  }, []);

  // 알림 제거 함수
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // 알림 표시/숨김 토글
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // 시간 경과 표시 함수
  const getTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    
    const days = Math.floor(hours / 24);
    return `${days}일 전`;
  };

  // 메시지 타입별 아이콘
  const getMessageIcon = (type) => {
    switch (type) {
      case 'milestone': return '🎉';
      case 'ranking': return '🏆';
      case 'achievement': return '⭐';
      default: return '💫';
    }
  };

  // 메시지 타입별 배경색
  const getMessageColor = (type) => {
    switch (type) {
      case 'milestone': return 'from-purple-500/20 to-pink-500/20';
      case 'ranking': return 'from-yellow-500/20 to-orange-500/20';
      case 'achievement': return 'from-blue-500/20 to-cyan-500/20';
      default: return 'from-green-500/20 to-teal-500/20';
    }
  };

  if (!isVisible || notifications.length === 0) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleVisibility}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-3 
                     hover:bg-white/20 transition-all duration-300 group"
          title="실시간 알림 보기"
        >
          <div className="relative">
            <span className="text-xl">🔔</span>
            {notifications.length > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs 
                            rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </div>
            )}
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm space-y-2">
      {/* 헤더 */}
      <div className="flex items-center justify-between bg-white/10 backdrop-blur-md 
                      border border-white/20 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📡</span>
          <span className="text-white font-medium">실시간 피드</span>
        </div>
        <button
          onClick={toggleVisibility}
          className="text-white/60 hover:text-white transition-colors"
          title="알림 숨기기"
        >
          ✕
        </button>
      </div>

      {/* 알림 목록 */}
      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className={`bg-gradient-to-r ${getMessageColor(notification.type)} 
                       backdrop-blur-md border border-white/20 rounded-lg p-3
                       transform transition-all duration-500 hover:scale-105
                       animate-slideInRight`}
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}
          >
            <div className="flex items-start gap-3">
              {/* 아이콘 */}
              <div className="text-xl flex-shrink-0 mt-0.5">
                {getMessageIcon(notification.type)}
              </div>

              {/* 메시지 내용 */}
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm leading-relaxed">
                  {notification.message}
                </div>
                
                {/* 시간 정보 */}
                <div className="text-white/60 text-xs mt-1">
                  {getTimeAgo(notification.timestamp)}
                </div>
              </div>

              {/* 닫기 버튼 */}
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-white/40 hover:text-white/80 transition-colors
                          text-xs flex-shrink-0"
                title="알림 삭제"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 정보 */}
      {notifications.length > 0 && (
        <div className="text-center">
          <div className="text-white/40 text-xs">
            {notifications.length}개의 최근 활동
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveFeedNotifications;