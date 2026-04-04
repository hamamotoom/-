import { authenticateUser, registerStudent, isUsernameTaken, setCurrentUser, initDemoUsers, getCurrentUser, getUserProgress, getStats } from '../app.js';

// ===== دوال التبديل بين النماذج =====
function switchToLogin() {
    const loginForm = document.getElementById('loginForm');
    const createForm = document.getElementById('createAccountForm');
    if (loginForm) loginForm.classList.add('active');
    if (createForm) createForm.classList.remove('active');

    // إعادة تعيين حقول إنشاء الحساب
    const createFormElement = document.getElementById('createAccountFormElement');
    if (createFormElement) createFormElement.reset();
    hideAllErrors();
}

function switchToRegister() {
    const loginForm = document.getElementById('loginForm');
    const createForm = document.getElementById('createAccountForm');
    if (loginForm) loginForm.classList.remove('active');
    if (createForm) createForm.classList.add('active');

    // إعادة تعيين حقول تسجيل الدخول
    const loginFormElement = document.getElementById('loginFormElement');
    if (loginFormElement) loginFormElement.reset();
    hideAllErrors();
}

// إظهار/إخفاء حقول الطالب والأدمن حسب الراديو
function toggleUserFields() {
    const studentRadio = document.getElementById('studentRadio');
    if (!studentRadio) return;

    const isStudent = studentRadio.checked;
    const studentFields = document.getElementById('studentFields');
    const adminFields = document.getElementById('adminFields');
    const formTitle = document.getElementById('formTitle');

    if (studentFields && adminFields) {
        if (isStudent) {
            studentFields.classList.add('active');
            adminFields.classList.remove('active');
        } else {
            studentFields.classList.remove('active');
            adminFields.classList.add('active');
        }
    }

    if (formTitle) {
        formTitle.textContent = isStudent ? 'تسجيل دخول الطالب' : 'تسجيل دخول الأدمن';
    }
    hideAllErrors();
}

// ===== دوال التحقق وعرض الأخطاء =====
function hideAllErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
}

function showError(id, message) {
    const errorEl = document.getElementById(id);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
}

// دالة مساعدة لإظهار رسائل (يمكن استبدالها بـ Toast لاحقاً)
function showNotification(message, isSuccess = true) {
    alert(message); // حالياً نستخدم alert
}

function initializeCurrentUserStorage() {
    getUserProgress();
    getStats();
}

// ===== معالج تسجيل الدخول =====
function handleLogin(event) {
    event.preventDefault(); // منع إعادة تحميل الصفحة
    console.log('محاولة تسجيل الدخول...');

    try {
        hideAllErrors();

        const studentRadio = document.getElementById('studentRadio');
        if (!studentRadio) {
            console.error('عنصر studentRadio غير موجود');
            return;
        }

        const isStudent = studentRadio.checked;
        let username, password, ministerialNumber = '';

        if (isStudent) {
            const usernameField = document.getElementById('studentUsername');
            const passwordField = document.getElementById('studentPassword');
            if (!usernameField || !passwordField) {
                console.error('حقول الطالب غير موجودة');
                return;
            }
            username = usernameField.value.trim();
            password = passwordField.value;
        } else {
            const usernameField = document.getElementById('adminUsername');
            const ministerialField = document.getElementById('adminMinisterialNumber');
            const passwordField = document.getElementById('adminPassword');
            if (!usernameField || !ministerialField || !passwordField) {
                console.error('حقول الأدمن غير موجودة');
                return;
            }
            username = usernameField.value.trim();
            ministerialNumber = ministerialField.value.trim();
            password = passwordField.value;
        }

        // التحقق من الحقول المطلوبة
        if (!username) {
            showError(isStudent ? 'studentUsernameError' : 'adminUsernameError', 'يرجى إدخال اسم المستخدم');
            return;
        }
        if (!password) {
            showError(isStudent ? 'studentPasswordError' : 'adminPasswordError', 'يرجى إدخال كلمة السر');
            return;
        }
        if (!isStudent && !ministerialNumber) {
            showError('adminMinisterialNumberError', 'يرجى إدخال الرقم الوزاري');
            return;
        }
        if (password.length < 8) {
            showError(isStudent ? 'studentPasswordError' : 'adminPasswordError', 'كلمة السر يجب أن تكون 8 خانات على الأقل');
            return;
        }
        if (!isStudent && ministerialNumber.length !== 8) {
            showError('adminMinisterialNumberError', 'الرقم الوزاري يجب أن يكون 8 خانات');
            return;
        }

        const authResult = authenticateUser({
            username,
            password,
            role: isStudent ? 'student' : 'admin',
            ministerialNumber
        });

        if (!authResult.success) {
            showNotification(authResult.message, false);
            return;
        }

        // حفظ المستخدم الحالي وإعداد بياناته الشخصية
        setCurrentUser(authResult.user);
        initializeCurrentUserStorage();
        console.log('تم تسجيل الدخول بنجاح، جاري التوجيه...');

        // محاولة التوجيه - تأكد من صحة المسار
        window.location.href = '../home/home.html'; // عدل المسار حسب هيكل مجلداتك
    } catch (error) {
        console.error('حدث خطأ في handleLogin:', error);
        alert('حدث خطأ غير متوقع. يرجى التحقق من وحدة التحكم.');
    }
}

// ===== معالج إنشاء حساب جديد =====
function handleRegister(event) {
    event.preventDefault();
    console.log('محاولة إنشاء حساب...');

    try {
        hideAllErrors();

        const gradeField = document.getElementById('studentGrade');
        const usernameField = document.getElementById('newStudentUsername');
        const passwordField = document.getElementById('newStudentPassword');
        const confirmField = document.getElementById('confirmPassword');

        if (!gradeField || !usernameField || !passwordField || !confirmField) {
            console.error('بعض حقول إنشاء الحساب غير موجودة');
            return;
        }

        const grade = gradeField.value;
        const username = usernameField.value.trim();
        const password = passwordField.value;
        const confirm = confirmField.value;

        // التحقق من الصف
        if (!grade) {
            showError('studentGradeError', 'يرجى اختيار الصف الدراسي');
            return;
        }

        // التحقق من اسم المستخدم
        if (!username) {
            showError('newStudentUsernameError', 'يرجى إدخال اسم مستخدم');
            return;
        }
        if (isUsernameTaken(username)) {
            showError('newStudentUsernameError', 'اسم المستخدم موجود بالفعل');
            return;
        }

        // التحقق من كلمة السر
        if (password.length < 8 || password.length > 12) {
            showError('newStudentPasswordError', 'كلمة السر يجب أن تكون بين 8 و 12 خانة');
            return;
        }

        // التحقق من تطابق كلمة السر
        if (password !== confirm) {
            showError('confirmPasswordError', 'كلمة السر غير متطابقة');
            return;
        }

        // إضافة المستخدم الجديد
        const registerResult = registerStudent({ username, password, grade });
        if (!registerResult.success) {
            showNotification(registerResult.message, false);
            return;
        }

        // تسجيل الدخول للمستخدم الجديد تلقائياً وإعداد تقدم جديد
        const newUser = registerResult.user;
        setCurrentUser(newUser);
        initializeCurrentUserStorage();
        window.location.href = '../home/home.html';
        return;
    } catch (error) {
        console.error('حدث خطأ في handleRegister:', error);
        alert('حدث خطأ غير متوقع أثناء إنشاء الحساب.');
    }
}

// ===== التهيئة عند تحميل الصفحة =====
function initApp() {
    console.log('جاري تهيئة صفحة تسجيل الدخول...');
    initDemoUsers();

    if (getCurrentUser()) {
        window.location.href = '../home/home.html';
        return;
    }

    // الحصول على العناصر
    const studentRadio = document.getElementById('studentRadio');
    const adminRadio = document.getElementById('adminRadio');
    const showCreateAccount = document.getElementById('showCreateAccount');
    const showLoginForm = document.getElementById('showLoginForm');
    const loginForm = document.getElementById('loginFormElement');
    const registerForm = document.getElementById('createAccountFormElement');

    // التحقق من وجود العناصر الأساسية
    if (!loginForm) {
        console.error('عنصر loginFormElement غير موجود!');
        return;
    }
    if (!registerForm) {
        console.error('عنصر createAccountFormElement غير موجود!');
        return;
    }

    // إضافة مستمعي الأحداث
    if (studentRadio) studentRadio.addEventListener('change', toggleUserFields);
    if (adminRadio) adminRadio.addEventListener('change', toggleUserFields);
    if (showCreateAccount) showCreateAccount.addEventListener('click', switchToRegister);
    if (showLoginForm) showLoginForm.addEventListener('click', switchToLogin);

    // ربط أحداث تقديم النماذج
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);

    // تعيين الحالة الأولية
    toggleUserFields();
    hideAllErrors();

    console.log('تمت التهيئة بنجاح.');
}

// تشغيل التهيئة بعد تحميل الصفحة بالكامل
window.addEventListener('DOMContentLoaded', initApp);