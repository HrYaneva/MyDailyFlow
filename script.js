// =========================
// MyDailyFlow – Modern JS
// =========================

// DOM елементи
const taskInput = document.getElementById("taskInput");
const categorySelect = document.getElementById("categorySelect");
const prioritySelect = document.getElementById("prioritySelect");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filters button");
const themeToggle = document.getElementById("themeToggle");
const langToggle = document.getElementById("langToggle");

// Текстове за двата езика
const translations = {
    bg: {
        newTask: "Нова задача",
        myTasks: "Моите задачи",
        add: "Добави",
        all: "Всички",
        done: "Готови",
        pending: "Неготови",
        placeholder: "Въведи задача...",
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
        }
    },
    en: {
        newTask: "New Task",
        myTasks: "My Tasks",
        add: "Add",
        all: "All",
        done: "Completed",
        pending: "Pending",
        placeholder: "Enter a task...",
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
        }
    }
};

let currentLang = "bg";

// Смяна на езика
function updateLanguage() {
    const t = translations[currentLang];

    document.getElementById("newTaskTitle").textContent = t.newTask;
    document.getElementById("myTasksTitle").textContent = t.myTasks;
    addTaskBtn.textContent = t.add;

    document.getElementById("filterAll").textContent = t.all;
    document.getElementById("filterDone").textContent = t.done;
    document.getElementById("filterPending").textContent = t.pending;

    taskInput.placeholder = t.placeholder;

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
});

// Зареждане на задачите от localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Рендиране
function renderTasks(filter = "all") {
    taskList.innerHTML = "";

    let filtered = tasks;

    if (filter === "done") filtered = tasks.filter(t => t.done);
    if (filter === "pending") filtered = tasks.filter(t => !t.done);

    filtered.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item" + (task.done ? " done" : "");

        li.innerHTML = `
            <span>
                <strong>${task.text}</strong><br>
                <small>${translations[currentLang].categories[task.category]} • ${translations[currentLang].priorities[task.priority]}</small>
            </span>
            <div>
                <button onclick="toggleTask(${task.id})">✔</button>
                <button onclick="deleteTask(${task.id})">✖</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

// Добавяне
addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (!text) return;

    const newTask = {
        id: Date.now(),
        text,
        category: categorySelect.value,
        priority: prioritySelect.value,
        done: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    taskInput.value = "";
});

// Маркиране
function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    saveTasks();
    renderTasks();
}

// Изтриване
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

// Филтри
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderTasks(btn.dataset.filter);
    });
});

// Тъмна тема
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Старт
updateLanguage();
renderTasks();
