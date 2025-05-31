// 🛠️ 로깅 유틸리티 - 개발/운영 환경 구분
// Production 빌드에서는 모든 console.* 이 자동 제거됨 (vite.config.js 설정)

const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';

// 🎯 중요 로그만 출력하는 필터링 시스템
const IMPORTANT_ONLY = false; // 🔧 버그 수정 테스트를 위해 임시로 false

// 개발 모드에서만 로그 출력
export const logger = {
  // 🎯 최우선 디버그 로그 (항상 출력)
  critical: (...args) => {
    if (isDev) {
      console.log('🚨 [CRITICAL]', ...args);
    }
  },
  
  debug: (...args) => {
    if (isDev && !IMPORTANT_ONLY) {
      console.log('🐛 [DEBUG]', ...args);
    }
  },
  
  info: (...args) => {
    if (isDev && !IMPORTANT_ONLY) {
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
  
  // 🎯 Firebase 중요 로그만
  firebase: (...args) => {
    if (isDev) {
      console.log('🔥 [Firebase]', ...args);
    }
  },
  
  // 🎯 랭킹 중요 로그만
  ranking: (...args) => {
    if (isDev) {
      console.log('🏆 [Ranking]', ...args);
    }
  },
  
  // 🎯 채팅 중요 로그만
  chat: (...args) => {
    if (isDev && !IMPORTANT_ONLY) {
      console.log('💬 [Chat]', ...args);
    }
  },
  
  // 🎯 통계 핵심 로그만
  stats: (...args) => {
    if (isDev) {
      console.log('📊 [Stats]', ...args);
    }
  }
};

// 성능 측정 도구 (개발 모드 전용)
export const performance = {
  start: (label) => {
    if (isDev && !IMPORTANT_ONLY) {
      console.time(`⏱️ ${label}`);
    }
  },
  
  end: (label) => {
    if (isDev && !IMPORTANT_ONLY) {
      console.timeEnd(`⏱️ ${label}`);
    }
  }
};

export default logger;
