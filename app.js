const todoInput = document.getElementById('todo-input');
const addTaskBtn = document.getElementById('add-task-btn');
const todoList = document.getElementById('todo-list');

// Add new task
function addTask() {
  const taskText = todoInput.value.trim();
  console.log(taskText);

  if (taskText !== '') {
    const taskItem = createTaskItem(taskText);
    todoList.appendChild(taskItem);
    todoInput.value = '';
  }
}

// Create new task item
function createTaskItem(taskText) {
  const description = taskText.replaceAll(' ', '-').toLowerCase();
  const taskItem = document.createElement('li');

  taskItem.className = 'todo-item';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('checkbox');
  checkbox.setAttribute('aria-label', 'input-checkbox');

  const taskTextSpan = document.createElement('span');
  taskTextSpan.textContent = taskText;
  taskTextSpan.setAttribute('aria-label', 'task-text');

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.setAttribute('aria-describedby', 'task-text');
  deleteBtn.addEventListener('click', deleteTask);

  taskItem.appendChild(checkbox);
  taskItem.appendChild(taskTextSpan);
  taskItem.appendChild(deleteBtn);
  taskItem.setAttribute('aria-label', description + '-listitem');
  return taskItem;
}

// Delete task
function deleteTask(event) {
  const taskItem = event.target.parentNode;
  todoList.removeChild(taskItem);
}

// Mark task as completed
function toggleTask(event) {
  const taskItem = event.target.parentNode;
  taskItem.classList.toggle('completed');
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);
todoInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    addTask();
  }
});

todoList.addEventListener('change', toggleTask);

// Example initial tasks
const initialTasks = ['Buy groceries', 'Pay bills', 'Walk the dog'];

initialTasks.forEach((task) => {
  const taskItem = createTaskItem(task);
  todoList.appendChild(taskItem);
});
