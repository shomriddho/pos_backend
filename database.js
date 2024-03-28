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

// Create items table (if not exists)

module.exports = db;
