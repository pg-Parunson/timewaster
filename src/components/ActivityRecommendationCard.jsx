import React from 'react';
import { Clock, Lightbulb, Brain, Target, Zap } from 'lucide-react';

const ActivityRecommendationCard = ({ 
  recommendation, 
  theme, 
  onActivitySelect = () => {} 
}) => {
  if (!recommendation) return null;

  const {
    timeSpent,
    activities,
    message,
    category,
    difficulty,
    brainState,
    energyLevel,
    focusLevel,
    timeOptimization,
    personalizedTip,
    optimalActivities
  } = recommendation;

  const getEnergyColor = (level) => {
    switch(level) {
      case '낮음': return 'text-yellow-600';
      case '중간': return 'text-orange-600';
      case '높음': return 'text-green-600';
      case '최고': return 'text-emerald-600';
      default: return 'text-gray-600';
    }
  };

  const getDifficultyBadge = (difficulty) => {
    const colors = {
      '매우 쉬움': 'bg-green-100 text-green-800',
      '쉬움': 'bg-blue-100 text-blue-800',
      '보통': 'bg-yellow-100 text-yellow-800',
      '어려움': 'bg-orange-100 text-orange-800',
      '매우 어려움': 'bg-red-100 text-red-800',
      '전문가': 'bg-purple-100 text-purple-800',
      '레전드': 'bg-pink-100 text-pink-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-${theme.color}-400 to-${theme.color}-600 flex items-center justify-center`}>
          <span className="text-xl">{theme.icon}</span>
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">{theme.description}</h3>
          <p className="text-white/70 text-sm">{timeSpent} 활용 가능</p>
        </div>
      </div>

      {/* 메인 메시지 */}
      <div className="mb-4">
        <p className="text-white text-lg font-medium mb-2">{message}</p>
        {personalizedTip && (
          <p className="text-cyan-300 text-sm italic">{personalizedTip}</p>
        )}
      </div>

      {/* 상태 정보 */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <Brain className="w-5 h-5 mx-auto mb-1 text-purple-400" />
          <p className="text-white text-sm font-medium">{brainState}</p>
        </div>
        <div className="text-center">
          <Zap className={`w-5 h-5 mx-auto mb-1 ${getEnergyColor(energyLevel)}`} />
          <p className="text-white text-sm">에너지: {energyLevel}</p>
        </div>
        <div className="text-center">
          <Target className={`w-5 h-5 mx-auto mb-1 ${getEnergyColor(focusLevel)}`} />
          <p className="text-white text-sm">집중: {focusLevel}</p>
        </div>
      </div>

      {/* 난이도 배지 */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyBadge(difficulty)}`}>
          {difficulty}
        </span>
        <span className="text-white/60 text-xs">{category} 카테고리</span>
      </div>

      {/* 추천 활동 리스트 */}
      <div className="mb-4">
        <h4 className="text-white font-medium mb-2 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          지금 할 수 있는 활동들
        </h4>
        <div className="space-y-2">
          {activities.slice(0, 3).map((activity, index) => (
            <button
              key={index}
              onClick={() => onActivitySelect(activity)}
              className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 group"
            >
              <span className="text-white group-hover:text-cyan-300 transition-colors">
                {index + 1}. {activity}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 시간 최적화 팁 */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg p-3 border border-cyan-300/20">
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="text-cyan-300 font-medium text-sm mb-1">⏰ 시간 최적화 팁</h5>
            <p className="text-white/80 text-sm leading-relaxed">{timeOptimization}</p>
          </div>
        </div>
      </div>

      {/* 최적 활동 (현재 시간대 기준) */}
      {optimalActivities && optimalActivities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <h5 className="text-white font-medium text-sm mb-2">🌟 지금 시간대 최적 활동</h5>
          <div className="flex flex-wrap gap-2">
            {optimalActivities.slice(0, 4).map((activity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-300 text-xs rounded-full border border-yellow-400/30"
              >
                {activity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <button
          onClick={() => onActivitySelect('start_activity')}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
        >
          🚀 지금 바로 시작하기
        </button>
      </div>
    </div>
  );
};

export default ActivityRecommendationCard;