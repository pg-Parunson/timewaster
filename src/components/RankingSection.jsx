  // 🏆 게임 티어 랭킹 시스템 - 진짜 게임스러운 티어!
  const getGameTierStyle = (rank, isCurrentUser) => {
    const baseClasses = `flex items-center gap-3 p-4 rounded-xl transition-all duration-500 relative overflow-hidden`;
    
    switch (rank) {
      case 1: // 🏆 LEGENDARY - 전설 등급 (금색 + 보라)
        return `${baseClasses} ${
          isCurrentUser 
            ? 'bg-gradient-to-r from-yellow-400 via-purple-500 to-yellow-400 border-4 border-yellow-300 shadow-2xl tier-legendary' 
            : 'bg-gradient-to-r from-yellow-300 via-purple-400 to-yellow-300 border-4 border-yellow-200 shadow-2xl tier-legendary'
        }`;
        
      case 2: // 🕸️ MASTER - 마스터 등급 (다이아몬드 블루)
        return `${baseClasses} ${
          isCurrentUser 
            ? 'bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 border-3 border-cyan-300 shadow-xl tier-master' 
            : 'bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-300 border-3 border-cyan-200 shadow-xl tier-master'
        }`;
        
      case 3: // 💎 DIAMOND - 다이아몬드 등급 (파란 다이아)
        return `${baseClasses} ${
          isCurrentUser 
            ? 'bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-500 border-3 border-blue-400 shadow-xl tier-diamond' 
            : 'bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-400 border-3 border-blue-300 shadow-xl tier-diamond'
        }`;
        
      case 4: // 🥈 PLATINUM - 플래티네 등급 (청록 + 은샄)
        return `${baseClasses} ${
          isCurrentUser 
            ? 'bg-gradient-to-r from-teal-400 via-gray-300 to-teal-400 border-3 border-teal-300 shadow-lg tier-platinum' 
            : 'bg-gradient-to-r from-teal-300 via-gray-200 to-teal-300 border-3 border-teal-200 shadow-lg tier-platinum'
        }`;
        
      case 5: // 🥇 GOLD - 골드 등급 (황금)
        return `${baseClasses} ${
          isCurrentUser 
            ? 'bg-gradient-to-r from-yellow-400 via-orange-300 to-yellow-400 border-3 border-yellow-300 shadow-lg tier-gold' 
            : 'bg-gradient-to-r from-yellow-300 via-orange-200 to-yellow-300 border-3 border-yellow-200 shadow-lg tier-gold'
        }`;
        
      case 6: // 🥈 SILVER - 실버 등급 (은색)
        return `${baseClasses} ${
          isCurrentUser 
            ? 'bg-gradient-to-r from-gray-300 via-slate-200 to-gray-300 border-2 border-gray-300 shadow-md tier-silver' 
            : 'bg-gradient-to-r from-gray-200 via-slate-100 to-gray-200 border-2 border-gray-200 shadow-md tier-silver'
        }`;
        
      case 7:
      case 8:
      case 9:
      case 10: // 🥉 BRONZE - 브로즈 등급 (동색)
        return `${baseClasses} ${
          isCurrentUser 
            ? 'bg-gradient-to-r from-orange-300 via-amber-200 to-orange-300 border-2 border-orange-300 shadow-md tier-bronze' 
            : 'bg-gradient-to-r from-orange-200 via-amber-100 to-orange-200 border-2 border-orange-200 shadow-md tier-bronze'
        }`;
        
      default: // ⚪ UNRANKED - 언랭크드
        return `${baseClasses} ${
          isCurrentUser 
            ? 'bg-gradient-to-r from-gray-100 via-slate-50 to-gray-100 border-2 border-gray-200 shadow-sm' 
            : 'bg-gradient-to-r from-gray-50 via-white to-gray-50 border border-gray-100 shadow-sm'
        }`;
    }
  };
  
  // 🏆 게임 티어 텍스트 스타일
  const getGameTierTextStyle = (rank, isCurrentUser) => {
    const baseClasses = 'pokemon-font text-sm truncate font-bold';
    
    switch (rank) {
      case 1: return `${baseClasses} text-yellow-900`; // LEGENDARY
      case 2: return `${baseClasses} text-cyan-800`;   // MASTER  
      case 3: return `${baseClasses} text-blue-800`;   // DIAMOND
      case 4: return `${baseClasses} text-teal-800`;   // PLATINUM
      case 5: return `${baseClasses} text-yellow-800`; // GOLD
      case 6: return `${baseClasses} text-gray-700`;   // SILVER
      case 7:
      case 8:
      case 9:
      case 10: return `${baseClasses} text-orange-700`; // BRONZE
      default: return `${baseClasses} ${
        isCurrentUser ? 'text-blue-700 font-bold' : 'text-gray-600'
      }`;
    }
  };
  
  // 🏆 게임 티어 시간 스타일
  const getGameTierTimeStyle = (rank, isCurrentUser) => {
    const baseClasses = 'pokemon-font text-xs font-bold';
    
    switch (rank) {
      case 1: return `${baseClasses} text-yellow-800`; // LEGENDARY
      case 2: return `${baseClasses} text-cyan-700`;   // MASTER
      case 3: return `${baseClasses} text-blue-700`;   // DIAMOND
      case 4: return `${baseClasses} text-teal-700`;   // PLATINUM
      case 5: return `${baseClasses} text-yellow-700`; // GOLD
      case 6: return `${baseClasses} text-gray-600`;   // SILVER
      case 7:
      case 8:
      case 9:
      case 10: return `${baseClasses} text-orange-600`; // BRONZE
      default: return `${baseClasses} ${isCurrentUser ? 'text-blue-600' : 'text-gray-500'}`;
    }
  };// 포켓몬 명예의 전당 스타일 랭킹 컴포넌트
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

  // 🏆 게임 티어 아이콘 및 이모지
  const getTierIcon = (rank) => {
    switch (rank) {
      case 1: return { emoji: '🏆', icon: <Crown className="w-6 h-6 text-yellow-600" /> }; // LEGENDARY
      case 2: return { emoji: '🕸️', icon: <Medal className="w-6 h-6 text-cyan-600" /> };   // MASTER
      case 3: return { emoji: '💎', icon: <Medal className="w-6 h-6 text-blue-600" /> };   // DIAMOND
      case 4: return { emoji: '💿', icon: <Medal className="w-6 h-6 text-teal-600" /> };   // PLATINUM
      case 5: return { emoji: '🥇', icon: <Medal className="w-6 h-6 text-yellow-600" /> }; // GOLD
      case 6: return { emoji: '🥈', icon: <Medal className="w-6 h-6 text-gray-500" /> };   // SILVER
      case 7:
      case 8:
      case 9:
      case 10: return { emoji: '🥉', icon: <Medal className="w-6 h-6 text-orange-500" /> }; // BRONZE
      default: return { 
        emoji: '⚪', 
        icon: <div className="w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-500">{rank}</div> 
      };
    }
  };
  
  // 🏆 게임 티어 이름
  const getTierName = (rank) => {
    switch (rank) {
      case 1: return 'LEGENDARY';
      case 2: return 'MASTER';
      case 3: return 'DIAMOND';
      case 4: return 'PLATINUM';
      case 5: return 'GOLD';
      case 6: return 'SILVER';
      case 7:
      case 8:
      case 9:
      case 10: return 'BRONZE';
      default: return null;
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
              {/* TOP 10 게임 티어 랭킹 표시 - 🏆 진짜 게임스러운 티어! */}
              {ranking.slice(0, 10).map((user, index) => {
                const tierInfo = getTierIcon(user.rank);
                const tierName = getTierName(user.rank);
                
                return (
                  <div
                    key={`${user.anonymousName}-${index}`}
                    className={`${getGameTierStyle(user.rank, user.isCurrentUser)} vip-rank-container`}
                  >
                    {/* 순위 + 티어 아이콘 */}
                    <div className="flex items-center gap-3 min-w-[80px]">
                      <span className="text-2xl">{tierInfo.emoji}</span>
                      {tierInfo.icon}
                      <div className="text-sm font-bold text-gray-800">#{user.rank}</div>
                    </div>

                    {/* 닉네임 + 티어 + 소감 */}
                    <div className="flex-1 min-w-0 px-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className={getGameTierTextStyle(user.rank, user.isCurrentUser)}>
                          {user.anonymousName}
                        </div>
                        {user.isCurrentUser && (
                          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full whitespace-nowrap font-bold">
                            나
                          </span>
                        )}
                        {/* 🏆 게임 티어 배지 */}
                        {tierName && (
                          <span className={`text-xs px-3 py-1 rounded-full font-black whitespace-nowrap border-2 ${
                            user.rank === 1 ? 'bg-yellow-100 text-yellow-900 border-yellow-400' :
                            user.rank === 2 ? 'bg-cyan-100 text-cyan-900 border-cyan-400' :
                            user.rank === 3 ? 'bg-blue-100 text-blue-900 border-blue-400' :
                            user.rank === 4 ? 'bg-teal-100 text-teal-900 border-teal-400' :
                            user.rank === 5 ? 'bg-yellow-100 text-yellow-900 border-yellow-400' :
                            user.rank === 6 ? 'bg-gray-100 text-gray-900 border-gray-400' :
                            'bg-orange-100 text-orange-900 border-orange-400' // BRONZE
                          }`}>
                            {tierName}
                          </span>
                        )}
                      </div>
                      {/* 소감 - 연한 느낌으로 */}
                      {user.comment && (
                        <div className="pokemon-font text-xs text-gray-600 mt-2 truncate" 
                             style={{ maxWidth: '250px' }}>
                          📝 {user.comment}
                        </div>
                      )}
                    </div>

                    {/* 시간 */}
                    <div className="text-right min-w-[80px]">
                      <div className={getGameTierTimeStyle(user.rank, user.isCurrentUser)}>
                        {user.timeDisplay}
                      </div>
                    </div>
                    
                    {/* 🔥 풀파워 VIP 이팩트 - TOP 3만 화려하게! */}
                    {user.rank === 1 && (
                      <div className="rank-gold-sparkle"></div>
                    )}
                    {user.rank === 2 && (
                      <div className="rank-silver-shimmer"></div>
                    )}
                    {user.rank === 3 && (
                      <div className="rank-bronze-gleam"></div>
                    )}
                  </div>
                );
              })}
              
              {/* 더 보기 영역 (스크롤 가능) */}
              {ranking.length > 10 && (
                <>
                  <div className="border-t-2 border-gray-300 my-2 pt-2">
                    <p className="text-center pokemon-font text-xs text-gray-500 mb-2">
                      👇 더 많은 랭킹 보기
                    </p>
                  </div>
                  
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {ranking.slice(10, 20).map((user, index) => {
                      const tierInfo = getTierIcon(user.rank);
                      
                      return (
                        <div
                          key={`${user.anonymousName}-extended-${index}`}
                          className={`
                            flex items-center gap-3 p-3 rounded-lg transition-all text-sm
                            ${user.isCurrentUser 
                              ? 'bg-blue-100 border-2 border-blue-400 shadow-md' 
                              : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                            }
                          `}
                        >
                          {/* 순위 + 티어 아이콘 */}
                          <div className="flex items-center gap-2 min-w-[60px]">
                            <span className="text-sm">{tierInfo.emoji}</span>
                            <span className="text-xs font-bold text-gray-600">#{user.rank}</span>
                          </div>

                          {/* 닉네임 + 소감 */}
                          <div className="flex-1 min-w-0 px-2">
                            <div className={`
                              pokemon-font text-xs font-bold
                              ${user.isCurrentUser ? 'text-blue-700' : 'text-gray-700'}
                            `}>
                              {user.anonymousName}
                              {user.isCurrentUser && (
                                <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                                  나
                                </span>
                              )}
                            </div>
                            {/* 소감 표시 + 길이 제한 */}
                            {user.comment && (
                              <div className="pokemon-font text-xs text-gray-400 mt-1" 
                                   style={{ 
                                     maxWidth: '150px', 
                                     wordBreak: 'break-all',
                                     overflow: 'hidden',
                                     textOverflow: 'ellipsis',
                                     whiteSpace: 'nowrap'
                                   }}>
                                📝 {user.comment.length > 15 ? user.comment.slice(0, 15) + '...' : user.comment}
                              </div>
                            )}
                          </div>

                          {/* 시간 */}
                          <div className="text-right min-w-[60px]">
                            <div className={`
                              pokemon-font text-xs font-bold
                              ${user.isCurrentUser ? 'text-blue-600' : 'text-gray-600'}
                            `}>
                              {user.timeDisplay}
                            </div>
                          </div>
                        </div>
                      );
                    })}
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