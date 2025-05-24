import React from 'react';
import { Users, MousePointer, Clock, Zap } from 'lucide-react';

const StatsBar = ({ visits, adClicks, totalTimeWasted, concurrentUsers, extremeMode, currentElapsedTime }) => {
  // 시간을 "분:초" 형태로 포맷팅
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
      <div className="flex items-center gap-8">
        {/* 실시간 추적 표시등 - 항상 깜빡임 */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
          <span className="text-white/80 text-sm">실시간 추적</span>
        </div>

        {/* 동시 접속자 */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-white/80 text-sm">
            {concurrentUsers}명 접속 중
          </span>
        </div>

        {/* 방문 횟수 */}
        <div className="flex items-center gap-2">
          <MousePointer className="w-4 h-4 text-purple-400" />
          <span className="text-white/80 text-sm">
            방문 {visits}회
          </span>
        </div>

        {/* 광고 클릭 */}
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-white/80 text-sm">
            광고 {adClicks}회
          </span>
        </div>

        {/* 총 낭비 시간 - 실시간 업데이트 */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-400" />
          <span className="text-white/80 text-sm">
            총 낭비: {formatTime(totalTimeWasted + (currentElapsedTime || 0))}
          </span>
        </div>
      </div>

      {/* 극한 모드 배지 */}
      {extremeMode && (
        <div className="bg-red-500/20 backdrop-blur border border-red-500/30 rounded-lg px-3 py-1">
          <span className="text-red-300 text-sm font-medium animate-pulse">
            🔥 극한 모드
          </span>
        </div>
      )}
    </div>
  );
};

export default StatsBar;