// 시간별 실제 활동 매칭 데이터베이스
export const TIME_BASED_ACTIVITIES = [
  { minSeconds: 0, activity: "심호흡 3번", category: "건강", icon: "🫁" },
  { minSeconds: 5, activity: "물 한 컵 마시기", category: "건강", icon: "💧" },
  { minSeconds: 10, activity: "목 스트레칭 한 동작", category: "운동", icon: "🤸" },
  { minSeconds: 15, activity: "창문 열고 환기", category: "환경", icon: "🌬️" },
  { minSeconds: 20, activity: "내일 계획 메모 한 줄", category: "계획", icon: "📝" },
  { minSeconds: 30, activity: "팔굽혀펴기 10개", category: "운동", icon: "💪" },
  { minSeconds: 45, activity: "책 한 페이지 읽기", category: "학습", icon: "📖" },
  { minSeconds: 60, activity: "간단한 명상 (1분)", category: "멘탈", icon: "🧘" },
  { minSeconds: 90, activity: "냉장고 자리 정리", category: "집안일", icon: "🚀" },
  { minSeconds: 120, activity: "친구에게 안부 문자", category: "인간관계", icon: "💬" },
  { minSeconds: 150, activity: "열 가지 영어 단어 외우기", category: "학습", icon: "🌎" },
  { minSeconds: 180, activity: "라면 끓여서 어머니께 대접", category: "효도", icon: "🍜" },
  { minSeconds: 240, activity: "방 정리 한 모서리", category: "집안일", icon: "🧹" },
  { minSeconds: 300, activity: "새로운 단어 20개 외우기", category: "학습", icon: "📚" },
  { minSeconds: 360, activity: "기초 요가 따라하기", category: "운동", icon: "🧘‍♀️" },
  { minSeconds: 420, activity: "유튜브 하나 보고 뭔가 배우기", category: "학습", icon: "📺" },
  { minSeconds: 480, activity: "간단한 요리 작품 만들기", category: "요리", icon: "👨‍🍳" },
  { minSeconds: 600, activity: "진짜 생산적인 일 시작하기", category: "생산성", icon: "⚡" },
  { minSeconds: 720, activity: "스킬 한 가지 연습하기", category: "자기계발", icon: "🎯" },
  { minSeconds: 900, activity: "취업 지원서 한 개 쓰기", category: "취업", icon: "💼" },
  { minSeconds: 1080, activity: "가계부 정리하기", category: "재정", icon: "💰" },
  { minSeconds: 1200, activity: "새로운 취미 찾아보기", category: "취미", icon: "🎨" },
  { minSeconds: 1500, activity: "건강검진 예약 잡기", category: "건강", icon: "🏥" },
  { minSeconds: 1800, activity: "인생에 대해 진지하게 고민하기", category: "철학", icon: "🤔" },
  { minSeconds: 2100, activity: "부모님께 안부 전화 드리기", category: "가족", icon: "📞" },
  { minSeconds: 2400, activity: "새로운 도전 목표 세우기", category: "목표", icon: "🎯" }
];

// 세련된 카테고리별 색상 매핑
export const CATEGORY_COLORS = {
  "건강": "from-emerald-500 to-teal-500 text-white",
  "운동": "from-blue-500 to-cyan-500 text-white",
  "환경": "from-green-500 to-emerald-500 text-white",
  "계획": "from-purple-500 to-violet-500 text-white",
  "학습": "from-indigo-500 to-blue-500 text-white",
  "멘탈": "from-pink-500 to-rose-500 text-white",
  "집안일": "from-orange-500 to-amber-500 text-white",
  "인간관계": "from-yellow-500 to-orange-500 text-white",
  "효도": "from-red-500 to-pink-500 text-white",
  "생산성": "from-gray-600 to-slate-600 text-white",
  "자기계발": "from-cyan-500 to-blue-500 text-white",
  "취업": "from-amber-500 to-orange-500 text-white",
  "재정": "from-lime-500 to-green-500 text-white",
  "취미": "from-fuchsia-500 to-pink-500 text-white",
  "철학": "from-slate-500 to-gray-500 text-white",
  "가족": "from-rose-500 to-red-500 text-white",
  "목표": "from-violet-500 to-purple-500 text-white",
  "요리": "from-teal-500 to-cyan-500 text-white",
  "기본": "from-gray-500 to-slate-500 text-white"
};

// 실제 시간에 따른 활동 가져오기
export const getTimeBasedActivity = (seconds) => {
  const activities = TIME_BASED_ACTIVITIES.filter(act => seconds >= act.minSeconds);
  const currentActivity = activities.length > 0 ? activities[activities.length - 1] : {
    activity: "잠깐의 휴식", 
    category: "기본", 
    icon: "⏰"
  };
  return currentActivity;
};
