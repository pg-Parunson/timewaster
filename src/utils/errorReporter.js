// 🚨 에러 리포팅 및 모니터링 시스템 (비활성화)
import { logger } from './logger.js';

class ErrorReporter {
  constructor() {
    this.errorQueue = [];
    this.maxQueueSize = 50;
    this.reportingEnabled = false; // 🔇 모든 리포팅 비활성화
  }

  // 🐛 버그 리포트 생성 (비활성화)
  reportBug(category, description, context = {}) {
    // 리포팅 비활성화로 아무 동작 안함
    return null;
  }

  // 🚨 심각도 판단 (비활성화)
  getSeverity(category) {
    return 'LOW';
  }

  // 📝 버그 리포트 로깅 (비활성화)
  logBugReport(report) {
    // 로깅 비활성화
  }

  // 🔍 특정 카테고리 버그 조회
  getBugsByCategory(category) {
    return [];
  }

  // 📊 버그 통계
  getBugStats() {
    return {
      total: 0,
      bySeverity: {},
      byCategory: {},
      recent: []
    };
  }

  // 🧹 오래된 버그 리포트 정리
  cleanup(daysToKeep = 7) {
    // 비활성화
  }

  // 🚀 버그 리포트 초기화 (테스트용)
  clearReports() {
    this.errorQueue = [];
  }
}

// 싱글톤 인스턴스
export const errorReporter = new ErrorReporter();

// 글로벌 에러 핸들러 등록 (비활성화)
// if (typeof window !== 'undefined') {
//   window.addEventListener('error', (event) => {
//     errorReporter.reportBug('javascript-error', event.message, {
//       filename: event.filename,
//       lineno: event.lineno,
//       colno: event.colno,
//       stack: event.error?.stack
//     });
//   });

//   window.addEventListener('unhandledrejection', (event) => {
//     errorReporter.reportBug('promise-rejection', event.reason?.message || 'Promise rejected', {
//       reason: event.reason,
//       stack: event.reason?.stack
//     });
//   });
// }

export default ErrorReporter;
