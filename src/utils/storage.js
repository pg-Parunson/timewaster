// localStorage 관리 유틸리티
export const storage = {
  // 방문 횟수 증가 및 반환
  incrementVisits: () => {
    const visits = parseInt(localStorage.getItem('timewaster_visits') || '0') + 1;
    localStorage.setItem('timewaster_visits', visits.toString());
    return visits;
  },

  // 총 낭비 시간 가져오기
  getTotalTimeWasted: () => {
    return parseInt(localStorage.getItem('timewaster_total_time') || '0');
  },

  // 총 낭비 시간 업데이트
  updateTotalTimeWasted: (elapsedTime) => {
    const currentTotal = storage.getTotalTimeWasted();
    const newTotal = currentTotal + elapsedTime;
    localStorage.setItem('timewaster_total_time', newTotal.toString());
    return newTotal;
  },

  // 광고 클릭 수 가져오기
  getAdClicks: () => {
    return parseInt(localStorage.getItem('timewaster_ad_clicks') || '0');
  },

  // 광고 클릭 수 증가
  incrementAdClicks: () => {
    const clicks = storage.getAdClicks() + 1;
    localStorage.setItem('timewaster_ad_clicks', clicks.toString());
    return clicks;
  },

  // 모든 데이터 가져오기
  getAllData: () => {
    return {
      visits: parseInt(localStorage.getItem('timewaster_visits') || '0'),
      totalTimeWasted: storage.getTotalTimeWasted(),
      adClicks: storage.getAdClicks()
    };
  }
};
