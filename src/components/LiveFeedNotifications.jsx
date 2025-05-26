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

  // 메시지 타입별 배경색 (포켓몬 스타일)
  const getMessageColor = (type) => {
    switch (type) {
      case 'milestone': return 'bg-purple-100 border-purple-400';
      case 'ranking': return 'bg-yellow-100 border-yellow-400';
      case 'achievement': return 'bg-blue-100 border-blue-400';
      default: return 'bg-green-100 border-green-400';
    }
  };

  if (!isVisible || notifications.length === 0) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleVisibility}
          className="pokemon-dialog pokemon-hover p-3"
          title="실시간 알림 보기"
        >
          <div className="relative">
            <span className="text-xl">🔔</span>
            {notifications.length > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white pokemon-font text-xs 
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
      {/* 포켓몬 스타일 헤더 */}
      <div className="pokemon-dialog pokemon-hover">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📡</span>
            <span className="pokemon-font text-gray-800">실시간 피드</span>
          </div>
          <button
            onClick={toggleVisibility}
            className="text-gray-600 hover:text-gray-800 pokemon-font transition-colors"
            title="알림 숨기기"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 포켓몬 스타일 알림 목록 */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className={`${getMessageColor(notification.type)} 
                       border-2 rounded-lg p-3 pokemon-hover
                       transform transition-all duration-500`}
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}
          >
            <div className="flex items-start gap-3">
              {/* 아이콘 */}
              <div className="text-lg flex-shrink-0 mt-0.5">
                {getMessageIcon(notification.type)}
              </div>

              {/* 메시지 내용 */}
              <div className="flex-1 min-w-0">
                <div className="pokemon-font text-gray-800 text-sm leading-relaxed">
                  {notification.message}
                </div>
                
                {/* 시간 정보 */}
                <div className="pokemon-font text-gray-600 text-xs mt-1">
                  {getTimeAgo(notification.timestamp)}
                </div>
              </div>

              {/* 닫기 버튼 */}
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-500 hover:text-gray-800 transition-colors
                          text-xs flex-shrink-0 pokemon-font"
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
          <div className="pokemon-font text-gray-600 text-xs">
            {notifications.length}개의 최근 활동
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveFeedNotifications;