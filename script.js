/* ============================
      DOM ELEMENTS
============================ */

const taskInput = document.getElementById("taskInput");
const categorySelect = document.getElementById("categorySelect");
const prioritySelect = document.getElementById("prioritySelect");
const dateInput = document.getElementById("dateInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

const filterButtons = document.querySelectorAll(".filters button");

const themeToggle = document.getElementById("themeToggle");
const langToggle = document.getElementById("langToggle");

const tasksTab = document.getElementById("tasksTab");
const statsTab = document.getElementById("statsTab");

const navTasks = document.getElementById("navTasks");
const navStats = document.getElementById("navStats");

/* ============================
      TRANSLATIONS
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
        placeholder: "Въведи задача...",
        search: "Търси задача...",
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
            low: "🌱 Нисък приоритет",
            medium: "⚡ Среден приоритет",
            high: "🔥 Висок приоритет"
        }
    },
    en: {
        newTask: "New Task",
        myTasks: "My Tasks",
        add: "Add",
        all: "All",
        today: "Today",
        week: "Week",
        done: "Completed",
        pending: "Pending",
        placeholder: "Enter a task...",
        search: "Search task...",
        navTasks: "Tasks",
        navStats: "Stats",
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
            low: "🌱 Low priority",
            medium: "⚡ Medium priority",
            high: "🔥 High priority"
        }
    }
};

let currentLang = "bg";

/* ============================
      LANGUAGE SWITCH
============================ */

function updateLanguage() {
    const t = translations[currentLang];

    document.getElementById("newTaskTitle").textContent = t.newTask;
    document.getElementById("myTasksTitle").textContent = t.myTasks;

    addTaskBtn.textContent = t.add;

    document.getElementById("filterAll").textContent = t.all;
    document.getElementById("filterToday").textContent = t.today;
    document.getElementById("filterWeek").textContent = t.week;
    document.getElementById("filterDone").textContent = t.done;
    document.getElementById("filterPending").textContent = t.pending;

    searchInput.placeholder = t.search;
    taskInput.placeholder = t.placeholder;

    document.getElementById("navTasksLabel").textContent = t.navTasks;
    document.getElementById("navStatsLabel").textContent = t.navStats;

    document.getElementById("statTotalLabel").textContent = t.stats.total;
    document.getElementById("statDoneLabel").textContent = t.stats.done;
    document.getElementById("statTodayLabel").textContent = t.stats.today;
    document.getElementById("statWeekLabel").textContent = t.stats.week;
    document.getElementById("statPercentLabel").textContent = t.stats.percent;

    [...categorySelect.options].forEach(opt => {
        opt.textContent = t.categories[opt.value];
    });

    [...prioritySelect.options].forEach(opt => {
        opt.textContent = t.priorities[opt.value];
    });

    langToggle.textContent = currentLang.toUpperCase();
}

langToggle.addEventListener("click", () => {
    currentLang = currentLang === "bg" ? "en" : "bg";
    updateLanguage();
    renderTasks();
    updateStats();
});

/* ============================
      LOCAL STORAGE
============================ */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ============================
      RENDER TASKS
============================ */

function renderTasks(filter = "all") {
    taskList.innerHTML = "";

    let filtered = tasks;

    const today = new Date().toISOString().split("T")[0];

    if (filter === "today") {
        filtered = tasks.filter(t => t.date === today);
    }

    if (filter === "week") {
        const now = new Date();
        const weekAhead = new Date();
        weekAhead.setDate(now.getDate() + 7);

        filtered = tasks.filter(t => {
            const d = new Date(t.date);
            return d >= now && d <= weekAhead;
        });
    }

    if (filter === "done") filtered = tasks.filter(t => t.done);
    if (filter === "pending") filtered = tasks.filter(t => !t.done);

    // Search filter
    const searchText = searchInput.value.toLowerCase();
    filtered = filtered.filter(t => t.text.toLowerCase().includes(searchText));

    filtered.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";
        li.draggable = true;
        li.dataset.id = task.id;

        if (task.done) li.classList.add("done");

        const priorityIcon = {
            low: "🌱",
            medium: "⚡",
            high: "🔥"
        }[task.priority];

        li.innerHTML = `
            <span>
                <strong>${priorityIcon} ${task.text}</strong><br>
                <small>
                    ${translations[currentLang].categories[task.category]} • 
                    ${translations[currentLang].priorities[task.priority]} • 
                    ${task.date}
                </small>
            </span>
            <div>
                <button onclick="toggleTask(${task.id})">✔</button>
                <button onclick="deleteTask(${task.id})">✖</button>
            </div>
        `;

        taskList.appendChild(li);
    });

    enableDragAndDrop();
}

/* ============================
      ADD TASK
============================ */

addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    const date = dateInput.value;

    if (!text || !date) return;

    const newTask = {
        id: Date.now(),
        text,
        category: categorySelect.value,
        priority: prioritySelect.value,
        date,
        done: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateStats();

    taskInput.value = "";
    dateInput.value = "";
});

/* ============================
      TOGGLE & DELETE
============================ */

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    saveTasks();
    renderTasks();
    updateStats();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

/* ============================
      FILTER BUTTONS
============================ */

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderTasks(btn.dataset.filter);
    });
});

/* ============================
      SEARCH
============================ */

searchInput.addEventListener("input", () => {
    renderTasks(document.querySelector(".filters .active").dataset.filter);
});

/* ============================
      DRAG & DROP
============================ */

function enableDragAndDrop() {
    const items = document.querySelectorAll(".task-item");
    let dragged = null;

    items.forEach(item => {
        item.addEventListener("dragstart", () => {
            dragged = item;
            item.style.opacity = "0.5";
        });

        item.addEventListener("dragend", () => {
            dragged.style.opacity = "1";
            dragged = null;
        });

        item.addEventListener("dragover", e => {
            e.preventDefault();
            const bounding = item.getBoundingClientRect();
            const offset = bounding.y + bounding.height / 2;

            if (e.clientY - offset > 0) {
                item.after(dragged);
            } else {
                item.before(dragged);
            }
        });
    });
}

/* ============================
      DASHBOARD STATISTICS
============================ */

function updateStats() {
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;

    const today = new Date().toISOString().split("T")[0];
    const todayCount = tasks.filter(t => t.date === today).length;

    const now = new Date();
    const weekAhead = new Date();
    weekAhead.setDate(now.getDate() + 7);

    const weekCount = tasks.filter(t => {
        const d = new Date(t.date);
        return d >= now && d <= weekAhead;
    }).length;

    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    document.getElementById("statTotal").textContent = total;
    document.getElementById("statDone").textContent = done;
    document.getElementById("statToday").textContent = todayCount;
    document.getElementById("statWeek").textContent = weekCount;
    document.getElementById("statPercent").textContent = percent + "%";
}

/* ============================
      THEME SWITCH
============================ */

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

/* ============================
      TAB NAVIGATION
============================ */

navTasks.addEventListener("click", () => {
    tasksTab.classList.add("active");
    statsTab.classList.remove("active");

    navTasks.classList.add("active");
    navStats.classList.remove("active");
});

navStats.addEventListener("click", () => {
    statsTab.classList.add("active");
    tasksTab.classList.remove("active");

    navStats.classList.add("active");
    navTasks.classList.remove("active");

    updateStats();
});

/* ============================
      INIT
============================ */

updateLanguage();
renderTasks();
updateStats();
