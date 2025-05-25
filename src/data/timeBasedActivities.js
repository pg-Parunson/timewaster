// 🎯 시간대별 세밀한 활동 매칭 시스템
// 각 시간 구간별로 실제로 할 수 있는 구체적인 활동들을 제안

export const TIME_BASED_ACTIVITIES = {
  // 1분 - 초단위 활동들
  '1min': {
    activities: [
      "물 한 잔 마시기", "스트레칭", "심호흡", "감사 인사", "미소 짓기"
    ],
    message: "1분이면 할 수 있는 건강한 일들",
    category: "instant",
    difficulty: "매우 쉬움"
  },

  // 3분 - 빠른 실행 활동들  
  '3min': {
    activities: [
      "책상 정리", "이메일 확인", "일기 한 줄", "명상", "플랭크 운동"
    ],
    message: "3분의 마법 - 작지만 의미있는 변화",
    category: "quick",
    difficulty: "쉬움"
  },

  // 5분 - 습관 형성 활동들
  '5min': {
    activities: [
      "영어 단어 암기", "요가 스트레칭", "감사 일기", "친구에게 안부 문자", "방 청소"
    ],
    message: "5분 투자로 하루가 달라집니다",
    category: "habit",
    difficulty: "보통"
  },

  // 7분 - 집중 활동들
  '7min': {
    activities: [
      "TED 강연 시청", "팟캐스트 듣기", "운동 루틴", "독서", "온라인 강의"
    ],
    message: "7분, 새로운 지식을 얻기에 충분한 시간",
    category: "learning",
    difficulty: "보통"
  },

  // 10분 - 생산적 활동들
  '10min': {
    activities: [
      "블로그 포스팅", "언어 학습", "요리 레시피 연구", "투자 정보 확인", "취미 연구"
    ],
    message: "10분이면 전문가 되기 첫걸음!",
    category: "productive",
    difficulty: "보통"
  },

  // 15분 - 스킬 개발 활동들
  '15min': {
    activities: [
      "코딩 연습", "악기 연습", "그림 그리기", "외국어 회화", "창작 활동"
    ],
    message: "15분 투자로 새로운 스킬 개발하기",
    category: "skill",
    difficulty: "어려움"
  },

  // 20분 - 심화 학습 활동들
  '20min': {
    activities: [
      "온라인 강의 수강", "책 한 챕터 읽기", "운동 루틴 완성", "요리하기", "프로젝트 작업"
    ],
    message: "20분, 진짜 성장이 시작되는 시간",
    category: "advanced",
    difficulty: "어려움"
  },

  // 30분 - 전문성 구축 활동들
  '30min': {
    activities: [
      "심화 학습", "포트폴리오 작업", "네트워킹", "멘토링 받기", "창업 아이디어 구상"
    ],
    message: "30분이면 전문가 수준 진입 가능!",
    category: "expert",
    difficulty: "매우 어려움"
  },

  // 45분 - 마스터 레벨 활동들
  '45min': {
    activities: [
      "프로젝트 완성", "심화 연구", "전문 스킬 마스터리", "창작물 제작", "비즈니스 계획"
    ],
    message: "45분, 마스터가 되기 위한 황금시간",
    category: "master",
    difficulty: "전문가"
  },

  // 60분+ - 레전드 활동들
  '60min': {
    activities: [
      "완전한 프로젝트 완성", "전문 자격증 공부", "창업 준비", "예술 작품 완성", "인생 계획 수립"
    ],
    message: "1시간, 인생을 바꿀 수 있는 시간",
    category: "legend",
    difficulty: "레전드"
  }
};

// 시간대별 뇌 상태와 최적 활동 매칭
export const TIME_OF_DAY_OPTIMIZATION = {
  // 새벽 (0-6시) - 창의성과 깊은 사고
  dawn: {
    optimal: ["창작", "명상", "계획 수립", "독서", "일기 쓰기"],
    brainState: "창의적 사고",
    energy: "낮음",
    focus: "높음",
    recommendation: "조용한 창작 활동이나 깊은 사고가 필요한 일"
  },

  // 오전 전반 (6-9시) - 최고 집중력
  earlyMorning: {
    optimal: ["어려운 공부", "중요한 업무", "문제 해결", "전략 수립", "복잡한 작업"],
    brainState: "최고 집중력",
    energy: "높음",
    focus: "최고",
    recommendation: "가장 어렵고 중요한 일부터 시작하세요"
  },

  // 오전 후반 (9-12시) - 논리적 사고
  midMorning: {
    optimal: ["분석 작업", "의사결정", "회의", "학습", "기획"],
    brainState: "논리적 사고",
    energy: "높음", 
    focus: "높음",
    recommendation: "논리적 판단이 필요한 중요한 결정들"
  },

  // 오후 전반 (12-15시) - 소화와 에너지 회복
  earlyAfternoon: {
    optimal: ["가벼운 업무", "소통", "네트워킹", "루틴 작업", "정리"],
    brainState: "에너지 회복 중",
    energy: "중간",
    focus: "중간",
    recommendation: "무거운 일보다는 소통이나 정리 작업"
  },

  // 오후 후반 (15-18시) - 협업과 소통
  lateAfternoon: {
    optimal: ["팀워크", "브레인스토밍", "소통", "협업", "피드백"],
    brainState: "사회적 활동",
    energy: "중간",
    focus: "중간",
    recommendation: "다른 사람들과 함께하는 활동이 효과적"
  },

  // 저녁 전반 (18-21시) - 창의성 재부상
  earlyEvening: {
    optimal: ["창작", "취미", "학습", "운동", "계획"],
    brainState: "창의적 부활",
    energy: "중간",
    focus: "좋음",
    recommendation: "새로운 시도나 창의적 활동"
  },

  // 저녁 후반 (21-24시) - 성찰과 정리
  lateEvening: {
    optimal: ["성찰", "정리", "독서", "명상", "하루 계획"],
    brainState: "성찰 모드",
    energy: "낮음",
    focus: "중간",
    recommendation: "하루를 돌아보고 내일을 준비하는 시간"
  }
};

// 개인화된 추천 시스템
export const PERSONALIZED_RECOMMENDATIONS = {
  // 반복 방문자 (3회 이상)
  frequentVisitor: {
    message: "또 오셨네요! 이제 패턴이 보여요...",
    suggestions: [
      "알림 설정으로 시간 관리 시작하기",
      "하루 30분 생산성 챌린지",
      "시간낭비 패턴 분석 일기",
      "친구와 함께하는 생산성 경쟁"
    ]
  },

  // 장시간 사용자 (30분 이상)
  longTimeUser: {
    message: "정말 대단한 집중력이시네요... 다른 곳에 써보시면?",
    suggestions: [
      "이 집중력으로 온라인 강의 수강",
      "새로운 기술 스킬 마스터하기", 
      "창작 프로젝트 시작하기",
      "전문 자격증 공부 시작"
    ]
  },

  // 특정 시간대 단골 (같은 시간대 5회 이상)
  timePatternUser: {
    message: "이 시간대의 단골손님이시네요!",
    suggestions: [
      "이 시간대 최적화된 루틴 만들기",
      "생체리듬 맞춤 활동 추천",
      "시간대별 에너지 레벨 활용법",
      "개인 맞춤 생산성 스케줄"
    ]
  }
};

// 메인 함수: 시간과 상황에 맞는 활동 추천
export const getTimeBasedActivityRecommendation = (seconds, userHistory = {}) => {
  const minutes = Math.floor(seconds / 60);
  const currentHour = new Date().getHours();
  
  // 시간 구간 결정
  let timeKey = '1min';
  if (minutes >= 60) timeKey = '60min';
  else if (minutes >= 45) timeKey = '45min';
  else if (minutes >= 30) timeKey = '30min';
  else if (minutes >= 20) timeKey = '20min';
  else if (minutes >= 15) timeKey = '15min';
  else if (minutes >= 10) timeKey = '10min';
  else if (minutes >= 7) timeKey = '7min';
  else if (minutes >= 5) timeKey = '5min';
  else if (minutes >= 3) timeKey = '3min';

  // 시간대별 뇌 상태 결정
  let timeOfDay = 'midMorning';
  if (currentHour >= 0 && currentHour < 6) timeOfDay = 'dawn';
  else if (currentHour >= 6 && currentHour < 9) timeOfDay = 'earlyMorning';
  else if (currentHour >= 9 && currentHour < 12) timeOfDay = 'midMorning';
  else if (currentHour >= 12 && currentHour < 15) timeOfDay = 'earlyAfternoon';
  else if (currentHour >= 15 && currentHour < 18) timeOfDay = 'lateAfternoon';
  else if (currentHour >= 18 && currentHour < 21) timeOfDay = 'earlyEvening';
  else timeOfDay = 'lateEvening';

  const activityData = TIME_BASED_ACTIVITIES[timeKey];
  const brainData = TIME_OF_DAY_OPTIMIZATION[timeOfDay];
  
  // 개인화 추천 추가
  let personalizedTip = "";
  if (userHistory.visits >= 3) {
    personalizedTip = PERSONALIZED_RECOMMENDATIONS.frequentVisitor.message;
  } else if (minutes >= 30) {
    personalizedTip = PERSONALIZED_RECOMMENDATIONS.longTimeUser.message;
  }

  return {
    timeSpent: `${minutes}분 ${seconds % 60}초`,
    activities: activityData.activities,
    message: activityData.message,
    category: activityData.category,
    difficulty: activityData.difficulty,
    brainState: brainData.brainState,
    energyLevel: brainData.energy,
    focusLevel: brainData.focus,
    timeOptimization: brainData.recommendation,
    personalizedTip,
    optimalActivities: brainData.optimal
  };
};

// 활동 카테고리별 색상 테마
export const ACTIVITY_THEMES = {
  instant: { color: "green", icon: "⚡", description: "즉시 실행" },
  quick: { color: "blue", icon: "🚀", description: "빠른 실행" },
  habit: { color: "purple", icon: "🔄", description: "습관 형성" },
  learning: { color: "orange", icon: "🧠", description: "학습 중심" },
  productive: { color: "red", icon: "⚡", description: "생산성 향상" },
  skill: { color: "indigo", icon: "🎯", description: "스킬 개발" },
  advanced: { color: "pink", icon: "📈", description: "심화 학습" },
  expert: { color: "yellow", icon: "👑", description: "전문성 구축" },
  master: { color: "cyan", icon: "🏆", description: "마스터 레벨" },
  legend: { color: "emerald", icon: "💎", description: "레전드 도전" }
};

export default {
  TIME_BASED_ACTIVITIES,
  TIME_OF_DAY_OPTIMIZATION,
  PERSONALIZED_RECOMMENDATIONS,
  getTimeBasedActivityRecommendation,
  ACTIVITY_THEMES
};
