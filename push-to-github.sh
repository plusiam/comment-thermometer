#!/bin/bash

# 댓글 온도계 GitHub 푸시 스크립트

echo "🚀 댓글 온도계 GitHub에 푸시하기"
echo ""

# 현재 디렉토리로 이동
cd /Users/yeohanki/Documents/GitHub/comment-thermometer

# Git 초기화 (이미 되어 있으면 무시됨)
if [ ! -d .git ]; then
    echo "📦 Git 저장소 초기화..."
    git init
    echo "✅ Git 초기화 완료"
else
    echo "✅ Git 저장소 이미 존재"
fi

# 파일 추가
echo ""
echo "📝 파일 추가 중..."
git add .

# 커밋
echo ""
echo "💾 커밋 생성 중..."
git commit -m "초등학교 4학년 도덕 수업용 댓글 온도계 웹 학습지

주요 기능:
- 드래그 앤 드롭으로 댓글 분류 (상처주는 말/응원하는 말/무관심한 말)
- 유연한 채점 시스템 (상처주는 말과 무관심한 말 경계 모호 인정)
- 성찰 질문 답변 포함 이미지 저장 기능
- 학습 결과를 PNG로 다운로드하여 포트폴리오 기록 가능
- 반응형 디자인 (모바일/태블릿/데스크톱 모두 지원)

기술 스택: HTML5, CSS3, Vanilla JavaScript, html2canvas"

# Remote 추가 (이미 있으면 무시됨)
echo ""
echo "🔗 GitHub 저장소 연결 중..."
if git remote | grep -q origin; then
    echo "✅ Remote origin 이미 존재"
    git remote set-url origin https://github.com/plusiam/comment-thermometer.git
else
    git remote add origin https://github.com/plusiam/comment-thermometer.git
    echo "✅ Remote origin 추가 완료"
fi

# 브랜치 확인 및 main으로 변경
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo ""
    echo "🔀 main 브랜치로 변경..."
    git branch -M main
fi

# Push
echo ""
echo "🚀 GitHub에 푸시 중..."
git push -u origin main

echo ""
echo "✅ 완료! https://github.com/plusiam/comment-thermometer 에서 확인하세요!"
echo ""