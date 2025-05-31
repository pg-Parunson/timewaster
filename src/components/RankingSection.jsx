// 포켓몬 명예의 전당 스타일 랭킹 컴포넌트
import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, Users } from 'lucide-react';
import { rankingService } from '../services/rankingService.jsx';
import { RANKING_PERIODS, RANKING_LABELS } from '../config/firebase.js';
import { formatTime } from '../utils/helpers';
import TrainerCardModal from './TrainerCardModal.jsx';

const RankingSection = ({ isVisible = true, currentUser: propCurrentUser = null, elapsedTime = 0 }) => {
  const [ranking, setRanking] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePeriod, setActivePeriod] = useState(RANKING_PERIODS.DAILY);
  const [unsubscribe, setUnsubscribe] = useState(null);
  const [myRank, setMyRank] = useState(null);
  const [showMyRank, setShowMyRank] = useState(false);
  
  // 🎮 랭커 카드 모달 상태
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showTrainerModal, setShowTrainerModal] = useState(false);
  const [isModalTransitioning, setIsModalTransitioning] = useState(false);

  // 🏆 포켓몬 레트로 스타일 티어 시스템 - 단순하면서도 임팩트 있게!
  const getGameTierStyle = (rank, isCurrentUser) => {
    const baseClasses = `flex items-center gap-3 p-4 rounded-lg transition-all duration-300 relative overflow-hidden pokemon-font`;
    
    switch (rank) {
      case 1: // 🏆 CHAMPION - 챔피언 (포켓몬 골드의 레드 챔피언)
        return `${baseClasses} ${
          isCurrentUser 
            ? 'tier-legendary shadow-lg' 
            : 'tier-legendary shadow-lg'
        }`;
        
      case 2: // 🥈 ELITE FOUR - 사천왕 (보라색 + 실버)
        return `${baseClasses} ${
          isCurrentUser 
            ? 'tier-master shadow-md' 
            : 'tier-master shadow-md'
        }`;
        
      case 3: // 💎 GYM LEADER - 체육관 관장 (청록색)
        return `${baseClasses} ${
          isCurrentUser 
            ? 'tier-diamond shadow-md' 
            : 'tier-diamond shadow-md'
        }`;
        
      case 4: // 🏅 TRAINER - 트레이너 (초록색)
        return `${baseClasses} ${
          isCurrentUser 
            ? 'tier-platinum shadow-sm' 
            : 'tier-platinum shadow-sm'
        }`;
        
      case 5: // 🥇 VETERAN - 베테랑 (황금색)
        return `${baseClasses} ${
          isCurrentUser 
            ? 'tier-gold shadow-sm' 
            : 'tier-gold shadow-sm'
        }`;
        
      case 6: // 🥈 ROOKIE - 루키 (실버)
        return `${baseClasses} ${
          isCurrentUser 
            ? 'tier-silver shadow-sm' 
            : 'tier-silver shadow-sm'
        }`;
        
      case 7:
      case 8:
      case 9:
      case 10: // 🥉 BEGINNER - 초보자 (브론즈)
        return `${baseClasses} ${
          isCurrentUser 
            ? 'tier-bronze shadow-sm' 
            : 'tier-bronze shadow-sm'
        }`;
        
      default: // ⚪ UNRANKED - 언랭크드
        return `${baseClasses} ${
          isCurrentUser 
            ? 'bg-white border-2 border-blue-400 shadow-sm' 
            : 'bg-gray-50 border border-gray-200 shadow-sm'
        }`;
    }
  };
  
  // 🏆 포켓몬 레트로 스타일 텍스트 (CSS에서 처리)
  const getGameTierTextStyle = (rank, isCurrentUser) => {
    const baseClasses = 'pokemon-font text-sm truncate font-bold';
    
    // CSS 클래스에서 색상을 처리하므로 기본 클래스만 반환
    return `${baseClasses} ${
      isCurrentUser && rank > 10 ? 'text-blue-700 font-bold' : ''
    }`;
  };
  
  // 🏆 포켓몬 레트로 스타일 시간 텍스트 (CSS에서 처리)
  const getGameTierTimeStyle = (rank, isCurrentUser) => {
    const baseClasses = 'pokemon-font text-xs font-bold';
    
    // CSS 클래스에서 색상을 처리하므로 기본 클래스만 반환
    return `${baseClasses} ${
      isCurrentUser && rank > 10 ? 'text-blue-600' : ''
    }`;
  };

  // 🏆 포켓몬 레트로 스타일 아이콘
  const getTierIcon = (rank) => {
    switch (rank) {
      case 1: return { emoji: '👑', icon: <Crown className="w-5 h-5 text-white" /> }; // CHAMPION
      case 2: return { emoji: '⭐', icon: <Medal className="w-5 h-5 text-white" /> };   // ELITE FOUR
      case 3: return { emoji: '🎖️', icon: <Medal className="w-5 h-5 text-white" /> };   // GYM LEADER
      case 4: return { emoji: '🏅', icon: <Medal className="w-5 h-5 text-white" /> };   // TRAINER
      case 5: return { emoji: '🥇', icon: <Medal className="w-5 h-5 text-black" /> }; // VETERAN
      case 6: return { emoji: '🥈', icon: <Medal className="w-5 h-5 text-black" /> };   // ROOKIE
      case 7:
      case 8:
      case 9:
      case 10: return { emoji: '🥉', icon: <Medal className="w-5 h-5 text-black" /> }; // BEGINNER
      default: return { 
        emoji: '⚪', 
        icon: <div className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-500">{rank}</div> 
      };
    }
  };
  
  // 🏆 포켓몬 레트로 스타일 티어 명칭
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

  // 🎮 랭커 카드 모달 함수들
  const openTrainerCard = (user) => {
    // 이미 열려있거나 전환 중이면 무시
    if (showTrainerModal || isModalTransitioning || !user || !user.rank) return;
    
    console.log('🎮 랭커 카드 열기 (Portal 사용):', user.anonymousName);
    
    setIsModalTransitioning(true);
    setSelectedTrainer({
      ...user,
      uniqueId: `${user.rank}-${user.anonymousName}-${Date.now()}`
    });
    setShowTrainerModal(true);
    
    setTimeout(() => setIsModalTransitioning(false), 500);
  };
  
  const closeTrainerCard = () => {
    if (isModalTransitioning) return;
    
    console.log('🎮 랭커 카드 닫기');
    
    setIsModalTransitioning(true);
    setShowTrainerModal(false);
    
    setTimeout(() => {
      setSelectedTrainer(null);
      setIsModalTransitioning(false);
    }, 500);
  };

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
                    className={`${getGameTierStyle(user.rank, user.isCurrentUser)} vip-rank-container cursor-pointer hover:scale-[1.02] transition-transform`}
                    onClick={() => openTrainerCard(user)}
                    title="클릭하면 랭커 카드를 볼 수 있어요!"
                  >
                    {/* 순위 + 티어 아이콘 */}
                    <div className="flex items-center gap-3 min-w-[80px]">
                      <span className="text-2xl">{tierInfo.emoji}</span>
                      {tierInfo.icon}
                      <div className="text-sm font-bold text-gray-800">#{user.rank}</div>
                    </div>

                    {/* 닉네임 + 티어 + 소감 - 가로폭 제한 완화 */}
                    <div className="flex-1 min-w-0 px-3">
                      <div className="flex items-center gap-1 flex-nowrap">
                        <div className={`${getGameTierTextStyle(user.rank, user.isCurrentUser)} truncate`} style={{ maxWidth: '100px' }}>
                          {user.anonymousName}
                        </div>
                        {user.isCurrentUser && (
                          <span className="text-xs bg-blue-500 text-white px-1 py-0.5 rounded-full whitespace-nowrap font-bold flex-shrink-0">
                            나
                          </span>
                        )}
                        {/* 🏆 게임 티어 배지 - 모바일에서는 아예 숨김, 데스크톱에서도 작게 + 줄바꿈 방지 */}
                        {tierName && (
                          <span className={`text-xs px-1 py-0.5 rounded font-black whitespace-nowrap border flex-shrink-0 hidden lg:inline ${
                            user.rank === 1 ? 'bg-yellow-100 text-yellow-900 border-yellow-400' :
                            user.rank === 2 ? 'bg-cyan-100 text-cyan-900 border-cyan-400' :
                            user.rank === 3 ? 'bg-blue-100 text-blue-900 border-blue-400' :
                            user.rank === 4 ? 'bg-teal-100 text-teal-900 border-teal-400' :
                            user.rank === 5 ? 'bg-yellow-100 text-yellow-900 border-yellow-400' :
                            user.rank === 6 ? 'bg-gray-100 text-gray-900 border-gray-400' :
                            'bg-orange-100 text-orange-900 border-orange-400'
                          }`}>
                            {tierName}
                          </span>
                        )}
                      </div>
                      {/* 소감 - 연한 느낌으로 + 가로폭 제한 완화 */}
                      {user.comment && (
                        <div className="pokemon-font text-xs text-gray-600 mt-1 truncate w-full" 
                             style={{ maxWidth: '180px' }}>
                          📝 {user.comment.length > 12 ? user.comment.slice(0, 12) + '...' : user.comment}
                        </div>
                      )}
                    </div>

                    {/* 시간 */}
                    <div className="text-right min-w-[80px]">
                      <div className={getGameTierTimeStyle(user.rank, user.isCurrentUser)}>
                        {user.timeDisplay}
                      </div>
                    </div>
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
                            flex items-center gap-3 p-3 rounded-lg transition-all text-sm cursor-pointer hover:scale-[1.01]
                            ${user.isCurrentUser 
                              ? 'bg-blue-100 border-2 border-blue-400 shadow-md' 
                              : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                            }
                          `}
                          onClick={() => openTrainerCard(user)}
                          title="클릭하면 랭커 카드를 볼 수 있어요!"
                        >
                          {/* 순위 + 티어 아이콘 */}
                          <div className="flex items-center gap-2 min-w-[60px]">
                            <span className="text-sm">{tierInfo.emoji}</span>
                            <span className="text-xs font-bold text-gray-600">#{user.rank}</span>
                          </div>

                          {/* 닉네임 + 소감 - 가로폭 제한 완화 */}
                          <div className="flex-1 min-w-0 px-2">
                            <div className={`
                              pokemon-font text-xs font-bold truncate
                              ${user.isCurrentUser ? 'text-blue-700' : 'text-gray-700'}
                            `} style={{ maxWidth: '150px' }}>
                              {user.anonymousName.length > 10 ? user.anonymousName.slice(0, 10) + '...' : user.anonymousName}
                              {user.isCurrentUser && (
                                <span className="ml-1 text-xs bg-blue-500 text-white px-1 py-0.5 rounded-full">
                                  나
                                </span>
                              )}
                            </div>
                            {/* 소감 표시 + 길이 제한 완화 */}
                            {user.comment && (
                              <div className="pokemon-font text-xs text-gray-400 mt-1 truncate" 
                                   style={{ maxWidth: '130px' }}>
                                📝 {user.comment.length > 10 ? user.comment.slice(0, 10) + '...' : user.comment}
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
            
            {/* 🎮 랭커 카드 모달 - 최종 안정화 */}
            {showTrainerModal && selectedTrainer && selectedTrainer.rank && !isModalTransitioning && (
              <TrainerCardModal 
                key={selectedTrainer.uniqueId || `trainer-${selectedTrainer.rank}-${selectedTrainer.anonymousName}`}
                showModal={true}
                trainer={selectedTrainer}
                onClose={closeTrainerCard}
                currentLabel={currentLabel}
              />
            )}
            </div>
  );
};

export default RankingSection;
