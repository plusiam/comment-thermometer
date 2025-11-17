// 댓글 데이터
const comments = [
    { id: 1, text: "어떻게 거북이한테 질 수가 있지?", type: "indifferent" },
    { id: 2, text: "잘난 척하더니 꼴좋다!", type: "hurt" },
    { id: 3, text: "재빨라의 시대는 끝났다", type: "indifferent" },
    { id: 4, text: "재빨라도 수고했어!", type: "cheer" },
    { id: 5, text: "다음엔 더 잘할 수 있을 거야!", type: "cheer" },
    { id: 6, text: "거북이가 이겼네 ㅋㅋㅋㅋ", type: "indifferent" },
    { id: 7, text: "재빨라 응원했는데 아쉽네요. 하지만 최선을 다한 모습이 멋있었어요!", type: "cheer" },
    { id: 8, text: "너무 자만했잖아. 당연한 결과야.", type: "hurt" },
    { id: 9, text: "낮잠 자다니 프로정신이 없네", type: "indifferent" },
    { id: 10, text: "노력하는 거북이가 더 멋져!", type: "cheer" },
    { id: 11, text: "재빨라는 이제 끝났어", type: "hurt" },
    { id: 12, text: "실수할 수도 있지! 다음 기회에 힘내!", type: "cheer" }
];

let draggedElement = null;
let placedComments = {
    hurt: [],
    cheer: [],
    indifferent: []
};

// 페이지 로드 시 댓글 카드 생성
document.addEventListener('DOMContentLoaded', () => {
    initializeComments();
    setupDragAndDrop();
});

// 댓글 카드 초기화
function initializeComments() {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';
    
    // 댓글을 랜덤하게 섞기
    const shuffledComments = [...comments].sort(() => Math.random() - 0.5);
    
    shuffledComments.forEach(comment => {
        const card = createCommentCard(comment);
        commentsList.appendChild(card);
    });
}

// 댓글 카드 생성
function createCommentCard(comment) {
    const card = document.createElement('div');
    card.className = 'comment-card';
    card.draggable = true;
    card.dataset.commentId = comment.id;
    card.dataset.correctType = comment.type;
    card.textContent = comment.text;
    
    // 드래그 이벤트 리스너
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
    
    return card;
}

// 드래그 앤 드롭 설정
function setupDragAndDrop() {
    const dropZones = document.querySelectorAll('.drop-area');
    
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragleave', handleDragLeave);
    });
}

// 드래그 시작
function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

// 드래그 종료
function handleDragEnd(e) {
    this.classList.remove('dragging');
}

// 드래그 오버
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
    return false;
}

// 드래그 떠남
function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

// 드롭
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    this.classList.remove('drag-over');
    
    if (draggedElement) {
        // 기존 위치에서 제거
        const parent = draggedElement.parentNode;
        if (parent && parent.classList.contains('drop-area')) {
            // 이전 영역에서 제거
            const previousZone = parent.id.replace('Zone', '').toLowerCase();
            const commentId = parseInt(draggedElement.dataset.commentId);
            placedComments[previousZone] = placedComments[previousZone].filter(id => id !== commentId);
        }
        
        // 새로운 위치에 추가
        this.appendChild(draggedElement);
        draggedElement.classList.add('placed');
        
        // 배치된 댓글 추적
        const zone = this.id.replace('Zone', '').toLowerCase();
        const commentId = parseInt(draggedElement.dataset.commentId);
        
        if (!placedComments[zone]) {
            placedComments[zone] = [];
        }
        
        if (!placedComments[zone].includes(commentId)) {
            placedComments[zone].push(commentId);
        }
        
        checkIfComplete();
    }
    
    return false;
}

// 모든 댓글이 배치되었는지 확인
function checkIfComplete() {
    const totalPlaced = placedComments.hurt.length + placedComments.cheer.length + placedComments.indifferent.length;
    const submitBtn = document.getElementById('submitBtn');
    
    if (totalPlaced === comments.length) {
        submitBtn.style.display = 'block';
        submitBtn.classList.add('pulse');
    } else {
        submitBtn.style.display = 'block';
        submitBtn.classList.remove('pulse');
    }
}

// 결과 표시
function showResults() {
    const totalPlaced = placedComments.hurt.length + placedComments.cheer.length + placedComments.indifferent.length;
    
    if (totalPlaced === 0) {
        alert('먼저 댓글들을 분류해주세요!');
        return;
    }
    
    const resultSection = document.getElementById('resultSection');
    const resultChart = document.getElementById('resultChart');
    
    // 결과 차트 생성
    resultChart.innerHTML = `
        <div class="result-item">
            <span class="emoji">💔</span>
            <div class="count">${placedComments.hurt.length}개</div>
            <div class="label">상처주는 말</div>
        </div>
        <div class="result-item">
            <span class="emoji">💚</span>
            <div class="count">${placedComments.cheer.length}개</div>
            <div class="label">응원하는 말</div>
        </div>
        <div class="result-item">
            <span class="emoji">😐</span>
            <div class="count">${placedComments.indifferent.length}개</div>
            <div class="label">무관심한 말</div>
        </div>
    `;
    
    // 결과 섹션 표시
    resultSection.style.display = 'block';
    
    // 결과 섹션으로 스크롤
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // 정답 체크 (선택사항)
    checkAnswers();
}

// 정답 체크 (교육적 피드백용)
function checkAnswers() {
    let correctCount = 0;
    let totalCount = 0;
    
    // 각 영역의 댓글 확인
    ['hurt', 'cheer', 'indifferent'].forEach(zone => {
        placedComments[zone].forEach(commentId => {
            totalCount++;
            const comment = comments.find(c => c.id === commentId);
            
            if (comment) {
                // 응원하는 말은 정확히 구분해야 함
                if (comment.type === 'cheer') {
                    if (zone === 'cheer') {
                        correctCount++;
                    }
                } 
                // 상처주는 말과 무관심한 말은 섞어도 정답 (부정적 계열)
                else if (comment.type === 'hurt' || comment.type === 'indifferent') {
                    if (zone === 'hurt' || zone === 'indifferent') {
                        correctCount++;
                    }
                }
            }
        });
    });
    
    // 결과에 피드백 추가
    const feedbackArea = document.getElementById('feedbackArea');
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'feedback-box';
    feedbackDiv.style.cssText = 'margin-top: 20px; padding: 20px; background: #f8f9ff; border-radius: 10px; text-align: center;';
    
    const accuracy = Math.round((correctCount / totalCount) * 100);
    
    let feedbackMessage = '';
    let feedbackEmoji = '';
    let feedbackDetail = '';
    
    if (accuracy >= 90) {
        feedbackEmoji = '🎉';
        feedbackMessage = '정말 잘했어요! 말이 주는 영향을 잘 이해하고 있네요!';
        feedbackDetail = '응원하는 말과 부정적인 말을 잘 구분했어요.';
    } else if (accuracy >= 70) {
        feedbackEmoji = '👏';
        feedbackMessage = '좋아요! 각 말이 주는 느낌에 대해 더 생각해봐요!';
        feedbackDetail = '조금만 더 생각해보면 완벽해질 거예요.';
    } else {
        feedbackEmoji = '💪';
        feedbackMessage = '괜찮아요! 다시 한번 생각해보면서 분류해봐요!';
        feedbackDetail = '응원하는 말과 그렇지 않은 말을 먼저 나눠볼까요?';
    }
    
    feedbackDiv.innerHTML = `
        <div style="font-size: 3em; margin-bottom: 10px;">${feedbackEmoji}</div>
        <div style="font-size: 1.3em; font-weight: bold; color: #333; margin-bottom: 10px;">
            ${feedbackMessage}
        </div>
        <div style="color: #666; margin-bottom: 10px;">
            나의 이해도: ${accuracy}%
        </div>
        <div style="color: #888; font-size: 0.9em; padding: 10px; background: white; border-radius: 5px;">
            💡 ${feedbackDetail}
        </div>
    `;
    
    // 기존 피드백 제거하고 새로 추가
    feedbackArea.innerHTML = '';
    feedbackArea.appendChild(feedbackDiv);
}

// 결과를 이미지로 다운로드
function downloadResult() {
    const captureArea = document.getElementById('captureArea');
    
    // 성찰 답변 수집
    const answers = [];
    const answerBoxes = document.querySelectorAll('.answer-box');
    const questions = document.querySelectorAll('.question');
    
    answerBoxes.forEach((box, index) => {
        const answer = box.value.trim();
        if (answer) {
            answers.push({
                question: questions[index].textContent,
                answer: answer
            });
        }
    });
    
    // 성찰 답변을 captureArea에 임시로 추가
    const reflectionDiv = document.createElement('div');
    reflectionDiv.id = 'tempReflection';
    reflectionDiv.style.cssText = 'margin-top: 30px; padding: 20px; background: #f8f9ff; border-radius: 10px;';
    
    if (answers.length > 0) {
        let reflectionHTML = '<h3 style="color: #333; margin-bottom: 15px; text-align: center;">💭 나의 생각</h3>';
        
        answers.forEach(item => {
            reflectionHTML += `
                <div style="margin-bottom: 15px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #667eea;">
                    <div style="font-weight: bold; color: #333; margin-bottom: 8px;">${item.question}</div>
                    <div style="color: #555; line-height: 1.6;">${item.answer}</div>
                </div>
            `;
        });
        
        reflectionDiv.innerHTML = reflectionHTML;
        captureArea.appendChild(reflectionDiv);
    }
    
    // html2canvas로 캡처
    html2canvas(captureArea, {
        backgroundColor: '#ffffff',
        scale: 2, // 고화질
        logging: false,
        useCORS: true
    }).then(canvas => {
        // 임시로 추가한 성찰 답변 제거
        const tempReflection = document.getElementById('tempReflection');
        if (tempReflection) {
            tempReflection.remove();
        }
        
        // Canvas를 이미지로 변환
        canvas.toBlob(function(blob) {
            // 다운로드 링크 생성
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            // 파일명 생성 (날짜 포함)
            const now = new Date();
            const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
            const timeStr = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
            
            link.download = `댓글온도계_결과_${dateStr}_${timeStr}.png`;
            link.href = url;
            
            // 다운로드 실행
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // URL 해제
            URL.revokeObjectURL(url);
            
            // 성공 메시지
            showDownloadMessage();
        });
    }).catch(error => {
        // 임시로 추가한 성찰 답변 제거 (에러 시에도)
        const tempReflection = document.getElementById('tempReflection');
        if (tempReflection) {
            tempReflection.remove();
        }
        
        console.error('이미지 생성 중 오류:', error);
        alert('이미지 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    });
}

// 다운로드 성공 메시지
function showDownloadMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px 50px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        text-align: center;
        animation: fadeInOut 2s ease-in-out;
    `;
    
    message.innerHTML = `
        <div style="font-size: 3em; margin-bottom: 10px;">✅</div>
        <div style="font-size: 1.2em; font-weight: bold; color: #333;">
            이미지가 저장되었습니다!
        </div>
    `;
    
    document.body.appendChild(message);
    
    // 애니메이션 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
    `;
    document.head.appendChild(style);
    
    // 2초 후 제거
    setTimeout(() => {
        document.body.removeChild(message);
    }, 2000);
}

// 활동 초기화
function resetActivity() {
    // 배치된 댓글 초기화
    placedComments = {
        hurt: [],
        cheer: [],
        indifferent: []
    };
    
    // 드롭 영역 비우기
    document.querySelectorAll('.drop-area').forEach(zone => {
        const hint = zone.querySelector('.drop-hint');
        zone.innerHTML = '';
        if (hint) {
            zone.appendChild(hint);
        } else {
            zone.innerHTML = '<p class="drop-hint">여기로 드래그하세요</p>';
        }
    });
    
    // 결과 섹션 숨기기
    document.getElementById('resultSection').style.display = 'none';
    
    // 댓글 카드 다시 생성
    initializeComments();
    
    // 제출 버튼 숨기기
    document.getElementById('submitBtn').style.display = 'none';
    
    // 성찰 답변 초기화
    document.querySelectorAll('.answer-box').forEach(box => {
        box.value = '';
    });
    
    // 맨 위로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 애니메이션 효과를 위한 CSS 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
    
    .pulse {
        animation: pulse 2s infinite;
    }
`;
document.head.appendChild(style);
