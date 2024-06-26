const express = require('express');
const db = require('./database');

const router = express.Router();

// Get all items
router.get('/', (req, res) => {
    db.all('SELECT * FROM items', (err, itemsRows) => {
        if (err) {
            console.error('Error fetching items:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        // Fetch variants for each item
        Promise.all(itemsRows.map(item => {
            return new Promise((resolve, reject) => {
                db.all('SELECT * FROM variants WHERE item_id = ?', [item.id], (err, variantRows) => {
                    if (err) {
                        reject(err);
                    } else {
                        // Map variant rows to transform "value" to "description"
                        const variants = variantRows.map(variantRow => ({
                            ...variantRow,
                            description: variantRow.value,
                            value: undefined
                        }));
                        item.variants = variants;
                        resolve(item);
                    }
                });
            });
        }))
        .then(itemsWithVariants => {
            res.json(itemsWithVariants);
        })
        .catch(error => {
            console.error('Error fetching variants:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    });
});

// Get an item by ID
router.get('/:id', (req, res) => { // Changed route from '/items/:id' to '/item/:id'
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
router.post('/', (req, res) => {
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
router.put('/items/:id', (req, res) => {
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
router.delete('/items/:id', (req, res) => {
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

// Other item routes...

module.exports = router;
