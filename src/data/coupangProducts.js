// 쿠팡 파트너스 상품 데이터베이스
export const COUPANG_PRODUCTS = [
  {
    name: "쿠팡홈",
    description: "쿠팡에서 뭐든지 찾아보세요!",
    url: "https://link.coupang.com/a/cvyvMI",
    category: "쇼핑",
    icon: "🏠",
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "덤벨 세트",
    description: "집에서 운동하며 시간을 더 의미있게!",
    url: "https://link.coupang.com/a/cvyvfR",
    category: "운동",
    icon: "💪",
    color: "from-red-500 to-orange-500"
  },
  {
    name: "아들아 시간을 낭비하기에는 인생이 너무 짧다",
    description: "시간 관리의 지혜를 배워보세요",
    url: "https://link.coupang.com/a/cvywcQ",
    category: "도서",
    icon: "📚",
    color: "from-green-500 to-emerald-500"
  },
  {
    name: "알람시계",
    description: "정시에 일어나서 시간을 아껴보세요",
    url: "https://link.coupang.com/a/cvyw8r",
    category: "생활",
    icon: "⏰",
    color: "from-purple-500 to-pink-500"
  },
  {
    name: "브레인 메모리 영양제",
    description: "두뇌 건강으로 효율성을 높이세요",
    url: "https://link.coupang.com/a/cvyxs1",
    category: "건강",
    icon: "🧠",
    color: "from-yellow-500 to-orange-500"
  },
  {
    name: "루미큐브 보드게임",
    description: "가족과 함께하는 의미있는 시간",
    url: "https://link.coupang.com/a/cvyxI2",
    category: "게임",
    icon: "🎲",
    color: "from-indigo-500 to-purple-500"
  },
  {
    name: "케모마일티",
    description: "차 한 잔의 여유로 마음을 진정시키세요",
    url: "https://link.coupang.com/a/cvyx8I",
    category: "음료",
    icon: "🍵",
    color: "from-green-400 to-teal-500"
  },
  {
    name: "곰인형 만들기 DIY",
    description: "창의적인 활동으로 시간을 보내보세요",
    url: "https://link.coupang.com/a/cvyyv3",
    category: "취미",
    icon: "🧸",
    color: "from-pink-500 to-rose-500"
  }
];

// 시간대별 상황에 맞는 상품 추천 로직
export const getRecommendedProduct = (elapsedSeconds) => {
  // 시간대별 추천 로직
  if (elapsedSeconds < 300) { // 5분 미만
    return COUPANG_PRODUCTS[Math.floor(Math.random() * 3)]; // 쿠팡홈, 덤벨, 도서 중 랜덤
  } else if (elapsedSeconds < 600) { // 10분 미만
    return COUPANG_PRODUCTS[3 + Math.floor(Math.random() * 3)]; // 알람시계, 영양제, 보드게임 중
  } else { // 10분 이상
    return COUPANG_PRODUCTS[6 + Math.floor(Math.random() * 2)]; // 차, DIY 중
  }
};
