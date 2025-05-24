# Timewaster Calculator 🕒

[![Deploy Status](https://img.shields.io/badge/deploy-ready-brightgreen)](https://pg-parunson.github.io/timewaster)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.3-blue)](https://tailwindcss.com/)

> **당신이 낭비한 시간을 실시간으로 계산해드리는 부조리한 웹사이트**

## 🎯 프로젝트 개요

이 프로젝트는 사용자가 사이트에서 머무는 시간을 "시간 낭비"로 표현하며, 유쾌한 비난조 멘트와 함께 웃음을 유도하는 미니 웹사이트입니다.

### ✨ 주요 기능

- ⏰ **실시간 타이머**: 페이지 진입 시 자동 시작되는 정확한 시간 측정
- 💬 **비난 멘트 시스템**: 20개 이상의 재미있는 메시지를 자동/수동으로 표시
- 📢 **광고 유도**: 체류 시간에 따라 진화하는 10단계 광고 유도 시스템
- 🔗 **SNS 공유**: 트위터, 카카오톡, 링크 복사 기능
- 🎮 **극한 모드**: 5분 이상 체류 시 활성화되는 특별 모드
- 📊 **통계 추적**: 방문 횟수, 광고 클릭, 총 낭비 시간 기록
- 🚨 **페이지 이탈 방지**: 1분 이상 체류 시 나가기 확인 메시지

### 🎨 디자인 컨셉

- **극단적 단순함**: 최소한의 UI 요소로 "의도된 무의미함" 전달
- **부조리한 유머**: 시간 낭비를 유도하면서도 자각하게 만드는 아이러니
- **중독성 있는 인터랙션**: 계속 머물고 싶게 만드는 심리적 장치들

## 🚀 빠른 시작

### 필수 요구사항
- Node.js 16+ 
- npm 또는 yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/pg-Parunson/timewaster.git
cd timewaster

# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# GitHub Pages 배포
npm run deploy
```

### 프로젝트 구조

```
timewaster-project/
├── public/                 # 정적 파일
├── src/
│   ├── App.jsx            # 메인 React 컴포넌트
│   ├── index.css          # 전역 스타일
│   └── main.jsx           # React 엔트리포인트
├── package.json           # 프로젝트 설정
├── tailwind.config.js     # TailwindCSS 설정
├── vite.config.js         # Vite 설정
└── README.md              # 이 파일
```

## 🎮 사용법

1. **사이트 접속**: 타이머가 자동으로 시작됩니다
2. **메시지 확인**: 재미있는 비난 멘트를 읽어보세요
3. **버튼 클릭**: "내가 지금 뭐 하는 거지?" 버튼으로 새로운 메시지 확인
4. **광고 체험**: 1분 후 나타나는 광고 버튼을 클릭해보세요
5. **친구 괴롭히기**: 공유 버튼으로 친구들에게 이 경험을 선사하세요
6. **극한 도전**: 5분 이상 버텨서 극한 모드를 체험해보세요

## 🛠️ 기술 스택

- **Frontend**: React 18.2.0
- **Styling**: TailwindCSS 3.3.3
- **Build Tool**: Vite 4.4.5
- **Icons**: Lucide React
- **Deployment**: GitHub Pages
- **Font**: Noto Sans KR

## ⚡ 성능 최적화

- ✅ **React Hooks 최적화**: 불필요한 리렌더링 방지
- ✅ **메모리 누수 방지**: useEffect cleanup 함수 활용
- ✅ **반응형 디자인**: 모든 디바이스에서 완벽한 경험
- ✅ **PWA 준비**: 캐싱 및 오프라인 지원 준비 완료

## 📱 브라우저 지원

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ 모바일 브라우저 지원

## 🎯 로드맵

### v1.1 (계획 중)
- [ ] 다크모드 지원
- [ ] 음성 효과 추가
- [ ] 더 많은 비난 멘트 (50개 목표)
- [ ] 사용자 랭킹 시스템

### v1.2 (계획 중)
- [ ] 멀티언어 지원
- [ ] PWA 변환
- [ ] 실시간 사용자 통계
- [ ] 소셜 로그인 연동

## 🤝 기여하기

기여를 환영합니다! 다음과 같은 방법으로 참여할 수 있습니다:

1. **새로운 비난 멘트 제안**: 더 창의적인 메시지 아이디어
2. **버그 리포트**: Issues 탭에서 버그 신고
3. **기능 요청**: 새로운 기능 아이디어 제안
4. **코드 기여**: Pull Request 제출

### 개발 가이드라인

```bash
# 개발 환경 설정
npm install
npm run dev

# 코드 스타일 확인
npm run lint

# 빌드 테스트
npm run build
npm run preview
```

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

## 👨‍💻 제작자

- **Developer**: pg-Parunson
- **GitHub**: [@pg-Parunson](https://github.com/pg-Parunson)
- **Website**: [시간낭비 계산기](https://pg-parunson.github.io/timewaster)

## 🙏 감사의 말

이 프로젝트는 순수한 재미와 학습을 위해 제작되었습니다. 
실제로 시간을 낭비하라는 의미가 아니라, 시간의 소중함을 역설적으로 표현한 작품입니다.

---

**⚠️ 경고: 이 사이트는 중독성이 있을 수 있습니다. 적당히 즐기세요!**

🕒 **지금까지 이 README를 읽는데 걸린 시간도 낭비입니다!**