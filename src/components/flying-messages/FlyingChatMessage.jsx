import React, { useState, useEffect, useRef } from 'react';

const FlyingChatMessage = ({ message, id, isMyMessage, messageType = 'basic', onComplete }) => {
  // 🔧 안전한 윈도우 크기 확인 함수
  const getWindowDimensions = () => {
    if (typeof window === 'undefined') {
      return { width: 1920, height: 1080 };
    }
    return { 
      width: window.innerWidth || 1920, 
      height: window.innerHeight || 1080 
    };
  };

  // 🎯 더 안전하고 다양한 궤도 설정
  const [trajectory, setTrajectory] = useState(() => {
    const { width, height } = getWindowDimensions();
    
    // 화면이 너무 작은 경우 기본값 사용
    const safeWidth = Math.max(width, 800);
    const safeHeight = Math.max(height, 600);
    
    const trajectories = [
      // 1. 왼쪽에서 오른쪽으로 (가로 직선) - 상단
      {
        startX: -100, // 화면 밖에서 시작
        endX: safeWidth + 100, // 화면 밖으로 종료
        startY: 150,
        endY: 150,
        direction: 'horizontal-top'
      },
      // 2. 오른쪽에서 왼쪽으로 (가로 직선) - 중단
      {
        startX: safeWidth + 100,
        endX: -100,
        startY: 250,
        endY: 250,
        direction: 'horizontal-reverse'
      },
      // 3. 왼쪽에서 오른쪽으로 (가로 직선) - 하단
      {
        startX: -100,
        endX: safeWidth + 100,
        startY: 350,
        endY: 350,
        direction: 'horizontal-bottom'
      },
      // 4. 위에서 아래로 (세로 직선) - 왼쪽
      {
        startX: 200,
        endX: 200,
        startY: -50,
        endY: safeHeight + 50,
        direction: 'vertical-left'
      },
      // 5. 위에서 아래로 (세로 직선) - 오른쪽
      {
        startX: safeWidth - 200,
        endX: safeWidth - 200,
        startY: -50,
        endY: safeHeight + 50,
        direction: 'vertical-right'
      },
      // 6. 아래에서 위로 (세로 직선) - 중앙
      {
        startX: safeWidth / 2,
        endX: safeWidth / 2,
        startY: safeHeight + 50,
        endY: -50,
        direction: 'vertical-up'
      },
      // 🎯 7. 대각선 이동 - 왼쪽 위에서 오른쪽 아래로
      {
        startX: -100,
        endX: safeWidth + 100,
        startY: 100,
        endY: safeHeight - 100,
        direction: 'diagonal-down-right'
      },
      // 🎯 8. 대각선 이동 - 오른쪽 위에서 왼쪽 아래로
      {
        startX: safeWidth + 100,
        endX: -100,
        startY: 100,
        endY: safeHeight - 100,
        direction: 'diagonal-down-left'
      },
      // 🎯 9. 대각선 이동 - 왼쪽 아래에서 오른쪽 위로
      {
        startX: -100,
        endX: safeWidth + 100,
        startY: safeHeight - 100,
        endY: 100,
        direction: 'diagonal-up-right'
      },
      // 🎯 10. 대각선 이동 - 오른쪽 아래에서 왼쪽 위로
      {
        startX: safeWidth + 100,
        endX: -100,
        startY: safeHeight - 100,
        endY: 100,
        direction: 'diagonal-up-left'
      }
    ];
    
    return trajectories[Math.floor(Math.random() * trajectories.length)];
  });
  
  const [position, setPosition] = useState(() => ({
    x: trajectory.startX,
    y: trajectory.startY
  }));
  
  const [isVisible, setIsVisible] = useState(true);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  
  // 🔥 핵심: 깔끔한 애니메이션 로직
  useEffect(() => {
    startTimeRef.current = Date.now();
    
    const duration = 5000; // 5초 동안 이동
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // 🎯 선형 이동 계산
      const newX = trajectory.startX + (trajectory.endX - trajectory.startX) * progress;
      const newY = trajectory.startY + (trajectory.endY - trajectory.startY) * progress;
      
      setPosition({ x: newX, y: newY });
      
      // 🔄 애니메이션 계속 진행 또는 완료
      if (progress < 1 && isVisible) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // 애니메이션 완료
        setIsVisible(false);
        setTimeout(() => {
          if (onComplete) {
            onComplete(id);
          }
        }, 200);
      }
    };
    
    // 🔥 브라우저 호환성 체크 & 폴백
    if (typeof requestAnimationFrame === 'undefined') {
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        
        const newX = trajectory.startX + (trajectory.endX - trajectory.startX) * progress;
        const newY = trajectory.startY + (trajectory.endY - trajectory.startY) * progress;
        
        setPosition({ x: newX, y: newY });
        
        if (progress >= 1) {
          clearInterval(interval);
          setIsVisible(false);
          setTimeout(() => onComplete && onComplete(id), 200);
        }
      }, 16); // ~60fps
      
      return () => clearInterval(interval);
    }
    
    // 🚀 애니메이션 시작
    animationRef.current = requestAnimationFrame(animate);
    
    // 🛡️ 안전장치: 최대 실행 시간 제한 (7초)
    const safetyTimeout = setTimeout(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      setIsVisible(false);
      setTimeout(() => onComplete && onComplete(id), 100);
    }, 7000);
    
    // 정리 함수
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      clearTimeout(safetyTimeout);
    };
  }, [id]);

  // 🎯 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // 보이지 않으면 렌더링하지 않음
  if (!isVisible) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        zIndex: 99999,
        pointerEvents: 'none'
      }}
    >
      {/* 메시지 타입에 따른 다른 스타일 */}
      <div 
        className="pokemon-font"
        style={{
          // 메시지 타입에 따른 배경 설정
          background: messageType === 'premium'
            ? (isMyMessage 
                ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' // 내 프리미엄: 골드
                : 'linear-gradient(135deg, #98FB98 0%, #32CD32 100%)') // 다른 사람 프리미엄: 초록
            : 'rgba(255, 255, 255, 0.9)', // 일반 메시지: 더 진한 배경
          
          color: messageType === 'premium' ? '#000000' : '#333333',
          
          border: messageType === 'premium' 
            ? '4px solid #000000'
            : '2px solid rgba(100, 100, 100, 0.5)', // 더 진한 테두리
          
          borderRadius: '20px',
          padding: messageType === 'premium' ? '12px 20px' : '10px 15px',
          fontSize: messageType === 'premium' ? '16px' : '14px',
          fontWeight: messageType === 'premium' ? 'bold' : 'normal',
          
          textShadow: messageType === 'premium' 
            ? '2px 2px 0px rgba(255, 255, 255, 0.9)'
            : '1px 1px 0px rgba(255, 255, 255, 0.8)',
          
          boxShadow: messageType === 'premium' 
            ? [
                '4px 4px 0px rgba(0, 0, 0, 0.5)',
                'inset 2px 2px 0px rgba(255, 255, 255, 0.3)',
                '0 0 20px rgba(255, 215, 0, 0.6)'
              ].join(', ')
            : '2px 2px 8px rgba(0, 0, 0, 0.3)',
          
          position: 'relative',
          maxWidth: '350px',
          width: 'fit-content',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          
          // 애니메이션: 프리미엄만 반짝반짝
          animation: messageType === 'premium' 
            ? 'glow 2s ease-in-out infinite alternate' 
            : 'none'
        }}
      >
        {/* 말풍선 꼬리 - 프리미엄만 표시 */}
        {messageType === 'premium' && (
          <>
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
          </>
        )}
        
        {/* 메시지 내용 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: messageType === 'premium' ? '8px' : '6px' 
        }}>
          <span style={{ fontSize: messageType === 'premium' ? '20px' : '16px' }}>
            {messageType === 'premium' 
              ? (isMyMessage ? '😊' : '💭')
              : (isMyMessage ? '😐' : '💬')
            }
          </span>
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
};

// CSS 애니메이션 추가 - 프리미엄만 반짝이는 효과
const style = document.createElement('style');
style.textContent = `
  @keyframes glow {
    from { 
      box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.5), 
                  inset 2px 2px 0px rgba(255, 255, 255, 0.3), 
                  0 0 20px rgba(255, 215, 0, 0.6); 
    }
    to { 
      box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.5), 
                  inset 2px 2px 0px rgba(255, 255, 255, 0.3), 
                  0 0 30px rgba(255, 215, 0, 0.8); 
    }
  }
`;

if (!document.head.querySelector('[data-flying-message-styles]') && document.head) {
  style.setAttribute('data-flying-message-styles', 'true');
  document.head.appendChild(style);
}

export default FlyingChatMessage;