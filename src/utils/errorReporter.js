// 🚨 에러 리포팅 및 모니터링 시스템
import { logger } from './logger.js';

class ErrorReporter {
  constructor() {
    this.errorQueue = [];
    this.maxQueueSize = 50;
    this.reportingEnabled = import.meta.env.DEV; // 개발 모드에서만 활성화
  }

  // 🐛 버그 리포트 생성
  reportBug(category, description, context = {}) {
    const bugReport = {
      id: `bug_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      category,
      description,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      severity: this.getSeverity(category)
    };

    this.errorQueue.push(bugReport);
    
    // 큐 사이즈 관리
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    // 즉시 로깅
    this.logBugReport(bugReport);

    return bugReport.id;
  }

  // 🚨 심각도 판단
  getSeverity(category) {
    const severityMap = {
      'concurrent-users': 'HIGH',
      'ranking-display': 'HIGH', 
      'firebase-connection': 'CRITICAL',
      'session-management': 'MEDIUM',
      'ui-rendering': 'LOW',
      'performance': 'MEDIUM'
    };
    
    return severityMap[category] || 'LOW';
  }

  // 📝 버그 리포트 로깅
  logBugReport(report) {
    if (!this.reportingEnabled) return;

    const emoji = {
      'CRITICAL': '🚨',
      'HIGH': '⚠️',
      'MEDIUM': '⚡',
      'LOW': '📝'
    }[report.severity] || '📝';

    logger.critical(`${emoji} [BUG-REPORT] ${report.category.toUpperCase()}`, {
      id: report.id,
      description: report.description,
      severity: report.severity,
      context: report.context,
      timestamp: report.timestamp
    });
  }

  // 🔍 특정 카테고리 버그 조회
  getBugsByCategory(category) {
    return this.errorQueue.filter(bug => bug.category === category);
  }

  // 📊 버그 통계
  getBugStats() {
    const stats = {
      total: this.errorQueue.length,
      bySeverity: {},
      byCategory: {},
      recent: this.errorQueue.slice(-10)
    };

    this.errorQueue.forEach(bug => {
      stats.bySeverity[bug.severity] = (stats.bySeverity[bug.severity] || 0) + 1;
      stats.byCategory[bug.category] = (stats.byCategory[bug.category] || 0) + 1;
    });

    return stats;
  }

  // 🧹 오래된 버그 리포트 정리
  cleanup(daysToKeep = 7) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysToKeep);
    
    const before = this.errorQueue.length;
    this.errorQueue = this.errorQueue.filter(bug => 
      new Date(bug.timestamp) > cutoff
    );
    
    const cleaned = before - this.errorQueue.length;
    if (cleaned > 0) {
      logger.info(`🧹 ${cleaned}개의 오래된 버그 리포트를 정리했습니다.`);
    }
  }

  // 🚀 버그 리포트 초기화 (테스트용)
  clearReports() {
    const count = this.errorQueue.length;
    this.errorQueue = [];
    logger.info(`🗑️ ${count}개의 버그 리포트를 초기화했습니다.`);
  }
}

// 싱글톤 인스턴스
export const errorReporter = new ErrorReporter();

// 글로벌 에러 핸들러 등록
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    errorReporter.reportBug('javascript-error', event.message, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    errorReporter.reportBug('promise-rejection', event.reason?.message || 'Promise rejected', {
      reason: event.reason,
      stack: event.reason?.stack
    });
  });
}

export default ErrorReporter;
