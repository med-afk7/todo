const todo = document.querySelector('#to-do-list');
const form = document.querySelector('#todo-form');
const input = document.querySelector('#to-do-input');

// ✅ Load tasks from the backend API on page load
window.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:5000/tasks')
    .then(res => res.json())
    .then(tasks => {
      tasks.forEach(task => createTaskElement(task));
    })
    .catch(err => console.error('Error loading tasks:', err));
});

// Helper: create task <li> element and append it to the list
function createTaskElement(task) {
  const li = document.createElement('li');

  const textSpan = document.createElement('span');
  textSpan.textContent = task.text;
  li.appendChild(textSpan);

  if (task.done) {
    li.classList.add('done');
  }

  // Done button
  const btnDone = document.createElement('button');
  btnDone.innerText = "Done";
  btnDone.classList.add('done');
  btnDone.addEventListener('click', () => {
    fetch(`http://localhost:5000/tasks/${task._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !li.classList.contains('done') })
    })
    .then(res => res.json())
    .then(updated => {
      li.classList.toggle('done');
    });
  });

  // Delete button
  const btnDelete = document.createElement('button');
  btnDelete.innerText = "Delete";
  btnDelete.classList.add('delete');
  btnDelete.addEventListener('click', () => {
    fetch(`http://localhost:5000/tasks/${task._id}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(() => {
      li.remove();
    });
  });

  li.appendChild(btnDone);
  li.appendChild(btnDelete);
  todo.appendChild(li);
}

// ✅ Handle form submission to add a new task to backend
form.addEventListener('submit', function(event) {
  event.preventDefault();
  const taskText = input.value.trim();
  if (taskText === '') return;

  fetch('http://localhost:5000/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: taskText })
  })
  .then(res => res.json())
  .then(newTask => {
    createTaskElement(newTask);
    input.value = '';
  });
});
