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

const translations = { /* твоя обект */ };
let currentLang = "bg";

function updateLanguage() {
    const t = translations[currentLang];

    document.getElementById("newTaskTitle").textContent = t.newTask;
    document.getElementById("myTasksTitle").textContent = t.myTasks;

    els.addBtn.textContent = t.add;

    document.getElementById("filterAll").textContent = t.all;
    document.getElementById("filterToday").textContent = t.today;
    document.getElementById("filterWeek").textContent = t.week;
    document.getElementById("filterDone").textContent = t.done;
    document.getElementById("filterPending").textContent = t.pending;

    els.search.placeholder = t.search;
    els.taskInput.placeholder = t.placeholder;

    document.getElementById("navTasksLabel").textContent = t.navTasks;
    document.getElementById("navStatsLabel").textContent = t.navStats;

    document.getElementById("statTotalLabel").textContent = t.stats.total;
    document.getElementById("statDoneLabel").textContent = t.stats.done;
    document.getElementById("statTodayLabel").textContent = t.stats.today;
    document.getElementById("statWeekLabel").textContent = t.stats.week;
    document.getElementById("statPercentLabel").textContent = t.stats.percent;

    [...els.category.options].forEach(o => o.textContent = t.categories[o.value]);
    [...els.priority.options].forEach(o => o.textContent = t.priorities[o.value]);

    els.lang.textContent = currentLang.toUpperCase();
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
