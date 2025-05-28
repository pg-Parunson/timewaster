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

  // 🎯 더 간단하고 확실한 궤도 설정
  const [trajectory, setTrajectory] = useState(() => {
    const { width, height } = getWindowDimensions();
    
    // 화면 중앙 영역에서 시작해서 확실히 보이게 만들기
    const safeZone = {
      minX: 100,
      maxX: width - 100,
      minY: 100,
      maxY: height - 200
    };
    
    const trajectories = [
      // 1. 왼쪽에서 오른쪽으로 - 화면 안에서 시작
      {
        startX: safeZone.minX,
        endX: safeZone.maxX,
        startY: Math.random() * (safeZone.maxY - safeZone.minY) + safeZone.minY,
        endY: Math.random() * (safeZone.maxY - safeZone.minY) + safeZone.minY,
        direction: 'left-to-right'
      },
      // 2. 오른쪽에서 왼쪽으로 - 화면 안에서 시작
      {
        startX: safeZone.maxX,
        endX: safeZone.minX,
        startY: Math.random() * (safeZone.maxY - safeZone.minY) + safeZone.minY,
        endY: Math.random() * (safeZone.maxY - safeZone.minY) + safeZone.minY,
        direction: 'right-to-left'
      },
      // 3. 위에서 아래로 - 화면 안에서 시작
      {
        startX: Math.random() * (safeZone.maxX - safeZone.minX) + safeZone.minX,
        endX: Math.random() * (safeZone.maxX - safeZone.minX) + safeZone.minX,
        startY: safeZone.minY,
        endY: safeZone.maxY,
        direction: 'top-to-bottom'
      },
      // 4. 아래에서 위로 - 화면 안에서 시작
      {
        startX: Math.random() * (safeZone.maxX - safeZone.minX) + safeZone.minX,
        endX: Math.random() * (safeZone.maxX - safeZone.minX) + safeZone.minX,
        startY: safeZone.maxY,
        endY: safeZone.minY,
        direction: 'bottom-to-top'
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
  const hasStarted = useRef(false);
  
  useEffect(() => {
    // 중복 실행 방지
    if (hasStarted.current) return;
    hasStarted.current = true;
    
    console.log('🚀 메시지 애니메이션 시작:', { 
      id, 
      message: message.substring(0, 20) + '...', 
      trajectory,
      startPos: { x: trajectory.startX, y: trajectory.startY },
      endPos: { x: trajectory.endX, y: trajectory.endY }
    });
    
    const startTime = Date.now();
    const duration = 6000; // 6초로 단축 (더 빠르게)
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 🎯 단순한 선형 이동
      const newX = trajectory.startX + (trajectory.endX - trajectory.startX) * progress;
      const newY = trajectory.startY + (trajectory.endY - trajectory.startY) * progress;
      
      // 약간의 파동 효과 추가 (선택적)
      const waveOffset = Math.sin(progress * Math.PI * 2) * 20;
      const finalY = newY + waveOffset;
      
      setPosition({ x: newX, y: finalY });
      
      // 자주 로그 출력 (개발 환경에서만)
      if (import.meta.env.DEV && elapsed % 500 < 50) { // 0.5초마다
        console.log(`📍 메시지 위치 ${id}:`, { 
          progress: Math.floor(progress * 100), 
          x: Math.floor(newX), 
          y: Math.floor(finalY),
          visible: isVisible
        });
      }
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        console.log('✅ 메시지 애니메이션 완료:', id);
        setIsVisible(false);
        setTimeout(() => onComplete(id), 100);
      }
    };
    
    // 🔥 브라우저 호환성 체크 & 폴백
    if (typeof requestAnimationFrame === 'undefined') {
      console.error('❌ requestAnimationFrame 미지원 - setInterval 폴백 사용');
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const newX = trajectory.startX + (trajectory.endX - trajectory.startX) * progress;
        const newY = trajectory.startY + (trajectory.endY - trajectory.startY) * progress;
        const waveOffset = Math.sin(progress * Math.PI * 2) * 20;
        
        setPosition({ x: newX, y: newY + waveOffset });
        
        if (progress >= 1) {
          clearInterval(interval);
          setIsVisible(false);
          setTimeout(() => onComplete(id), 100);
        }
      }, 32); // ~30fps (낮은 성능 환경 고려)
      
      return () => clearInterval(interval);
    }
    
    // 🚀 즉시 시작 (지연 없음)
    animationRef.current = requestAnimationFrame(animate);
    
    // 정리 함수
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [id, onComplete, trajectory, isVisible]);

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
        pointerEvents: 'none',
        // 🔍 디버그용 배경 (개발 환경에서만)
        ...(import.meta.env.DEV && {
          border: '2px dashed red',
          backgroundColor: 'rgba(255, 0, 0, 0.1)'
        })
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
        
        {/* 🔍 디버그 정보 표시 (개발 환경에서만) */}
        {import.meta.env.DEV && (
          <div style={{
            position: 'absolute',
            top: '-20px',
            left: '0',
            fontSize: '10px',
            color: 'red',
            backgroundColor: 'white',
            padding: '2px 4px',
            borderRadius: '2px',
            border: '1px solid red'
          }}>
            ID: {id}
          </div>
        )}
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

if (!document.head.querySelector('[data-flying-message-styles]')) {
  style.setAttribute('data-flying-message-styles', 'true');
  document.head.appendChild(style);
}

export default FlyingChatMessage;