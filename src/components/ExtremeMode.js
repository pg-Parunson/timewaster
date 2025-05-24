import React from 'react';
import { Skull } from 'lucide-react';

// 극한 모드 경고 컴포넌트
const ExtremeMode = ({ extremeMode, elapsedTime }) => {
  if (!extremeMode) return null;

  return (
    <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-2xl backdrop-blur">
      <div className="flex items-center justify-center gap-2">
        <Skull className="w-5 h-5 text-red-400 animate-bounce" />
        <p className="text-red-200 font-bold text-base">
          경고: 5분을 넘겼습니다! 이제 정말로 심각한 시간낭비입니다!
        </p>
        <Skull className="w-5 h-5 text-red-400 animate-bounce" />
      </div>
    </div>
  );
};

export default ExtremeMode;
