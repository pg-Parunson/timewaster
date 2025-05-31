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

// 🎯 광고 클릭 시 랜덤 쿠팡 링크 선택 함수
export const getRandomCoupangProduct = () => {
  const randomIndex = Math.floor(Math.random() * COUPANG_PRODUCTS.length);
  return COUPANG_PRODUCTS[randomIndex];
};

// 시간대별 상황에 맞는 상품 추천 로직 - 🎲 재미있는 랜덤 시스템
export const getRecommendedProduct = (elapsedSeconds) => {
  // 시간대별 상품 풀 정의
  let productPool = [];
  
  if (elapsedSeconds < 180) { // 3분 미만: 초보자용 상품들
    productPool = [0, 1, 2]; // 쿠팡홈, 덤벨, 도서
  } else if (elapsedSeconds < 420) { // 7분 미만: 중급자용 상품들  
    productPool = [1, 2, 3, 4]; // 덤벨, 도서, 알람시계, 영양제
  } else if (elapsedSeconds < 660) { // 11분 미만: 고급자용 상품들
    productPool = [3, 4, 5, 6]; // 알람시계, 영양제, 보드게임, 차
  } else { // 11분 이상: 프로급 시간낭비자용
    productPool = [5, 6, 7]; // 보드게임, 차, DIY
  }
  
  // 🎲 해당 시간대 풀에서 랜덤 선택 (하지만 일정 시간마다 변경)
  const changeInterval = 90; // 90초(1.5분)마다 상품 변경
  const seed = Math.floor(elapsedSeconds / changeInterval);
  const randomIndex = seed % productPool.length;
  const selectedProductIndex = productPool[randomIndex];
  
  return COUPANG_PRODUCTS[selectedProductIndex];
};
