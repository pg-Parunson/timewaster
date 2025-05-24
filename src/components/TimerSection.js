import React from 'react';
import { Brain } from 'lucide-react';
import { getTimeBasedActivity, CATEGORY_COLORS } from '../data/timeBasedActivities';
import { formatTime } from '../utils/helpers';

// 타이머 및 활동 제안 컴포넌트
const TimerSection = ({ elapsedTime, extremeMode }) => {
  const currentActivity = getTimeBasedActivity(elapsedTime);

  return (
    <div className="lg:col-span-2">
      {/* 타이머 디스플레이 */}
      <div className="text-center mb-6">
        <div className="relative mb-6">
          <div className="inline-flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div 
                className={`relative text-5xl md:text-7xl lg:text-8xl font-mono font-bold ${
                  extremeMode 
                    ? 'text-red-400 animate-pulse' 
                    : 'bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent'
                }`}
                style={{
                  textShadow: extremeMode 
                    ? '0 0 30px rgba(239, 68, 68, 0.8)' 
                    : '0 0 20px rgba(239, 68, 68, 0.5)'
                }}
              >
                {formatTime(elapsedTime)}
              </div>
            </div>
          </div>
        </div>

        {/* 활동 제안 카드 */}
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
            CATEGORY_COLORS[currentActivity.category] || CATEGORY_COLORS["기본"]
          } shadow-lg`}>
            <span className="font-medium text-sm">{currentActivity.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerSection;
