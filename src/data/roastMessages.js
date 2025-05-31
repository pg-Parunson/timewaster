// 🔥 자극적이고 유머러스한 비난 멘트 데이터베이스 - 완전 개편!
import { getTimeBasedActivityRecommendation, ACTIVITY_THEMES } from './timeBasedActivities.js';

export const ROAST_MESSAGES = [
  // 🔥 신랄하고 재밌는 기본 멘트들
  "와... 진짜 대단하시네요. 시간 죽이기 프로세요?",
  "이러고 있을 시간에 배달음식이라도 시켜드세요 ㅋㅋ",
  "친구들은 지금 인스타 스토리 올리고 있는데 여긴 뭐하러...",
  "엄마가 보면 한숨 푹푹 쉬실 것 같은데요 ㅋㅋ",
  "이 끈기로 주식 공부했으면 부자 됐을 텐데... 아깝네",
  "지금 몇 시인지 아세요? 아, 시간 개념이 없으시구나",
  "이런 집중력이면 수능 만점도 가능했을 텐데...",
  "취미가 시간낭비인가요? 꽤 잘하시네요 ㅋㅋ",
  "아무래도 시간이 너무 많으신 것 같아요",
  "다른 사람들은 지금 돈 벌고 있는데... 아이고",
  "이 인내심으로 다이어트 했으면 몸매 끝장났을 텐데",
  "부모님 용돈이라도 벌어드리세요... 제발",
  "이거 보고 있는 게 제일 생산적인 일인가요?",
  "시간 = 돈인데 지금 얼마나 태우고 계신지 아세요?",
  "진짜... 이럴 시간에 자기계발서라도 읽으세요",
  "남들은 넷플릭스 보면서 쉬는데 여긴 왜 와서...",
  "이런 몰입도면 게임 프로게이머 해도 될 듯",
  "시간낭비 올림픽 있으면 금메달감이에요 진짜",
  "이 시간에 운동 30분만 해도 건강해질 텐데...",
  "친구들이 연락 안 하는 이유를 알 것 같아요",

  // 💀 더 신랄한 고급 멘트들  
  "아... 인생이 이렇게 여유로우시다니 부럽네요",
  "시간 녹이는 기술이 이 정도면 프로급이에요",
  "이런 여유가 있으시다니... 금수저세요?",
  "시간표에 '멍때리기' 항목이 따로 있나요?",
  "이 끈기로 영어공부 했으면 토익 990점...",
  "부모님이 등록금 아까워하실 것 같은데요",
  "미래의 나에게 욕먹을 각오 되셨나요?",
  "이 정도면 시간낭비계의 인플루언서에요",
  "지금 뇌세포들이 파업 중인 것 같아요",
  "아무것도 안 하는 것도 재능이긴 하죠... 근데",
  "이런 집중력을 어디다 쓰시는 거예요 진짜",
  "시간아 미안해... 이 사람 때문에 억울하게 갔어",
  "이 시간에 부모님께 안부전화라도 드리세요",
  "혹시 시간이 무한하다고 착각하고 계신가요?",
  "이런 인내심이면 명상 고수 될 수 있어요",
  "진짜 대단해요... 나쁜 의미로",
  "이 몰입감으로 책 읽으면 박사학위 따겠어요",
  "시간낭비도 예술의 경지까지 오르셨네요",
  "이거 하나의 철학인가요? 시간낭비주의?",
  "기네스북 도전해보세요. 시간낭비 부문으로",

  // 🤡 완전 웃긴 극한 멘트들
  "아 진짜 ㅋㅋㅋㅋ 이런 사람 처음 봐요",
  "이 시간에 치킨이라도 시켜먹지 그래요 ㅋㅋ",
  "남친/여친이 있으면 화낼 것 같은데... 아 없구나",
  "이런 끈기면 롤 챌린저도 찍을 수 있어요",
  "엄마: 뭐하냐? 당신: 시간낭비요... 대화 끝",
  "진짜 존경스러워요... 이런 의미로는 처음이지만",
  "이 집중력 어디서 배웠어요? 독학이세요?",
  "시간낭비 마스터급이시네요 ㄷㄷ",
  "이 정도면 시간을 원수로 보시는 건가요?",
  "뇌가 휴가 중인 것 같아요... 언제까지?",
  "이런 재능은 어디서 써먹을 수 있나요?",
  "아무것도 안 하는 것도 힘든 일이죠... 수고하세요",
  "시간낭비 레전드 탄생하는 순간을 목격 중",
  "이 여유로움... 혹시 은퇴하셨나요?",
  "남들은 스펙 쌓는데 여긴 왜 와서 시간 쌓고...",
  "이런 몰입력이면 유튜브 크리에이터 해도 될 듯",
  "친구들 단톡방에서 '얘 지금 뭐하냐' 이러고 있을걸요",
  "이 시간에 자소서라도 쓰세요... 취업 힘들어요 요즘",
  "시간낭비 본좌 등극! 앞으로 '님'자 붙여 부를게요",
  "이런 끈기로 주식 했으면... 아니 그것도 도박이니까"
];

// 랭킹 기반 특별 멘트 시스템 - 더 자극적으로!
export const RANKING_BASED_MESSAGES = {
  // 1위 달성 시
  rank1: [
    "🏆 축하해요! 시간낭비 킹왕짱 등극! ...이게 자랑인가?",
    "👑 1위 달성! 다른 분야에서도 이런 실력을...",
    "🥇 시간낭비계의 전설이 되셨네요 ㅋㅋㅋ",
    "⭐ 우와... 진짜 대단하세요. 시간낭비 1등이라니",
    "🔥 1등! 부모님께 자랑할 수 있을까요? ㅋㅋ"
  ],
  
  // 2-3위 달성 시  
  topRank: [
    "🥈 2등! 1등과의 격차가 얼마나 될까요?",
    "🥉 3등 입상! 시상식은 언제 하나요? ㅋㅋ",
    "🏅 메달 획득! 근데 이런 메달은 좀...",
    "✨ 상위권! 이 실력을 다른 곳에 써보세요",
    "🎖️ 톱랭커 등극! 근데 분야가 좀 그렇네요"
  ],
  
  // 10위 안 달성 시
  top10: [
    "📈 톱10! 시간낭비 고수시네요 ㄷㄷ",
    "🎯 상위 10위! 근데 기뻐해야 하나 말아야 하나",
    "🚀 랭킹 상승! 이 방향성이 맞나요? ㅋㅋ",
    "💎 다이아 등급! 시간낭비 프로게이머네요",
    "🌟 스타 등극! 근데 이런 스타는 좀..."
  ],
  
  // 첫 랭킹 진입 시
  firstRank: [
    "🎉 첫 랭킹! 시간낭비 세계에 입문하셨네요",
    "🔰 랭킹 데뷔! 앞으로가 더 걱정되는데요",
    "🎊 랭킹 진입! 이제 진짜 시작이군요",
    "🌈 첫 기록! 기록 경신하지 마세요 ㅋㅋ",
    "🎁 랭킹 입성! 축하...해야 하나요?"
  ],
  
  // 랭킹 상승 시
  rankUp: [
    "📊 순위 UP! 시간낭비 실력이 늘고 있어요 ㅋㅋ",
    "⬆️ 랭킹 상승! 이 성장세를 다른 곳에서도...",
    "🔼 레벨업! 잘못된 방향으로 성장 중",
    "📈 급성장! 이 추진력을 좀 다른 곳에...",
    "🌪️ 수직상승! 근데 이런 건 자랑 못해요"
  ],
  
  // 오래 버틴 사람에게 (30분 이상)
  endurance: [
    "🏃‍♂️ 이 지구력으로 마라톤 뛰세요! 진짜로!",
    "💪 끈기 대박! 이걸 어디다 쓸 거예요?",
    "🧘‍♀️ 명상 수행자급! 근데 뭘 깨달으셨어요?",
    "🎭 시간낭비계 철인! 타이틀이 좀 그렇네요",
    "🦁 라이언 하트! 방향만 바꾸면 뭐든 될 듯"
  ]
};

// 시간대별 특별 멘트 - 더 찌릿찌릿하게!
export const TIME_BASED_SPECIAL_MESSAGES = {
  // 새벽 시간대 (0-6시)
  dawn: [
    "새벽에 뭐하세요? 잠은 포기하신 건가요?",
    "새벽형 인간이세요? 근데 이런 건 아니죠 ㅋㅋ",
    "이 시간에 안 자고 뭐하시는 거예요 진짜",
    "새벽 감성으로 시간낭비? 로맨틱하네요",
    "불면증이세요? 그럼 차라리 책이라도 읽으세요"
  ],
  
  // 오전 시간대 (7-12시)
  morning: [
    "아침부터 이러시면... 하루가 걱정돼요",
    "모닝커피 대신 시간낭비로 하루 시작?",
    "아침 시간이 제일 소중한데... 아이고",
    "오전에 뇌가 제일 활발한데 이럴 거예요?",
    "아침 루틴이 시간낭비인가요? ㅋㅋㅋ"
  ],
  
  // 오후 시간대 (13-18시)
  afternoon: [
    "점심 먹고 졸리는 건 이해하는데... 이건 좀",
    "오후 시간 아까워요! 뭔가 해보세요!",
    "이 시간에 운동이라도 하세요... 제발",
    "오후 3시 슬럼프? 그럼 차라리 낮잠이라도",
    "황금 시간대를 이렇게... 아깝다 아까워"
  ],
  
  // 저녁 시간대 (19-23시)
  evening: [
    "저녁까지 여기 계시네요... 집에 가세요",
    "저녁 시간인데 친구들 안 만나요?",
    "하루 마무리를 이렇게? 좀 슬프네요 ㅋㅋ",
    "저녁 약속도 없이 여기서 시간낭비?",
    "오늘 하루 뭐했는지 돌아보는 시간이에요"
  ]
};

// 랭킹 위치에 따른 메시지 가져오기
export const getRankingMessage = (rank, timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  
  if (rank === 1) {
    return RANKING_BASED_MESSAGES.rank1[Math.floor(Math.random() * RANKING_BASED_MESSAGES.rank1.length)];
  } else if (rank <= 3) {
    return RANKING_BASED_MESSAGES.topRank[Math.floor(Math.random() * RANKING_BASED_MESSAGES.topRank.length)];
  } else if (rank <= 10) {
    return RANKING_BASED_MESSAGES.top10[Math.floor(Math.random() * RANKING_BASED_MESSAGES.top10.length)];
  } else if (minutes >= 30) {
    return RANKING_BASED_MESSAGES.endurance[Math.floor(Math.random() * RANKING_BASED_MESSAGES.endurance.length)];
  } else {
    return RANKING_BASED_MESSAGES.firstRank[Math.floor(Math.random() * RANKING_BASED_MESSAGES.firstRank.length)];
  }
};

// 시간대별 메시지 가져오기
export const getTimeBasedMessage = () => {
  const hour = new Date().getHours();
  let timeCategory = 'morning';
  
  if (hour >= 0 && hour < 7) {
    timeCategory = 'dawn';
  } else if (hour >= 7 && hour < 13) {
    timeCategory = 'morning';
  } else if (hour >= 13 && hour < 19) {
    timeCategory = 'afternoon';
  } else {
    timeCategory = 'evening';
  }
  
  const messages = TIME_BASED_SPECIAL_MESSAGES[timeCategory];
  return messages[Math.floor(Math.random() * messages.length)];
};

// 랜덤 일반 메시지 가져오기
export const getRandomRoastMessage = () => {
  return ROAST_MESSAGES[Math.floor(Math.random() * ROAST_MESSAGES.length)];
};

// 🎯 새로운 기능: 시간 기반 스마트 메시지 생성 - 더 직설적으로!
export const getSmartTimeBasedMessage = (seconds, userHistory = {}) => {
  const activityRec = getTimeBasedActivityRecommendation(seconds, userHistory);
  const minutes = Math.floor(seconds / 60);
  
  // 더 자극적인 시간대별 맞춤 메시지 생성
  const spicyMessages = [
    `${activityRec.timeSpent} 동안 여기 계셨다고요? 와...`,
    `이 시간에 "${activityRec.activities[0]}" 했으면 인생이 달라졌을 텐데`,
    `${activityRec.message} - 지금이라도 일어나세요!`,
    `현재 뇌 상태: ${activityRec.brainState}. 좀 움직이세요!`,
    `${activityRec.difficulty} 난이도 활동들이 기다리는데... 언제까지?`,
    `이 시간이면 진짜 뭐든 할 수 있었는데... 아깝다`,
    `시간이 돈이라면 지금 얼마나 태우고 계신 거예요?`,
    `친구들은 지금 뭐하고 있을까요? 궁금하지 않아요?`
  ];
  
  // 개인화된 팁이 있으면 더 자극적으로 추가
  if (activityRec.personalizedTip) {
    spicyMessages.push(`💡 진짜 팁: ${activityRec.personalizedTip} 한번 해보세요!`);
  }
  
  return {
    message: spicyMessages[Math.floor(Math.random() * spicyMessages.length)],
    activityRecommendation: activityRec,
    theme: ACTIVITY_THEMES[activityRec.category]
  };
};

// 통합 메시지 시스템 - 확률 기반 선택
export const getIntegratedMessage = (seconds, userRank = null, userHistory = {}) => {
  const random = Math.random();
  
  // 랭킹 메시지 20% 확률
  if (userRank && random < 0.2) {
    return {
      type: 'ranking',
      message: getRankingMessage(userRank, seconds),
      category: 'ranking'
    };
  }
  
  // 시간 기반 스마트 메시지 40% 확률
  if (random < 0.6) {
    const smartMessage = getSmartTimeBasedMessage(seconds, userHistory);
    return {
      type: 'smart',
      message: smartMessage.message,
      category: 'activity',
      recommendation: smartMessage.activityRecommendation,
      theme: smartMessage.theme
    };
  }
  
  // 시간대별 메시지 20% 확률
  if (random < 0.8) {
    return {
      type: 'timeBased',
      message: getTimeBasedMessage(),
      category: 'timeOfDay'
    };
  }
  
  // 일반 비난 메시지 20% 확률
  return {
    type: 'roast',
    message: getRandomRoastMessage(),
    category: 'general'
  };
};
