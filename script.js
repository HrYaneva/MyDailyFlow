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

// Зареждане на задачите от localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Запазване в localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Рендиране на задачите
function renderTasks(filter = "all") {
    taskList.innerHTML = "";

    let filtered = tasks;

    if (filter === "done") {
        filtered = tasks.filter(t => t.done);
    } else if (filter === "pending") {
        filtered = tasks.filter(t => !t.done);
    }

    filtered.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item" + (task.done ? " done" : "");

        li.innerHTML = `
            <span>
                <strong>${task.text}</strong><br>
                <small>${task.category} • ${task.priority}</small>
            </span>
            <div>
                <button onclick="toggleTask(${task.id})">✔</button>
                <button onclick="deleteTask(${task.id})">✖</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

// Добавяне на задача
addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    const category = categorySelect.value;
    const priority = prioritySelect.value;

    if (text === "") return;

    const newTask = {
        id: Date.now(),
        text,
        category,
        priority,
        done: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    taskInput.value = "";
});

// Маркиране като готова
function toggleTask(id) {
    tasks = tasks.map(t =>
        t.id === id ? { ...t, done: !t.done } : t
    );
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

// Първоначално зареждане
renderTasks();
