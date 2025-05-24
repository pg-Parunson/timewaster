// 시간 포맷팅 유틸리티
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}분 ${secs.toString().padStart(2, '0')}초`;
};

// 한국어 조사 처리 유틸리티
export const getParticle = (word, type) => {
  if (!word || typeof word !== 'string') return '';
  
  // 마지막 글자의 유니코드
  const lastChar = word[word.length - 1];
  const lastCharCode = lastChar.charCodeAt(0);
  
  // 한글 범위 확인 (가-힣)
  if (lastCharCode >= 0xAC00 && lastCharCode <= 0xD7A3) {
    // 받침 있는지 확인 (한글 완성형 공식)
    const hasBatchim = (lastCharCode - 0xAC00) % 28 !== 0;
    
    switch (type) {
      case '을를':
        return hasBatchim ? '을' : '를';
      case '이가':
        return hasBatchim ? '이' : '가';
      case '은는':
        return hasBatchim ? '은' : '는';
      case '과와':
        return hasBatchim ? '과' : '와';
      case '아으로':
        return hasBatchim ? '으로' : '로';
      default:
        return '';
    }
  } else {
    // 한글이 아닌 경우 (영어, 숫자 등)
    // 영어나 숫자는 대부분 받침 없음으로 처리
    switch (type) {
      case '을를':
        return '를';
      case '이가':
        return '가';
      case '은는':
        return '는';
      case '과와':
        return '와';
      case '아으로':
        return '로';
      default:
        return '';
    }
  }
};

// 동시 접속자 시뮬레이션 로직
export const calculateConcurrentUsers = () => {
  const hour = new Date().getHours();
  let baseUsers = 3;
  let timeWeight = 1;
  
  if (hour >= 9 && hour <= 12) timeWeight = 1.3;
  else if (hour >= 14 && hour <= 18) timeWeight = 1.5;
  else if (hour >= 19 && hour <= 23) timeWeight = 1.8;
  else if (hour >= 0 && hour <= 2) timeWeight = 1.2;
  else timeWeight = 0.8;

  const variation = (Math.random() - 0.5) * 4;
  return Math.max(1, Math.min(15, Math.round(baseUsers * timeWeight + variation)));
};

// 클립보드 복사 유틸리티
export const copyToClipboard = (text) => {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return Promise.resolve();
  }
};

// 타이핑 애니메이션 유틸리티
export const createTypingAnimation = (message, onUpdate, onComplete) => {
  let index = 0;
  let currentText = "";
  
  const type = () => {
    if (index < message.length) {
      currentText += message.charAt(index);
      onUpdate(currentText);
      index++;
      return setTimeout(type, 30 + Math.random() * 20);
    } else {
      onComplete();
      return null;
    }
  };
  
  return type();
};
