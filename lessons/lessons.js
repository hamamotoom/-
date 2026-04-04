// lessons.js — النسخة المعدلة
import {
    ALL_CATEGORIES,
    checkLessonAnswers,
    getStats,
    saveStats,
    requireLogin,
    getUnitsCount,
    getUnitName,
    getUnitLessons,
    getLesson,
    getExamsByUnit
} from '../app.js';

// ------------------- إدارة الإحصائيات -------------------
let statsStore = loadStatsFromStorage();

function loadStatsFromStorage() {
    return getStats();
}

function saveStatsToStorage() {
    saveStats(statsStore);
}

function updateStatsFromResults(results, questionsArray) {
    if (!Array.isArray(results) || !Array.isArray(questionsArray)) return 0;
    let sessionCorrect = 0, sessionWrong = 0;
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

// ------------------- متغيرات الحالة -------------------
let currentUnitId = null;
let currentLessonId = null;
let expandedUnit = null;

// ------------------- دوال العرض الأساسية -------------------
function updateUnitInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const unitParam = urlParams.get('unit');
    if (unitParam) {
        const unitLessons = getUnitLessons(unitParam);
        if (unitLessons.length > 0) {
            document.getElementById('header-unit-name').textContent = getUnitName(unitParam) || '';
            document.getElementById('lesson-count').textContent = unitLessons.length;
        }
    }
}

function populateLessons() {
    const unitsContainer = document.querySelector('.units-container');
    if (!unitsContainer) return;
    unitsContainer.innerHTML = '';

    const totalUnits = getUnitsCount();
    for (let unitId = 1; unitId <= totalUnits; unitId++) {
        const unitLessons = getUnitLessons(unitId);
        if (!Array.isArray(unitLessons)) continue;

        const completedCount = unitLessons.filter(l => l.status === 'completed').length;
        const lockedCount = unitLessons.filter(l => l.status === 'locked').length;
        const isUnitLocked = lockedCount === unitLessons.length;

        const unitCard = document.createElement('div');
        unitCard.className = `unit-card${isUnitLocked ? ' locked' : ''}`;
        unitCard.setAttribute('data-unit', unitId);

        const statusText = isUnitLocked
            ? 'مقفلة'
            : `${completedCount} من ${unitLessons.length} حصص مكتملة`;

        unitCard.innerHTML = `
            <div class="unit-header">
                <h3><i class="fas fa-book"></i> ${getUnitName(unitId) || 'الوحدة'}</h3>
                <span class="unit-status">${statusText}</span>
            </div>
            <div class="unit-lessons" id="unit-${unitId}-lessons"></div>
        `;

        unitCard.querySelector('.unit-header').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleLessons(unitCard);
        });

        unitsContainer.appendChild(unitCard);
        if (isUnitLocked) continue;

        const lessonsContainer = unitCard.querySelector('.unit-lessons');
        let lessonsHTML = '';
        unitLessons.forEach(lesson => {
            lessonsHTML += `
                <div class="lesson-item" data-unit="${unitId}" data-lesson="${lesson.id}">
                    <div class="lesson-header">
                        <div class="lesson-title">
                            <i class="fas fa-video"></i> ${lesson.title}
                        </div>
                        <div class="lesson-status status-${lesson.status}">
                            ${getStatusText(lesson.status)}
                        </div>
                    </div>
                    <div class="lesson-details">
                        <div class="lesson-meta">
                            <span><i class="fab fa-youtube"></i> يوتيوب</span>
                        </div>
                    </div>
                </div>
            `;
        });
        lessonsContainer.innerHTML = lessonsHTML;

        lessonsContainer.querySelectorAll('.lesson-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const unit = item.getAttribute('data-unit');
                const lesson = parseInt(item.getAttribute('data-lesson'));
                viewLesson(unit, lesson);
            });
        });
    }
}

function getStatusText(status) {
    switch (status) {
        case 'completed': return 'مكتملة';
        case 'current':   return 'حالية';
        case 'locked':    return 'مقفلة';
        default:          return '';
    }
}

function toggleLessons(unitElement) {
    if (unitElement.classList.contains('locked')) return;
    const unitId = unitElement.getAttribute('data-unit');
    const lessonsContainer = unitElement.querySelector('.unit-lessons');

    if (expandedUnit === unitId) {
        lessonsContainer.classList.remove('expanded');
        expandedUnit = null;
        unitElement.querySelector('.unit-status').style.backgroundColor = 'white';
    } else {
        document.querySelectorAll('.unit-lessons.expanded').forEach(c => c.classList.remove('expanded'));
        lessonsContainer.classList.add('expanded');
        expandedUnit = unitId;
        document.querySelectorAll('.unit-card').forEach(card => {
            card.querySelector('.unit-status').style.backgroundColor = 'white';
        });
        unitElement.querySelector('.unit-status').style.backgroundColor = 'var(--primary-light)';
    }
}

function viewLesson(unitId, lessonId) {
    const lesson = getLesson(unitId, lessonId);
    if (!lesson) return;

    currentUnitId = unitId;
    currentLessonId = lessonId;

    document.getElementById('lesson-title-header').textContent = lesson.title;
    document.getElementById('lesson-iframe').src = lesson.videoUrl;

    const questionsContainer = document.getElementById('lesson-questions');
    questionsContainer.innerHTML = '';

    lesson.questions.forEach((question, index) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        let optionsHTML = '';
        question.options.forEach((option, optIndex) => {
            optionsHTML += `
                <label class="option-label">
                    <input type="radio" name="lesson-${unitId}-${lessonId}-question-${index}" value="${optIndex}">
                    <span>${option}</span>
                </label>
            `;
        });
        questionCard.innerHTML = `
            <div class="question-title">${index + 1}. ${question.text}</div>
            <div class="question-options">${optionsHTML}</div>
        `;
        questionsContainer.appendChild(questionCard);
    });

    // إزالة الملخص القديم إن وجد
    const oldSummary = document.getElementById('lesson-summary');
    if (oldSummary) oldSummary.remove();

    document.getElementById('lessons-screen').classList.remove('active');
    document.getElementById('lesson-view-screen').classList.add('active');
}

function goBackToLessons() {
    document.getElementById('lesson-view-screen').classList.remove('active');
    document.getElementById('lessons-screen').classList.add('active');
    const summary = document.getElementById('lesson-summary');
    if (summary) summary.remove();
    // إيقاف الفيديو عند الرجوع
    document.getElementById('lesson-iframe').src = '';
}

function submitLesson() {
    const questions = document.querySelectorAll('#lesson-questions .question-card');
    const currentLesson = getLesson(currentUnitId, currentLessonId);
    if (!currentLesson) return;

    // التحقق من الإجابة على جميع الأسئلة
    let allAnswered = true;
    questions.forEach(q => {
        if (!q.querySelector('input[type="radio"]:checked')) {
            allAnswered = false;
            q.style.borderColor = '#FFA500';
        } else {
            q.style.borderColor = '';
        }
    });
    if (!allAnswered) {
        showErrorMessage('⚠️ يجب الإجابة على جميع الأسئلة قبل التسليم!');
        return;
    }

    // تعطيل زر التسليم لمنع الإرسال المزدوج
    const submitBtn = document.getElementById('submit-lesson-btn');
    if (submitBtn) submitBtn.disabled = true;

    // ✅ جمع إجابات المستخدم
    const userAnswers = [];
    questions.forEach((questionCard) => {
        const radio = questionCard.querySelector('input[type="radio"]:checked');
        userAnswers.push(parseInt(radio.value));
    });

    // ✅ استدعاء دالة التصحيح من app.js
    const { correctCount, totalQuestions, resultsArray, sessionPoints } = checkLessonAnswers(
        currentLesson.questions,
        userAnswers
    );

    // ✅ تعطيل خيارات الإجابة بعد التسليم
    questions.forEach(questionCard => {
        questionCard.querySelectorAll('input[type="radio"]').forEach(input => input.disabled = true);
    });

    // ✅ تطبيق التغذية الراجعة على كل سؤال (بناءً على نتائج التصحيح)
    questions.forEach((questionCard, idx) => {
        const result = resultsArray[idx];
        if (result.isCorrect) {
            questionCard.style.borderColor = 'var(--success)';
            questionCard.style.backgroundColor = 'rgba(34, 197, 94, 0.05)';
            const div = document.createElement('div');
            div.className = 'answer-result-inline correct-inline';
            div.innerHTML = `<i class="fas fa-check-circle"></i> السؤال ${idx + 1}: صحيح ✓`;
            questionCard.appendChild(div);
        } else {
            questionCard.style.borderColor = '#EF4444';
            questionCard.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
            const div = document.createElement('div');
            div.className = 'answer-result-inline wrong-inline';
            div.innerHTML = `
                <div><i class="fas fa-times-circle"></i> السؤال ${idx + 1}: خطأ</div>
                <div class="correct-answer-inline">الإجابة الصحيحة: ${result.correctAnswer}</div>
            `;
            questionCard.appendChild(div);
        }
    });

    // ✅ تحديث الإحصائيات باستخدام النتائج
    updateStatsFromResults(resultsArray, currentLesson.questions);

    // ✅ تحديث حالة الحصة
    if (currentLesson.status !== 'completed') {
        currentLesson.status = 'completed';
        const currentIndex = unitLessons.findIndex(l => l.id === currentLessonId);
        if (currentIndex !== -1 && currentIndex + 1 < unitLessons.length) {
            const nextLesson = unitLessons[currentIndex + 1];
            if (nextLesson.status === 'locked') {
                nextLesson.status = 'current';
            }
        }
    }

    // ✅ عرض الملخص باستخدام النتائج
    displayLessonSummary(correctCount, totalQuestions, resultsArray, sessionPoints);
}

function displayLessonSummary(correct, totalQuestions, results, sessionPoints) {
    // إزالة ملخص سابق إن وجد
    const oldSummary = document.getElementById('lesson-summary');
    if (oldSummary) oldSummary.remove();

    const percentage = totalQuestions > 0 ? (correct / totalQuestions) * 100 : 0;
    const summaryContainer = document.createElement('div');
    summaryContainer.id = 'lesson-summary';
    summaryContainer.className = 'exam-summary';
    summaryContainer.innerHTML = `
        <div class="summary-header">
            <h4><i class="fas fa-list"></i> ملخص الحصة</h4>
        </div>
        <div class="summary-stats">
            <div class="summary-stat">
                <span class="stat-label">صحيح</span>
                <span class="stat-value correct-value">${correct}</span>
            </div>
            <div class="summary-stat">
                <span class="stat-label">خاطئ</span>
                <span class="stat-value wrong-value">${totalQuestions - correct}</span>
            </div>
            <div class="summary-stat">
                <span class="stat-label">النسبة</span>
                <span class="stat-value percent-value">${percentage.toFixed(0)}%</span>
            </div>
            <div class="summary-stat">
                <span class="stat-label">نقاط</span>
                <span class="stat-value points-value">${sessionPoints}</span>
            </div>
        </div>
        <div class="exam-summary-list"></div>
        <div class="lesson-summary-actions"></div>
    `;

    const listContainer = summaryContainer.querySelector('.exam-summary-list');
    results.forEach(r => {
        const item = document.createElement('div');
        item.className = `exam-summary-item ${r.isCorrect ? 'correct-item' : 'wrong-item'}`;
        item.innerText = r.isCorrect
            ? `السؤال ${r.idx + 1}: صحيح ✓`
            : `السؤال ${r.idx + 1}: الإجابة الصحيحة هي: ${r.correctAnswer}`;
        listContainer.appendChild(item);
    });

    const actionsDiv = summaryContainer.querySelector('.lesson-summary-actions');
    const lessons = getUnitLessons(currentUnitId);
    const curIdNum = parseInt(currentLessonId, 10);
    let nextLesson = null;
    if (lessons) {
        for (let i = 0; i < lessons.length; i++) {
            if (lessons[i].id === curIdNum && i + 1 < lessons.length) {
                nextLesson = lessons[i + 1];
                break;
            }
        }
    }

    if (nextLesson) {
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-primary';
        nextBtn.innerHTML = '<i class="fas fa-arrow-left"></i> الحصة التالية';
        nextBtn.addEventListener('click', () => viewLesson(currentUnitId, nextLesson.id));
        actionsDiv.appendChild(nextBtn);
    } else {
        const examsForUnit = getExamsByUnit(currentUnitId);
        const examForUnit = examsForUnit.length ? examsForUnit[0] : null;
        if (examForUnit && examForUnit.status !== 'locked') {
            const examBtn = document.createElement('button');
            examBtn.className = 'btn btn-primary';
            examBtn.innerHTML = '<i class="fas fa-file-alt"></i> ابدأ امتحان الوحدة';
            examBtn.addEventListener('click', () => {
                window.location.href = `../exams/exams.html?exam=${examForUnit.id}`;
            });
            actionsDiv.appendChild(examBtn);
        } else {
            const doneMsg = document.createElement('div');
            doneMsg.className = 'results-message';
            doneMsg.textContent = '🎉 أحسنت! انتهت جميع حصص هذه الوحدة.';
            actionsDiv.appendChild(doneMsg);
        }
    }

    const lessonContent = document.getElementById('lesson-questions').parentElement;
    lessonContent.appendChild(summaryContainer);
    summaryContainer.scrollIntoView({ behavior: 'smooth' });
}

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
            box-shadow: 0 10px 30px rgba(220,38,38,0.3);
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

// ------------------- التهيئة وربط الأحداث -------------------
document.addEventListener('DOMContentLoaded', function () {
    if (!requireLogin()) return;
    if (getUnitsCount() === 0) {
        const container = document.querySelector('.units-container');
        if (container) {
            container.innerHTML = `
                <div style="background:#FEE2E2;color:#991B1B;padding:16px;border-radius:12px;text-align:center;">
                    ⚠️ حدث خطأ في تحميل البيانات. تأكد من وجود ملف app.js في نفس المجلد.
                </div>`;
        }
        return;
    }

    updateUnitInfo();
    populateLessons();

    document.getElementById('back-to-lessons-btn').addEventListener('click', goBackToLessons);
    document.getElementById('submit-lesson-btn').addEventListener('click', submitLesson);

    setTimeout(() => {
        const firstUnit = document.querySelector('.unit-card:not(.locked)');
        if (firstUnit) toggleLessons(firstUnit);
    }, 300);

    const urlParams = new URLSearchParams(window.location.search);
    const unitParam = urlParams.get('unit');
    const lessonParam = urlParams.get('lesson');

    if (unitParam && getUnitLessons(unitParam).length > 0) {
        if (lessonParam) {
            viewLesson(unitParam, parseInt(lessonParam));
        } else {
            setTimeout(() => {
                const unitCard = document.querySelector(`.unit-card[data-unit="${unitParam}"]`);
                if (unitCard) {
                    toggleLessons(unitCard);
                    unitCard.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
        }
    }

    document.addEventListener('pointerdown', function (e) {
        const label = e.target.closest('.option-label');
        if (!label) return;
        const input = label.querySelector('input[type="radio"]');
        if (!input || e.target === input) return;
        e.preventDefault();
        input.focus();
        input.click();
    });
});