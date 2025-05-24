import React from 'react';

const StatsBar = ({ visits = 0, adClicks = 0, totalTimeWasted = 0, concurrentUsers = 0, extremeMode = false }) => {
  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-white/80 text-sm">실시간 추적</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/70">동시 접속 {concurrentUsers}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6 text-sm">
        <span className="text-white/70">방문 {visits}</span>
        <span className="text-white/70">광고 {adClicks}</span>
        <span className="text-white/70">총 낭비 {Math.floor(totalTimeWasted / 60)}분</span>
      </div>
    </div>
  );
};

export default StatsBar;
