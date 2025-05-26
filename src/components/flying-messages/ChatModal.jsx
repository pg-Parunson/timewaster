import React, { useState } from 'react';

const ChatModal = ({ isOpen, onClose, onSendMessage, remainingTime, canChat }) => {
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
          <h3 className="pokemon-font text-xl font-bold mb-2 text-center">
            🗨️ 글로벌 메시지 전송 <span className="text-sm font-normal text-gray-600">(메시지 {canChat ? '1개' : '0개'} 사용가능)</span>
          </h3>
          
          {!canChat && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
              <div className="pokemon-font text-sm text-yellow-800 text-center">
                ⚠️ 메시지 전송 권한이 없습니다<br/>
                <span className="font-bold">사이트에서 1분 체류 시 권한이 주어집니다!</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={canChat ? "전 세계 시간낭비자들에게 메시지를 보내세요..." : "1분 체류 후 메시지 전송이 가능합니다."}
                className={`w-full p-3 border-2 rounded-lg pokemon-font resize-none ${
                  canChat ? 'border-gray-300' : 'border-gray-200 bg-gray-100 cursor-not-allowed'
                }`}
                rows={3}
                maxLength={maxLength}
                autoFocus={canChat}
                disabled={!canChat}
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
                disabled={!message.trim() || !canChat}
                className={`flex-1 pokemon-button ${
                  (!message.trim() || !canChat) ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-600' : ''
                }`}
              >
                {canChat ? '전송 🚀' : '전송 불가 ❌'}
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