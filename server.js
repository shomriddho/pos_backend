// server.js
const express = require('express');
const cors = require('cors');
const itemRoutes = require('./routes/itemRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const db = require('./routes/database'); // Require the database module
const PORT = process.env.PORT || 3000;
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
    )`, (err) => {
        if (err) {
            console.error('Error creating items table:', err.message);
        } else {
            console.log('Items table created successfully');
        }
    });

    // Create variants table (if not exists)
    db.run(`CREATE TABLE IF NOT EXISTS variants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL,
        name TEXT NOT NULL,  -- Name or label for the variant (e.g., "Size", "Color")
        value TEXT NOT NULL, -- Value of the variant (e.g., "Small", "Red")
        price INTEGER NOT NULL, -- Price adjustment for the variant
        cost INTEGER NOT NULL, -- Cost adjustment for the variant
        quantity INTEGER NOT NULL DEFAULT 0, -- Quantity of the variant in stock
        FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
    )`, (err) => {
        if (err) {
            console.error('Error creating variants table:', err.message);
        } else {
            console.log('Variants table created successfully');
        }
    });
}

// Create employees table (if not exists)
function createEmployeesTable() {
    db.run(`CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        position TEXT NOT NULL,
        salary INTEGER NOT NULL
    )`);
}
createEmployeesTable()
createItemsTable()

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Mount item routes at /items
app.use('/items', itemRoutes);

// Mount employee routes at /employees
app.use('/employees', employeeRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
