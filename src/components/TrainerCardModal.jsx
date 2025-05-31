// 🎮 포켓몬 스타일 랭커 카드 모달 - 독립 컴포넌트
import React from 'react';
import ReactDOM from 'react-dom';
import { User, Clock, MessageSquare, X, Crown, Medal } from 'lucide-react';

const TrainerCardModal = React.memo(({ 
  showModal, 
  trainer, 
  onClose, 
  currentLabel 
}) => {
  // 안전 검사 - 모든 조건이 충족되어야 렌더링
  if (!showModal || !trainer || !trainer.rank) {
    return null;
  }
  
  const getTierIcon = (rank) => {
    switch (rank) {
      case 1: return { emoji: '👑', icon: <Crown className="w-5 h-5 text-white" /> };
      case 2: return { emoji: '⭐', icon: <Medal className="w-5 h-5 text-white" /> };
      case 3: return { emoji: '🎖️', icon: <Medal className="w-5 h-5 text-white" /> };
      case 4: return { emoji: '🏅', icon: <Medal className="w-5 h-5 text-white" /> };
      case 5: return { emoji: '🥇', icon: <Medal className="w-5 h-5 text-black" /> };
      case 6: return { emoji: '🥈', icon: <Medal className="w-5 h-5 text-black" /> };
      case 7:
      case 8:
      case 9:
      case 10: return { emoji: '🥉', icon: <Medal className="w-5 h-5 text-black" /> };
      default: return { 
        emoji: '⚪', 
        icon: <div className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-500">{rank}</div> 
      };
    }
  };
  
  const getTierName = (rank) => {
    switch (rank) {
      case 1: return 'LEGENDARY';
      case 2: return 'CHALLENGER';
      case 3: return 'GRANDMASTER';
      case 4: return 'MASTER';
      case 5: return 'DIAMOND';
      case 6: return 'PLATINUM';
      case 7:
      case 8:
      case 9:
      case 10: return 'GOLD';
      default: return null;
    }
  };
  
  const tierInfo = getTierIcon(trainer.rank);
  const tierName = getTierName(trainer.rank);
  
  // 이벤트 전파 방지
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // 🎆 Portal을 사용해서 body에 직접 렌더링 - 가장 중요!
  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 ranker-card-backdrop"
      style={{ zIndex: 9999 }} // 최고 z-index 설정
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white border-4 border-black rounded-lg max-w-md w-full mx-4 pokemon-font ranker-card-modal" 
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b-2 border-black bg-gray-100">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-bold text-gray-800">랭커 카드</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded border-2 border-black hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* 메인 컨텐츠 */}
        <div className="p-6">
          {/* 랭킹 & 티어 정보 */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-3xl">{tierInfo.emoji}</span>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">#{trainer.rank}</div>
                {tierName && (
                  <div className={`text-sm px-2 py-1 rounded border-2 border-black font-bold ${
                    trainer.rank === 1 ? 'bg-yellow-100 text-yellow-900' :
                    trainer.rank === 2 ? 'bg-purple-100 text-purple-900' :
                    trainer.rank === 3 ? 'bg-blue-100 text-blue-900' :
                    trainer.rank === 4 ? 'bg-green-100 text-green-900' :
                    trainer.rank === 5 ? 'bg-yellow-100 text-yellow-900' :
                    trainer.rank === 6 ? 'bg-gray-100 text-gray-900' :
                    'bg-orange-100 text-orange-900'
                  }`}>
                    {tierName}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* 닉네임 */}
          <div className="mb-4 p-3 bg-gray-50 border-2 border-gray-300 rounded">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600 font-bold">닉네임</span>
            </div>
            <div className="text-lg font-bold text-gray-800 break-words">
              {trainer.anonymousName}
              {trainer.isCurrentUser && (
                <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                  나
                </span>
              )}
            </div>
          </div>
          
          {/* 시간 정보 */}
          <div className="mb-4 p-3 bg-gray-50 border-2 border-gray-300 rounded">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600 font-bold">시간 낙비 기록</span>
            </div>
            <div className="text-xl font-bold text-gray-800">
              {trainer.timeDisplay}
            </div>
          </div>
          
          {/* 소감 */}
          {trainer.comment && (
            <div className="mb-4 p-3 bg-gray-50 border-2 border-gray-300 rounded">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600 font-bold">소감</span>
              </div>
              <div className="text-base text-gray-800 break-words leading-relaxed">
                {trainer.comment}
              </div>
            </div>
          )}
          
          {/* 선택된 기간 정보 */}
          <div className="text-center mt-6 pt-4 border-t-2 border-gray-300">
            <div className="text-sm text-gray-600">
              현재 {currentLabel.label} 랭킹 기준
            </div>
          </div>
        </div>
        
        {/* 푸터 */}
        <div className="p-4 border-t-2 border-black bg-gray-100 text-center">
          <button 
            onClick={onClose}
            className="pokemon-button px-6 py-2"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
  
  // 🎆 ReactDOM.createPortal로 body에 직접 렌더링
  return ReactDOM.createPortal(modalContent, document.body);
});

TrainerCardModal.displayName = 'TrainerCardModal';

export default TrainerCardModal;
