/* ============================
      FIREBASE INIT
============================ */

const firebaseConfig = {
  apiKey: "AIzaSyDjHhHHWMLRilF9P2m-NKaTa1WP1NmIykI",
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
      AUTH REDIRECT
============================ */

auth.onAuthStateChanged(user => {
    const isAuthPage =
        location.pathname.includes("login.html") ||
        location.pathname.includes("register.html");

    if (!user && !isAuthPage) return location.href = "login.html";
    if (user && isAuthPage) return location.href = "index.html";
    if (user && !isAuthPage) loadTasks();
});

/* ============================
      LOGIN / REGISTER
============================ */

function setupAuthForms() {
    const loginBtn = document.getElementById("loginBtn");
    const googleLoginBtn = document.getElementById("googleLoginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const googleRegisterBtn = document.getElementById("googleRegisterBtn");

    if (loginBtn) {
        loginBtn.onclick = () => {
            auth.signInWithEmailAndPassword(
                loginEmail.value,
                loginPassword.value
            ).catch(e => alert(e.message));
        };
        googleLoginBtn.onclick = googleAuth;
    }

    if (registerBtn) {
        registerBtn.onclick = () => {
            auth.createUserWithEmailAndPassword(
                registerEmail.value,
                registerPassword.value
            ).catch(e => alert(e.message));
        };
        googleRegisterBtn.onclick = googleAuth;
    }
}

function googleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(e => alert(e.message));
}

setupAuthForms();

/* ============================
      DOM ELEMENTS
============================ */

const els = {
    taskInput: document.getElementById("taskInput"),
    category: document.getElementById("categorySelect"),
    priority: document.getElementById("prioritySelect"),
    date: document.getElementById("dateInput"),
    addBtn: document.getElementById("addTaskBtn"),
    list: document.getElementById("taskList"),
    search: document.getElementById("searchInput"),
    filters: document.querySelectorAll(".filters button"),
    theme: document.getElementById("themeToggle"),
    lang: document.getElementById("langToggle"),
    tasksTab: document.getElementById("tasksTab"),
    statsTab: document.getElementById("statsTab"),
    navTasks: document.getElementById("navTasks"),
    navStats: document.getElementById("navStats")
};

/* ============================
      LANGUAGE
============================ */
const translations = {
    
    bg: {
        newTask: "Нова задача",
        myTasks: "Моите задачи",
        add: "Добави",
        all: "Всички",
        today: "Днес",
        week: "Седмица",
        done: "Готови",
        pending: "Неготови",
        search: "Търси задача...",
        placeholder: "Въведи задача...",
        navTasks: "Задачи",
        navStats: "Статистики",

        stats: {
            total: "Общо задачи",
            done: "Готови",
            today: "За днес",
            week: "За седмицата",
            percent: "Процент изпълнение"
        },

        categories: {
            work: "Работа",
            home: "Дом",
            school: "Училище",
            personal: "Лични"
        },

        priorities: {
            low: "Нисък приоритет",
            medium: "Среден приоритет",
            high: "Висок приоритет"
        },

        auth: {
            loginTitle: "Вход",
            registerTitle: "Регистрация",
            email: "Имейл",
            password: "Парола",
            loginBtn: "Вход",
            registerBtn: "Регистрация",
            googleLogin: "Вход с Google",
            noAccount: "Нямаш акаунт?",
            haveAccount: "Имаш акаунт?",
            goToRegister: "Регистрация",
            goToLogin: "Вход"
        }
    },

    en: {
        newTask: "New Task",
        myTasks: "My Tasks",
        add: "Add",
        all: "All",
        today: "Today",
        week: "Week",
        done: "Done",
        pending: "Pending",
        search: "Search task...",
        placeholder: "Enter a task...",
        navTasks: "Tasks",
        navStats: "Statistics",

        stats: {
            total: "Total tasks",
            done: "Completed",
            today: "Today",
            week: "This week",
            percent: "Completion rate"
        },

        categories: {
            work: "Work",
            home: "Home",
            school: "School",
            personal: "Personal"
        },

        priorities: {
            low: "Low priority",
            medium: "Medium priority",
            high: "High priority"
        },

        auth: {
            loginTitle: "Login",
            registerTitle: "Register",
            email: "Email",
            password: "Password",
            loginBtn: "Login",
            registerBtn: "Register",
            googleLogin: "Login with Google",
            noAccount: "Don't have an account?",
            haveAccount: "Already have an account?",
            goToRegister: "Register",
            goToLogin: "Login"
        }
    }

};

let currentLang = "bg";

function updateLanguage() {
    const t = translations[currentLang];

    // Helper: безопасно задаване на текст
    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    // Основни заглавия
    setText("newTaskTitle", t.newTask);
    setText("myTasksTitle", t.myTasks);

    if (els.addBtn) els.addBtn.textContent = t.add;

    // Филтри
    setText("filterAll", t.all);
    setText("filterToday", t.today);
    setText("filterWeek", t.week);
    setText("filterDone", t.done);
    setText("filterPending", t.pending);

    // Полета
    if (els.search) els.search.placeholder = t.search;
    if (els.taskInput) els.taskInput.placeholder = t.placeholder;

    // Навигация
    setText("navTasksLabel", t.navTasks);
    setText("navStatsLabel", t.navStats);

    // Статистики
    if (t.stats) {
        setText("statTotalLabel", t.stats.total);
        setText("statDoneLabel", t.stats.done);
        setText("statTodayLabel", t.stats.today);
        setText("statWeekLabel", t.stats.week);
        setText("statPercentLabel", t.stats.percent);
    }

    // Категории
    if (els.category) {
        [...els.category.options].forEach(o => {
            o.textContent = t.categories[o.value];
        });
    }

    // Приоритети
    if (els.priority) {
        [...els.priority.options].forEach(o => {
            o.textContent = t.priorities[o.value];
        });
    }

   // 🔹 AUTH страници (login / register)
if (document.body.classList.contains("auth-page")) {

    // Проверяваме дали сме на login или register
    const isLogin = document.getElementById("loginBtn") !== null;

    // Заглавие
    setText("authTitle", isLogin ? t.auth.loginTitle : t.auth.registerTitle);

    // Полета
    setText("authEmailLabel", t.auth.email);
    setText("authPasswordLabel", t.auth.password);

    // Бутони
    setText("loginBtn", t.auth.loginBtn);
    setText("registerBtn", t.auth.registerBtn);

    setText("googleLoginBtn", t.auth.googleLogin);

    // Линкове
    setText("noAccountText", t.auth.noAccount);
    setText("haveAccountText", t.auth.haveAccount);

    setText("goToRegisterLink", t.auth.goToRegister);
    setText("goToLoginLink", t.auth.goToLogin);
}

    // Бутон за език
if (els.lang) {
    els.lang.textContent = currentLang === "bg" ? "🇧🇬" : "🇪🇳";
}

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
    const uid = auth.currentUser.uid;

    db.collection("users")
        .doc(uid)
        .collection("tasks")
        .orderBy("createdAt")
        .onSnapshot(snap => {
            tasks = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            renderTasks();
            updateStats();
        });
}

function addTask(task) {
    const uid = auth.currentUser.uid;
    db.collection("users").doc(uid).collection("tasks").add({
        ...task,
        createdAt: Date.now()
    });
}

function updateTask(id, data) {
    const uid = auth.currentUser.uid;
    db.collection("users").doc(uid).collection("tasks").doc(id).update(data);
}

function removeTask(id) {
    const uid = auth.currentUser.uid;
    db.collection("users").doc(uid).collection("tasks").doc(id).delete();
}

/* ============================
      ADD TASK
============================ */

els.addBtn?.addEventListener("click", () => {
    const text = els.taskInput.value.trim();
    const date = els.date.value;

    if (!text || !date) return;

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

/* ============================
      RENDER TASKS
============================ */

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
        const week = new Date();
        week.setDate(now.getDate() + 7);
        filtered = filtered.filter(t => {
            const d = new Date(t.date);
            return d >= now && d <= week;
        });
    }

    const search = els.search.value.toLowerCase();
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
                <small>
                    ${translations[currentLang].categories[task.category]} •
                    ${translations[currentLang].priorities[task.priority]} •
                    ${task.date}
                </small>
            </span>
            <div>
                <button onclick="toggleTask('${task.id}')">✔</button>
                <button onclick="deleteTask('${task.id}')">✖</button>
            </div>
        `;

        els.list.appendChild(li);
    });

    enableDrag();
}

/* ============================
      TOGGLE & DELETE
============================ */

function toggleTask(id) {
    const t = tasks.find(x => x.id === id);
    updateTask(id, { done: !t.done });
}

function deleteTask(id) {
    removeTask(id);
}

/* ============================
      DRAG & DROP
============================ */

function enableDrag() {
    const items = document.querySelectorAll(".task-item");
    let drag = null;

    items.forEach(i => {
        i.addEventListener("dragstart", () => {
            drag = i;
            i.style.opacity = "0.5";
        });

        i.addEventListener("dragend", () => {
            drag.style.opacity = "1";
            drag = null;
        });

        i.addEventListener("dragover", e => {
            e.preventDefault();
            const box = i.getBoundingClientRect();
            const mid = box.y + box.height / 2;
            if (e.clientY > mid) i.after(drag);
            else i.before(drag);
        });
    });
}

/* ============================
      STATS
============================ */

function updateStats() {
    if (!document.getElementById("statTotal")) return;

    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;

    const today = new Date().toISOString().split("T")[0];
    const todayCount = tasks.filter(t => t.date === today).length;

    const now = new Date();
    const week = new Date();
    week.setDate(now.getDate() + 7);

    const weekCount = tasks.filter(t => {
        const d = new Date(t.date);
        return d >= now && d <= week;
    }).length;

    const percent = total ? Math.round(done / total * 100) : 0;

    statTotal.textContent = total;
    statDone.textContent = done;
    statToday.textContent = todayCount;
    statWeek.textContent = weekCount;
    statPercent.textContent = percent + "%";
}

/* ============================
      THEME
============================ */

els.theme?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    els.theme.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

/* ============================
      TABS
============================ */

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

/* ============================
      INIT
============================ */

updateLanguage();
