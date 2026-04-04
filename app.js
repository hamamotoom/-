// app.js - ملف البيانات والمسارات المركزي للتطبيق
// ======================= المصدر الرئيسي للبيانات + منطق التصحيح =======================

// =======================
// بيانات الحصص (كاملة + التجريبية)
// =======================
import { GRADE_LESSONS_DATA, GRADE_EXAMS_DATA, UNIT_NAMES } from './Data_bez.js';

const gradeLessonsCache = {};
const gradeExamsCache = {};

function normalizeGrade(grade) {
    return grade ? String(grade).trim() : '4';
}

function buildGradeLessonsData(grade) {
    const normalizedGrade = normalizeGrade(grade);
    const baseLessons = GRADE_LESSONS_DATA[normalizedGrade] || GRADE_LESSONS_DATA['4'] || {};
    return JSON.parse(JSON.stringify(baseLessons));
}

function buildGradeExamsData(grade) {
    const normalizedGrade = normalizeGrade(grade);
    const baseExams = GRADE_EXAMS_DATA[normalizedGrade] || GRADE_EXAMS_DATA['4'] || [];
    return JSON.parse(JSON.stringify(baseExams));
}

export function getUserGrade() {
    const user = getCurrentUser();
    return user && user.grade ? normalizeGrade(user.grade) : '4';
}

export function getLessonsDataForGrade(grade) {
    const normalizedGrade = normalizeGrade(grade || getUserGrade());
    if (!gradeLessonsCache[normalizedGrade]) {
        gradeLessonsCache[normalizedGrade] = buildGradeLessonsData(normalizedGrade);
    }
    return gradeLessonsCache[normalizedGrade];
}

export function getExamsDataForGrade(grade) {
    const normalizedGrade = normalizeGrade(grade || getUserGrade());
    if (!gradeExamsCache[normalizedGrade]) {
        gradeExamsCache[normalizedGrade] = buildGradeExamsData(normalizedGrade);
    }
    return gradeExamsCache[normalizedGrade];
}

// =======================
// دوال مساعدة عامة (الموجودة سابقاً)
// =======================

function getUserStorageKey(baseKey, username = null) {
    const user = username ? { username } : getCurrentUser();
    return user && user.username
        ? `${baseKey}_${user.username}`
        : `${baseKey}_guest`;
}

function getUserProgressKey(username = null) {
    return getUserStorageKey(PROGRESS_KEY, username);
}

function getUserStatsKey(username = null) {
    return getUserStorageKey(STATS_KEY, username);
}

function getUserEducationPathKey(username = null) {
    return getUserStorageKey(EDUCATION_PATH_KEY, username);
}

// حفظ المسار التعليمي
export function saveEducationPath(unitId) {
    const pathData = {
        unitId: parseInt(unitId, 10),
        unitName: getUnitName(unitId),
        savedDate: new Date().toISOString(),
        completedLessons: [],
        isNew: true
    };
    localStorage.setItem(getUserEducationPathKey(), JSON.stringify(pathData));
}

// الحصول على المسار التعليمي المحفوظ
export function getSavedEducationPath() {
    const saved = localStorage.getItem(getUserEducationPathKey());
    return safeParseJSON(saved, null);
}

// بدء المسار التعليمي
export function startEducationPath() {
    const key = getUserEducationPathKey();
    const savedPath = getSavedEducationPath();
    if (savedPath) {
        savedPath.isNew = false;
        localStorage.setItem(key, JSON.stringify(savedPath));
    }
}

// دالة تقييم الإجابات لحصة (موجودة مسبقاً)
export function evaluateLessonAnswers(lesson, selectedAnswers) {
    if (!lesson || !Array.isArray(lesson.questions)) {
        return { correct: 0, total: 0, percentage: 0, results: [] };
    }

    const results = [];
    let correct = 0;

    lesson.questions.forEach((question, idx) => {
        const selected = selectedAnswers[idx];
        const isCorrect = selected !== undefined && parseInt(selected, 10) === question.correct;
        if (isCorrect) correct++;
        results.push({ idx, isCorrect, correctAnswer: question.options[question.correct] });
    });

    const total = lesson.questions.length;
    const percentage = total > 0 ? (correct / total) * 100 : 0;

    return { correct, total, percentage, results };
}

// دالة تقييم الإجابات لامتحان (موجودة مسبقاً)
export function evaluateExamAnswers(exam, selectedAnswers) {
    if (!exam || !Array.isArray(exam.questions)) {
        return { correct: 0, total: 0, percentage: 0, results: [] };
    }

    const results = [];
    let correct = 0;

    exam.questions.forEach((question, idx) => {
        const selected = selectedAnswers[idx];
        const isCorrect = selected !== undefined && parseInt(selected, 10) === question.correct;
        if (isCorrect) correct++;
        results.push({ idx, isCorrect, correctAnswer: question.options[question.correct] });
    });

    const total = exam.questions.length;
    const percentage = total > 0 ? (correct / total) * 100 : 0;

    return { correct, total, percentage, results };
}

// =======================
// دوال جديدة للتكامل مع lessons.js
// =======================

/**
 * استرجاع بيانات حصة معينة باستخدام معرف الوحدة ومعرف الحصة
 * @param {number|string} unitId 
 * @param {number} lessonId 
 * @returns {object|null}
 */
export function getLesson(unitId, lessonId) {
    const lessons = getUnitLessons(unitId);
    return lessons.find(l => l.id === lessonId) || null;
}

/**
 * تقييم إجابات المستخدم لحصة معينة باستخدام المعرفات
 * @param {number|string} unitId 
 * @param {number} lessonId 
 * @param {Array<number>} userAnswers
 * @returns {object}
 */
export function evaluateLessonAnswersFromIds(unitId, lessonId, userAnswers) {
    const lesson = getLesson(unitId, lessonId);
    if (!lesson) {
        return { correct: 0, total: 0, percentage: 0, results: [] };
    }
    return evaluateLessonAnswers(lesson, userAnswers);
}

// =======================
// دالة التصحيح المتوقعة من lessons.js
// =======================
export function checkLessonAnswers(questions, userAnswers) {
    if (!Array.isArray(questions) || !Array.isArray(userAnswers)) {
        return {
            correctCount: 0,
            totalQuestions: 0,
            resultsArray: [],
            sessionPoints: 0
        };
    }

    const resultsArray = [];
    let correctCount = 0;

    questions.forEach((question, idx) => {
        const selected = userAnswers[idx];
        const isCorrect = (selected !== undefined && parseInt(selected, 10) === question.correct);
        if (isCorrect) correctCount++;
        resultsArray.push({
            idx,
            isCorrect,
            correctAnswer: question.options[question.correct]
        });
    });

    const totalQuestions = questions.length;
    const wrongCount = totalQuestions - correctCount;
    const sessionPoints = correctCount - wrongCount; // النقاط = الصحيح – الخطأ

    return {
        correctCount,
        totalQuestions,
        resultsArray,
        sessionPoints
    };
}

// =======================
// مفتاح وتكوين الإحصائيات
// =======================
export const STATS_KEY = 'manaraStats_v1';
export const PROGRESS_KEY = 'manaraLessonProgress';
export const EDUCATION_PATH_KEY = 'manaraEducationPath_v1';
export const ALL_CATEGORIES = {
    'المفردات': { correct: 0, wrong: 0, points: 0 },
    'الحروف': { correct: 0, wrong: 0, points: 0 },
    'الأرقام': { correct: 0, wrong: 0, points: 0 },
    'المحادثة': { correct: 0, wrong: 0, points: 0 },
    'أسئلة واستفهام': { correct: 0, wrong: 0, points: 0 },
    'قواعد': { correct: 0, wrong: 0, points: 0 },
    'المضارع البسيط': { correct: 0, wrong: 0, points: 0 },
    'المضارع المستمر': { correct: 0, wrong: 0, points: 0 },
    'الماضي البسيط': { correct: 0, wrong: 0, points: 0 },
    'المستقبل': { correct: 0, wrong: 0, points: 0 }
};

// =======================
// دوال إدارة الحساب والمستخدم الحالي
// =======================
export const USERS_KEY = 'manaraUsers';
export const CURRENT_USER_KEY = 'manaraCurrentUser';

function safeParseJSON(raw, fallback) {
    try {
        return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
        return fallback;
    }
}

function getPersistentStorage(key, fallback) {
    const raw = localStorage.getItem(key);
    return safeParseJSON(raw, fallback);
}

function setPersistentStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
}

function cleanupLegacySharedKey(key, value) {
    if (!value || typeof value !== 'object' || Object.keys(value).length === 0) {
        localStorage.removeItem(key);
        return;
    }
    setPersistentStorage(key, value);
}

const PROGRESS_MIGRATION_MARKER = 'manaraProgressMigration_v1';
const STATS_MIGRATION_MARKER = 'manaraStatsMigration_v1';
const EDUCATION_PATH_MIGRATION_MARKER = 'manaraEducationPathMigration_v1';

function looksLikeProgressObject(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    if (value.completed !== undefined && Array.isArray(value.completed)) return true;

    const entries = Object.values(value);
    return entries.length > 0 && entries.every(entry => entry && typeof entry === 'object' && Array.isArray(entry.completed));
}

function looksLikeStatsObject(value) {
    return value && typeof value === 'object' &&
        typeof value.totalCorrect === 'number' &&
        typeof value.totalWrong === 'number' &&
        typeof value.points === 'number';
}

function looksLikeEducationPathObject(value) {
    return value && typeof value === 'object' &&
        value.unitId !== undefined &&
        value.unitName !== undefined;
}

function migrateSharedProgressForUser(username) {
    if (!username) return;
    const userKey = getUserProgressKey(username);
    const existingUserProgress = getPersistentStorage(userKey, null);
    if (existingUserProgress) return;

    const shared = getPersistentStorage(PROGRESS_KEY, null);
    if (!shared || typeof shared !== 'object') return;

    if (shared[username] && typeof shared[username] === 'object') {
        saveAllProgress(shared[username], username);
        delete shared[username];
        cleanupLegacySharedKey(PROGRESS_KEY, shared);
        return;
    }

    if (looksLikeProgressObject(shared)) {
        const marker = getPersistentStorage(PROGRESS_MIGRATION_MARKER, null);
        if (!marker) {
            saveAllProgress(shared, username);
            setPersistentStorage(PROGRESS_MIGRATION_MARKER, { username, migratedAt: new Date().toISOString() });
            localStorage.removeItem(PROGRESS_KEY);
        } else if (marker.username === username) {
            saveAllProgress(shared, username);
            localStorage.removeItem(PROGRESS_KEY);
        }
    }
}

function migrateSharedStatsForUser(username) {
    if (!username) return;
    const userKey = getUserStatsKey(username);
    const existingUserStats = getPersistentStorage(userKey, null);
    if (existingUserStats) return;

    const shared = getPersistentStorage(STATS_KEY, null);
    if (!shared || typeof shared !== 'object') return;

    if (shared[username] && typeof shared[username] === 'object') {
        saveAllStats(shared[username], username);
        delete shared[username];
        cleanupLegacySharedKey(STATS_KEY, shared);
        return;
    }

    if (looksLikeStatsObject(shared)) {
        const marker = getPersistentStorage(STATS_MIGRATION_MARKER, null);
        if (!marker) {
            saveAllStats(shared, username);
            setPersistentStorage(STATS_MIGRATION_MARKER, { username, migratedAt: new Date().toISOString() });
            localStorage.removeItem(STATS_KEY);
        } else if (marker.username === username) {
            saveAllStats(shared, username);
            localStorage.removeItem(STATS_KEY);
        }
    }
}

function migrateSharedEducationPathForUser(username) {
    if (!username) return;
    const userKey = getUserEducationPathKey(username);
    const existingUserPath = getPersistentStorage(userKey, null);
    if (existingUserPath) return;

    const shared = getPersistentStorage(EDUCATION_PATH_KEY, null);
    if (!shared || typeof shared !== 'object') return;

    if (shared[username] && typeof shared[username] === 'object') {
        setPersistentStorage(userKey, shared[username]);
        delete shared[username];
        cleanupLegacySharedKey(EDUCATION_PATH_KEY, shared);
        return;
    }

    if (looksLikeEducationPathObject(shared)) {
        const marker = getPersistentStorage(EDUCATION_PATH_MIGRATION_MARKER, null);
        if (!marker) {
            setPersistentStorage(userKey, shared);
            setPersistentStorage(EDUCATION_PATH_MIGRATION_MARKER, { username, migratedAt: new Date().toISOString() });
            localStorage.removeItem(EDUCATION_PATH_KEY);
        } else if (marker.username === username) {
            setPersistentStorage(userKey, shared);
            localStorage.removeItem(EDUCATION_PATH_KEY);
        }
    }
}

function migrateSharedUserStorage(username) {
    migrateSharedProgressForUser(username);
    migrateSharedStatsForUser(username);
    migrateSharedEducationPathForUser(username);
}

export function getCurrentUser() {
    const raw = sessionStorage.getItem(CURRENT_USER_KEY);
    return safeParseJSON(raw, null);
}

export function setCurrentUser(user) {
    if (!user || !user.username) return;
    const copy = { ...user };
    delete copy.password;
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(copy));
    migrateSharedUserStorage(copy.username);
    return copy;
}

export function clearCurrentUser() {
    sessionStorage.removeItem(CURRENT_USER_KEY);
}

export function requireLogin() {
    if (getCurrentUser()) return true;
    window.location.href = '../register/register.html';
    return false;
}

export function getUsers() {
    return getPersistentStorage(USERS_KEY, []);
}

export function saveUsers(users) {
    setPersistentStorage(USERS_KEY, users);
}

export function isUsernameTaken(username) {
    if (!username) return false;
    return getUsers().some(user => user.username === username);
}

export function initDemoUsers() {
    const users = getUsers();
    const demoUsers = [
        { username: 'student1', password: 'password123', role: 'student', grade: '10' },
        { username: 'admin1', password: 'admin12345', role: 'admin', ministerialNumber: '12345678' }
    ];
    let updated = false;
    demoUsers.forEach(demo => {
        if (!users.some(u => u.username === demo.username)) {
            users.push(demo);
            updated = true;
        }
    });
    if (updated) saveUsers(users);
}

export function registerStudent({ username, password, grade }) {
    if (!username || !password || !grade) {
        return { success: false, message: 'يرجى إدخال جميع بيانات الطالب.' };
    }
    if (isUsernameTaken(username)) {
        return { success: false, message: 'اسم المستخدم موجود بالفعل.' };
    }
    const users = getUsers();
    const newUser = { username, password, role: 'student', grade };
    users.push(newUser);
    saveUsers(users);
    return { success: true, user: newUser };
}

export function authenticateUser({ username, password, role, ministerialNumber }) {
    const users = getUsers();
    const user = users.find(u => u.username === username);
    if (!user) {
        return { success: false, message: 'اسم المستخدم غير موجود.' };
    }
    if (user.password !== password) {
        return { success: false, message: 'كلمة السر غير صحيحة.' };
    }
    if (user.role !== role) {
        return { success: false, message: user.role === 'admin' ? 'هذا الحساب هو حساب مدير.' : 'هذا الحساب غير طالب.' };
    }
    if (role === 'admin' && user.ministerialNumber !== ministerialNumber) {
        return { success: false, message: 'الرقم الوزاري غير صحيح.' };
    }
    return { success: true, user };
}

function createInitialProgress() {
    return {};
}

function getAllProgress(username = null) {
    return getPersistentStorage(getUserProgressKey(username), {});
}

function saveAllProgress(progress, username = null) {
    setPersistentStorage(getUserProgressKey(username), progress);
}

export function getUserProgress() {
    const user = getCurrentUser();
    const progress = getAllProgress(user ? user.username : null);
    if (!progress || Object.keys(progress).length === 0) {
        const initialProgress = createInitialProgress();
        saveAllProgress(initialProgress, user ? user.username : null);
        return initialProgress;
    }
    return progress;
}

export function saveUserProgress(progress) {
    const user = getCurrentUser();
    if (!user) return;
    saveAllProgress(progress, user.username);
}

export function clearUserProgress() {
    const user = getCurrentUser();
    const userKey = getUserProgressKey(user ? user.username : null);
    localStorage.removeItem(userKey);
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(PROGRESS_MIGRATION_MARKER);
}

export function clearAllProgressData() {
    const prefixes = [
        `${PROGRESS_KEY}_`,
        `${STATS_KEY}_`,
        `${EDUCATION_PATH_KEY}_`
    ];

    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (
            key === PROGRESS_KEY ||
            key === STATS_KEY ||
            key === EDUCATION_PATH_KEY ||
            key === PROGRESS_MIGRATION_MARKER ||
            key === STATS_MIGRATION_MARKER ||
            key === EDUCATION_PATH_MIGRATION_MARKER ||
            prefixes.some(prefix => key.startsWith(prefix))
        ) {
            localStorage.removeItem(key);
        }
    }
}

export function updateLessonStatus(unitId, lessonId, newStatus) {
    const progress = getUserProgress();
    if (!progress[unitId]) progress[unitId] = { completed: [] };
    if (newStatus === 'completed') {
        if (!progress[unitId].completed.includes(lessonId)) {
            progress[unitId].completed.push(lessonId);
        }
    }
    saveUserProgress(progress);
}

export function isLessonCompleted(unitId, lessonId) {
    const progress = getUserProgress();
    return progress[unitId] && progress[unitId].completed.includes(lessonId);
}

export function getUnitLessons(unitId) {
    const gradeLessons = getLessonsDataForGrade(getUserGrade());
    const baseLessons = gradeLessons[unitId] || [];
    const progress = getUserProgress();
    const completed = progress[unitId] ? progress[unitId].completed : [];

    const updatedLessons = baseLessons.map(lesson => {
        if (completed.includes(lesson.id)) {
            return { ...lesson, status: 'completed' };
        }
        return { ...lesson, status: 'locked' };
    });

    let currentFound = false;
    const finalLessons = updatedLessons.map(lesson => {
        if (lesson.status === 'completed') return lesson;
        if (!currentFound) {
            currentFound = true;
            return { ...lesson, status: 'current' };
        }
        return { ...lesson, status: 'locked' };
    });

    if (finalLessons.length > 0 && finalLessons.every(l => l.status === 'locked')) {
        finalLessons[0].status = 'current';
    }

    return finalLessons;
}

export function getUnitsCount() {
    return Object.keys(getLessonsDataForGrade(getUserGrade())).length;
}

export function getUnitName(unitId) {
    return UNIT_NAMES[unitId] || `الوحدة ${unitId}`;
}

// =======================
// دوال الإحصائيات للتكامل مع stats.js
// =======================
function createDefaultStats() {
    return {
        totalCorrect: 0,
        totalWrong: 0,
        points: 0,
        byCategory: JSON.parse(JSON.stringify(ALL_CATEGORIES))
    };
}

function getAllStats(username = null) {
    return getPersistentStorage(getUserStatsKey(username), null);
}

function saveAllStats(stats, username = null) {
    setPersistentStorage(getUserStatsKey(username), stats);
}

export function getStats() {
    const user = getCurrentUser();
    const saved = getAllStats(user ? user.username : null);
    if (!saved) {
        const initialStats = createDefaultStats();
        saveAllStats(initialStats, user ? user.username : null);
        return initialStats;
    }
    return saved;
}

export function saveStats(stats) {
    const user = getCurrentUser();
    saveAllStats(stats, user ? user.username : null);
}

export function updateStatsFromResults(resultsArray, questions) {
    const stats = getStats();
    let totalCorrect = stats.totalCorrect;
    let totalWrong = stats.totalWrong;
    let points = stats.points;

    resultsArray.forEach((result, idx) => {
        const question = questions[idx];
        const category = question.category || 'المفردات';
        if (!stats.byCategory[category]) {
            stats.byCategory[category] = { correct: 0, wrong: 0, points: 0 };
        }
        if (result.isCorrect) {
            totalCorrect++;
            stats.byCategory[category].correct++;
            points++;
            stats.byCategory[category].points++;
        } else {
            totalWrong++;
            stats.byCategory[category].wrong++;
            points--;
            stats.byCategory[category].points--;
        }
    });

    stats.totalCorrect = totalCorrect;
    stats.totalWrong = totalWrong;
    stats.points = points;
    saveStats(stats);
}

// =======================
// دالة تسليم الحصة الكاملة (تستخدمها home.js)
// =======================
export function submitLessonAnswers(unitId, lessonId, userAnswers) {
    const lesson = getLesson(unitId, lessonId);
    if (!lesson) {
        return { error: 'الحصة غير موجودة' };
    }
    if (isLessonCompleted(unitId, lessonId)) {
        return { error: 'لقد أكملت هذه الحصة بالفعل' };
    }

    const evaluation = checkLessonAnswers(lesson.questions, userAnswers);
    const { correctCount, totalQuestions, resultsArray, sessionPoints } = evaluation;
    const percentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const passed = percentage >= 70;

    if (passed) {
        updateLessonStatus(unitId, lessonId, 'completed');
    }

    // تحديث الإحصائيات
    updateStatsFromResults(resultsArray, lesson.questions);

    const results = resultsArray.map(r => ({
        idx: r.idx,
        isCorrect: r.isCorrect,
        correctAnswer: r.correctAnswer
    }));

    return {
        correct: correctCount,
        total: totalQuestions,
        results: results,
        percentage: percentage,
        passed: passed,
        sessionPoints: sessionPoints
    };
}

// =======================
// دوال الامتحانات (للتكامل مع exams.js)
// =======================
export function getExamsByUnit(unitId) {
    const exams = getExamsDataForGrade(getUserGrade());
    return exams.filter(exam => String(exam.unitId) === String(unitId));
}

export function getExamById(examId) {
    const exams = getExamsDataForGrade(getUserGrade());
    return exams.find(exam => String(exam.id) === String(examId)) || null;
}