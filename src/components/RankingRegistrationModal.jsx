import React, { useState, useEffect } from 'react';
import { formatTime } from '../utils/helpers';
import { rankingService } from '../services/rankingService.jsx';

const RankingRegistrationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  elapsedTime, 
  currentUser,
  totalTimeWasted,
  visits,
  adClicks 
}) => {
  const [customNickname, setCustomNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [rankPosition, setRankPosition] = useState(null);

  // 현재 시간 기록의 예상 순위 확인
  useEffect(() => {
    if (isOpen && elapsedTime > 0) {
      const checkRankPosition = async () => {
        try {
          const position = await rankingService.getExpectedRank(elapsedTime);
          setRankPosition(position);
        } catch (error) {
          console.error('예상 순위 확인 실패:', error);
        }
      };
      checkRankPosition();
    }
  }, [isOpen, elapsedTime]);

  // 닉네임 입력 핸들러
  const handleNicknameChange = (e) => {
    const value = e.target.value;
    // 최대 12자 제한, 특수문자 필터링
    const filteredValue = value
      .replace(/[<>"/\\&']/g, '') // 위험한 문자 제거
      .slice(0, 12);
    setCustomNickname(filteredValue);
  };

  // 랭킹 등록 처리
  const handleRegisterRanking = async () => {
    setIsSubmitting(true);
    
    try {
      const finalNickname = customNickname.trim() || currentUser?.anonymousName || '익명';
      
      // Firebase 랭킹에 등록
      await rankingService.submitScore(elapsedTime, finalNickname);
      
      // 성공 후 종료 처리
      onConfirm();
    } catch (error) {
      console.error('랭킹 등록 실패:', error);
      // 실패해도 종료는 진행
      onConfirm();
    } finally {
      setIsSubmitting(false);
    }
  };

  // 그냥 종료 (랭킹 등록 안함)
  const handleSkipRanking = () => {
    onConfirm();
  };

  if (!isOpen) return null;

  const minutes = Math.floor(elapsedTime / 60);
  const isWorthRegistering = elapsedTime >= 60; // 1분 이상만 랭킹 등록 가능

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">🏆</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            시간낭비 기록 달성!
          </h2>
          <p className="text-white/70">
            {formatTime(elapsedTime)}의 소중한 시간을 낭비하셨습니다
          </p>
        </div>

        {/* 통계 요약 */}
        <div className="bg-white/5 rounded-xl p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">이번 세션</span>
            <span className="text-white font-mono">{formatTime(elapsedTime)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">총 방문 횟수</span>
            <span className="text-white">{visits}회</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">누적 시간낭비</span>
            <span className="text-white font-mono">{formatTime(totalTimeWasted + elapsedTime)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">광고 클릭</span>
            <span className="text-white">{adClicks}회</span>
          </div>
          {rankPosition && (
            <div className="flex justify-between text-sm pt-2 border-t border-white/10">
              <span className="text-white/70">예상 순위</span>
              <span className="text-yellow-400 font-bold">#{rankPosition}</span>
            </div>
          )}
        </div>

        {/* 랭킹 등록 섹션 */}
        {isWorthRegistering ? (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-3 text-center">
              🎖️ 랭킹에 기록하시겠습니까?
            </h3>
            
            {/* 닉네임 입력 */}
            <div className="mb-4">
              <label className="block text-sm text-white/70 mb-2">
                닉네임 (선택사항)
              </label>
              <input
                type="text"
                value={customNickname}
                onChange={handleNicknameChange}
                placeholder={currentUser?.anonymousName || "익명의 시간낭비자"}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                maxLength="12"
              />
              <p className="text-xs text-white/50 mt-1">
                {customNickname.length}/12자 (비워두면 기본 닉네임 사용)
              </p>
            </div>

            {/* 미리보기 */}
            <div className="bg-white/5 rounded-lg p-3 mb-4">
              <p className="text-sm text-white/70 mb-1">랭킹 표시 미리보기:</p>
              <div className="flex items-center justify-between bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-2">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400 font-bold">#{rankPosition || '?'}</span>
                  <span className="text-white font-medium">
                    {customNickname || currentUser?.anonymousName || '익명'}
                  </span>
                </div>
                <span className="text-white/80 font-mono text-sm">
                  {formatTime(elapsedTime)}
                </span>
              </div>
            </div>

            {/* 버튼들 */}
            <div className="space-y-3">
              <button
                onClick={handleRegisterRanking}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>등록 중...</span>
                  </div>
                ) : (
                  '🏆 랭킹에 등록하고 종료'
                )}
              </button>
              
              <button
                onClick={handleSkipRanking}
                className="w-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white font-medium py-3 px-6 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                랭킹 등록 없이 그냥 종료
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6 text-center">
            <div className="text-4xl mb-3">😅</div>
            <p className="text-white/70 mb-4">
              1분 이상 시간을 낭비해야 랭킹에 등록할 수 있어요
            </p>
            <button
              onClick={handleSkipRanking}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              그냥 종료
            </button>
          </div>
        )}

        {/* 취소 버튼 */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white/70 text-sm underline transition-colors"
          >
            아직 더 시간을 낭비하고 싶어요
          </button>
        </div>
      </div>
    </div>
  );
};

export default RankingRegistrationModal;