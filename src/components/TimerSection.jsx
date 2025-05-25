import React from 'react';
import { Brain } from 'lucide-react';
import { getTimeBasedActivityRecommendation, ACTIVITY_THEMES } from '../data/timeBasedActivities';
import { formatTime } from '../utils/helpers';

const TimerSection = ({ elapsedTime = 0, extremeMode = false }) => {
  const activityRecommendation = getTimeBasedActivityRecommendation(elapsedTime);
  const currentActivity = {
    activity: activityRecommendation.activities[0] || '생산적인 일',
    icon: ACTIVITY_THEMES[activityRecommendation.category]?.icon || '🎨',
    category: ACTIVITY_THEMES[activityRecommendation.category]?.description || '생산성'
  };

  return (
    <div className="lg:col-span-2">
      <div className="text-center mb-6">
        <div className="relative mb-6">
          <div className="inline-flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-2xl opacity-50"></div>
              <div 
                className={`relative text-5xl md:text-7xl lg:text-8xl font-mono font-bold ${
                  extremeMode 
                    ? 'text-red-400' 
                    : 'bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent'
                }`}
              >
                {formatTime(elapsedTime)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="text-white/80 font-medium text-sm">지금 이 시간에 할 수 있었던 일</span>
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="text-2xl">{currentActivity.icon}</div>
            <div className="text-xl lg:text-2xl font-bold text-white">
              {currentActivity.activity}
            </div>
          </div>
          
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${
            `from-${ACTIVITY_THEMES[activityRecommendation.category]?.color || 'blue'}-500/20 to-${ACTIVITY_THEMES[activityRecommendation.category]?.color || 'blue'}-600/20`
          } shadow-lg`}>
            <span className="font-medium text-sm">{currentActivity.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerSection;
