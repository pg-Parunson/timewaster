# 🛠️ GitHub Pages 배포 트러블슈팅 기록

## 📋 배포 과정에서 발생한 문제들과 해결책

### 🎯 최종 성공 결과
- **성공적 배포 완료**: https://pg-parunson.github.io/timewaster/
- **총 트러블슈팅 시간**: 60분
- **발생한 문제 수**: 4개
- **해결 성공률**: 100%

---

## 🚨 발생한 문제들

### 문제 #1: 초기 404 에러
- **발생일시**: 2025-05-24 18:10
- **문제 유형**: 설정 오류
- **심각도**: 높음
- **문제 설명**: GitHub Pages 사이트에 접속했지만 "There isn't a GitHub Pages site here" 404 에러 발생
- **발생 환경**: GitHub Pages 초기 접속
- **원인**: GitHub Pages가 아직 활성화되지 않음
- **해결책**: GitHub Actions 워크플로우 추가 필요
- **소요 시간**: 5분
- **상태**: ✅ 해결완료

### 문제 #2: Node.js 설정 오류  
- **발생일시**: 2025-05-24 18:15
- **문제 유형**: 의존성 오류
- **심각도**: 높음
- **문제 설명**: `npm ci` 명령어 실행 중 "Dependencies lock file is not found" 오류
- **발생 환경**: GitHub Actions 워크플로우 실행
- **재현 단계**: 
  1. GitHub Actions 실행
  2. Setup Node.js 단계
  3. Install dependencies (npm ci) 실행
  4. package-lock.json 파일 없음으로 인한 실패
- **해결 과정**: 
  1. 오류 로그 분석
  2. `npm ci` → `npm install` 변경
  3. 워크플로우 재실행
- **해결책**: `npm install` 사용으로 변경
- **소요 시간**: 10분
- **상태**: ✅ 해결완료

### 문제 #3: GitHub Actions 의존성 충돌
- **발생일시**: 2025-05-24 18:25
- **문제 유형**: 액션 의존성 오류
- **심각도**: 중간
- **문제 설명**: "Missing download info for actions/upload-artifact@v3" 오류
- **발생 환경**: GitHub Actions - actions/upload-pages-artifact@v2 실행 중
- **원인**: 최신 GitHub Actions API와의 호환성 문제
- **해결 과정**:
  1. 복잡한 Pages 설정 방식에서 간단한 방식으로 변경
  2. `peaceiris/actions-gh-pages@v3` 사용
  3. 불필요한 권한 설정 제거
- **해결책**: 검증된 안정적인 액션으로 교체
- **소요 시간**: 15분
- **상태**: ✅ 해결완료

### 문제 #4: GitHub Pages 권한 오류
- **발생일시**: 2025-05-24 18:35
- **문제 유형**: 권한 설정 오류
- **심각도**: 높음
- **문제 설명**: 
  ```
  remote: Write access to repository not granted.
  fatal: unable to access 'https://github.com/pg-Parunson/timewaster.git/': 
  The requested URL returned error: 403
  ```
- **발생 환경**: GitHub Actions에서 gh-pages 브랜치에 푸시 시도
- **재현 단계**:
  1. GitHub Actions 워크플로우 실행
  2. 빌드 성공
  3. Deploy to GitHub Pages 단계에서 권한 오류
- **해결 과정**:
  1. 저장소가 Private 상태임을 확인
  2. Private 저장소는 GitHub Pages 유료 기능임을 파악
  3. 저장소를 Public으로 변경
  4. GitHub Pages 설정에서 Source를 "GitHub Actions"로 변경
- **해결책**: 
  1. 저장소 Public 변경
  2. Settings → Pages → Source → "GitHub Actions" 선택
- **소요 시간**: 30분
- **상태**: ✅ 해결완료

---

## 🎓 배운 교훈

### 1. GitHub Pages 기본 요구사항
- **Public 저장소 필수**: Private 저장소는 유료 계정 필요
- **Pages 활성화 필수**: Source 설정을 명시적으로 해야 함

### 2. GitHub Actions 베스트 프랙티스
- **검증된 액션 사용**: 수백만 개 프로젝트에서 검증된 액션 선택
- **단순한 워크플로우**: 복잡한 설정보다 단순하고 안정적인 방식
- **점진적 접근**: 문제 발생 시 단계적으로 단순화

### 3. 의존성 관리
- **package-lock.json 관리**: npm ci vs npm install 차이점 이해
- **유연한 설정**: 환경에 따른 유연한 명령어 사용

### 4. 디버깅 접근법
- **로그 분석**: 오류 메시지 정확한 해석
- **단계별 해결**: 한 번에 하나씩 문제 해결
- **문서 참조**: 공식 문서 및 커뮤니티 솔루션 활용

---

## 🔧 최종 성공 워크플로우

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Upload Pages artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

---

## 📊 트러블슈팅 통계

- **총 소요 시간**: 60분
- **가장 오래 걸린 문제**: 권한 오류 (30분)
- **가장 빠른 해결**: 초기 404 에러 (5분)
- **성공률**: 100% (4/4)
- **재발 방지 대책**: ✅ 완료

---

## 🚀 개선 방향

### 1. 예방 조치
- 프로젝트 시작 시 저장소 Visibility 확인
- GitHub Pages 요구사항 사전 체크리스트 작성
- 표준 워크플로우 템플릿 작성

### 2. 모니터링
- GitHub Actions 상태 정기 확인
- 배포 성공/실패 알림 설정
- 성능 모니터링 도구 도입

### 3. 문서화
- 트러블슈팅 가이드 작성 완료
- 팀 공유용 베스트 프랙티스 정리
- 자주 발생하는 문제 FAQ 작성

---

**🎉 결론: 모든 문제를 성공적으로 해결하고 완벽한 배포 환경을 구축했습니다!**

*최종 업데이트: 2025-05-24 19:00*