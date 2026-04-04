import { STATS_KEY, ALL_CATEGORIES, clearUserProgress, getStats, saveStats, requireLogin } from '../app.js';

let statsStore = loadStatsFromStorage();

function loadStatsFromStorage() {
    return getStats();
}

function saveStatsToStorage() {
    saveStats(statsStore);
}

function renderStats() {
    const totalCorrect = statsStore.totalCorrect || 0;
    const totalWrong = statsStore.totalWrong || 0;
    const total = totalCorrect + totalWrong || 1;
    const percent = Math.round((totalCorrect / total) * 100);
    const points = statsStore.points || 0;

    // تحديث البطاقة العامة
    const grid = document.querySelector('.general-stats-grid');
    if (grid) {
        const values = grid.querySelectorAll('.general-stat-value');
        if (values.length >= 4) {
            values[0].textContent = totalCorrect;
            values[1].textContent = totalWrong;
            values[2].textContent = percent + '%';
            values[3].textContent = points;
        }
    }

    // عرض تفاصيل التصنيفات
    const container = document.getElementById('grammar-details-content');
    if (!container) return;
    container.innerHTML = '';

    // استخراج جميع التصنيفات من البيانات المخزنة
    const categories = Object.keys(statsStore.byCategory);
    if (categories.length === 0) {
        container.innerHTML = '<div class="no-data">لا توجد بيانات إحصائية بعد</div>';
        return;
    }

    // ترتيب التصنيفات حسب الاسم (اختياري)
    categories.sort();

    for (const cat of categories) {
        const data = statsStore.byCategory[cat];
        const catTotal = (data.correct || 0) + (data.wrong || 0) || 1;
        const catPercent = Math.round(((data.correct || 0) / catTotal) * 100);

        const item = document.createElement('div');
        item.className = 'grammar-item';
        item.innerHTML = `
            <div class="grammar-title">${cat}</div>
            <div class="grammar-stats">
                <div class="grammar-stat">
                    <span class="grammar-stat-label">صحيحة:</span>
                    <span class="grammar-stat-value correct">${catPercent}%</span>
                </div>
                <div class="grammar-stat">
                    <span class="grammar-stat-label">خاطئة:</span>
                    <span class="grammar-stat-value wrong">${100 - catPercent}%</span>
                </div>
                <div class="grammar-stat">
                    <span class="grammar-stat-label">النقاط:</span>
                    <span class="grammar-stat-value points">${data.points || 0}</span>
                </div>
            </div>
        `;
        container.appendChild(item);
    }
}

function toggleGrammarDetails() {
    const grammarContent = document.getElementById('grammar-details-content');
    const collapseIcon = document.getElementById('grammar-collapse-icon');

    if (grammarContent.classList.contains('expanded')) {
        grammarContent.classList.remove('expanded');
        collapseIcon.classList.remove('rotated');
    } else {
        grammarContent.classList.add('expanded');
        collapseIcon.classList.add('rotated');
    }
}

function resetAllStats() {
    if (confirm('هل أنت متأكد من تفريغ جميع الإحصاءات؟')) {
        statsStore = {
            totalCorrect: 0,
            totalWrong: 0,
            points: 0,
            byCategory: JSON.parse(JSON.stringify(ALL_CATEGORIES))
        };
        saveStatsToStorage();
        renderStats();
        showMessage('✅ تم تفريغ جميع الإحصاءات بنجاح!');
    }
}

function resetUserProgress() {
    if (confirm('هل تريد إعادة تعيين تقدم المستخدم؟')) {
        clearUserProgress();
        showMessage('✅ تم إعادة تعيين تقدم المستخدم بنجاح.');
    }
}

function showMessage(message) {
    let msgContainer = document.getElementById('message-container');
    if (!msgContainer) {
        msgContainer = document.createElement('div');
        msgContainer.id = 'message-container';
        msgContainer.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            background: #22C55E;
            color: white;
            padding: 16px;
            border-radius: 8px;
            border: 2px solid #16A34A;
            box-shadow: 0 10px 30px rgba(34, 197, 94, 0.3);
            font-size: 1rem;
            text-align: right;
            z-index: 9999;
            direction: rtl;
            font-weight: 500;
        `;
        document.body.appendChild(msgContainer);
    }
    msgContainer.textContent = message;
    msgContainer.style.display = 'block';
    setTimeout(() => { msgContainer.style.display = 'none'; }, 3000);
}

// إضافة مستمع لأحداث التخزين لتحديث الإحصائيات في الوقت الفعلي (اختياري)
window.addEventListener('storage', function(event) {
    if (event.key && event.key.startsWith(STATS_KEY)) {
        statsStore = loadStatsFromStorage();
        renderStats();
        showMessage('📊 تم تحديث الإحصائيات تلقائياً');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    if (!requireLogin()) return;
    statsStore = loadStatsFromStorage();
    renderStats();
});

// ربط الدوال بالنافذة لاستخدامها من onclick
window.toggleGrammarDetails = toggleGrammarDetails;
window.resetAllStats = resetAllStats;
window.resetUserProgress = resetUserProgress;
window.showMessage = showMessage;