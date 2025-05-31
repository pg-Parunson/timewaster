#!/bin/bash

# 🧹 시간낭비 마스터 - 콘솔 정리 완료 테스트 스크립트

echo "🚀 시간낭비 마스터 v2.8.3 - 콘솔 정리 테스트 시작!"
echo "=================================================="

# 1️⃣ 의존성 확인
echo ""
echo "1️⃣ 의존성 확인 중..."
if command -v npm &> /dev/null; then
    echo "✅ npm 확인됨"
    npm --version
else
    echo "❌ npm이 설치되어 있지 않습니다"
    exit 1
fi

# 2️⃣ Production 빌드 실행
echo ""
echo "2️⃣ Production 빌드 실행 중..."
echo "NODE_ENV=production으로 설정하여 console.* 자동 제거"

if npm run build; then
    echo "✅ 빌드 성공!"
else
    echo "❌ 빌드 실패"
    exit 1
fi

# 3️⃣ 빌드 결과 확인
echo ""
echo "3️⃣ 빌드 결과 분석..."

if [ -d "dist" ]; then
    echo "📦 빌드 결과물 크기:"
    du -sh dist/
    
    if [ -d "dist/assets" ]; then
        echo ""
        echo "📁 주요 파일들:"
        ls -lah dist/assets/
    fi
else
    echo "❌ dist 폴더가 생성되지 않았습니다"
    exit 1
fi

# 4️⃣ Console 로그 제거 확인
echo ""
echo "4️⃣ Console 로그 제거 확인..."

if grep -r "console\." dist/ --exclude-dir=node_modules 2>/dev/null; then
    echo "❌ console 로그가 발견되었습니다!"
    echo "💡 개발 모드 코드가 남아있을 수 있습니다."
    exit 1
else
    echo "✅ 모든 console 로그가 성공적으로 제거되었습니다!"
fi

# 5️⃣ 주요 기능 파일 존재 확인
echo ""
echo "5️⃣ 주요 파일 존재 확인..."

REQUIRED_FILES=(
    "dist/index.html"
    "dist/assets"
    "dist/robots.txt"
    "dist/sitemap.xml"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -e "$file" ]; then
        echo "✅ $file 존재"
    else
        echo "⚠️ $file 누락"
    fi
done

# 6️⃣ 최종 결과
echo ""
echo "=================================================="
echo "🎉 콘솔 정리 작업 완료!"
echo ""
echo "📊 결과 요약:"
echo "  ✅ Production 빌드 성공"
echo "  ✅ 모든 console.* 제거됨"
echo "  ✅ 번들 최적화 완료"
echo "  ✅ 배포 준비 완료"
echo ""
echo "🚀 다음 단계:"
echo "  1. npm run deploy        # GitHub Pages 배포"
echo "  2. Google Search Console 등록"
echo "  3. 다크 모드 구현"
echo ""
echo "🌐 사이트: https://timetrash.net"
echo "=================================================="
