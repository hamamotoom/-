// home.js - واجهة عرض تعتمد بالكامل على app.js

import {
    getUnitsCount,
    getUnitName,
    getUnitLessons,
    getLesson,
    submitLessonAnswers,
    saveEducationPath,
    getSavedEducationPath,
    startEducationPath,
    getExamsByUnit,
    getCurrentUser,
    requireLogin
} from '../app.js';

let currentUnit = null;
let currentLesson = null;

function updateUserAvatar() {
    const user = getCurrentUser();
    const avatar = document.querySelector('.user-avatar');
    const gradeLabel = document.getElementById('userGrade');
    if (avatar && user && user.username) {
        avatar.textContent = user.username.charAt(0).toUpperCase();
    }
    if (gradeLabel && user && user.grade) {
        gradeLabel.textContent = `الصف ${user.grade}`;
    }
}

// عرض المسار التعليمي
function displayActivePath() {
    const savedPath = getSavedEducationPath();
    const newPathOptions = document.getElementById('new-path-options');
    const activePathInfo = document.getElementById('active-path-info');
    const primaryBtn = document.querySelector('.btn-primary');

    updateUserAvatar();

    if (savedPath) {
        document.getElementById('current-unit-name').textContent = savedPath.unitName;
        if (savedPath.isNew) {
            newPathOptions.style.display = 'block';
            activePathInfo.style.display = 'none';
            if (primaryBtn) primaryBtn.style.display = 'none';
        } else {
            newPathOptions.style.display = 'none';
            activePathInfo.style.display = 'block';
            if (primaryBtn) primaryBtn.style.display = 'none';
        }
    } else {
        newPathOptions.style.display = 'none';
        activePathInfo.style.display = 'none';
        if (primaryBtn) primaryBtn.style.display = 'flex';
    }
}

// متابعة المسار المحفوظ
export function continueEducationPath() {
    const savedPath = getSavedEducationPath();
    if (!savedPath) return openUnitSelector();
    startEducationPath();
    const unitLessons = getUnitLessons(savedPath.unitId);
    const currentLessonObj = unitLessons.find(l => l.status === 'current') || unitLessons.find(l => l.status !== 'completed');
    if (currentLessonObj) {
        viewLesson(savedPath.unitId, currentLessonObj.id);
    } else {
        openLessonsList(savedPath.unitId);
    }
}

// فتح نافذة اختيار الوحدة
export function openUnitSelector() {
    const unitModal = document.getElementById('unit-modal');
    const unitsList = unitModal.querySelector('.units-list');
    const unitsCountElement = document.getElementById('units-count');
    unitsList.innerHTML = '';
    const totalUnits = getUnitsCount();
    unitsCountElement.textContent = totalUnits;

    for (let unitId = 1; unitId <= totalUnits; unitId++) {
        const unitTitle = getUnitName(unitId);
        const lessons = getUnitLessons(unitId);
        const completedCount = lessons.filter(l => l.status === 'completed').length;
        const unitItem = document.createElement('div');
        unitItem.className = 'unit-item';
        unitItem.innerHTML = `
            <div class="unit-item-content">
                <h4>🎓 ${unitTitle}</h4>
                <p class="unit-stats">${lessons.length} حصص | ✅ ${completedCount} مكتملة</p>
                <p class="unit-description">ابدأ تعلمك الآن</p>
            </div>
        `;
        unitItem.addEventListener('click', () => {
            closeUnitModal();
            saveEducationPath(unitId);
            openLessonsList(unitId);
        });
        unitsList.appendChild(unitItem);
    }
    unitModal.classList.add('active');
}

export function closeUnitModal() {
    document.getElementById('unit-modal').classList.remove('active');
}

// فتح قائمة الحصص لوحدة محددة
export function openLessonsList(unitId) {
    currentUnit = parseInt(unitId);
    const lessonsGrid = document.getElementById('lessons-grid');
    document.getElementById('lessons-unit-name').textContent = getUnitName(unitId);
    const lessons = getUnitLessons(unitId);
    document.getElementById('lessons-count').textContent = lessons.length;
    lessonsGrid.innerHTML = '';

    if (lessons.length === 0) {
        lessonsGrid.innerHTML = `<div class="no-lessons-message">لا توجد حصص</div>`;
        switchScreen('lessons-list-screen');
        return;
    }

    const availableLessons = lessons.filter(l => l.status !== 'locked');
    if (availableLessons.length === 0) {
        lessonsGrid.innerHTML = `<div class="no-lessons-message">جميع الحصص مقفلة</div>`;
        switchScreen('lessons-list-screen');
        return;
    }

    availableLessons.forEach(lesson => {
        const lessonCard = document.createElement('div');
        lessonCard.className = 'lesson-card';
        let statusText = '';
        if (lesson.status === 'completed') statusText = '✅ مكتملة';
        else if (lesson.status === 'current') statusText = '📖 حالية';
        lessonCard.innerHTML = `
            <div class="lesson-header">
                <div class="lesson-title"><i class="fas fa-video"></i> ${lesson.title}</div>
                <div class="lesson-status status-${lesson.status}">${statusText}</div>
            </div>
            <div class="lesson-meta"><span><i class="fab fa-youtube"></i> يوتيوب</span></div>
        `;
        lessonCard.addEventListener('click', () => viewLesson(unitId, lesson.id));
        lessonsGrid.appendChild(lessonCard);
    });
    switchScreen('lessons-list-screen');
}

// عرض الحصة مع الفيديو والأسئلة
export function viewLesson(unitId, lessonId) {
    const lesson = getLesson(unitId, lessonId);
    if (!lesson) {
        console.error('❌ الحصة غير موجودة');
        return;
    }
    currentUnit = unitId;
    currentLesson = lessonId;

    document.getElementById('lesson-title-header').textContent = lesson.title;
    document.getElementById('lesson-unit-header').textContent = getUnitName(unitId);

    const iframe = document.getElementById('lesson-iframe');
    if (iframe) iframe.src = lesson.videoUrl;

    const questionsContainer = document.getElementById('lesson-questions');
    questionsContainer.innerHTML = '';
    lesson.questions.forEach((q, idx) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        let optionsHTML = '';
        q.options.forEach((opt, optIdx) => {
            optionsHTML += `
                <label class="option-label">
                    <input type="radio" name="lesson-${unitId}-${lessonId}-question-${idx}" value="${optIdx}">
                    <span>${opt}</span>
                </label>
            `;
        });
        questionCard.innerHTML = `
            <div class="question-title">${idx + 1}. ${q.text}</div>
            <div class="question-options">${optionsHTML}</div>
        `;
        questionsContainer.appendChild(questionCard);
    });

    document.getElementById('lesson-result').style.display = 'none';
    document.getElementById('lesson-questions').style.display = 'block';
    document.querySelector('.lesson-actions').style.display = 'block';
    switchScreen('lesson-view-screen');
}

// تسليم الحصة واستدعاء app.js للتصحيح
export function submitLesson() {
    const questions = document.querySelectorAll('#lesson-questions .question-card');
    const lesson = getLesson(currentUnit, currentLesson);
    if (!lesson) return;

    let allAnswered = true;
    const userAnswers = [];
    questions.forEach((card, idx) => {
        const selected = card.querySelector('input[type="radio"]:checked');
        if (!selected) {
            allAnswered = false;
            card.style.borderColor = '#FFA500';
        } else {
            card.style.borderColor = '';
            userAnswers.push(parseInt(selected.value));
        }
    });
    if (!allAnswered) {
        showErrorMessage('⚠️ يجب الإجابة على جميع الأسئلة قبل التسليم!');
        return;
    }

    // استدعاء دالة التصحيح من app.js
    const result = submitLessonAnswers(currentUnit, currentLesson, userAnswers);
    if (result.error) {
        showErrorMessage(result.error);
        return;
    }

    document.getElementById('lesson-questions').style.display = 'none';
    document.querySelector('.lesson-actions').style.display = 'none';

    const lessons = getUnitLessons(currentUnit);
    const currentIndex = lessons.findIndex(l => l.id === currentLesson);
    const hasNextLesson = currentIndex < lessons.length - 1;

    displayLessonSummary(result.correct, result.total, result.results, hasNextLesson);
}

function displayLessonSummary(correct, total, results, hasNextLesson) {
    const percentage = total ? (correct / total) * 100 : 0;
    const lessonResult = document.getElementById('lesson-result');
    lessonResult.innerHTML = `
        <div class="exam-summary">
            <div class="summary-header">
                <h4><i class="fas fa-list"></i> ملخص الحصة</h4>
            </div>
            <div class="summary-stats">
                <div class="summary-stat"><span class="stat-label">صحيح:</span><span class="stat-value correct-value">${correct}</span></div>
                <div class="summary-stat"><span class="stat-label">خاطئ:</span><span class="stat-value wrong-value">${total - correct}</span></div>
                <div class="summary-stat"><span class="stat-label">النسبة:</span><span class="stat-value percent-value">${percentage.toFixed(0)}%</span></div>
                <div class="summary-stat"><span class="stat-label">نقاط:</span><span class="stat-value points-value">${correct - (total - correct)}</span></div>
            </div>
            <div class="exam-summary-list">
                ${results.map(r => `<div class="exam-summary-item ${r.isCorrect ? 'correct-item' : 'wrong-item'}">${r.isCorrect ? `السؤال ${r.idx +1}: صح` : `السؤال ${r.idx +1}: الإجابة الصحيحة: ${r.correctAnswer}`}</div>`).join('')}
            </div>
            <div class="lesson-summary-actions">
                <button class="btn btn-secondary" onclick="goBackToLessonsList()"><i class="fas fa-list"></i> قائمة الحصص</button>
                ${hasNextLesson ? '<button class="btn btn-primary" onclick="goToNextLesson()"><i class="fas fa-arrow-left"></i> الذهاب للحصة التالية</button>' : '<button class="btn btn-primary" onclick="goBackToPath()"><i class="fas fa-home"></i> العودة للمسار</button>'}
            </div>
        </div>
    `;
    lessonResult.style.display = 'block';
}

export function goToNextLesson() {
    const lessons = getUnitLessons(currentUnit);
    const currentIndex = lessons.findIndex(l => l.id === currentLesson);
    if (currentIndex < lessons.length - 1) {
        viewLesson(currentUnit, lessons[currentIndex + 1].id);
    }
}

export function goBackToLessonsList() {
    resetLessonView();
    if (currentUnit !== null) openLessonsList(currentUnit);
    else goBackToPath();
}

export function goBackToPath() {
    resetLessonView();
    switchScreen('path-screen');
    displayActivePath();
}

function resetLessonView() {
    const iframe = document.getElementById('lesson-iframe');
    if (iframe) iframe.src = 'about:blank';
    document.getElementById('lesson-title-header').textContent = 'الحصة';
    document.getElementById('lesson-unit-header').textContent = 'الوحدة';
    document.getElementById('lesson-result').style.display = 'none';
    const questionsDiv = document.getElementById('lesson-questions');
    if (questionsDiv) {
        questionsDiv.style.display = 'block';
        questionsDiv.innerHTML = '';
    }
    const actionsDiv = document.querySelector('.lesson-actions');
    if (actionsDiv) actionsDiv.style.display = 'block';
}

function switchScreen(screenId) {
    if (screenId !== 'lesson-view-screen') resetLessonView();
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
    else console.error('❌ شاشة غير موجودة:', screenId);
}

function showErrorMessage(message) {
    let errorContainer = document.getElementById('error-message-container');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'error-message-container';
        errorContainer.style.cssText = `
            position: fixed; top: 20px; left: 20px; right: 20px;
            background: #FEE2E2; color: #991B1B; padding: 16px;
            border-radius: 8px; border: 2px solid #DC2626;
            box-shadow: 0 10px 30px rgba(220,38,38,0.3);
            font-size: 1rem; text-align: right; z-index: 9999;
            direction: rtl; font-weight: 500;
        `;
        document.body.appendChild(errorContainer);
    }
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    setTimeout(() => errorContainer.style.display = 'none', 5000);
}

// ربط الدوال بالـ window لاستخدامها من onclick
window.openUnitSelector = openUnitSelector;
window.closeUnitModal = closeUnitModal;
window.continueEducationPath = continueEducationPath;
window.goBackToPath = goBackToPath;
window.openLessonsList = openLessonsList;
window.viewLesson = viewLesson;
window.submitLesson = submitLesson;
window.goToNextLesson = goToNextLesson;
window.goBackToLessonsList = goBackToLessonsList;

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    if (!requireLogin()) return;
    displayActivePath();
});