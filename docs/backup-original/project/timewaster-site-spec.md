# 🕒 당신이 낭비한 시간 계산기 - 초기 기획서

## ✅ 프로젝트 개요

- **프로젝트명 (가칭)**: 당신이 낭비한 시간 계산기
- **목표**: 사용자가 사이트에서 머무는 '쓸모없는 시간'을 실시간으로 계산하고,  
  그것을 유쾌하고 비난조의 멘트로 전달하여 웃음을 유도하며,  
  자연스럽게 광고 클릭 및 공유를 유도하는 미니 웹사이트 제작

---

## 🧩 핵심 컨셉

- 사용자가 사이트에 머무는 시간 자체가 **핵심 콘텐츠**
- 일정 시간마다 혹은 버튼 클릭 시 **비난조 메시지** 출력
- 사용자로 하여금 "**이 시간 낭비, 너무 웃겨서 친구에게도 시켜야겠다**"고 생각하게 유도
- 체류 시간이 길어질수록 점점 더 진심 섞인 **광고 클릭 유도**
- 타이머, 멘트, 버튼, 광고, 공유 이 5요소만으로 구성

---

## 🖼️ 화면 구성

```
┌────────────────────────────┐
│         ⏱️ 03분 42초         │ ← 타이머 (A)
│ 당신은 이 시간 동안               │ ← 멘트 영역 (B)
│ 냉동피자 1/2개를 해동할 수 있었습니다 │                               
│                              │
│     [내가 지금 뭐 하는 거지?]      │ ← 버튼 (C)
│                              │
│  “이 정도 웃겼으면 광고 한 번쯤…”  │ ← 광고 유도 문구 (D)
│  👉 [광고 누르기] 👈              │ ← 광고 버튼 (E)
│                              │
│  “친구도 시간 낭비시켜보자” 🔗    │ ← 공유 버튼 (F)
└────────────────────────────┘
```

---

## ⚙️ 기능 상세

### (A) 타이머
- 페이지 진입 시 자동 시작
- 초 단위 증가 표시 (ex. 03분 42초)
- `localStorage` 기반 누적 시간 기록 (선택사항)

### (B) 비난 멘트 출력
- 시간 경과에 따라 자동 출력
- 혹은 사용자가 버튼 누를 때마다 갱신
- 멘트 예시:
  - “이 시간에 이메일 한 통은 보낼 수 있었어요.”
  - “이 사이트 만든 사람보다 오래 있네요.”
  - “엄마가 널 이렇게 키우지 않았어.”

### (C) 버튼: `내가 지금 뭐 하는 거지?`
- 누를 때마다 멘트 새로고침
- UX상 클릭 유도 요소

### (D), (E) 광고 유도 및 버튼
- 광고 문구 예시:
  - “1분 넘었어요. 이 정도면 광고 한 번 눌러줘도 되지 않나요?”
  - “저희는 당신보다 집요합니다. 광고 한 번만요.”
  - “이 사이트에서의 모든 낭비는 광고 수익으로 보상받습니다.”
- 클릭 유도형 버튼 디자인 적용

### (F) 공유
- 공유 메시지 예시:
  - “나는 이 사이트에서 7분 42초를 날렸습니다.  
    너도 똑같이 당해보시겠어요?”
- 공유 링크: 트위터, 카카오톡, 클립보드 복사

---

## 💡 UX 원칙

- **극단적 단순함**: 요소를 최소화해 "의도된 무의미함" 전달
- **낭비를 유도하되 자각하게 만들기**: 부조리한 유머
- **광고/공유 유도도 대놓고 하되 정서적으로 귀엽게**

---

## 📦 MVP 기능 정리

| 기능 항목          | 포함 여부 | 비고 |
|-------------------|-----------|------|
| 타이머             | ✅        | 즉시 시작, 증가 표시 |
| 랜덤 멘트 출력      | ✅        | 자동 & 버튼 둘 다 |
| 버튼               | ✅        | 멘트 트리거용 |
| 광고 유도 멘트/버튼 | ✅        | 체류 시간 기반 진화 |
| SNS 공유            | ✅        | 트위터/카톡/링크 복사 |

---

## 🔨 기술 스택 제안

- **프론트엔드**: HTML + Vanilla JS 또는 React (선호 시)
- **상태 관리**: `useState`, `useEffect`, `localStorage`
- **디자인**: TailwindCSS 또는 Minimal CSS
- **광고 연동**: Google AdSense 또는 직접 태그 삽입
- **호스팅**: Vercel, Netlify 등

---

## 🧪 다음 단계

- [ ] 사이트 이름 확정
- [ ] 와이어프레임 스케치
- [ ] 멘트 DB or JSON 작성
- [ ] MVP 코드 구성 시작
