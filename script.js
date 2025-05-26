// script.js

const taskInput = document.getElementById("taskInput");
const dueTimeInput = document.getElementById("dueTime");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${task.text} <small>🕒 ${task.due}</small></span>
      <button onclick="deleteTask(${index})">❌</button>
    `;
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  const due = dueTimeInput.value;
  if (text && due) {
    tasks.push({ text, due });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    taskInput.value = "";
    dueTimeInput.value = "";
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Reminder check
function checkReminders() {
  const now = new Date();
  tasks.forEach((task, i) => {
    const taskTime = new Date(task.due);
    if (taskTime <= now) {
      alert(`🌙 Reminder: "${task.text}" is due now!`);
      tasks.splice(i, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    }
  });
}

addTaskBtn.addEventListener("click", addTask);
window.addEventListener("load", renderTasks);
setInterval(checkReminders, 60000); // Check every minute
// Lunar App: Integrated Task Reminder Notifications

document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const dueTimeInput = document.getElementById("dueTime");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");

  function checkNotificationsPermission() {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission !== "granted") {
          alert("Please allow notifications to get task reminders.");
        }
      });
    }
  }

  function scheduleNotification(task, dueTime) {
    const timeUntilDue = new Date(dueTime) - new Date();

    if (timeUntilDue > 0) {
      setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification("🌙 Lunar Reminder", {
            body: `Task Due: ${task}`,
            icon: "moon-icon.svg",
          });
        }
      }, timeUntilDue);
    }
  }

  function addTask() {
    const taskText = taskInput.value.trim();
    const dueDateTime = dueTimeInput.value;

    if (taskText === "" || dueDateTime === "") return;

    const li = document.createElement("li");
    li.classList.add("task-item");
    li.innerHTML = `
      <span>${taskText}</span>
      <span class="task-time">⏰ ${new Date(dueDateTime).toLocaleString()}</span>
    `;
    taskList.appendChild(li);

    // Store in localStorage
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks.push({ task: taskText, due: dueDateTime });
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Schedule desktop notification
    checkNotificationsPermission();
    scheduleNotification(taskText, dueDateTime);

    taskInput.value = "";
    dueTimeInput.value = "";
  }

  addTaskBtn.addEventListener("click", addTask);

  // Load saved tasks
  const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  savedTasks.forEach(({ task, due }) => {
    const li = document.createElement("li");
    li.classList.add("task-item");
    li.innerHTML = `
      <span>${task}</span>
      <span class="task-time">⏰ ${new Date(due).toLocaleString()}</span>
    `;
    taskList.appendChild(li);
  });
});


