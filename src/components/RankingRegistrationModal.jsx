import React, { useState, useEffect } from 'react';
import { formatTime } from '../utils/helpers';
import { rankingService } from '../services/rankingService.jsx';

const RankingRegistrationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  onExit, // 실제 종료 시 사용
  elapsedTime, 
  currentUser,
  totalTimeWasted,
  visits,
  adClicks 
}) => {
  const [customNickname, setCustomNickname] = useState('');
  const [customComment, setCustomComment] = useState('');
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
      const finalComment = customComment.trim();
      
      // Firebase 랭킹에 등록 (소감 포함)
      await rankingService.submitScore(elapsedTime, finalNickname, finalComment);
      
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
    if (onExit) {
      onExit(); // 확인 모달 표시
    } else {
      onConfirm(); // 바로 종료
    }
  };

  if (!isOpen) return null;

  const minutes = Math.floor(elapsedTime / 60);
  const isWorthRegistering = elapsedTime >= 60; // 1분 이상만 랭킹 등록 가능

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="pokemon-dialog max-w-md w-full p-6 animate-fadeIn">
        {/* 헤더 - 포켓몬 컨셉에 맞게 */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">🏆</div>
          <h2 className="pokemon-font text-2xl font-bold text-gray-800 mb-2">
            시간낭비 기록 달성!
          </h2>
          <p className="pokemon-font text-gray-600">
            {formatTime(elapsedTime)}의 소중한 시간을 낭비하셨습니다
          </p>
        </div>

        {/* 통계 요약 - 포켓몬 스타일 */}
        <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="pokemon-font text-gray-600">이번 세션</span>
            <span className="pokemon-font text-gray-800 font-bold">{formatTime(elapsedTime)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="pokemon-font text-gray-600">총 방문 횟수</span>
            <span className="pokemon-font text-gray-800">{visits}회</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="pokemon-font text-gray-600">누적 시간낭비</span>
            <span className="pokemon-font text-gray-800 font-bold">{formatTime(totalTimeWasted + elapsedTime)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="pokemon-font text-gray-600">광고 클릭</span>
            <span className="pokemon-font text-gray-800">{adClicks}회</span>
          </div>
          {rankPosition && (
            <div className="flex justify-between text-sm pt-2 border-t-2 border-gray-300">
              <span className="pokemon-font text-gray-600">예상 순위</span>
              <span className="pokemon-font text-yellow-600 font-bold">#{rankPosition}</span>
            </div>
          )}
        </div>

        {/* 랭킹 등록 섹션 */}
        {isWorthRegistering ? (
          <div className="mb-6">
            <h3 className="pokemon-font text-lg font-bold text-gray-800 mb-3 text-center">
              🎖️ 랭킹에 기록하시겠습니까?
            </h3>
            
            {/* 닉네임 입력 */}
            <div className="mb-4">
              <label className="block pokemon-font text-sm text-gray-700 mb-2">
                닉네임 (선택사항)
              </label>
              <input
                type="text"
                value={customNickname}
                onChange={handleNicknameChange}
                placeholder={currentUser?.anonymousName || "익명의 시간낭비자"}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg pokemon-font text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-all"
                maxLength="12"
              />
              <p className="pokemon-font text-xs text-gray-500 mt-1">
                {customNickname.length}/12자 (비워두면 기본 닉네임 사용)
              </p>
            </div>

            {/* 미리보기 */}
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-3 mb-4">
              <p className="pokemon-font text-sm text-gray-600 mb-2">랭킹 표시 미리보기:</p>
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-100 to-blue-200 border-2 border-blue-300 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <span className="pokemon-font text-blue-700 font-bold">#{rankPosition || '?'}</span>
                  <span className="pokemon-font text-gray-800 font-medium">
                    {customNickname || currentUser?.anonymousName || '익명'}
                  </span>
                </div>
                <span className="pokemon-font text-gray-700 font-bold text-sm">
                  {formatTime(elapsedTime)}
                </span>
              </div>
            </div>

            {/* 소감 남기기 영역 */}
            <div className="mb-4">
              <label className="block pokemon-font text-sm text-gray-700 mb-2">
                한마디 소감 남기기 (선택사항)
              </label>
              <textarea
                value={customComment}
                onChange={(e) => setCustomComment(e.target.value.slice(0, 50))}
                placeholder="시간낭비에 대한 소감을 남겨보세요..."
                className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg pokemon-font text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-all resize-none"
                rows="2"
                maxLength="50"
              />
              <p className="pokemon-font text-xs text-gray-500 mt-1">
                {customComment.length}/50자
              </p>
            </div>

            {/* 버튼들 */}
            <div className="space-y-3">
              <button
                onClick={handleRegisterRanking}
                disabled={isSubmitting}
                className="pokemon-button w-full disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
                    <span>등록 중...</span>
                  </div>
                ) : (
                  '🏆 랭킹에 등록하고 종료'
                )}
              </button>
              
              <button
                onClick={handleSkipRanking}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-800 pokemon-font font-medium py-3 px-6 rounded-lg border-2 border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                랭킹 등록 없이 그냥 종료
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6 text-center">
            <div className="text-4xl mb-3">😅</div>
            <div className="pokemon-dialog bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 mb-4">
              <p className="pokemon-font text-yellow-800 font-bold mb-2">
                🎮 시간낭비 마스터 규칙 📋
              </p>
              <p className="pokemon-font text-yellow-700 text-sm">
                1분 이상 시간을 낭비해야 명예의 전당에 등록할 수 있습니다!
              </p>
            </div>
            <button
              onClick={handleSkipRanking}
              className="pokemon-button w-full"
            >
              그냥 종료
            </button>
          </div>
        )}

        {/* 더 시간낭비하기 버튼 - 바로 돌아가기 */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="pokemon-font text-gray-500 hover:text-gray-700 text-sm underline transition-colors"
          >
            아직 더 시간을 낭비하고 싶어요
          </button>
        </div>
      </div>
    </div>
  );
};

export default RankingRegistrationModal;