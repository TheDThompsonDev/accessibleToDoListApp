const todoInput = document.getElementById('todo-input');
const addTaskBtn = document.getElementById('add-task-btn');
const todoList = document.getElementById('todo-list');
const livePolite = document.getElementById('live-polite');

// Add new task
function addTask() {
  const taskText = todoInput.value.trim();
  console.log(taskText);

  if (taskText !== '') {
    const taskItem = createTaskItem(taskText);
    todoList.appendChild(taskItem);

    // we share the event with screen reader users in the live region.
    const announcementText = `${taskText} added. ${getTodoListStatus()}`;
    announce(announcementText);


    todoInput.value = '';
  }
}

// to update the aria-live region
function announce(text){
   livePolite.textContent = text;
}

//generate a unique ID
function createUniqueID(){
   return "id-" + Math.floor(Math.random() * 100) + "-" + Date.now();
}

// Create new task item
function createTaskItem(taskText) {

  //to properly associate labels, aria-describedby etc. we need unique IDs on each item in the list.
  //the simplest way to do this is to generate a unique ID.
  const taskID = createUniqueID();



  const description = taskText.replaceAll(' ', '-').toLowerCase();
  const taskItem = document.createElement('li');

  taskItem.className = 'todo-item';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('checkbox');
  // the label needs to have the text of the item so the checkbox makes sense.
  //now if I land on the checkbox the checked state or not checked state has meaning.
  checkbox.setAttribute('aria-label', taskText + " is complete / done");

  const taskTextSpan = document.createElement('span');
  taskTextSpan.textContent = taskText;
  //we need to give this item an ID as we want to reference it with `aria-describedby` which takes an element's ID.
  taskTextSpan.setAttribute('id', taskID);
  taskTextSpan.classList.add("task-text");

  //aria-labels are not very reliable on non-interactive (non-focusable) items.
  //so best to just remove this.
  //REMOVE: taskTextSpan.setAttribute('aria-label', 'task');



  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('delete-btn');
  //aria-describedby points to an ID of an element.
  // Changed: deleteBtn.setAttribute('aria-describedby', 'task-text');
  deleteBtn.setAttribute('aria-describedby', taskID);
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

  //get the tast items text.
  const taskText = taskItem.querySelector('.task-text').textContent;

  todoList.removeChild(taskItem);

  //update visually hidden section
  const announcementText = `${taskText} deleted. ${getTodoListStatus()}`;
  announce(announcementText);

  //we should manage focus as the selected item no longer exists.
  //returning the focus to the input is one option.
  todoInput.focus();  
}

// Mark task as completed
function toggleTask(event) {
  const taskItem = event.target.parentNode;
  taskItem.classList.toggle('completed');

  const taskText = taskItem.querySelector('.task-text').textContent;

  const announcementText = `${taskText} marked as complete. ${getTodoListStatus()}`;
  announce(announcementText);
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
// const initialTasks = [];

initialTasks.forEach((task) => {
  const taskItem = createTaskItem(task);
  todoList.appendChild(taskItem);
});


//we need to set the state of the aria-invalid attribute, which lets them know the state must change.
//ideally we would also have an error message if they pressed "enter" and the input was empty, but I will leave that up to you

function checkInputIsValid(){
  console.log(todoInput.value);
   if(todoInput.value.length > 0){
     return todoInput.setAttribute('aria-invalid', false)
   }
   return todoInput.setAttribute('aria-invalid', true)
}

todoInput.addEventListener('keyup', function(){
  checkInputIsValid()
})

function getTodoListStatus(){
  let items = [...todoList.querySelectorAll("li")]
  let totalItemCount = items.length
  let completedItemCount = items.map(item => item.querySelector("input[type='checkbox']"))
                                .filter(checkbox => checkbox.checked).length
  console.log(completedItemCount);
  let incompleteItemCount = totalItemCount - completedItemCount
  
  return `${totalItemCount}  items are currently in your todo list. ${completedItemCount} completed items, ${incompleteItemCount} incomplete.`
}