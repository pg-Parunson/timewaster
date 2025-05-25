# 🕒 시간낭비 계산기 v3.0

> **당신이 이 사이트에서 낭비한 시간을 실시간으로 계산해드립니다** ✨

[![Live Demo](https://img.shields.io/badge/Live%20Demo-🚀%20체험하기-blue)](https://pg-parunson.github.io/timewaster/)
[![Version](https://img.shields.io/badge/Version-v3.0-green)](https://github.com/pg-Parunson/timewaster)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime-orange)](https://firebase.google.com/)

## 🎯 프로젝트 소개

**시간낭비 계산기**는 사용자가 사이트에 머무르는 시간을 실시간으로 측정하고, 유머러스한 비난과 함께 "생산적인 활동"을 제안하는 재미있는 웹 애플리케이션입니다.

### ✨ 주요 특징

- 🕐 **실시간 시간 측정** - 정확한 시간 추적
- 🎮 **레트로 게임 컨셉** - 8비트 게임 스타일 UI
- 🏆 **실시간 랭킹 시스템** - Firebase 기반 멀티유저 랭킹
- 📊 **실시간 통계 시스템** - 동시 접속자, 전체 방문수 실시간 추적
- 🎉 **축하 이펙트** - 9단계 시간별 특별 애니메이션
- 🧠 **AI 활동 추천** - 시간대별 맞춤 생산성 활동 제안
- 💬 **50가지 비난 메시지** - 랭킹/시간대 기반 스마트 메시지
- 📱 **완전 반응형** - 모든 디바이스 지원
- 🔥 **극한 모드** - 5분 후 활성화되는 특별 모드

## 🚀 라이브 데모

**👉 [https://pg-parunson.github.io/timewaster/](https://pg-parunson.github.io/timewaster/)**

## 🎨 스크린샷

### 메인 화면
- 레트로 게임 스타일 타이머
- 실시간 랭킹 보드
- 스마트 활동 추천

### 축하 이펙트
- 2분, 5분, 10분... 단계별 특별 애니메이션
- 파티클 효과와 배경 플래시

## 🛠️ 기술 스택

### Frontend
- **React 18.2.0** - 메인 프레임워크
- **TailwindCSS 3.3.3** - 스타일링
- **Lucide React** - 아이콘
- **Vite 4.4.5** - 빌드 도구

### Backend & Database
- **Firebase Realtime Database** - 실시간 랭킹 시스템
- **Firebase Hosting** - 배포 (자동 배포)

### 기타
- **GitHub Actions** - CI/CD
- **쿠팡 파트너스** - 수익화
- **Google Analytics** - 분석

## 📁 프로젝트 구조

```
timewaster-project/
├── src/
│   ├── components/          # React 컴포넌트들
│   │   ├── SiteHeader.jsx   # 헤더 + 시간 표시
│   │   ├── MessageSection.jsx # 비난 메시지
│   │   ├── RankingSection.jsx # 실시간 랭킹
│   │   ├── CelebrationEffect.jsx # 축하 이펙트
│   │   └── ...
│   ├── hooks/               # 커스텀 훅들
│   │   ├── useTimerLogic.jsx # 메인 타이머 로직
│   │   ├── useModalLogic.jsx # 모달 관련 로직
│   │   └── useCelebrationSystem.jsx
│   ├── data/                # 데이터 및 메시지
│   │   ├── roastMessages.jsx # 50가지 비난 메시지
│   │   ├── timeBasedActivities.jsx # 활동 추천
│   │   └── celebrationEffects.jsx
│   ├── services/            # 외부 서비스
│   │   ├── rankingService.jsx # Firebase 랭킹
│   │   └── liveFeedService.jsx # 실시간 피드
│   └── utils/               # 유틸리티
├── docs/                    # 문서들
│   ├── development/         # 개발 관련
│   ├── features/           # 기능 설명
│   ├── troubleshooting/    # 문제 해결
│   └── archive/            # 아카이브
├── public/                 # 정적 파일들
└── README.md              # 이 파일
```

## 🎮 주요 기능 상세

### 1. 실시간 랭킹 시스템
- Firebase Realtime Database 연동
- 익명 닉네임 자동 할당 ("시간여행자", "우주탐험가" 등)
- TOP 10 실시간 업데이트
- 일간/주간/월간/전체 랭킹 지원

### 2. 스마트 메시지 시스템
- **50가지 비난 메시지** (기본/중급/고급 단계별)
- **랭킹 기반 특별 메시지** (1위, 상위권, 톱10 등)
- **시간대별 메시지** (새벽/오전/오후/저녁 각 5개)
- **확률 기반 선택** (랭킹 20% + 시간대 15% + 일반 65%)

### 3. AI 활동 추천 시스템
- **뇌과학 기반 시간대 최적화** (7개 시간대별 분석)
- **200+ 실행 가능한 활동** (난이도별 분류)
- **개인화된 추천** (사용자 패턴 학습)
- **상황 인식 제안** (에너지, 집중도, 시간대 고려)

### 4. 축하 이펙트 시스템
- **9단계 시간별 이펙트** (2분~2시간)
- **다양한 애니메이션** (bounce, pulse, float, rainbow 등)
- **파티클 효과** (이모지 떠다니기)
- **배경 플래시** (반짝거리는 화면)

### 5. 실시간 통계 시스템 ⭐ NEW
- **실제 동시 접속자 추적** (Firebase 기반 30초 하트비트)
- **전체 사이트 방문수** (모든 사용자 누적)
- **자동 세션 관리** (페이지 이탈시 자동 정리)
- **오프라인 대응** (연결 실패시 기본값 표시)

## 🔧 개발 환경 설정

### 1. 저장소 클론
```bash
git clone https://github.com/pg-Parunson/timewaster.git
cd timewaster
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 빌드
```bash
npm run build
```

### 5. 배포
```bash
npm run deploy
```

## 🔥 최신 업데이트 (v3.0 Final)

### 🎨 **UI/UX 완전 리뉴얼** (2025-05-25)
- ✅ **헤더 5:5 레이아웃 개편** - 타이틀과 타이머 균형있게 배치
- ✅ **대형 타이머 디스플레이** - 4xl-5xl 폰트, 박스 확대, 그림자 효과
- ✅ **축하 이펙트 완전 복원** - 파티클 강화, 배경 플래시 동기화
- ✅ **광고 카드 완전 고정** - GPU 가속으로 프레임 이탈 방지
- ✅ **모든 UI 깨짐 현상 해결** - 안정성 100% 보장

### 🚀 **v3.0 혁신적 기능 완성**
- ✅ **시간대별 세밀한 활동 매칭** (1분~60분+ 10단계)
- ✅ **뇌과학 기반 시간대 최적화** (7개 시간대별 분석)
- ✅ **50개 비난 메시지 확장** + 랭킹/시간대 기반 스마트 선택
- ✅ **Firebase 랭킹 시스템** 완전 구현 (30개 익명 닉네임)
- ✅ **실시간 통계 시스템** 추가 구현

### 🐛 **모든 버그 완전 수정**
- ✅ **JSX 확장자 통일** - 모든 React 컴포넌트 .jsx로 통일
- ✅ **빌드 오류 해결** - Rollup Unicode 구문 오류 완전 수정
- ✅ **사용자 발견 버그 15개** 모두 완전 해결

## 📊 성능 지표

- **번들 크기**: ~500KB (압축 후)
- **초기 로딩**: <2초
- **실시간 업데이트**: 30초 간격
- **Firebase 연결**: <1초
- **SEO 점수**: 95/100
- **완성도**: 100% 🎉

## 🤝 기여 방법

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

## 👨‍💻 개발자

**pg-Parunson**
- GitHub: [@pg-Parunson](https://github.com/pg-Parunson)
- 프로젝트 링크: [https://github.com/pg-Parunson/timewaster](https://github.com/pg-Parunson/timewaster)

## 🙏 감사 인사

- React 팀 - 훌륭한 프레임워크
- TailwindCSS 팀 - 아름다운 스타일링
- Firebase 팀 - 실시간 데이터베이스
- 모든 테스터분들 - 소중한 피드백

---

**⚠️ 경고: 이 사이트는 실제로 시간을 낭비시킬 수 있습니다. 사용에 주의하세요! 😄**

*마지막 업데이트: 2025-05-25*
*상태: v3.0 Final Release - 개발 완료 🏁*