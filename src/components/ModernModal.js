import React, { useEffect } from 'react';

// 세련된 모달 컴포넌트
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
    exit: '🚪'
  };

  const colorMap = {
    success: 'from-green-500 to-emerald-500',
    warning: 'from-yellow-500 to-orange-500',
    info: 'from-blue-500 to-cyan-500',
    exit: 'from-red-500 to-pink-500'
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose} // 바깥 클릭시 닫기
    >
      <div 
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭시 이벤트 전파 중단
      >
        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">{iconMap[type]}</div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        </div>
        
        {/* 메시지 */}
        <div className="text-center mb-6">
          <p className="text-white/90 text-base leading-relaxed">{message}</p>
        </div>
        
        {/* 버튼 */}
        <div className={`flex justify-center gap-3 ${showCancel ? 'flex-row' : ''}`}>
          {showCancel && (
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              취소
            </button>
          )}
          <button
            onClick={onConfirm || onClose}
            className={`px-6 py-3 bg-gradient-to-r ${colorMap[type]} text-white font-semibold rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg`}
          >
            {showCancel ? '확인' : '확인'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernModal;
