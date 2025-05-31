// Firebase 설정 및 초기화
import { initializeApp } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';

// 환경변수에서 Firebase 설정 로드
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Firebase 앱 초기화 (안전한 방식)
let app = null;
let database = null;
let isFirebaseConnected = false;

// 개발환경에서도 Firebase 활성화 (테스트를 위해)
try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  isFirebaseConnected = true;
} catch (error) {
  // Firebase 연결 실패 (콘솔 로그 제거됨)
  isFirebaseConnected = false;
}

export { database, isFirebaseConnected };

// 익명 닉네임 풀 (30개)
export const ANONYMOUS_NAMES = [
  "시간여행자", "우주탐험가", "몽상가", "일상탈출자", "현실도피자",
  "시공간유랑자", "상상력모험가", "꿈꾸는자", "무한스크롤러", "딴생각러",
  "시간조각가", "공상과학자", "멍때리스트", "자유로운영혼", "떠도는구름",
  "바람따라가는자", "호기심탐험가", "순간포착자", "감성여행자", "창의적방랑자",
  "직감따르는자", "영감수집가", "순수한마음", "자연친화자", "평온추구자",
  "행복탐험가", "따스한바람", "고요한호수", "별빛수집가", "무지개추적자"
];

// Firebase 데이터베이스 경로
export const DB_PATHS = {
  SESSIONS: 'sessions',
  RANKINGS: 'rankings',
  DAILY: 'rankings/daily',
  WEEKLY: 'rankings/weekly', 
  MONTHLY: 'rankings/monthly',
  ALL_TIME: 'rankings/allTime',
  LIVE_FEED: 'live-feed' // 하이픈으로 변경
};

// 랭킹 기간 타입
export const RANKING_PERIODS = {
  DAILY: 'daily',
  WEEKLY: 'weekly', 
  MONTHLY: 'monthly',
  ALL_TIME: 'allTime'
};

// 랭킹 기간별 표시 정보
export const RANKING_LABELS = {
  [RANKING_PERIODS.DAILY]: {
    title: '🏆 오늘의 시간낭비 챔피언',
    label: '일간',
    description: '오늘의 랭킹'
  },
  [RANKING_PERIODS.WEEKLY]: {
    title: '🥇 이번 주 시간낭비 킹',
    label: '주간', 
    description: '이번 주 랭킹'
  },
  [RANKING_PERIODS.MONTHLY]: {
    title: '👑 이번 달 시간낭비 제왕',
    label: '월간',
    description: '이번 달 랭킹' 
  },
  [RANKING_PERIODS.ALL_TIME]: {
    title: '🌟 역대 최강 시간낭비러',
    label: '전체',
    description: '역대 최고 랭킹'
  }
};

export default app;
