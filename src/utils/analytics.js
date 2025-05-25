// Google Analytics 유틸리티
export const analytics = {
  // 세션 시작 이벤트
  trackSessionStart: (visits, totalTimeWasted) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'session_start', {
        event_category: 'engagement',
        visits_count: visits,
        total_time_wasted: totalTimeWasted,
        returning_visitor: visits > 1
      });
    }
  },

  // 극한 모드 진입 이벤트
  trackExtremeMode: () => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'extreme_mode_entered', {
        event_category: 'engagement',
        event_label: 'time_milestone',
        value: 300
      });
    }
  },

  // 마일스톤 달성 이벤트
  trackMilestone: (seconds, message) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'milestone_achieved', {
        event_category: 'engagement',
        milestone_seconds: seconds,
        milestone_message: message
      });
    }
  },

  // 쿠팡 클릭 이벤트
  trackCoupangClick: (productName, category, elapsedTime, adClicks) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'coupang_click', {
        event_category: 'affiliate',
        event_label: productName,
        product_category: category,
        time_wasted_seconds: elapsedTime,
        value: adClicks
      });
    }
  },

  // 공유 이벤트
  trackShare: (method, elapsedTime) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'share', {
        method: method,
        content_type: 'time_wasted',
        time_wasted_seconds: elapsedTime
      });
    }
  },

  // 종료 이벤트
  trackExit: (elapsedTime) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exit_confirmed', {
        event_category: 'engagement',
        time_wasted_seconds: elapsedTime,
        exit_method: 'button'
      });
    }
  },

  // 활동 선택 이벤트 - 새로운 기능
  trackActivitySelect: (activity, elapsedTime) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'activity_selected', {
        event_category: 'productivity',
        event_label: activity,
        time_wasted_seconds: elapsedTime,
        custom_parameter_1: 'smart_recommendation'
      });
    }
  },

  // 스마트 메시지 표시 이벤트
  trackSmartMessage: (messageType, category, elapsedTime) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'smart_message_shown', {
        event_category: 'engagement',
        message_type: messageType,
        message_category: category,
        time_wasted_seconds: elapsedTime
      });
    }
  }
};
