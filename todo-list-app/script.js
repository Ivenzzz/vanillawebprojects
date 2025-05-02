const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
const taskList = document.getElementById('taskList');

window.addEventListener('DOMContentLoaded', loadTasks);
addTaskBtn.addEventListener('click', addTask);
deleteSelectedBtn.addEventListener('click', deleteSelectedTasks);

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const task = {
        id: generateId(),
        text: taskText,
        isCompleted: false
    };

    addTaskToDOM(task);
    saveTaskToLocalStorage(task);
    taskInput.value = '';
}

function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('select-checkbox');

    const span = document.createElement('span');
    span.textContent = task.text;
    span.classList.add('task-text');
    if (task.isCompleted) span.classList.add('completed');

    span.addEventListener('click', () => {
        span.classList.toggle('completed');
        toggleTaskCompletion(li.dataset.id);
    });

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', () => editTask(li.dataset.id, span));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);

    taskList.insertBefore(li, taskList.firstChild);

    // Apply fade-in transition
    setTimeout(() => {
        li.classList.add('fade-in');
    }, 10); // Adding a small delay to trigger the CSS transition
}

function saveTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(addTaskToDOM);
}

function toggleTaskCompletion(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updated = tasks.map(task =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    );
    localStorage.setItem('tasks', JSON.stringify(updated));
}

function deleteSelectedTasks() {
    const checkboxes = document.querySelectorAll('.select-checkbox:checked');
    const idsToDelete = Array.from(checkboxes).map(cb => cb.parentElement.dataset.id);

    idsToDelete.forEach(id => {
        const taskItem = document.querySelector(`li[data-id="${id}"]`);
        if (taskItem) {
            taskItem.classList.add('fade-out');
            setTimeout(() => {
                taskItem.remove();
            }, 300); // match the CSS transition duration
        }
    });

    // Remove from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => !idsToDelete.includes(task.id));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function editTask(taskId, span) {
    const currentText = span.textContent;
    const newText = prompt('Edit your task:', currentText);

    if (newText !== null && newText.trim() !== '') {
        // Add editing class for transition effect
        const taskItem = span.parentElement;
        taskItem.classList.add('editing');

        setTimeout(() => {
            taskItem.classList.remove('editing'); // Remove after editing is complete
        }, 300); // Duration for the editing effect to last

        span.textContent = newText.trim();

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updated = tasks.map(task =>
            task.id === taskId ? { ...task, text: newText.trim() } : task
        );
        localStorage.setItem('tasks', JSON.stringify(updated));
    }
}



