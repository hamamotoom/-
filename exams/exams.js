// exams.js - منطق صفحة الامتحانات (باستخدام app.js كمصدر للبيانات)

import { evaluateExamAnswers, getExamsDataForGrade, getExamById, getStats, saveStats, requireLogin } from '../app.js';

let currentExamId = null;
let statsStore = loadStatsFromStorage();

// ==================== إدارة التخزين المحلي ====================
function loadStatsFromStorage() {
    return getStats();
}

function saveStatsToStorage() {
    saveStats(statsStore);
}

// تحديث الإحصائيات بناءً على نتائج الامتحان
function updateStatsFromResults(results, questionsArray) {
    if (!Array.isArray(results) || !Array.isArray(questionsArray)) return 0;
    let sessionCorrect = 0;
    let sessionWrong = 0;
    const perCategoryDelta = {};

    results.forEach(r => {
        const q = questionsArray[r.idx];
        const category = (q && q.category) ? q.category : 'مفردات';
        if (!statsStore.byCategory[category]) statsStore.byCategory[category] = { correct: 0, wrong: 0, points: 0 };
        if (!perCategoryDelta[category]) perCategoryDelta[category] = { correct: 0, wrong: 0 };

        if (r.isCorrect) {
            sessionCorrect++;
            statsStore.totalCorrect++;
            statsStore.byCategory[category].correct++;
            perCategoryDelta[category].correct++;
        } else {
            sessionWrong++;
            statsStore.totalWrong++;
            statsStore.byCategory[category].wrong++;
            perCategoryDelta[category].wrong++;
        }
    });

    const sessionPoints = sessionCorrect - sessionWrong;
    statsStore.points = (statsStore.points || 0) + sessionPoints;

    for (const cat in perCategoryDelta) {
        const d = perCategoryDelta[cat];
        statsStore.byCategory[cat].points = (statsStore.byCategory[cat].points || 0) + (d.correct - d.wrong);
    }

    saveStatsToStorage();
    return sessionPoints;
}

// ==================== عرض قائمة الامتحانات ====================
function populateExams() {
    const examsContainer = document.querySelector('.exams-container');
    if (!examsContainer) return;

    let examsHTML = '';
    const availableExams = getExamsDataForGrade().filter(exam => exam.status !== 'locked');

    availableExams.forEach(exam => {
        examsHTML += `
            <div class="exam-card">
                <div class="exam-header">
                    <div>
                        <div class="exam-title">${exam.title}</div>
                        <div class="exam-details">
                            <div class="exam-info">
                                <i class="far fa-question-circle"></i>
                                <span>${exam.questionsCount} أسئلة</span>
                            </div>
                            <div class="exam-info">
                                <i class="far fa-clock"></i>
                                <span>${exam.duration}</span>
                            </div>
                        </div>
                    </div>
                    <div class="exam-status status-${exam.status}">
                        متاح
                    </div>
                </div>
                <div class="exam-description">
                    ${exam.description}
                </div>
                <button class="exam-btn" data-exam-id="${exam.id}">
                    <i class="fas fa-play-circle"></i>
                    ابدأ الامتحان
                </button>
            </div>
        `;
    });

    examsContainer.innerHTML = examsHTML;

    document.querySelectorAll('.exam-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (btn.disabled) return;
            const examId = parseInt(btn.dataset.examId);
            const exam = getExamById(examId);
            if (exam) startExam(exam);
        });
    });
}

// ==================== بدء الامتحان ====================
function startExam(exam) {
    currentExamId = exam.id;
    document.getElementById('exam-title-header').textContent = exam.title;

    const questionsContainer = document.getElementById('exam-questions');
    questionsContainer.innerHTML = '';

    exam.questions.forEach((question, index) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        questionCard.id = `exam-question-${exam.id}-${index}`;

        let optionsHTML = '';
        question.options.forEach((option, optIndex) => {
            optionsHTML += `
                <label class="option-label">
                    <input type="radio" name="exam-${exam.id}-question-${index}" value="${optIndex}">
                    <span>${option}</span>
                </label>
            `;
        });

        questionCard.innerHTML = `
            <div class="question-text">${index + 1}. ${question.text}</div>
            <div class="question-options">
                ${optionsHTML}
            </div>
        `;
        questionsContainer.appendChild(questionCard);
    });

    document.getElementById('exams-screen').classList.remove('active');
    document.getElementById('exam-view-screen').classList.add('active');
}

// ==================== العودة إلى قائمة الامتحانات ====================
function goBackToExams() {
    document.getElementById('exam-view-screen').classList.remove('active');
    document.getElementById('exams-screen').classList.add('active');
    const summary = document.getElementById('exam-summary');
    if (summary) summary.remove();
}

// ==================== عرض رسائل الخطأ ====================
function showErrorMessage(message) {
    let errorContainer = document.getElementById('error-message-container');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'error-message-container';
        errorContainer.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            background: #FEE2E2;
            color: #991B1B;
            padding: 16px;
            border-radius: 8px;
            border: 2px solid #DC2626;
            box-shadow: 0 10px 30px rgba(220, 38, 38, 0.3);
            font-size: 1rem;
            text-align: right;
            z-index: 9999;
            direction: rtl;
            font-weight: 500;
        `;
        document.body.appendChild(errorContainer);
    }
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    setTimeout(() => { errorContainer.style.display = 'none'; }, 5000);
}

// ==================== عرض ملخص النتائج ====================
function displayExamSummary(correct, totalQuestions, results, sessionPoints) {
    const percentage = (correct / totalQuestions) * 100;
    const summaryContainer = document.createElement('div');
    summaryContainer.id = 'exam-summary';
    summaryContainer.className = 'exam-summary';

    summaryContainer.innerHTML = `
        <div class="summary-header">
            <h4><i class="fas fa-check-double"></i> ملخص النتائج</h4>
        </div>
        <div class="summary-stats">
            <div class="summary-stat">
                <span class="stat-label">صحيح:</span>
                <span class="stat-value correct-value">${correct}</span>
            </div>
            <div class="summary-stat">
                <span class="stat-label">خاطئ:</span>
                <span class="stat-value wrong-value">${totalQuestions - correct}</span>
            </div>
            <div class="summary-stat">
                <span class="stat-label">النسبة:</span>
                <span class="stat-value percent-value">${percentage.toFixed(0)}%</span>
            </div>
            <div class="summary-stat">
                <span class="stat-label">نقاط:</span>
                <span class="stat-value points-value">${sessionPoints}</span>
            </div>
        </div>
        <div class="exam-summary-list"></div>
        <div class="exam-summary-actions"></div>
    `;

    const listContainer = summaryContainer.querySelector('.exam-summary-list');
    results.forEach(r => {
        const item = document.createElement('div');
        item.className = `exam-summary-item ${r.isCorrect ? 'correct-item' : 'wrong-item'}`;
        const qNum = r.idx + 1;
        if (r.isCorrect) {
            item.innerText = `السؤال ${qNum}: صح`;
        } else {
            item.innerText = `السؤال ${qNum}: الإجابة الصحيحة هي: ${r.correctAnswer}`;
        }
        listContainer.appendChild(item);
    });

    const nextUnitId = currentExamId + 1;
    const actionsDiv = summaryContainer.querySelector('.exam-summary-actions');
    if (nextUnitId <= 3) {
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-primary';
        nextBtn.textContent = 'الانتقال للوحدة التالية';
        nextBtn.addEventListener('click', () => {
            window.location.href = `lessons.html?unit=${nextUnitId}`;
        });
        actionsDiv.appendChild(nextBtn);
    } else {
        const doneMsg = document.createElement('div');
        doneMsg.className = 'results-message';
        doneMsg.textContent = '🎉 لقد أكملت كل الوحدات المتاحة.';
        actionsDiv.appendChild(doneMsg);
    }

    const examContent = document.getElementById('exam-questions').parentElement;
    examContent.appendChild(summaryContainer);
    summaryContainer.scrollIntoView({ behavior: 'smooth' });
}

// ==================== تسليم الامتحان وتصحيحه (باستخدام evaluateExamAnswers) ====================
function submitExam() {
    const exam = getExamById(currentExamId);
    if (!exam) return;

    // جمع إجابات المستخدم
    const questions = document.querySelectorAll('#exam-questions .question-card');
    let allAnswered = true;
    const selectedAnswers = [];

    questions.forEach((questionCard, idx) => {
        const radio = questionCard.querySelector('input[type="radio"]:checked');
        if (!radio) {
            allAnswered = false;
            questionCard.style.borderColor = '#FFA500';
        } else {
            questionCard.style.borderColor = '';
            selectedAnswers[idx] = parseInt(radio.value);
        }
    });

    if (!allAnswered) {
        showErrorMessage('⚠️ يجب الإجابة على جميع الأسئلة قبل التسليم!');
        return;
    }

    // استخدام دالة التصحيح من app.js
    const evaluation = evaluateExamAnswers(exam, selectedAnswers);
    const { correct, total, results } = evaluation;

    // تحديث الإحصائيات
    const sessionPoints = updateStatsFromResults(results, exam.questions);

    // عرض النتائج في واجهة المستخدم (تلوين البطاقات وعرض الإجابات)
    questions.forEach((questionCard, idx) => {
        const result = results.find(r => r.idx === idx);
        if (!result) return;

        if (result.isCorrect) {
            questionCard.style.borderColor = 'var(--success)';
            questionCard.style.backgroundColor = 'rgba(34, 197, 94, 0.05)';
            const resultDiv = document.createElement('div');
            resultDiv.className = 'answer-result-inline correct-inline';
            resultDiv.innerHTML = `<i class="fas fa-check-circle"></i> الإجابة ${idx + 1}: صح`;
            questionCard.appendChild(resultDiv);
        } else {
            questionCard.style.borderColor = '#EF4444';
            questionCard.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
            const resultDiv = document.createElement('div');
            resultDiv.className = 'answer-result-inline wrong-inline';
            resultDiv.innerHTML = `
                <div><i class="fas fa-times-circle"></i> الإجابة ${idx + 1}: خطأ</div>
                <div class="correct-answer-inline">الإجابة الصحيحة: ${result.correctAnswer}</div>
            `;
            questionCard.appendChild(resultDiv);
        }
    });

    displayExamSummary(correct, total, results, sessionPoints);
}

// ==================== تهيئة الأحداث ====================
function initEventListeners() {
    const backBtn = document.getElementById('back-to-exams-btn');
    if (backBtn) backBtn.addEventListener('click', goBackToExams);

    const submitBtn = document.getElementById('submit-exam-btn');
    if (submitBtn) submitBtn.addEventListener('click', submitExam);

    document.addEventListener('click', function(e) {
        const label = e.target.closest('.option-label');
        if (!label) return;
        const input = label.querySelector('input[type="radio"]');
        if (!input || e.target === input) return;
        e.preventDefault();
        input.focus();
        input.click();
    });
}

// ==================== بدء التطبيق ====================
document.addEventListener('DOMContentLoaded', () => {
    if (!requireLogin()) return;
    initEventListeners();
    populateExams();

    const urlParams = new URLSearchParams(window.location.search);
    const examParam = urlParams.get('exam');
    if (examParam) {
        const exam = getExamById(parseInt(examParam));
        if (exam && exam.status !== 'locked') {
            startExam(exam);
        }
    }
});