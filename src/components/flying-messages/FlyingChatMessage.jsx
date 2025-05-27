import React, { useState, useEffect, useRef } from 'react';

const FlyingChatMessage = ({ message, id, isMyMessage, onComplete }) => {
  const [position, setPosition] = useState(() => ({
    x: window.innerWidth + 200, 
    y: Math.random() * 200 + 50 // Y 위치를 상단으로 올림 (50~250px)
  }));
  
  const animationRef = useRef(null);
  const hasStarted = useRef(false);
  
  useEffect(() => {
    // 중복 실행 방지
    if (hasStarted.current) return;
    hasStarted.current = true;
    
    const startTime = Date.now();
    const duration = 10000; // 10초로 단축 (너무 오래 걸리면 안 보임)
    const startX = window.innerWidth + 200;
    const endX = -500; // 더 멀리 나가도록
    const initialY = position.y; // 초기 Y 위치 고정
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setPosition({
        x: startX + (endX - startX) * progress,
        y: initialY + Math.sin(progress * Math.PI * 3) * 15 // 물결 효과 강화
      });
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onComplete(id);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    // 정리 함수
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [id, onComplete]);

  return (
    <div 
      style={{ 
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: 'translateY(-50%)',
        zIndex: 9999, // 최고 우선순위
        pointerEvents: 'none'
      }}
    >
      {/* 포켓몬 골드 스타일 말풍선 */}
      <div 
        className="pokemon-font"
        style={{
          background: isMyMessage 
            ? 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)' // 내 메시지: 파란색
            : 'linear-gradient(135deg, #98FB98 0%, #32CD32 100%)', // 다른 사람: 초록색
          color: '#000000',
          border: '3px solid #000000',
          borderRadius: '20px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: 'bold',
          textShadow: '1px 1px 0px rgba(255, 255, 255, 0.8)',
          boxShadow: '3px 3px 0px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          maxWidth: '250px',
          minWidth: '80px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {/* 말풍선 꼬리 */}
        <div
          style={{
            position: 'absolute',
            bottom: '-10px',
            left: '20px',
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: isMyMessage 
              ? '10px solid #4682B4' 
              : '10px solid #32CD32',
            zIndex: -1
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-7px',
            left: '22px',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: isMyMessage 
              ? '8px solid #87CEEB' 
              : '8px solid #98FB98'
          }}
        />
        
        {/* 메시지 내용 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '16px' }}>
            {isMyMessage ? '😊' : '💭'}
          </span>
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
};

export default FlyingChatMessage;