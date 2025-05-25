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
            <div className="relative retro-timer-container">
              {/* 레트로 CRT 모니터 효과 */}
              <div 
                className="absolute inset-0 bg-slate-900/90 border-4 border-slate-700"
                style={{
                  borderRadius: '0px',
                  boxShadow: `
                    inset 0 0 20px rgba(0,0,0,0.8),
                    0 0 0 2px #334155,
                    0 0 30px rgba(139, 92, 246, 0.3)
                  `
                }}
              ></div>
              
              {/* 스캔라인 효과 */}
              <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent animate-pulse"></div>
              </div>
              
              <div 
                className={`relative text-5xl md:text-7xl lg:text-8xl font-mono font-bold px-8 py-4 retro-time-display ${
                  extremeMode 
                    ? 'text-red-400' 
                    : 'text-cyan-400'
                }`}
                style={{
                  fontFamily: 'monospace, "Courier New", monospace',
                  textShadow: extremeMode 
                    ? `
                        0 0 10px #ef4444,
                        0 0 20px #dc2626,
                        0 0 30px #b91c1c,
                        1px 1px 0px #000
                      `
                    : `
                        0 0 10px #22d3ee,
                        0 0 20px #06b6d4,
                        0 0 30px #0891b2,
                        1px 1px 0px #000
                      `,
                  letterSpacing: '4px',
                  filter: extremeMode ? 'hue-rotate(15deg) saturate(1.2)' : 'none'
                }}
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
