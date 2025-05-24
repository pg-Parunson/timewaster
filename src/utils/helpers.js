// 시간 포맷팅 유틸리티
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}분 ${secs.toString().padStart(2, '0')}초`;
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
