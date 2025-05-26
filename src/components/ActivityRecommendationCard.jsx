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

  // 테마 색상을 직접 매핑하여 Tailwind 동적 클래스 문제 해결
  const getThemeColors = (colorName) => {
    const colorMap = {
      emerald: {
        gradient: 'from-emerald-400 to-emerald-600',
        bg: 'bg-emerald-400/95',
        text: 'text-emerald-50',
        border: 'border-emerald-300/80',
        shadow: 'shadow-emerald-400/40'
      },
      cyan: {
        gradient: 'from-cyan-400 to-cyan-600', 
        bg: 'bg-cyan-400/95',
        text: 'text-cyan-50',
        border: 'border-cyan-300/80',
        shadow: 'shadow-cyan-400/40'
      },
      violet: {
        gradient: 'from-violet-400 to-violet-600',
        bg: 'bg-violet-400/95', 
        text: 'text-violet-50',
        border: 'border-violet-300/80',
        shadow: 'shadow-violet-400/40'
      },
      amber: {
        gradient: 'from-amber-400 to-amber-600',
        bg: 'bg-amber-400/95',
        text: 'text-amber-50', 
        border: 'border-amber-300/80',
        shadow: 'shadow-amber-400/40'
      },
      rose: {
        gradient: 'from-rose-400 to-rose-600',
        bg: 'bg-rose-400/95',
        text: 'text-rose-50',
        border: 'border-rose-300/80', 
        shadow: 'shadow-rose-400/40'
      },
      blue: {
        gradient: 'from-blue-400 to-blue-600',
        bg: 'bg-blue-400/95',
        text: 'text-blue-50',
        border: 'border-blue-300/80',
        shadow: 'shadow-blue-400/40'
      },
      fuchsia: {
        gradient: 'from-fuchsia-400 to-fuchsia-600',
        bg: 'bg-fuchsia-400/95', 
        text: 'text-fuchsia-50',
        border: 'border-fuchsia-300/80',
        shadow: 'shadow-fuchsia-400/40'
      },
      yellow: {
        gradient: 'from-yellow-400 to-yellow-600',
        bg: 'bg-yellow-400/95',
        text: 'text-yellow-50',
        border: 'border-yellow-300/80',
        shadow: 'shadow-yellow-400/40'
      },
      teal: {
        gradient: 'from-teal-400 to-teal-600',
        bg: 'bg-teal-400/95',
        text: 'text-teal-50', 
        border: 'border-teal-300/80',
        shadow: 'shadow-teal-400/40'
      },
      pink: {
        gradient: 'from-pink-400 to-pink-600',
        bg: 'bg-pink-400/95',
        text: 'text-pink-50',
        border: 'border-pink-300/80',
        shadow: 'shadow-pink-400/40'
      }
    };
    return colorMap[colorName] || colorMap.emerald;
  };

  const themeColors = getThemeColors(theme.color);

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
      '매우 쉬움': 'bg-green-400/90 text-green-50 border border-green-300/70 shadow-lg',
      '쉬움': 'bg-blue-400/90 text-blue-50 border border-blue-300/70 shadow-lg',
      '보통': 'bg-yellow-400/90 text-yellow-50 border border-yellow-300/70 shadow-lg',
      '어려움': 'bg-orange-400/90 text-orange-50 border border-orange-300/70 shadow-lg',
      '매우 어려움': 'bg-red-400/90 text-red-50 border border-red-300/70 shadow-lg',
      '전문가': 'bg-purple-400/90 text-purple-50 border border-purple-300/70 shadow-lg',
      '레전드': 'bg-pink-400/90 text-pink-50 border border-pink-300/70 shadow-lg'
    };
    return colors[difficulty] || 'bg-gray-400/90 text-gray-50 border border-gray-300/70 shadow-lg';
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
      {/* 헤더 - 더 밝고 가운데 정렬 */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${themeColors.gradient} flex items-center justify-center shadow-lg`}>
          <span className="text-2xl">{theme.icon}</span>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${themeColors.gradient} ${themeColors.text} text-sm font-bold border ${themeColors.border} shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105`}
              style={{
                textShadow: '0 1px 2px rgba(0,0,0,0.6)',
                boxShadow: `0 3px 12px rgba(16, 185, 129, 0.5)`
              }}
            >
              <span className="font-bold">{theme.description}</span>
            </span>
          </div>
          <p className="text-white/70 text-sm font-medium">{timeSpent} 활용 가능</p>
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

      {/* 최적 활동 (현재 시간대 기준) - 더 밝고 선명한 색상 */}
      {optimalActivities && optimalActivities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <h5 className="text-white font-medium text-sm mb-2">🌟 지금 시간대 최적 활동</h5>
          <div className="flex flex-wrap gap-2">
            {optimalActivities.slice(0, 4).map((activity, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gradient-to-r from-yellow-400/95 to-orange-400/95 text-yellow-50 text-xs font-bold rounded-full border border-yellow-300/80 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                style={{
                  textShadow: '0 1px 2px rgba(0,0,0,0.6)',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)'
                }}
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