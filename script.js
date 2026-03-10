/* ============================
      DOM SHORTCUT
============================ */
const $ = id => document.getElementById(id);

/* ============================
      FIREBASE INIT
============================ */
const firebaseConfig = {
  apiKey: "AIzaSyCKN9-zpzVMQ0FGt2NePORv_zGWkYTRcbs",
  authDomain: "mydailyflow-70095.firebaseapp.com",
  projectId: "mydailyflow-70095",
  storageBucket: "mydailyflow-70095.firebasestorage.app",
  messagingSenderId: "121880210808",
  appId: "1:121880210808:web:007fb0afd4dad0ac982c8d",
  measurementId: "G-W2Z6H2HDQW"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

/* ============================
      AUTH OBSERVER (LISTEN)
============================ */
auth.onAuthStateChanged(user => {
    const isAuthPage = location.pathname.includes("login") || location.pathname.includes("register");
    
    if (user) {
        console.log("Влязъл потребител:", user.displayName || user.email);
        
        // Показваме името на потребителя, ако има такъв елемент в HTML
        if ($("userName")) $("userName").textContent = user.displayName || user.email;
        
        // Ако сме на логин страница, отиваме в индекса
        if (isAuthPage) {
            location.href = "index.html";
        } else {
            loadTasks(); // Зареждаме задачите само ако сме вътре
        }
    } else {
        console.log("Няма логнат потребител.");
        // Ако не сме логнати и не сме на логин страницата - препращаме към вход
        if (!isAuthPage) {
            location.href = "login.html";
        }
    }
});

/* ============================
      AUTH FORMS & LOGIC
============================ */
function setupAuthForms() {
    const loginBtn = $("loginBtn");
    const registerBtn = $("registerBtn");
    const googleBtn = $("googleLoginBtn");

    if (loginBtn) {
        loginBtn.onclick = () => {
            const email = $("loginEmail")?.value;
            const pass = $("loginPassword")?.value;
            auth.signInWithEmailAndPassword(email, pass).catch(e => alert(e.message));
        };
    }

    if (registerBtn) {
        registerBtn.onclick = () => {
            const email = $("registerEmail")?.value;
            const pass = $("registerPassword")?.value;
            auth.createUserWithEmailAndPassword(email, pass).catch(e => alert(e.message));
        };
    }

    // Унифициран клик за Google бутона
    if (googleBtn) {
        googleBtn.onclick = googleAuth;
    }
}

function googleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(() => console.log("Успешен вход с Google"))
        .catch(e => alert(e.message));
}

// Извикване на формата
setupAuthForms();

/* ============================
      LOGOUT FUNCTIONALITY
============================ */
const logoutBtn = $("logoutBtn");
if (logoutBtn) {
    logoutBtn.onclick = () => {
        auth.signOut().then(() => {
            console.log("Излязохте успешно.");
            location.href = "login.html";
        }).catch(e => alert(e.message));
    };
}

/* ============================
      UI ELEMENTS & TRANSLATIONS
============================ */
const els = {
    taskInput: $("taskInput"),
    category: $("categorySelect"),
    priority: $("prioritySelect"),
    date: $("dateInput"),
    addBtn: $("addTaskBtn"),
    list: $("taskList"),
    search: $("searchInput"),
    theme: $("themeToggle"),
    lang: $("langToggle"),
    tasksTab: $("tasksTab"),
    statsTab: $("statsTab"),
    navTasks: $("navTasks"),
    navStats: $("navStats")
};

const translations = {
    bg: {
        newTask: "Нова задача", myTasks: "Моите задачи", add: "Добави", all: "Всички", today: "Днес", week: "Седмица", done: "Готови", pending: "Неготови", search: "Търси задача...", placeholder: "Въведи задача...", navTasks: "Задачи", navStats: "Статистики",
        stats: { total: "Общо задачи", done: "Готови", today: "За днес", week: "За седмицата", percent: "Процент изпълнение" },
        categories: { work: "Работа", home: "Дом", school: "Училище", personal: "Лични" },
        priorities: { low: "Нисък приоритет", medium: "Среден приоритет", high: "Висок приоритет" },
        auth: { loginTitle: "Вход", registerTitle: "Регистрация", email: "Имейл", password: "Парола", loginBtn: "Вход", registerBtn: "Регистрация", googleLogin: "Вход с Google", noAccount: "Нямаш акаунт?", haveAccount: "Имаш акаунт?", goToRegister: "Регистрация", goToLogin: "Вход" }
    },
    en: {
        newTask: "New Task", myTasks: "My Tasks", add: "Add", all: "All", today: "Today", week: "Week", done: "Done", pending: "Pending", search: "Search task...", placeholder: "Enter a task...", navTasks: "Tasks", navStats: "Statistics",
        stats: { total: "Total tasks", done: "Completed", today: "Today", week: "This week", percent: "Completion rate" },
        categories: { work: "Work", home: "Home", school: "School", personal: "Personal" },
        priorities: { low: "Low priority", medium: "Medium priority", high: "High priority" },
        auth: { loginTitle: "Login", registerTitle: "Register", email: "Email", password: "Password", loginBtn: "Login", registerBtn: "Register", googleLogin: "Login with Google", noAccount: "Don't have an account?", haveAccount: "Already have an account?", goToRegister: "Register", goToLogin: "Login" }
    }
};

let currentLang = "bg";

function updateLanguage() {
    const t = translations[currentLang];
    const set = (id, val) => $(id) && ($(id).textContent = val);

    set("newTaskTitle", t.newTask);
    set("myTasksTitle", t.myTasks);
    if (els.addBtn) els.addBtn.textContent = t.add;
    set("filterAll", t.all);
    set("filterToday", t.today);
    set("filterWeek", t.week);
    set("filterDone", t.done);
    set("filterPending", t.pending);
    if (els.search) els.search.placeholder = t.search;
    if (els.taskInput) els.taskInput.placeholder = t.placeholder;
    set("navTasksLabel", t.navTasks);
    set("navStatsLabel", t.navStats);
    set("statTotalLabel", t.stats.total);
    set("statDoneLabel", t.stats.done);
    set("statTodayLabel", t.stats.today);
    set("statWeekLabel", t.stats.week);
    set("statPercentLabel", t.stats.percent);

    if (els.category) [...els.category.options].forEach(o => o.textContent = t.categories[o.value]);
    if (els.priority) [...els.priority.options].forEach(o => o.textContent = t.priorities[o.value]);

    if (document.body.classList.contains("auth-page")) {
        const isLogin = $("loginBtn") !== null;
        set("authTitle", isLogin ? t.auth.loginTitle : t.auth.registerTitle);
        set("authEmailLabel", t.auth.email);
        set("authPasswordLabel", t.auth.password);
        set("loginBtn", t.auth.loginBtn);
        set("registerBtn", t.auth.registerBtn);
        set("googleLoginBtn", t.auth.googleLogin);
        set("noAccountText", t.auth.noAccount);
        set("haveAccountText", t.auth.haveAccount);
        set("goToRegisterLink", t.auth.goToRegister);
        set("goToLoginLink", t.auth.goToLogin);
    }
    if (els.lang) els.lang.textContent = currentLang === "bg" ? "🇧🇬" : "🇪🇳";
}

els.lang?.addEventListener("click", () => {
    currentLang = currentLang === "bg" ? "en" : "bg";
    updateLanguage();
    renderTasks();
    updateStats();
});

/* ============================
      FIRESTORE TASKS
============================ */
let tasks = [];

function loadTasks() {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    db.collection("users").doc(uid).collection("tasks")
        .orderBy("createdAt")
        .onSnapshot(snap => {
            tasks = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            renderTasks();
            updateStats();
        });
}
function updateTask(id, data) {
    const uid = auth.currentUser.uid;
    db.collection("users").doc(uid).collection("tasks").doc(id).update(data);
}

function removeTask(id) {
    const uid = auth.currentUser.uid;
    if (confirm("Сигурни ли сте, че искате да изтриете тази задача?")) {
        db.collection("users").doc(uid).collection("tasks").doc(id).delete();
    }
}

function addTask(task) {
    const user = auth.currentUser;
    if (!user) {
        alert("Грешка: Не сте влезли в профила си!");
        return;
    }

    db.collection("users").doc(user.uid).collection("tasks")
        .add({ ...task, createdAt: Date.now() })
        .then(() => {
            console.log("Успешно записано в облака!");
            updateStats(); // Обновяваме числата веднага
        })
        .catch(error => {
            console.error("Грешка при запис:", error);
            alert("Проблем с базата данни: " + error.message);
        });
}
// Тези функции „говорят“ с базата данни
function updateTask(id, data) {
    const uid = auth.currentUser.uid;
    db.collection("users").doc(uid).collection("tasks").doc(id).update(data);
}

function removeTask(id) {
    const uid = auth.currentUser.uid;
    if (confirm("Сигурни ли сте, че искате да изтриете тази задача?")) {
        db.collection("users").doc(uid).collection("tasks").doc(id).delete();
    }
}
function renderTasks(filter = "all") {
    if (!els.list) return;
    els.list.innerHTML = "";
    let filtered = [...tasks];
    const today = new Date().toISOString().split("T")[0];

    if (filter === "today") filtered = filtered.filter(t => t.date === today);
    if (filter === "done") filtered = filtered.filter(t => t.done);
    if (filter === "pending") filtered = filtered.filter(t => !t.done);
    if (filter === "week") {
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);
        filtered = filtered.filter(t => {
            const d = new Date(t.date);
            return d >= now && d <= nextWeek;
        });
    }

    const search = els.search?.value.toLowerCase() || "";
    filtered = filtered.filter(t => t.text.toLowerCase().includes(search));

    filtered.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";
        li.draggable = true;
        li.dataset.id = task.id;
        if (task.done) li.classList.add("done");
        const icon = { low: "🌱", medium: "⚡", high: "🔥" }[task.priority];
   li.innerHTML = `
    <span>
        <strong>${icon} ${task.text}</strong><br>
        <small>${translations[currentLang].categories[task.category]} • ${translations[currentLang].priorities[task.priority]} • ${task.date}</small>
    </span>
    <div class="task-actions">
        <button class="btn-toggle" data-id="${task.id}">✔</button>
        <button class="btn-delete" data-id="${task.id}">✖</button>
    </div>`;
els.list.appendChild(li);
    });
    enableDrag();
}

function toggleTask(id) {
    const t = tasks.find(x => x.id === id);
    updateTask(id, { done: !t.done });
}

function deleteTask(id) { removeTask(id); }

function enableDrag() {
    const items = document.querySelectorAll(".task-item");
    let drag = null;
    items.forEach(i => {
        i.addEventListener("dragstart", () => { drag = i; i.style.opacity = "0.5"; });
        i.addEventListener("dragend", () => { drag.style.opacity = "1"; drag = null; });
        i.addEventListener("dragover", e => {
            e.preventDefault();
            const box = i.getBoundingClientRect();
            const mid = box.y + box.height / 2;
            if (e.clientY > mid) i.after(drag); else i.before(drag);
        });
    });
}

function updateStats() {
    // Вземаме елементите по ID-тата, които ти си написала в твоя HTML
    const totalEl = $("statTotal");
    const doneEl = $("statDone");
    const todayEl = $("statToday");
    const weekEl = $("statWeek"); // Това е за твоята оранжева карта
    const percentEl = $("statPercent");

    if (!totalEl) return;

    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    
    // Логика за "Днес"
    const todayStr = new Date().toISOString().split("T")[0];
    const todayCount = tasks.filter(t => t.date === todayStr).length;

    // Логика за "Седмицата" (следващите 7 дни)
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    
    const weekCount = tasks.filter(t => {
        const taskDate = new Date(t.date);
        return taskDate >= now && taskDate <= nextWeek;
    }).length;

    const percent = total ? Math.round((done / total) * 100) : 0;

    // Записваме числата в твоя HTML
    totalEl.textContent = total;
    if (doneEl) doneEl.textContent = done;
    if (todayEl) todayEl.textContent = todayCount;
    if (weekEl) weekEl.textContent = weekCount;
    if (percentEl) percentEl.textContent = percent + "%";
}
/* ============================
      LISTENERS (СЛУШАТЕЛИ)
============================ */

// 1. Добавяне на задача
els.addBtn?.addEventListener("click", () => {
    const text = els.taskInput.value.trim();
    const date = els.date.value;
    if (!text || !date) {
        alert("Моля, попълнете задача и дата!");
        return;
    }
    addTask({ 
        text, 
        category: els.category.value, 
        priority: els.priority.value, 
        date, 
        done: false 
    });
    els.taskInput.value = "";
    els.date.value = "";
});

// 2. Търсачка (Добави го ТУК)
els.search?.addEventListener("input", () => {
    const activeBtn = document.querySelector('.filters button.active');
    const filterType = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
    renderTasks(filterType);
});
els.theme?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    els.theme.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

els.navTasks?.addEventListener("click", () => {
    els.tasksTab.classList.add("active");
    els.statsTab.classList.remove("active");
    els.navTasks.classList.add("active");
    els.navStats.classList.remove("active");
});

els.navStats?.addEventListener("click", () => {
    els.statsTab.classList.add("active");
    els.tasksTab.classList.remove("active");
    els.navStats.classList.add("active");
    els.navTasks.classList.remove("active");
    updateStats();
});
// Сложи това най-отдолу в script.js
document.querySelectorAll('.filters button').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Махаме активния клас от стария бутон и го слагаме на новия
        document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Вземаме филтъра (all, today, done...)
        const filterType = e.target.getAttribute('data-filter');
        
        // Преначертаваме задачите с този филтър
        renderTasks(filterType);
    });
});
// Това ще работи и на лаптоп, и на телефон!
els.list.addEventListener("click", (e) => {
    // Намираме бутона, който е натиснат
    const btn = e.target.closest('button');
    if (!btn) return;

    const id = btn.getAttribute('data-id');
    if (!id) return;

    // Проверяваме кой бутон е натиснат чрез класа му
    if (btn.classList.contains("btn-toggle")) {
        toggleTask(id);
    } else if (btn.classList.contains("btn-delete")) {
        deleteTask(id);
    }
});
// ТЪРСАЧКА - Слушател за писане
els.search?.addEventListener("input", () => {
    // Вземаме кой филтър е натиснат в момента (Всички, Днес и т.н.)
    const activeBtn = document.querySelector('.filters button.active');
    const filterType = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
    
    // Обновяваме списъка
    renderTasks(filterType);
});
// Стартираме езика
updateLanguage();