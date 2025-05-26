// 포켓몬 명예의 전당 스타일 랭킹 컴포넌트
import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, Users } from 'lucide-react';
import { rankingService } from '../services/rankingService.jsx';
import { RANKING_PERIODS, RANKING_LABELS } from '../config/firebase.js';
import { formatTime } from '../utils/helpers';

const RankingSection = ({ isVisible = true, currentUser: propCurrentUser = null, elapsedTime = 0 }) => {
  const [ranking, setRanking] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePeriod, setActivePeriod] = useState(RANKING_PERIODS.DAILY);
  const [unsubscribe, setUnsubscribe] = useState(null);
  const [myRank, setMyRank] = useState(null);
  const [showMyRank, setShowMyRank] = useState(false);

  useEffect(() => {
    // 현재 사용자 정보 설정
    const user = propCurrentUser || rankingService.getCurrentUser();
    setCurrentUser(user);
  }, [propCurrentUser]);

  // 내 현재 순위 계산
  useEffect(() => {
    if (elapsedTime > 0 && currentUser) {
      const calculateMyRank = async () => {
        try {
          const expectedRank = await rankingService.getExpectedRank(elapsedTime);
          setMyRank({
            rank: expectedRank,
            time: elapsedTime,
            username: currentUser.anonymousName || '나'
          });
          
          // 10위 안에 있지 않으면 내 순위를 따로 보여주기
          setShowMyRank(expectedRank > 10);
        } catch (error) {
          console.log('내 순위 계산 실패:', error);
        }
      };
      calculateMyRank();
    }
  }, [elapsedTime, currentUser]);

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
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-orange-600" />;
      default:
        return <div className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-600">{rank}</div>;
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
    <div className="p-4 h-full">
      {/* 포켓몬 스타일 제목 */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h3 className="pokemon-font text-lg text-gray-800">
          명예의 전당
        </h3>
      </div>

      {/* 포켓몬 스타일 탭 메뉴 */}
      <div className="flex flex-wrap gap-1 mb-4 p-1 bg-gray-100 rounded-lg border-2 border-gray-300">
        {Object.values(RANKING_PERIODS).map((period) => {
          const label = RANKING_LABELS[period];
          const isActive = activePeriod === period;
          
          return (
            <button
              key={period}
              onClick={() => handlePeriodChange(period)}
              className={`
                flex-1 min-w-0 px-2 py-1 rounded pokemon-font text-xs transition-all
                ${isActive 
                  ? 'bg-blue-500 text-white border-2 border-blue-800' 
                  : 'text-gray-700 hover:bg-gray-200 border-2 border-transparent'
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
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mx-auto mb-2"></div>
          <p className="pokemon-font text-gray-600 text-sm">랭킹 로딩 중...</p>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="text-center py-6">
          <p className="pokemon-font text-red-600">⚠️ 랭킹 정보를 불러올 수 없습니다</p>
          <p className="pokemon-font text-gray-500 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* 랭킹 리스트 */}
      {!isLoading && !error && (
        <>
          {ranking.length === 0 ? (
            <div className="text-center py-6">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="pokemon-font text-gray-600">아직 명예의 전당이 비어있습니다</p>
              <p className="pokemon-font text-gray-500 text-sm">첫 번째 챔피언이 되어보세요!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* TOP 10 랭킹 표시 */}
              {ranking.slice(0, 10).map((user, index) => (
                <div
                  key={`${user.anonymousName}-${index}`}
                  className={`
                    flex items-center gap-2 p-2 rounded-lg transition-all
                    ${user.isCurrentUser 
                      ? 'bg-blue-100 border-2 border-blue-400 shadow-md' 
                      : 'bg-white border-2 border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  {/* 순위 */}
                  <div className="flex items-center gap-1 min-w-[50px]">
                    <span className="text-sm">{getRankEmoji(user.rank)}</span>
                    {getRankIcon(user.rank)}
                  </div>

                  {/* 닉네임 */}
                  <div className="flex-1 min-w-0 px-2">
                    <div className={`
                      pokemon-font text-sm
                      ${
                        user.isCurrentUser 
                          ? 'text-blue-700 font-bold' 
                          : user.rank === 1 
                            ? 'text-yellow-700 font-bold'
                            : user.rank === 2
                              ? 'text-gray-600 font-bold'
                              : user.rank === 3
                                ? 'text-orange-600 font-bold'
                                : 'text-gray-800'
                      }
                    `}>
                      {user.anonymousName}
                      {user.isCurrentUser && (
                        <span className="ml-1 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                          나
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 시간 */}
                  <div className="text-right min-w-[60px]">
                    <div className={`
                      pokemon-font text-xs font-bold
                      ${user.rank === 1 ? 'text-yellow-600' : 
                        user.rank === 2 ? 'text-gray-500' :
                        user.rank === 3 ? 'text-orange-600' :
                        user.isCurrentUser ? 'text-blue-600' : 'text-gray-700'
                      }
                    `}>
                      {user.timeDisplay}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* 더 보기 영역 (스크롤 가능) */}
              {ranking.length > 10 && (
                <>
                  <div className="border-t-2 border-gray-300 my-2 pt-2">
                    <p className="text-center pokemon-font text-xs text-gray-500 mb-2">
                      👇 더 많은 랭킹 보기
                    </p>
                  </div>
                  
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {ranking.slice(10, 20).map((user, index) => (
                      <div
                        key={`${user.anonymousName}-extended-${index}`}
                        className={`
                          flex items-center gap-2 p-1.5 rounded-lg transition-all text-sm
                          ${user.isCurrentUser 
                            ? 'bg-blue-100 border-2 border-blue-400 shadow-md' 
                            : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                          }
                        `}
                      >
                        {/* 순위 */}
                        <div className="flex items-center gap-1 min-w-[40px]">
                          <span className="text-xs">{getRankEmoji(user.rank)}</span>
                          <span className="text-xs font-bold text-gray-600">{user.rank}</span>
                        </div>

                        {/* 닉네임 */}
                        <div className="flex-1 min-w-0 px-1">
                          <div className={`
                            pokemon-font text-xs
                            ${user.isCurrentUser ? 'text-blue-700 font-bold' : 'text-gray-700'}
                          `}>
                            {user.anonymousName}
                            {user.isCurrentUser && (
                              <span className="ml-1 text-xs bg-blue-500 text-white px-1 py-0.5 rounded-full">
                                나
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 시간 */}
                        <div className="text-right min-w-[50px]">
                          <div className={`
                            pokemon-font text-xs font-bold
                            ${user.isCurrentUser ? 'text-blue-600' : 'text-gray-600'}
                          `}>
                            {user.timeDisplay}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {/* 내 현재 순위 (10위 밖일 때만 표시) */}
              {showMyRank && myRank && (
                <>
                  <div className="border-t-2 border-blue-300 my-2 pt-2">
                    <p className="text-center pokemon-font text-xs text-blue-600 mb-2">
                      📍 내 현재 예상 순위
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-2 shadow-md">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 min-w-[50px]">
                        <span className="text-sm">🎯</span>
                        <span className="text-sm font-bold text-blue-700">#{myRank.rank}</span>
                      </div>
                      
                      <div className="flex-1 px-2">
                        <div className="pokemon-font text-sm text-blue-800 font-bold">
                          {myRank.username}
                          <span className="ml-1 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                            나
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right min-w-[60px]">
                        <div className="pokemon-font text-xs font-bold text-blue-600">
                          {formatTime(myRank.time)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-1 text-center">
                      <p className="pokemon-font text-xs text-blue-600">
                        💪 계속 머물러서 순위를 올려보세요!
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 참여 독려 메시지 */}
          {ranking.length > 0 && !showMyRank && (
            <div className="mt-3 p-2 bg-yellow-100 border-2 border-yellow-400 rounded-lg">
              <p className="text-center pokemon-font text-yellow-800 text-xs">
                💪 더 오래 머물러서 명예의 전당에 이름을 올려보세요!
              </p>
            </div>
          )}
        </>
      )}

      {/* 하단 정보 */}
      <div className="mt-3 pt-2 border-t-2 border-gray-300">
        <div className="flex justify-between items-center pokemon-font text-xs text-gray-600">
          <span>TOP 20 랭킹</span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            LIVE
          </span>
        </div>
      </div>
    </div>
  );
};

export default RankingSection;