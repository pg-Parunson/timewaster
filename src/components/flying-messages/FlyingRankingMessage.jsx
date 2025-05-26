import React, { useState, useEffect } from 'react';

const FlyingRankingMessage = ({ message, id, onComplete }) => {
  const [position, setPosition] = useState({ x: -300, y: Math.random() * 400 + 100 });
  
  useEffect(() => {
    const startTime = Date.now();
    const duration = 8000; // 8초 동안 날아감
    const startX = -300;
    const endX = window.innerWidth + 300;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutCubic 애니메이션
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      setPosition({
        x: startX + (endX - startX) * easeProgress,
        y: position.y + Math.sin(progress * Math.PI * 2) * 20 // 물결 효과
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
      className="fixed z-40 pointer-events-none"
      style={{ 
        left: position.x,
        top: position.y,
        transform: 'translateY(-50%)'
      }}
    >
      <div className="pokemon-dialog bg-yellow-50 border-yellow-300 px-6 py-3 rounded-full shadow-lg">
        <div className="pokemon-font text-lg font-bold text-yellow-800">
          🏆 {message}
        </div>
      </div>
    </div>
  );
};

export default FlyingRankingMessage;