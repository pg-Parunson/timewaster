import { analytics } from './analytics';

// 공유 관련 유틸리티 함수들
export const sharing = {
  // X(트위터)에 공유
  shareToX: (elapsedTime, formatTime) => {
    analytics.trackShare('x', elapsedTime);
    
    const text = `나는 이 시간낭비 사이트에서 ${formatTime(elapsedTime)}를 날렸습니다. 너도 똑같이 당해보시겠어요?`;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`, '_blank');
  },

  // 카카오톡에 공유
  shareToKakao: (elapsedTime, formatTime, showModernModal) => {
    analytics.trackShare('kakao', elapsedTime);
    
    // 카카오 SDK가 로드되었는지 확인
    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
      try {
        Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: '🕒 시간낭비 계산기',
            description: `나는 이 사이트에서 ${formatTime(elapsedTime)}를 날렸습니다! 너도 똑같이 당해보시겠어요? 😂`,
            imageUrl: 'https://pg-parunson.github.io/timewaster/timer-icon.svg',
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
          buttons: [
            {
              title: '시간낭비 시작하기',
              link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
              },
            },
          ],
        });
        
        showModernModal("카카오톡 공유 완료!", "카카오톡으로 친구들에게 시간낭비를 공유했습니다! 🎉", 'success');
        
      } catch (error) {
        console.error('카카오톡 공유 오류:', error);
        sharing.fallbackKakaoShare(elapsedTime, formatTime, showModernModal);
      }
    } else {
      sharing.fallbackKakaoShare(elapsedTime, formatTime, showModernModal);
    }
  },

  // 폴백 공유 방법
  fallbackKakaoShare: (elapsedTime, formatTime, showModernModal) => {
    const text = `🕒 시간낭비 계산기\n\n나는 이 사이트에서 ${formatTime(elapsedTime)}를 날렸습니다! 너도 똑같이 당해보시겠어요? 😂\n\n${window.location.href}`;
    
    if (navigator.share) {
      navigator.share({
        title: '🕒 시간낭비 계산기',
        text: text,
        url: window.location.href
      });
    } else {
      sharing.copyToClipboard(text, showModernModal);
    }
  },

  // 클립보드에 복사
  copyToClipboard: (text, showModernModal, elapsedTime, formatTime) => {
    const shareText = text || `나는 이 시간낭비 사이트에서 ${formatTime(elapsedTime)}를 날렸습니다. 너도 똑같이 당해보시겠어요?\n\n${window.location.href}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    showModernModal("복사 완료!", "공유 메시지가 클립보드에 복사되었습니다!", 'success');
  }
};
