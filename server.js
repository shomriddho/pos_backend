// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*'
}));

// Create a new SQLite database connection
const db = new sqlite3.Database('./shop.db', err => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createItemsTable(); // Create items table if it doesn't exist
    }
});

// Create items table (if not exists)
function createItemsTable() {
    db.run(`CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        cost INTEGER NOT NULL,
        profit_percentage REAL NOT NULL,
        profit_value INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0, -- Added quantity column
        in_stock BOOLEAN NOT NULL DEFAULT 0 -- Added in_stock column
    )`);
}

// Express middleware to parse JSON
app.use(express.json());

// Routes
// Get all items
app.get('/items', (req, res) => {
    db.all('SELECT * FROM items', (err, rows) => {
        if (err) {
            console.error('Error fetching items:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(rows);
        }
    });
});

// Get an item by ID
app.get('/item/:id', (req, res) => { // Changed route from '/items/:id' to '/item/:id'
    const itemId = req.params.id;
    db.get('SELECT * FROM items WHERE id = ?', [itemId], (err, row) => {
        if (err) {
            console.error('Error fetching item:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (row) {
                res.json(row);
            } else {
                res.status(404).json({ error: 'Item not found' });
            }
        }
    });
});

// Add a new item
app.post('/items', (req, res) => {
    const { name, description, price, cost, quantity, in_stock } = req.body;
    const profitValue = price - cost;
    const profitPercentage = (profitValue / cost) * 100;
    db.run('INSERT INTO items (name, description, price, cost, profit_percentage, profit_value, quantity, in_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [name, description, price, cost, profitPercentage, profitValue, quantity, in_stock], function(err) {
        if (err) {
            console.error('Error adding item:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({
                message: 'Item added successfully',
                itemId: this.lastID
            });
        }
    });
});

// Update an item
app.put('/items/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price, cost, quantity, in_stock } = req.body;
    const profitValue = price - cost;
    const profitPercentage = (profitValue / cost) * 100;
    db.run('UPDATE items SET name = ?, description = ?, price = ?, cost = ?, profit_percentage = ?, profit_value = ?, quantity = ?, in_stock = ? WHERE id = ?', 
        [name, description, price, cost, profitPercentage, profitValue, quantity, in_stock, id], function(err) {
        if (err) {
            console.error('Error updating item:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ message: `Item with ID ${id} updated successfully` });
        }
    });
}); 

// Delete an item
app.delete('/items/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM items WHERE id = ?', id, function(err) {
        if (err) {
            console.error('Error deleting item:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ message: `Item with ID ${id} deleted successfully` });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
