// 🛠️ 로깅 유틸리티 - 개발/운영 환경 구분
// Production 빌드에서는 모든 console.* 이 자동 제거됨 (vite.config.js 설정)

const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';

// 개발 모드에서만 로그 출력
export const logger = {
  debug: (...args) => {
    if (isDev) {
      console.log('🐛 [DEBUG]', ...args);
    }
  },
  
  info: (...args) => {
    if (isDev) {
      console.info('ℹ️ [INFO]', ...args);
    }
  },
  
  warn: (...args) => {
    if (isDev) {
      console.warn('⚠️ [WARN]', ...args);
    }
  },
  
  error: (...args) => {
    if (isDev) {
      console.error('❌ [ERROR]', ...args);
    }
  },
  
  firebase: (...args) => {
    if (isDev) {
      console.log('🔥 [Firebase]', ...args);
    }
  },
  
  ranking: (...args) => {
    if (isDev) {
      console.log('🏆 [Ranking]', ...args);
    }
  },
  
  chat: (...args) => {
    if (isDev) {
      console.log('💬 [Chat]', ...args);
    }
  },
  
  stats: (...args) => {
    if (isDev) {
      console.log('📊 [Stats]', ...args);
    }
  }
};

// 성능 측정 도구 (개발 모드 전용)
export const performance = {
  start: (label) => {
    if (isDev) {
      console.time(`⏱️ ${label}`);
    }
  },
  
  end: (label) => {
    if (isDev) {
      console.timeEnd(`⏱️ ${label}`);
    }
  }
};

export default logger;
