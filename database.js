// database.js
const sqlite3 = require('sqlite3').verbose();

// Create a new SQLite database connection
const db = new sqlite3.Database('./shop.db', err => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createItemsTable(); // Create items table if it doesn't exist
        createEmployeesTable(); // Create employees table
    }
});
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
        item_id INTEGER ,
        name TEXT ,
        description TEXT ,
        price INTEGER ,
        cost INTEGER ,
        profit_percentage REAL ,
        profit_value INTEGER ,
        quantity INTEGER  DEFAULT 0,
        in_stock BOOLEAN  DEFAULT 0,
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
// Create items table (if not exists)

module.exports = db;
