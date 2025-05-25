import React from 'react';
import { generateTestNotifications } from '../services/liveFeedService';

const DevTools = ({ isVisible }) => {
  if (!isVisible) return null;

  const handleGenerateTestNotifications = () => {
    generateTestNotifications();
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/80 backdrop-blur-md 
                    border border-white/20 rounded-lg p-4 text-white text-sm">
      <h3 className="font-bold mb-2">🛠️ 개발자 도구</h3>
      <button
        onClick={handleGenerateTestNotifications}
        className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-xs
                   transition-colors duration-200"
      >
        테스트 알림 생성
      </button>
    </div>
  );
};

export default DevTools;