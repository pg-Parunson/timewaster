# 🐛 버그 수정 작업 로그 (2025-05-25)

## 🎯 사용자 보고 문제들

### 문제 1: 메시지 타이핑 중 광고 카드가 너무 빨리 바뀜
**증상**: 타이핑 애니메이션이 진행되는 동안 광고가 0.1초마다 바뀌는 것처럼 보임
**원인**: useEffect 의존성 배열이 매 초마다 재실행됨
**현재 코드**: `[Math.floor((elapsedTime - 60) / 30)]`
**해결**: 분 단위로만 업데이트하도록 변경, 타이핑 중에는 업데이트 차단

### 문제 2: 평상시에도 광고 카드가 너무 빨리 바뀜
**증상**: 30초마다 바뀌어야 하는데 더 자주 바뀌는 것 같음
**원인**: 동일한 useEffect 최적화 문제 + 랜덤 상품 선택
**해결**: 1분마다 변경 + 랜덤 제거하고 시간 기반 고정 상품 선택

### 문제 3: 상단 총 낭비 시간이 실시간 갱신되지 않음
**증상**: 초기 로드 값에서 변하지 않음
**원인**: totalTimeWasted가 현재 세션 시간과 합쳐지지 않음
**해결**: currentElapsedTime props 추가해서 실시간 합계 계산

### 문제 4: 실시간 추적 표시등이 깜빡이지 않음
**증상**: 예전에는 주기적으로 깜빡였는데 이제 깜빡이지 않음
**원인**: animate-pulse가 extremeMode일 때만 적용됨
**해결**: 항상 animate-pulse 적용

## 🛠️ 수정 내용

### ✅ 완료된 수정사항 (2025-05-25 오후)

#### 1. App.jsx 광고 업데이트 로직 완전 재작성
```javascript
// 기존 (문제 있던 코드)
useEffect(() => {
  if (elapsedTime >= 60 && !isTyping) {
    const adIndex = Math.min(Math.floor((elapsedTime - 60) / 30), AD_MESSAGES.length - 1);
    setAdMessage(AD_MESSAGES[adIndex]);
  }
}, [elapsedTime >= 60 ? Math.floor((elapsedTime - 60) / 30) : -1, isTyping]);

// 수정 후 (안정화된 코드)
useEffect(() => {
  if (!showAd) return;
  if (isTyping) return;
  
  const currentMinute = Math.floor(elapsedTime / 60);
  const adIndex = Math.min(currentMinute - 1, AD_MESSAGES.length - 1);
  
  if (adIndex >= 0 && adIndex < AD_MESSAGES.length) {
    setAdMessage(AD_MESSAGES[adIndex]);
  }
}, [showAd, isTyping, Math.floor(elapsedTime / 60)]);
```

#### 2. StatsBar.jsx 실시간 총 낭비 시간 추가
- `currentElapsedTime` props 추가
- `totalTimeWasted + currentElapsedTime` 실시간 합계 표시
- 실시간 추적 표시등 항상 깜빡이도록 수정

#### 3. AdSection.jsx React.memo 최적화
- 불필요한 리렌더링 방지
- 성능 최적화

#### 4. coupangProducts.js 상품 선택 로직 안정화
```javascript
// 기존 (랜덤 선택)
return COUPANG_PRODUCTS[Math.floor(Math.random() * 3)];

// 수정 후 (시간 기반 고정 순환)
const timeSlot = Math.floor(elapsedSeconds / 120); // 2분마다 변경
const productIndex = timeSlot % 3;
return COUPANG_PRODUCTS[productIndex];
```

#### 5. 디버깅 로그 추가
- 광고 업데이트 시점 콘솔 로그
- 문제 재발 시 원인 추적 가능

## 🎯 수정 결과 예상

### 광고 변경 주기
- **기존**: 매 초마다 불안정하게 변경
- **수정 후**: 정확히 1분마다 안정적으로 변경
- **타이핑 중**: 광고 변경 완전 차단

### 쿠팡 상품 변경 주기  
- **기존**: 매번 랜덤하게 변경
- **수정 후**: 2분마다 순환하며 변경

### 실시간 통계
- **기존**: 초기 값에서 변하지 않음
- **수정 후**: 매 초마다 실시간 업데이트

### 표시등 깜빡임
- **기존**: 극한 모드에서만 깜빡임
- **수정 후**: 항상 깜빡임

## 🚀 배포 명령어

```bash
npm run build
git add .
git commit -m "[FIX] 광고 빠른 변경 버그 완전 해결 - 1분 간격 안정화, 타이핑 중 차단, React.memo 최적화"
git push origin main
```

## 🔍 테스트 방법

1. **광고 변경 테스트**:
   - 1분 후 광고 나타남 확인
   - 메시지 타이핑 중 광고 변경되지 않음 확인
   - 정확히 1분 간격으로 광고 메시지 변경 확인

2. **쿠팡 상품 테스트**:
   - 2분마다 상품이 순환하며 변경됨 확인
   - 같은 시간대에서는 동일한 상품 표시 확인

3. **실시간 통계 테스트**:
   - 상단 "총 낭비" 시간이 매 초마다 증가 확인
   - 실시간 추적 표시등 깜빡임 확인

작업 시간: 2025-05-25 오후 (약 30분)
담당: Claude + 사용자 협업
상태: ✅ 수정 완료, 테스트 대기

## 🐛 **추가 버그 수정 (2025-05-25 오후 #2)**

### 문제 5: 탈출 버튼 더블 모달 문제
**증상**: "현실로 돌아가시겠습니까?" 확인 후 브라우저 기본 모달 "사이트에서 나가시겠습니까?" 추가 출현
**원인**: confirmExit에서 window.close() 호출 시 beforeunload 이벤트 추가 발생
**해결**: beforeunload 이벤트 리스너 제거 + 지연 후 페이지 나가기

### 개선 6: 카카오톡 아이콘 현대화
**현재**: 일반적인 MessageCircle 아이콘
**개선**: 카카오톡 전용 말풍선 SVG 아이콘으로 교체
**효과**: 더 직관적이고 브랜드 일관성 있는 UI

### ✅ 추가 수정 완료 (2025-05-25 오후 #2)

#### 1. App.jsx confirmExit 함수 재작성
```javascript
// 기존 (더블 모달 발생)
const confirmExit = () => {
  analytics.trackExit(elapsedTime);
  setShowModal(false);
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.close();
  }
};

// 수정 후 (더블 모달 방지)
const confirmExit = () => {
  analytics.trackExit(elapsedTime);
  storage.updateTotalTimeWasted(elapsedTime); // 시간 저장 추가
  setShowModal(false);
  
  // beforeunload 비활성화 (핵심!)
  window.removeEventListener('beforeunload', handleBeforeUnload);
  
  setTimeout(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.reload(); // 안전한 대안
    }
  }, 100);
};
```

#### 2. ShareSection.jsx 카카오톡 아이콘 업데이트
- MessageCircle 아이콘 → 카카오톡 전용 말풍선 SVG
- 색상도 더 카카오톡다운 yellow-400로 조정
- 브랜드 일관성 및 직관성 향상

## 🎯 **최종 수정 결과**

### 탈출 버튼 동작
- **기존**: 커스텀 모달 → (확인) → 브라우저 모달 (더블 확인)
- **수정 후**: 커스텀 모달 → (확인) → 바로 나가기 (싱글 확인)
- **추가 개선**: 시간 저장 보장, 안전한 페이지 종료

### 카카오톡 공유 버튼
- **기존**: 일반 메시지 아이콘
- **수정 후**: 카카오톡 전용 말풍선 아이콘
- **색상**: yellow-500 → yellow-400 (더 밝고 현대적)

## 🚀 **업데이트된 배포 명령어**

```bash
npm run build
git add .
git commit -m "[FIX] 탈출 버튼 더블 모달 해결 + 카카오톡 아이콘 현대화 - beforeunload 방지, 브랜드 일관성 개선"
git push origin main
```

## 🔍 **추가 테스트 항목**

4. **탈출 버튼 테스트**:
   - 탈출 버튼 클릭 → "현실로 돌아가시겠습니까?" 모달 확인
   - "확인" 클릭 → 추가 브라우저 모달 없이 바로 나가기
   - 시간이 제대로 저장되는지 확인 (다음 방문시)

5. **카카오톡 공유 테스트**:
   - 카카오톡 버튼에 말풍선 아이콘 표시 확인
   - 더 밝은 노란색 스타일 확인
   - 공유 기능 정상 동작 확인
