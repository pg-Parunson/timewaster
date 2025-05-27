// 🎉 압도적인 포켓몬 골드 스타일 축하 이펙트 컴포넌트
// 각 요소 독립 제어로 깜빡임 문제 해결

import React, { useState, useEffect, useRef } from 'react';

const EpicPokemonCelebrationEffect = ({ isActive, celebration, onComplete }) => {
  // celebration null 체크로 크래시 방지
  if (!celebration) {
    return null;
  }

  // 각 요소 독립적 상태 관리
  const [showBackground, setShowBackground] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  
  const [particles, setParticles] = useState([]);
  const [phase, setPhase] = useState(0); // 0: 준비, 1: 폭발, 2: 메시지 등장, 3: 메시지 안정
  
  const timeoutRefs = useRef([]);
  
  // 모든 타이머 정리
  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = [];
  };
  
  useEffect(() => {
    if (!isActive || !celebration) return;
    
    clearAllTimeouts();
    
    // 압도적인 파티클 생성 (30개!)
    const epicEmojis = ['⭐', '✨', '🎉', '🎊', '💫', '🌟', '💥', '🔥', '🎆', '🎇', '💎', '👑', '🏆', '🎖️', '🥇'];
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100, 
      emoji: epicEmojis[i % epicEmojis.length],
      delay: i * 0.05,
      duration: 4 + Math.random() * 2,
      size: 0.8 + Math.random() * 0.4
    }));
    setParticles(newParticles);
    
    // 🎯 새로운 타이밍 설계
    // 0.0초: 배경, 파티클 시작
    setShowBackground(true);
    setShowParticles(true);
    setPhase(1);
    
    // 0.8초: 메시지 카드 등장 (entrance 애니메이션)
    timeoutRefs.current.push(setTimeout(() => {
      setShowMessage(true);
      setPhase(2);
    }, 800));
    
    // 2.0초: 메시지 안정화 (애니메이션 멈춤)
    timeoutRefs.current.push(setTimeout(() => {
      setPhase(3); // 애니메이션 없는 안정 상태
    }, 2000));
    
    // 5.0초: 배경, 파티클만 제거 (메시지는 유지)
    timeoutRefs.current.push(setTimeout(() => {
      setShowBackground(false);
      setShowParticles(false);
    }, 5000));
    
    // 8.0초: 메시지 카드 제거 및 완료
    timeoutRefs.current.push(setTimeout(() => {
      setShowMessage(false);
      timeoutRefs.current.push(setTimeout(() => {
        if (onComplete) onComplete();
      }, 500)); // 부드러운 페이드아웃 후 완료
    }, 8000));
    
    return clearAllTimeouts;
  }, [isActive, celebration, onComplete]);

  // ESC 키로 즉시 종료
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && (showBackground || showParticles || showMessage)) {
        clearAllTimeouts();
        setShowBackground(false);
        setShowParticles(false);
        setShowMessage(false);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 100);
      }
    };
    
    if (isActive) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isActive, showBackground, showParticles, showMessage, onComplete]);

  // CSS 스타일 객체들
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 99999,
      pointerEvents: showMessage ? 'auto' : 'none',
      overflow: 'hidden',
      fontFamily: "'Galmuri11', 'Galmuri9', monospace"
    },
    flashBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: phase === 1 
        ? 'radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, rgba(255, 107, 53, 0.1) 100%)'
        : phase === 2
        ? 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, rgba(255, 107, 53, 0.05) 100%)'
        : 'radial-gradient(circle, rgba(255, 215, 0, 0.05) 0%, rgba(255, 107, 53, 0.02) 100%)',
      transition: 'background 0.5s ease-in-out, opacity 0.5s ease-in-out',
      opacity: showBackground ? 1 : 0,
      pointerEvents: 'none'
    },
    messageContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'auto',
      zIndex: 100000,
      opacity: showMessage ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out',
      // 애니메이션을 단계별로 적용
      animation: phase === 2 
        ? 'epicMessageEntrance 1s ease-out' 
        : 'none' // phase 3부터는 애니메이션 없음
    },
    messageBox: {
      background: 'linear-gradient(135deg, #FFD700 0%, #FF6B35 50%, #FFD700 100%)',
      color: '#000000',
      border: '6px solid #000000',
      borderRadius: '20px',
      padding: '40px 60px',
      fontSize: '28px',
      fontWeight: 'bold',
      textAlign: 'center',
      maxWidth: '80vw',
      minWidth: '400px',
      textShadow: '2px 2px 0px rgba(255, 255, 255, 0.8)',
      lineHeight: '1.4',
      boxShadow: `
        4px 4px 0px rgba(0, 0, 0, 0.4),
        inset 2px 2px 0px rgba(255, 255, 255, 0.3),
        0 0 25px rgba(255, 215, 0, 0.7)
      `,
      cursor: 'pointer',
      position: 'relative'
    },
    title: {
      fontSize: '36px',
      marginBottom: '16px',
      display: 'block',
      textShadow: '3px 3px 0px rgba(255, 255, 255, 0.9)'
    },
    message: {
      fontSize: '22px',
      color: '#003366',
      fontWeight: 'bold'
    },
    closeHint: {
      fontSize: '14px',
      color: '#666',
      marginTop: '16px',
      opacity: 0.8
    },
    particle: {
      position: 'absolute',
      fontSize: '32px',
      pointerEvents: 'none',
      zIndex: 99998,
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
      opacity: showParticles ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out',
      animation: 'epicParticleExplosion 5s ease-out forwards'
    }
  };

  useEffect(() => {
    // CSS 애니메이션을 동적으로 추가 - heartbeat 제거!
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerHTML = `
      @keyframes epicMessageEntrance {
        0% { 
          transform: translate(-50%, -50%) scale(0.3) rotate(-15deg);
        }
        50% { 
          transform: translate(-50%, -50%) scale(1.2) rotate(5deg);
        }
        100% { 
          transform: translate(-50%, -50%) scale(1) rotate(0deg);
        }
      }
      
      @keyframes epicParticleExplosion {
        0% { 
          transform: translateY(0px) scale(0.2) rotate(0deg);
        }
        10% { 
          transform: translateY(-20px) scale(0.6) rotate(90deg);
        }
        50% { 
          transform: translateY(-80px) scale(1.2) rotate(270deg);
        }
        100% { 
          transform: translateY(-150px) scale(1.5) rotate(720deg);
        }
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []);

  // 메시지 카드 클릭으로 즉시 종료
  const handleMessageClick = () => {
    clearAllTimeouts();
    setShowBackground(false);
    setShowParticles(false);
    setShowMessage(false);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 100);
  };
  
  // 어떤 요소라도 보여야 할 때만 렌더링
  if (!showBackground && !showParticles && !showMessage) {
    return null;
  }
  
  return (
    <div style={styles.overlay}>
      {/* 화면 전체 플래시 - showBackground로 독립 제어 */}
      <div style={styles.flashBg} />
      
      {/* 압도적인 메시지 - showMessage로 독립 제어 */}
      <div style={styles.messageContainer}>
        <div style={styles.messageBox} onClick={handleMessageClick}>
          <div style={styles.title}>
            🎉 대단합니다! 🎉
          </div>
          <div style={styles.message}>
            {celebration?.message || '축하합니다!'}
          </div>
          {phase >= 3 && (
            <div style={styles.closeHint}>
              💡 클릭하거나 ESC를 눌러 닫기
            </div>
          )}
        </div>
      </div>
      
      {/* 압도적인 파티클 폭발 효과 - showParticles로 독립 제어, opacity 깜빡임 제거! */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            ...styles.particle,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            fontSize: particle.size > 1.1 ? '48px' : particle.size > 0.9 ? '40px' : '28px'
          }}
        >
          {particle.emoji}
        </div>
      ))}
    </div>
  );
};

export default EpicPokemonCelebrationEffect;