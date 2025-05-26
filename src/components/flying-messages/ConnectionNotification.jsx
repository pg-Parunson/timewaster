import React, { useEffect } from 'react';

const ConnectionNotification = ({ user, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible || !user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right">
      <div className="pokemon-dialog bg-blue-50 border-blue-300 p-4 rounded-lg shadow-lg max-w-64">
        <div className="pokemon-font text-sm text-blue-800">
          🎮 새로운 시간낭비자 등장!
        </div>
        <div className="pokemon-font text-xs text-blue-600 mt-1">
          총 {user.totalUsers}명이 함께 시간을 낭비중...
        </div>
      </div>
    </div>
  );
};

export default ConnectionNotification;