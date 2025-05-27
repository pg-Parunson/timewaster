import React, { useState, useEffect, useRef } from 'react';

const FlyingChatMessage = ({ message, id, isMyMessage, onComplete }) => {
  // 다양한 시작 위치와 이동 방향 설정
  const [trajectory, setTrajectory] = useState(() => {
    const trajectories = [
      // 1. 왼쪽에서 오른쪽으로
      {
        startX: -200,
        endX: window.innerWidth + 200,
        y: Math.random() * 300 + 100, // 100~400px
        direction: 'left-to-right'
      },
      // 2. 오른쪽에서 왼쪽으로
      {
        startX: window.innerWidth + 200,
        endX: -200,
        y: Math.random() * 300 + 100,
        direction: 'right-to-left'
      },
      // 3. 위에서 아래로 (대각선)
      {
        startX: Math.random() * (window.innerWidth - 400) + 200,
        endX: Math.random() * (window.innerWidth - 400) + 200,
        startY: -100,
        endY: window.innerHeight + 100,
        y: null, // 동적 바뀐
        direction: 'top-to-bottom'
      },
      // 4. 아래에서 위로 (대각선)
      {
        startX: Math.random() * (window.innerWidth - 400) + 200,
        endX: Math.random() * (window.innerWidth - 400) + 200,
        startY: window.innerHeight + 100,
        endY: -100,
        y: null,
        direction: 'bottom-to-top'
      }
    ];
    
    return trajectories[Math.floor(Math.random() * trajectories.length)];
  });
  
  const [position, setPosition] = useState(() => ({
    x: trajectory.startX,
    y: trajectory.y || trajectory.startY
  }));
  
  const [isVisible, setIsVisible] = useState(true);
  const animationRef = useRef(null);
  const hasStarted = useRef(false);
  
  useEffect(() => {
    // 중복 실행 방지
    if (hasStarted.current) return;
    hasStarted.current = true;
    
    console.log('🎬 날아가는 메시지 애니메이션 시작:', { message, id, isMyMessage, trajectory });
    
    const startTime = Date.now();
    const duration = 8000; // 8초
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      let newX, newY;
      
      // 방향에 따른 위치 계산
      if (trajectory.direction === 'left-to-right' || trajectory.direction === 'right-to-left') {
        // 수평 이동
        newX = trajectory.startX + (trajectory.endX - trajectory.startX) * progress;
        newY = trajectory.y + Math.sin(progress * Math.PI * 2) * 30; // 물결 효과
      } else {
        // 수직 이동 (대각선)
        newX = trajectory.startX + (trajectory.endX - trajectory.startX) * progress;
        newY = trajectory.startY + (trajectory.endY - trajectory.startY) * progress;
        
        // 좌우 흔들림 추가
        newX += Math.sin(progress * Math.PI * 3) * 50;
      }
      
      setPosition({ x: newX, y: newY });
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        console.log('✅ 메시지 애니메이션 완료:', id);
        setIsVisible(false);
        setTimeout(() => onComplete(id), 100);
      }
    };
    
    // 약간의 지연 후 시작 (렌더링 완료 대기)
    setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate);
    }, 100);
    
    // 정리 함수
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [id, onComplete, message, isMyMessage, trajectory]);

  // 보이지 않으면 렌더링하지 않음
  if (!isVisible) return null;

  return (
    <div 
      style={{ 
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)', // 중앙 정렬
        zIndex: 99999, // 최고 우선순위
        pointerEvents: 'none'
      }}
    >
      {/* 강조된 포켓몬 골드 스타일 말풍선 */}
      <div 
        className="pokemon-font"
        style={{
          background: isMyMessage 
            ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' // 내 메시지: 골드
            : 'linear-gradient(135deg, #98FB98 0%, #32CD32 100%)', // 다른 사람: 초록색
          color: '#000000',
          border: '4px solid #000000', // 두꺼운 테두리
          borderRadius: '20px',
          padding: '12px 20px', // 더 큰 패딩
          fontSize: '16px', // 더 큰 폰트
          fontWeight: 'bold',
          textShadow: '2px 2px 0px rgba(255, 255, 255, 0.9)',
          boxShadow: [
            '4px 4px 0px rgba(0, 0, 0, 0.5)',
            'inset 2px 2px 0px rgba(255, 255, 255, 0.3)',
            '0 0 20px rgba(255, 215, 0, 0.6)' // 황금 빛
          ].join(', '),
          position: 'relative',
          maxWidth: '400px', // 최대 너비 증가
          minWidth: 'auto', // 최소 너비 자동 (내용에 따라)
          width: 'fit-content', // 내용에 맞춤
          whiteSpace: 'pre-wrap', // 줄바꿈 허용
          wordWrap: 'break-word', // 긴 단어 줄바꿈
          overflow: 'visible', // 오버플로우 표시
          textOverflow: 'clip', // 말줄임표 제거
          // 강조 효과
          animation: 'glow 2s ease-in-out infinite alternate'
        }}
      >
        {/* 말풍선 꼬리 */}
        <div
          style={{
            position: 'absolute',
            bottom: '-12px',
            left: '30px',
            width: 0,
            height: 0,
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: isMyMessage 
              ? '12px solid #FFA500' 
              : '12px solid #32CD32',
            zIndex: -1
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-8px',
            left: '32px',
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: isMyMessage 
              ? '10px solid #FFD700' 
              : '10px solid #98FB98'
          }}
        />
        
        {/* 메시지 내용 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '20px' }}>
            {isMyMessage ? '😊' : '💭'}
          </span>
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
};

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
  @keyframes glow {
    from { box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.5), inset 2px 2px 0px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 215, 0, 0.6); }
    to { box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.5), inset 2px 2px 0px rgba(255, 255, 255, 0.3), 0 0 30px rgba(255, 215, 0, 0.8); }
  }
`;
if (!document.head.querySelector('[data-flying-message-styles]')) {
  style.setAttribute('data-flying-message-styles', 'true');
  document.head.appendChild(style);
}

export default FlyingChatMessage;