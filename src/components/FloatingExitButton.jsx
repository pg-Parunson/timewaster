import React from 'react';
import { DoorOpen } from 'lucide-react';

// 탈출 버튼 컴포넌트 - 하단 액션 영역용으로 수정
const FloatingExitButton = ({ elapsedTime, onExit, inline = false, showAlways = false }) => {
  // showAlways가 true면 항상 표시, 아니면 3분 후에 표시
  if (!showAlways && elapsedTime <= 180) return null;

  // 인라인 모드 (하단 액션 바용)
  if (inline) {
    return (
      <button
        onClick={onExit}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 font-medium border border-red-400"
        title="현실로 돌아가기"
      >
        <DoorOpen className="w-5 h-5" />
        <span>현실 탈출</span>
      </button>
    );
  }

  // 기존 플로팅 모드 (백업용)
  return (
    <button
      onClick={onExit}
      className="fixed bottom-8 right-8 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white p-4 rounded-full shadow-2xl animate-bounce z-50 backdrop-blur border border-red-400 group floating-button"
      title="현실로 돌아가기"
    >
      <div className="flex items-center gap-2">
        <DoorOpen className="w-6 h-6" />
        <span className="hidden group-hover:block text-sm font-medium whitespace-nowrap bg-black/70 px-2 py-1 rounded absolute bottom-full mb-2 right-0">
          현실로 돌아가기
        </span>
      </div>
    </button>
  );
};

export default FloatingExitButton;