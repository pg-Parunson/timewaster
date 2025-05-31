@echo off
echo 🔥 Firebase 권한 문제 해결 - 단계별 진행
echo.

echo 1️⃣ 개발 서버 중지 (만약 실행 중이라면)
taskkill /f /im node.exe 2>nul

echo.
echo 2️⃣ 새로운 빌드 시작
npm run build

echo.
echo 3️⃣ 개발 서버 재시작 - 새 테스트 코드 포함
start "시간낭비마스터 개발서버" npm run dev

echo.
echo 4️⃣ 브라우저에서 확인하세요:
echo    - http://localhost:3000
echo    - F12 개발자 도구 열기
echo    - Console 탭에서 Firebase 권한 테스트 결과 확인
echo.
echo ✅ 5초 후 자동으로 Firebase 권한 테스트가 실행됩니다!
echo.
pause
