import React, { useEffect } from 'react';

// 🎮 포켓몬 스타일 모달 컴포넌트 - 레트로 게임 느낌
const ModernModal = ({ isOpen, onClose, onConfirm, title, message, type = 'info', showCancel = false }) => {
  // ESC 키 이벤트 처리
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc, false);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc, false);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const iconMap = {
    success: '🎉',
    warning: '⚠️',
    info: 'ℹ️',
    exit: '🚨'
  };

  // 🎮 포켓몬 스타일 배경 색상 설정
  const backgroundMap = {
    success: 'var(--pokemon-gold)',
    warning: '#FF6B35',
    info: '#2196F3',
    exit: '#FF4444'
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="pokemon-celebration animate-bounce-in">
        {/* 🎮 포켓몬 스타일 헤더 */}
        <div className="text-center mb-6">
          <div 
            className="inline-block p-4 rounded-full mb-4"
            style={{
              background: `linear-gradient(135deg, ${backgroundMap[type]}, ${backgroundMap[type]}CC)`,
              border: '4px solid var(--pokemon-black)',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.4)'
            }}
          >
            <div className="text-4xl">{iconMap[type]}</div>
          </div>
          <h3 className="pokemon-font text-2xl font-bold text-black mb-2">{title}</h3>
        </div>
        
        {/* 💬 메시지 영역 - 포켓몬 대화창 스타일 */}
        <div className="text-center mb-8">
          <div className="bg-white/90 border-4 border-black rounded-lg p-4 mb-4">
            <p className="pokemon-font text-lg text-black leading-relaxed font-bold">{message}</p>
          </div>
        </div>
        
        {/* 🎮 포켓몬 스타일 버튼 */}
        <div className={`flex justify-center gap-4 ${showCancel ? 'flex-row' : ''}`}>
          {showCancel && (
            <button
              onClick={onClose}
              className="pokemon-button bg-gray-400 hover:bg-gray-500 text-black font-bold px-8 py-3 transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #9E9E9E 0%, #757575 100%)',
                minHeight: '50px'
              }}
            >
              취소
            </button>
          )}
          <button
            onClick={onConfirm || onClose}
            className="pokemon-button text-black font-bold px-8 py-3 transition-all duration-200"
            style={{
              background: `linear-gradient(135deg, ${backgroundMap[type]}, ${backgroundMap[type]}DD)`,
              minHeight: '50px'
            }}
          >
            {showCancel ? '확인' : '확인'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernModal;