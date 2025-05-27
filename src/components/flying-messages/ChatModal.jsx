import React, { useState } from 'react';

const ChatModal = ({ isOpen, onClose, onSendMessage, remainingTime, canChat, chatTokens, premiumTokens, onAdClick, canGetTokenFromAd }) => {
  const [message, setMessage] = useState('');
  const maxLength = 50;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📝 폼 제출 시도:', { message: message.trim(), canChat, maxLength });
    
    if (message.trim() && message.length <= maxLength) {
      console.log('✅ 전송 조건 충족 - onSendMessage 호출');
      onSendMessage(message.trim());
      setMessage('');
      onClose();
    } else {
      console.warn('⚠️ 전송 조건 불충족:', { 
        isEmpty: !message.trim(), 
        tooLong: message.length > maxLength 
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="pokemon-window max-w-md w-full mx-4">
        <div className="pokemon-dialog">
          <h3 className="pokemon-font text-xl font-bold mb-2 text-center">
            🗨️ 글로벌 메시지 전송 
            <span className="text-sm font-normal text-gray-600">
              (일반:{chatTokens}개 프리미엄:{premiumTokens}개)
            </span>
          </h3>
          
          {!canChat && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
              <div className="pokemon-font text-sm text-yellow-800 text-center mb-3">
                ⚠️ 채팅 권한이 없습니다!<br/>
                <span className="font-bold">광고를 클릭해서 프리미엄 채팅 권한을 획득하세요!</span><br/>
                <span className="text-xs">프리미엄 메시지는 화려하게 빛나요! ✨</span>
              </div>
              
              {/* 광고 버튼 */}
              <button
                onClick={() => {
                  onAdClick();
                  if (canGetTokenFromAd) {
                    // 성공 시 채팅 권한 표시 업데이트
                  }
                }}
                disabled={!canGetTokenFromAd}
                className={`w-full pokemon-button text-sm py-2 ${
                  canGetTokenFromAd 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {canGetTokenFromAd 
                  ? '🎆 광고 보고 프리미엄 채팅권한 획득!' 
                  : `⏰ 광고 쿨다운: ${Math.ceil(remainingTime / 1000)}초`
                }
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={canChat 
                  ? (premiumTokens > 0 
                      ? "🎆 프리미엄 메시지로 화려하게 빛나는 메시지를 보내세요!" 
                      : "💬 일반 메시지로 간단한 메시지를 보내세요...") 
                  : "채팅 권한이 없습니다. 광고를 클릭해 권한을 획득하세요."
                }
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
                {canChat ? '전송 🚀' : '채팅 권한 없음 ❌'}
              </button>
            </div>
          </form>
          
          {remainingTime > 0 && (
            <div className="mt-3 text-center text-xs text-gray-600 pokemon-font">
              다음 광고 클릭 가능까지: {Math.ceil(remainingTime / 1000)}초
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatModal;