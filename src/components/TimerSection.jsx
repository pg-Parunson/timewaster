import React from 'react';
import { Brain } from 'lucide-react';
import { getTimeBasedActivityRecommendation, ACTIVITY_THEMES } from '../data/timeBasedActivities';

const TimerSection = ({ elapsedTime = 0, extremeMode = false }) => {
  const activityRecommendation = getTimeBasedActivityRecommendation(elapsedTime);
  const currentActivity = {
    activity: activityRecommendation.activities[0] || '생산적인 일',
    icon: ACTIVITY_THEMES[activityRecommendation.category]?.icon || '🎨',
    category: ACTIVITY_THEMES[activityRecommendation.category]?.description || '생산성'
  };

  return (
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
  );
};

export default TimerSection;
