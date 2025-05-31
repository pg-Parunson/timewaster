import React, { useState } from 'react';

const ChatModal = ({ isOpen, onClose, onSendMessage, remainingTime, canChat, chatTokens, premiumTokens, onAdClick, canGetTokenFromAd, elapsedTime }) => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('auto'); // 'auto', 'basic', 'premium'
  const maxLength = 50;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim() && message.length <= maxLength) {
      // 🎯 사용자가 선택한 메시지 타입 전달
      onSendMessage(message.trim(), messageType);
      setMessage('');
      onClose();
    } else {
      // 운영 환경에서는 에러 로그만 표시
      if (import.meta.env.DEV) {
        console.warn('⚠️ 전송 조건 불충족:', { 
          isEmpty: !message.trim(), 
          tooLong: message.length > maxLength 
        });
      }
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
          
          {/* 권한 없을 때 경고 메시지 */}
          {!canChat && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
              <div className="pokemon-font text-sm text-yellow-800 text-center mb-3">
                ⚠️ 채팅 권한이 없습니다!<br/>
                {elapsedTime < 60 ? (
                  <>
                    <span className="font-bold text-red-600">1분 후에 광고를 보고 프리미엄 채팅 권한을 획득할 수 있어요!</span><br/>
                    <span className="text-xs">남은 시간: {60 - elapsedTime}초</span>
                  </>
                ) : (
                  <>
                    <span className="font-bold">광고를 클릭해서 프리미엄 채팅 권한을 획득하세요!</span><br/>
                    <span className="text-xs">프리미엄 메시지는 화려하게 빛나요! ✨</span>
                  </>
                )}
              </div>
              
              {/* 광고 버튼 */}
              <button
                onClick={() => {
                  onAdClick();
                }}
                disabled={elapsedTime < 60 || !canGetTokenFromAd}
                className={`w-full pokemon-button text-sm py-2 ${
                  (elapsedTime >= 60 && canGetTokenFromAd)
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {elapsedTime < 60 
                  ? `🔒 1분 후 광고 시청 가능 (${60 - elapsedTime}초)` 
                  : (canGetTokenFromAd 
                      ? '🎆 광고 보고 프리미엄 채팅권한 획득!' 
                      : `⏰ 광고 쿨다운: ${Math.ceil(remainingTime / 1000)}초`
                    )
                }
              </button>
            </div>
          )}
          
          {/* 🎯 메시지 타입 선택 UI - 권한이 있을 때만 표시 */}
          {canChat && (chatTokens > 0 || premiumTokens > 0) && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-300 rounded-lg">
              <div className="pokemon-font text-sm font-bold text-blue-800 mb-2 text-center">
                🎯 메시지 타입 선택
              </div>
              
              <div className="flex gap-2">
                {/* 자동 선택 (기본값) */}
                <label className={`flex-1 p-2 border-2 rounded-lg cursor-pointer transition-all ${
                  messageType === 'auto'
                    ? 'border-blue-500 bg-blue-100'
                    : 'border-gray-300 hover:border-blue-300'
                }`}>
                  <input
                    type="radio"
                    name="messageType"
                    value="auto"
                    checked={messageType === 'auto'}
                    onChange={(e) => setMessageType(e.target.value)}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-lg mb-1">✨</div>
                    <div className="pokemon-font text-xs font-bold">자동</div>
                    <div className="pokemon-font text-xs text-gray-600">
                      {premiumTokens > 0 ? '프리미엄 우선' : '일반 메시지'}
                    </div>
                  </div>
                </label>

                {/* 일반 메시지 */}
                {chatTokens > 0 && (
                  <label className={`flex-1 p-2 border-2 rounded-lg cursor-pointer transition-all ${
                    messageType === 'basic'
                      ? 'border-green-500 bg-green-100'
                      : 'border-gray-300 hover:border-green-300'
                  }`}>
                    <input
                      type="radio"
                      name="messageType"
                      value="basic"
                      checked={messageType === 'basic'}
                      onChange={(e) => setMessageType(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-lg mb-1">💬</div>
                      <div className="pokemon-font text-xs font-bold">일반</div>
                      <div className="pokemon-font text-xs text-gray-600">
                        {chatTokens}개 보유
                      </div>
                    </div>
                  </label>
                )}

                {/* 프리미엄 메시지 */}
                {premiumTokens > 0 && (
                  <label className={`flex-1 p-2 border-2 rounded-lg cursor-pointer transition-all ${
                    messageType === 'premium'
                      ? 'border-yellow-500 bg-yellow-100'
                      : 'border-gray-300 hover:border-yellow-300'
                  }`}>
                    <input
                      type="radio"
                      name="messageType"
                      value="premium"
                      checked={messageType === 'premium'}
                      onChange={(e) => setMessageType(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-lg mb-1">🎆</div>
                      <div className="pokemon-font text-xs font-bold">프리미엄</div>
                      <div className="pokemon-font text-xs text-gray-600">
                        {premiumTokens}개 보유
                      </div>
                    </div>
                  </label>
                )}
              </div>
              
              {/* 선택된 타입 설명 */}
              <div className="mt-2 text-center">
                {messageType === 'auto' && (
                  <div className="pokemon-font text-xs text-blue-600">
                    {premiumTokens > 0 
                      ? '🎆 프리미엄 권한이 우선 사용되어 화려하게 빛나요!' 
                      : '💬 일반 메시지로 전송되어요'
                    }
                  </div>
                )}
                {messageType === 'basic' && (
                  <div className="pokemon-font text-xs text-green-600">
                    💬 일반 메시지로 전송됩니다 (권한 1개 소모)
                  </div>
                )}
                {messageType === 'premium' && (
                  <div className="pokemon-font text-xs text-yellow-600">
                    🎆 프리미엄 메시지로 화려하게 빛나요! (권한 1개 소모)
                  </div>
                )}
              </div>
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