// 🛠️ 로깅 유틸리티 - 운영 환경 최적화 (모든 로그 비활성화)
// Production 빌드에서는 모든 console.* 이 자동 제거됨 (vite.config.js 설정)

const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';

// 🔇 모든 로그 비활성화 (필요시 개별적으로 활성화)
const LOGGING_DISABLED = true;

// 개발 모드에서도 로그 출력 안함 (성능 최적화)
export const logger = {
  // 🎯 최우선 디버그 로그 (비활성화)
  critical: (...args) => {
    // if (isDev && !LOGGING_DISABLED) {
    //   console.log('🚨 [CRITICAL]', ...args);
    // }
  },
  
  debug: (...args) => {
    // if (isDev && !LOGGING_DISABLED) {
    //   console.log('🐛 [DEBUG]', ...args);
    // }
  },
  
  info: (...args) => {
    // if (isDev && !LOGGING_DISABLED) {
    //   console.info('ℹ️ [INFO]', ...args);
    // }
  },
  
  warn: (...args) => {
    // if (isDev && !LOGGING_DISABLED) {
    //   console.warn('⚠️ [WARN]', ...args);
    // }
  },
  
  error: (...args) => {
    // if (isDev && !LOGGING_DISABLED) {
    //   console.error('❌ [ERROR]', ...args);
    // }
  },
  
  // 🎯 Firebase 로그 (비활성화)
  firebase: (...args) => {
    // if (isDev && !LOGGING_DISABLED) {
    //   console.log('🔥 [Firebase]', ...args);
    // }
  },
  
  // 🎯 랭킹 로그 (비활성화)
  ranking: (...args) => {
    // if (isDev && !LOGGING_DISABLED) {
    //   console.log('🏆 [Ranking]', ...args);
    // }
  },
  
  // 🎯 채팅 로그 (비활성화)
  chat: (...args) => {
    // if (isDev && !LOGGING_DISABLED) {
    //   console.log('💬 [Chat]', ...args);
    // }
  },
  
  // 🎯 통계 로그 (비활성화)
  stats: (...args) => {
    // if (isDev && !LOGGING_DISABLED) {
    //   console.log('📊 [Stats]', ...args);
    // }
  }
};

// 성능 측정 도구 (비활성화)
export const performance = {
  start: (label) => {
    // if (isDev && !LOGGING_DISABLED) {
    //   console.time(`⏱️ ${label}`);
    // }
  },
  
  end: (label) => {
    // if (isDev && !LOGGING_DISABLED) {
    //   console.timeEnd(`⏱️ ${label}`);
    // }
  }
};

export default logger;
