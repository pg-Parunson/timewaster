import React, { useState, useEffect } from 'react';

const FlyingChatMessage = ({ message, id, isMyMessage, onComplete }) => {
  const [position, setPosition] = useState({ 
    x: window.innerWidth + 200, 
    y: Math.random() * 300 + 150 
  });
  
  useEffect(() => {
    const startTime = Date.now();
    const duration = 12000; // 12초 동안 천천히 날아감
    const startX = window.innerWidth + 200;
    const endX = -400;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setPosition({
        x: startX + (endX - startX) * progress,
        y: position.y + Math.sin(progress * Math.PI * 4) * 10 // 부드러운 물결
      });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete(id);
      }
    };
    
    requestAnimationFrame(animate);
  }, [id, onComplete, position.y]);

  return (
    <div 
      className="fixed z-30 pointer-events-none"
      style={{ 
        left: position.x,
        top: position.y,
        transform: 'translateY(-50%)'
      }}
    >
      <div className={`pokemon-dialog px-4 py-2 rounded-lg shadow-md opacity-80 ${
        isMyMessage 
          ? 'bg-blue-50 border-blue-300' 
          : 'bg-green-50 border-green-300'
      }`}>
        <div className={`pokemon-font text-sm ${
          isMyMessage 
            ? 'text-blue-800' 
            : 'text-green-800'
        }`}>
          {isMyMessage ? '😊' : '💭'} {message}
        </div>
      </div>
    </div>
  );
};

export default FlyingChatMessage;