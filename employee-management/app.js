const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');

const app = express();

// MySQL Connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',       // use your MySQL username
  password: 'root',       // use your MySQL password
  database: 'employeeDB'
});

// Template engine
app.engine('handlebars', engine());  
app.set('view engine', 'handlebars');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static('public'));


// Home Page
app.get('/', (req, res) => res.render('home'));

// List Employees
app.get('/employees', (req, res) => {
  pool.query('SELECT * FROM employees', (err, results) => {
    if (err) throw err;
    res.render('employees', { employees: results });
  });
});

// Add Employee Form
app.get('/employees/add', (req, res) => {
  res.render('addEmployee');
});

// Add Employee
app.post('/employees', (req, res) => {
  const { name, position, department, salary } = req.body;
  pool.query(
    'INSERT INTO employees (name, position, department, salary) VALUES (?, ?, ?, ?)',
    [name, position, department, salary],
    (err) => {
      if (err) throw err;
      res.redirect('/employees');
    }
  );
});

// Edit Employee Form
app.get('/employees/edit/:id', (req, res) => {
  pool.query('SELECT * FROM employees WHERE id = ?', [req.params.id], (err, results) => {
    if (err) throw err;
    res.render('editEmployee', { employee: results[0] });
  });
});

// Update Employee
app.put('/employees/:id', (req, res) => {
  const { name, position, department, salary } = req.body;
  pool.query(
    'UPDATE employees SET name = ?, position = ?, department = ?, salary = ? WHERE id = ?',
    [name, position, department, salary, req.params.id],
    (err) => {
      if (err) throw err;
      res.redirect('/employees');
    }
  );
});

// Delete Employee
app.delete('/employees/:id', (req, res) => {
  pool.query('DELETE FROM employees WHERE id = ?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/employees');
  });
});

app.listen(3000, () => console.log('Server started on port 3000'));
