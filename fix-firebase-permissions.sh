#!/bin/bash
echo "🔥 Firebase 권한 문제 긴급 수정"
echo ""

echo "1️⃣ 현재 Firebase 프로젝트 확인"
firebase use

echo ""
echo "2️⃣ 현재 데이터베이스 규칙 확인"
firebase database:get --project timewaster-ranking /

echo ""
echo "3️⃣ 긴급 규칙 배포 (모든 권한 허용)"
firebase deploy --only database:rules --project timewaster-ranking

echo ""
echo "4️⃣ 배포 확인"
firebase database:settings --project timewaster-ranking

echo ""
echo "✅ 완료! 브라우저에서 새로고침 후 테스트하세요."
