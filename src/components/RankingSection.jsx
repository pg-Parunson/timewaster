// 실시간 랭킹 표시 컴포넌트
import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, Users } from 'lucide-react';
import { rankingService } from '../services/rankingService.js';
import { RANKING_PERIODS, RANKING_LABELS } from '../config/firebase.js';

const RankingSection = ({ isVisible = true }) => {
  const [ranking, setRanking] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePeriod, setActivePeriod] = useState(RANKING_PERIODS.DAILY);
  const [unsubscribe, setUnsubscribe] = useState(null);

  useEffect(() => {
    // 현재 사용자 정보 설정
    const user = rankingService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    // 기존 리스너 정리
    if (unsubscribe) {
      unsubscribe();
    }

    // 새로운 리스너 등록
    setIsLoading(true);
    const newUnsubscribe = rankingService.onRankingChange((newRanking) => {
      setRanking(newRanking);
      setIsLoading(false);
    }, activePeriod);

    setUnsubscribe(() => newUnsubscribe);

    return () => {
      if (newUnsubscribe) {
        newUnsubscribe();
      }
    };
  }, [activePeriod]);

  // 탭 변경 핸들러
  const handlePeriodChange = (period) => {
    setActivePeriod(period);
  };

  // 랭킹 아이콘 반환
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <div className="w-5 h-5 flex items-center justify-center text-xs font-bold text-slate-400">{rank}</div>;
    }
  };

  // 랭킹 이모지 반환
  const getRankEmoji = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '📍';
    }
  };

  if (!isVisible) return null;

  const currentLabel = RANKING_LABELS[activePeriod];

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl">
      {/* 제목 */}
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-bold text-white">
          {currentLabel.title}
        </h3>
        <Users className="w-5 h-5 text-blue-400" />
      </div>

      {/* 랭킹 탭 메뉴 */}
      <div className="flex flex-wrap gap-2 mb-6 p-1 bg-white/5 rounded-xl border border-white/10">
        {Object.values(RANKING_PERIODS).map((period) => {
          const label = RANKING_LABELS[period];
          const isActive = activePeriod === period;
          
          return (
            <button
              key={period}
              onClick={() => handlePeriodChange(period)}
              className={`
                flex-1 min-w-0 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                }
              `}
            >
              {label.label}
            </button>
          );
        })}
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/30 mx-auto mb-2"></div>
          <p className="text-white/60">랭킹 로딩 중...</p>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-400">⚠️ 랭킹 정보를 불러올 수 없습니다</p>
          <p className="text-white/60 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* 랭킹 리스트 */}
      {!isLoading && !error && (
        <>
          {ranking.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-white/20 mx-auto mb-2" />
              <p className="text-white/60">아직 랭킹이 없습니다</p>
              <p className="text-white/40 text-sm">첫 번째 챔피언이 되어보세요!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {ranking.map((user, index) => (
                <div
                  key={`${user.anonymousName}-${index}`}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl transition-all duration-300
                    ${user.isCurrentUser 
                      ? 'bg-blue-500/20 border border-blue-400/30 shadow-lg scale-105' 
                      : 'bg-white/5 border border-white/5 hover:bg-white/10'
                    }
                  `}
                >
                  {/* 순위 */}
                  <div className="flex items-center gap-2 min-w-[60px]">
                    <span className="text-lg">{getRankEmoji(user.rank)}</span>
                    {getRankIcon(user.rank)}
                  </div>

                  {/* 닉네임 */}
                  <div className="flex-1 min-w-0 px-2">
                    <div className={`
                      font-semibold text-sm
                      ${
                        user.isCurrentUser 
                          ? 'text-blue-300' 
                          : user.rank === 1 
                            ? 'text-yellow-300'
                            : user.rank === 2
                              ? 'text-gray-200'
                              : user.rank === 3
                                ? 'text-amber-300'
                                : 'text-white'
                      }
                    `}>
                      {user.anonymousName}
                      {user.isCurrentUser && (
                        <span className="ml-2 text-xs bg-blue-500/40 px-2 py-1 rounded-full font-bold">
                          나
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 시간 */}
                  <div className="text-right min-w-[70px]">
                    <div className={`
                      font-mono font-bold text-sm
                      ${user.rank === 1 ? 'text-yellow-400' : 
                        user.rank === 2 ? 'text-gray-300' :
                        user.rank === 3 ? 'text-amber-600' :
                        user.isCurrentUser ? 'text-blue-300' : 'text-white/90'
                      }
                    `}>
                      {user.timeDisplay}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 참여 독려 메시지 */}
          {ranking.length > 0 && (
            <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-400/20">
              <p className="text-center text-white/80 text-sm">
                💪 더 오래 머물러서 상위권에 도전해보세요!
              </p>
            </div>
          )}
        </>
      )}

      {/* 하단 정보 */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="flex justify-between items-center text-xs text-white/60">
          <span>실시간 업데이트</span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            LIVE
          </span>
        </div>
      </div>
    </div>
  );
};

export default RankingSection;
