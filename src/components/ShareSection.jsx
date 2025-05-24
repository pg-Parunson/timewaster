import React from 'react';
import { Heart, Share2, MessageCircle, Copy } from 'lucide-react';
import { sharing } from '../utils/sharing';

// 공유 섹션 컴포넌트
const ShareSection = ({ elapsedTime, formatTime, showModernModal }) => {
  const handleShareToX = () => {
    sharing.shareToX(elapsedTime, formatTime);
  };

  const handleShareToKakao = () => {
    sharing.shareToKakao(elapsedTime, formatTime, showModernModal);
  };

  const handleCopyToClipboard = () => {
    sharing.copyToClipboard(null, showModernModal, elapsedTime, formatTime);
  };

  return (
    <div className="border-t border-white/10 pt-6">
      <div className="flex items-center justify-center gap-4 mb-4">
        <Heart className="w-5 h-5 text-pink-400 animate-pulse" />
        <span className="text-white/80 text-base font-medium">친구들도 시간 낭비시켜보자</span>
        <Share2 className="w-5 h-5 text-blue-400" />
      </div>
      
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={handleShareToX}
          className="bg-black/30 hover:bg-black/50 border border-gray-400/50 text-white px-4 py-2 rounded-xl flex items-center gap-2 transform hover:scale-105 transition-all duration-200 backdrop-blur text-sm"
        >
          <div className="w-4 h-4 flex items-center justify-center">
            {/* X 로고 SVG */}
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
          <span>X에서 공유</span>
        </button>
        
        <button
          onClick={handleShareToKakao}
          className="bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-400/50 text-yellow-200 px-4 py-2 rounded-xl flex items-center gap-2 transform hover:scale-105 transition-all duration-200 backdrop-blur text-sm"
        >
          {/* 카카오톡 로고 SVG - 최신 디자인 */}
          <div className="w-4 h-4 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
              <path d="M12 3C6.477 3 2 6.477 2 11.5c0 3.518 2.196 6.612 5.5 8.5v3l3.5-3c.5.1 1 .1 1.5 0l3.5 3v-3c3.304-1.888 5.5-4.982 5.5-8.5C22 6.477 17.523 3 12 3z"/>
            </svg>
          </div>
          <span>카카오톡</span>
        </button>
        
        <button
          onClick={handleCopyToClipboard}
          className="bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/50 text-gray-200 px-4 py-2 rounded-xl flex items-center gap-2 transform hover:scale-105 transition-all duration-200 backdrop-blur text-sm"
        >
          <Copy className="w-4 h-4" />
          <span>링크 복사</span>
        </button>
      </div>
    </div>
  );
};

export default ShareSection;
