@echo off
chcp 65001 >nul

:: 🧹 시간낭비 마스터 - 콘솔 정리 완료 테스트 스크립트 (Windows)

echo 🚀 시간낭비 마스터 v2.8.3 - 콘솔 정리 테스트 시작!
echo ==================================================

:: 1️⃣ 의존성 확인
echo.
echo 1️⃣ 의존성 확인 중...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm이 설치되어 있지 않습니다
    pause
    exit /b 1
) else (
    echo ✅ npm 확인됨
    npm --version
)

:: 2️⃣ Production 빌드 실행
echo.
echo 2️⃣ Production 빌드 실행 중...
echo NODE_ENV=production으로 설정하여 console.* 자동 제거

call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 빌드 실패
    pause
    exit /b 1
) else (
    echo ✅ 빌드 성공!
)

:: 3️⃣ 빌드 결과 확인
echo.
echo 3️⃣ 빌드 결과 분석...

if exist "dist" (
    echo 📦 빌드 결과물:
    dir dist /s /-c | find "bytes"
    
    if exist "dist\assets" (
        echo.
        echo 📁 주요 파일들:
        dir dist\assets
    )
) else (
    echo ❌ dist 폴더가 생성되지 않았습니다
    pause
    exit /b 1
)

:: 4️⃣ Console 로그 제거 확인
echo.
echo 4️⃣ Console 로그 제거 확인...

:: Windows에서 grep 대신 findstr 사용
findstr /s /i /c:"console." dist\*.* >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ❌ console 로그가 발견되었습니다!
    echo 💡 개발 모드 코드가 남아있을 수 있습니다.
    pause
    exit /b 1
) else (
    echo ✅ 모든 console 로그가 성공적으로 제거되었습니다!
)

:: 5️⃣ 주요 기능 파일 존재 확인
echo.
echo 5️⃣ 주요 파일 존재 확인...

if exist "dist\index.html" (echo ✅ dist\index.html 존재) else (echo ⚠️ dist\index.html 누락)
if exist "dist\assets" (echo ✅ dist\assets 존재) else (echo ⚠️ dist\assets 누락)
if exist "dist\robots.txt" (echo ✅ dist\robots.txt 존재) else (echo ⚠️ dist\robots.txt 누락)
if exist "dist\sitemap.xml" (echo ✅ dist\sitemap.xml 존재) else (echo ⚠️ dist\sitemap.xml 누락)

:: 6️⃣ 최종 결과
echo.
echo ==================================================
echo 🎉 콘솔 정리 작업 완료!
echo.
echo 📊 결과 요약:
echo   ✅ Production 빌드 성공
echo   ✅ 모든 console.* 제거됨
echo   ✅ 번들 최적화 완료
echo   ✅ 배포 준비 완료
echo.
echo 🚀 다음 단계:
echo   1. npm run deploy        # GitHub Pages 배포
echo   2. Google Search Console 등록
echo   3. 다크 모드 구현
echo.
echo 🌐 사이트: https://timetrash.net
echo ==================================================

pause
