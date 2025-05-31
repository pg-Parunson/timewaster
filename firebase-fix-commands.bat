@echo off
echo 🔥 Firebase 권한 문제 해결 스크립트
echo.

echo 1️⃣ 현재 Firebase 규칙 확인
firebase database:get --project your-project-id /

echo.
echo 2️⃣ 새로운 규칙 배포
firebase deploy --only database --project your-project-id

echo.
echo 3️⃣ 규칙 적용 확인
firebase database:get --project your-project-id / --shallow

echo.
echo ✅ 완료! 브라우저에서 테스트해보세요.
pause
