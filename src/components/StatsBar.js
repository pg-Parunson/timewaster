import React from 'react';
import { Clock, Target, Sparkles, Users, Skull } from 'lucide-react';

// 상단 통계 바 컴포넌트
const StatsBar = ({ visits, adClicks, totalTimeWasted, concurrentUsers, extremeMode }) => {
  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full status-indicator"></div>
          <span className="text-white/80 text-sm">실시간 추적</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-white/70">동시 접속 <span className="text-blue-400 font-semibold">{concurrentUsers}</span></span>
        </div>
        {extremeMode && (
          <div className="flex items-center gap-2">
            <Skull className="w-4 h-4 text-red-500" />
            <span className="text-red-400 text-sm font-medium">극한 모드</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-400" />
          <span className="text-white/70">방문 <span className="text-blue-400 font-semibold">{visits}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-white/70">광고 <span className="text-yellow-400 font-semibold">{adClicks}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-400" />
          <span className="text-white/70">총 낭비 <span className="text-red-400 font-semibold">{Math.floor(totalTimeWasted / 60)}분</span></span>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
