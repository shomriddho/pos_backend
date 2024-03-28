const express = require('express');
const db = require('./database');

const router = express.Router();

// Get all employees
router.get('/', (req, res) => {
    db.all('SELECT * FROM employees', (err, rows) => {
        if (err) {
            console.error('Error fetching employees:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(rows);
        }
    });
});

// Get an employee by ID
router.get('/:id', (req, res) => {
    const employeeId = req.params.id;
    db.get('SELECT * FROM employees WHERE id = ?', [employeeId], (err, row) => {
        if (err) {
            console.error('Error fetching employee:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (row) {
                res.json(row);
            } else {
                res.status(404).json({ error: 'Employee not found' });
            }
        }
    });
});

// Add a new employee
router.post('/', (req, res) => {
    const { name, position, salary } = req.body;
    db.run('INSERT INTO employees (name, position, salary) VALUES (?, ?, ?)',
        [name, position, salary], function(err) {
            if (err) {
                console.error('Error adding employee:', err.message);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.json({
                    message: 'Employee added successfully',
                    employeeId: this.lastID
                });
            }
        });
});

// Update an employee
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, position, salary } = req.body;
    db.run('UPDATE employees SET name = ?, position = ?, salary = ? WHERE id = ?',
        [name, position, salary, id], function(err) {
            if (err) {
                console.error('Error updating employee:', err.message);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.json({ message: `Employee with ID ${id} updated successfully` });
            }
        });
});

// Delete an employee
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM employees WHERE id = ?', id, function(err) {
        if (err) {
            console.error('Error deleting employee:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ message: `Employee with ID ${id} deleted successfully` });
        }
    });
});

// Other employee routes...

module.exports = router;
