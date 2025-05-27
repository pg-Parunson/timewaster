import React from 'react';
import { Heart, Share2, MessageCircle, Copy } from 'lucide-react';
import { sharing } from '../utils/sharing';

// 포켓몬 스타일 공유 섹션 컴포넌트
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
    <div className="text-center">
      {/* 포켓몬 스타일 제목 */}
      <div className="pokemon-font text-lg mb-6 text-gray-800 flex items-center justify-center gap-2">
        <Heart className="w-5 h-5 text-red-500 animate-pulse" />
        <span>친구들도 시간낭비시키기</span>
        <Share2 className="w-5 h-5 text-blue-500" />
      </div>
      
      {/* 포켓몬 스타일 버튼들 */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleShareToX}
          className="pokemon-button w-full flex items-center justify-center gap-3"
          style={{
            background: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
            color: '#FFFFFF'
          }}
        >
          <div className="w-5 h-5 flex items-center justify-center">
            {/* X 로고 SVG */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
          <span className="pokemon-font font-bold">X에서 공유하기</span>
        </button>
        
        <button
          onClick={handleShareToKakao}
          className="pokemon-button w-full flex items-center justify-center gap-3"
          style={{
            background: 'linear-gradient(135deg, #FFEB3B 0%, #FF9800 100%)',
            color: '#000'
          }}
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
              <path d="M12 3C6.477 3 2 6.477 2 11.5c0 3.518 2.196 6.612 5.5 8.5v3l3.5-3c.5.1 1 .1 1.5 0l3.5 3v-3c3.304-1.888 5.5-4.982 5.5-8.5C22 6.477 17.523 3 12 3z"/>
            </svg>
          </div>
          <span className="pokemon-font">카카오톡 공유</span>
        </button>
        
        <button
          onClick={handleCopyToClipboard}
          className="pokemon-button w-full flex items-center justify-center gap-3"
          style={{
            background: 'linear-gradient(135deg, #9E9E9E 0%, #607D8B 100%)',
            color: '#FFF'
          }}
        >
          <Copy className="w-5 h-5" />
          <span className="pokemon-font">링크 복사하기</span>
        </button>
      </div>

      {/* 포켓몬 스타일 안내 메시지 */}
      <div className="mt-4 p-3 bg-yellow-100 border-2 border-yellow-400 rounded-lg">
        <div className="pokemon-font text-sm text-yellow-800">
          💡 친구가 이 링크를 클릭하면 똑같이 시간을 낭비하게 됩니다!
        </div>
      </div>
    </div>
  );
};

export default ShareSection;