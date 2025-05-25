const express = require('express');
const bodyParser = require('body-parser');
const app = express();

let todos = [];

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Homepage
app.get('/', (req, res) => {
  const { priority, error } = req.query;
  let filteredTodos = todos;

  if (priority && priority !== 'All') {
    filteredTodos = todos.filter(todo => todo.priority === priority);
  }

  res.render('index', { todos: filteredTodos, query: { priority, error } });
});

// Add todo
app.post('/add', (req, res) => {
  const { task, priority } = req.body;
  if (!task.trim()) {
    return res.redirect('/?error=empty');
  }
  todos.push({ task, priority });
  res.redirect('/');
});

// Delete todo
app.post('/delete/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (!isNaN(index)) {
    todos.splice(index, 1);
  }
  res.redirect('/');
});

// Edit todo
app.post('/edit/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const { task, priority } = req.body;
  if (!task.trim()) {
    return res.redirect('/?error=empty');
  }
  if (!isNaN(index)) {
    todos[index] = { task, priority };
  }
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
