import React, { useState } from 'react';

const ChatModal = ({ isOpen, onClose, onSendMessage, remainingTime }) => {
  const [message, setMessage] = useState('');
  const maxLength = 50;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && message.length <= maxLength) {
      onSendMessage(message.trim());
      setMessage('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="pokemon-window max-w-md w-full mx-4">
        <div className="pokemon-dialog">
          <h3 className="pokemon-font text-xl font-bold mb-4 text-center">
            🗨️ 글로벌 메시지 전송
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="전 세계 시간낭비자들에게 메시지를 보내세요..."
                className="w-full p-3 border-2 border-gray-300 rounded-lg pokemon-font resize-none"
                rows={3}
                maxLength={maxLength}
                autoFocus
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {message.length}/{maxLength}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 pokemon-button bg-gray-300 text-gray-700"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!message.trim()}
                className="flex-1 pokemon-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                전송 🚀
              </button>
            </div>
          </form>
          
          {remainingTime > 0 && (
            <div className="mt-3 text-center text-xs text-gray-600 pokemon-font">
              다음 채팅 권한까지: {Math.ceil(remainingTime / 1000)}초
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatModal;