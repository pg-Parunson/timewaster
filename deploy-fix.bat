@echo off
echo 🔧 Vercel 배포 문제 해결 - 변경사항 커밋 중...

REM Git 스테이징
git add vercel.json
git add package.json

REM 커밋
git commit -m "🔧 Fix Vercel deployment: Add vercel.json config and fix build script - Add vercel.json with proper build configuration - Fix build script to remove NODE_ENV dependency - Enable proper SPA routing with rewrites - Add asset caching headers for performance"

REM Push to main branch
git push origin main

echo ✅ 변경사항이 커밋되었습니다. Vercel이 자동으로 재배포를 시작합니다.
echo 🌐 배포 상태: https://vercel.com/dashboard
echo 🎯 사이트 URL: https://timetrash.net

pause
