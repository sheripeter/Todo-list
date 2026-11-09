
const todoForm = document.querySelector("#todoForm");
const todoInput = document.querySelector("#todoInput");
const todoList = document.querySelector("#todoList");
const taskCounter = document.querySelector("#taskCounter");
const totalCounter = document.querySelector("#totalCounter");

// Load saved tasks
let tasks = [];

try {
    const savedTasks = localStorage.getItem("tasks");

    tasks = savedTasks ? JSON.parse(savedTasks) : [];

    if (!Array.isArray(tasks)) {
        tasks = [];
    }

} catch (error) {
    tasks = [];
    console.error("Unable to load saved tasks:", error);
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  todoList.innerHTML = "";

  tasks.forEach(function (task) {
    const listItem = document.createElement("li");
    
    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Complete ${task.text}`);

    // Task text
    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    taskText.classList.toggle("completed", task.completed);

    // Status label
    const statusText = document.createElement("span");
    statusText.textContent = task.completed ? "Completed" : "Pending";
    statusText.className = "task-status";

    // Update completion status
    checkbox.addEventListener("change", function () {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      tasks = tasks.filter(function (item) {
        return item.id !== task.id;
      });

      saveTasks();
      renderTasks();
    });

    // Add everything to the task row
    listItem.appendChild(checkbox);
    listItem.appendChild(taskText);
    listItem.appendChild(statusText);
    listItem.appendChild(deleteButton);

    // IMPORTANT: Display the task row on the page
    todoList.appendChild(listItem);
  }
);
const remainingTasks = tasks.filter(function (task) {
  return !task.completed;
}).length;

totalCounter.textContent = `Total tasks: ${tasks.length}`;
taskCounter.textContent = `Tasks remaining: ${remainingTasks}`;

}

// Add a new task
todoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = todoInput.value.trim();

  if (text === "") {
    alert("Please enter a task before adding.");
  return;
  }

  tasks.push({
    id: Date.now() + Math.random(),
    text: text,
    completed: false
  });

  saveTasks();
  renderTasks();

  todoInput.value = "";
  todoInput.focus();
});

// Display previously saved tasks
renderTasks();
