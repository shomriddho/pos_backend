const express = require('express');
const router = express.Router();
const db = require('../database');
// Create a variant for a specific item
router.post('/:itemId/variants', (req, res) => {
    const { itemId } = req.params;
    const { name, value, price, cost, quantity } = req.body;
    const profitValue = price - cost;
    const profitPercentage = (profitValue / cost) * 100;

    db.run(`INSERT INTO variants (item_id, name, description, price, cost, profit_value, profit_percentage, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [itemId, name, value, price, cost, profitValue, profitPercentage, quantity], function (err) {
            if (err) {
                console.error('Error adding variant:', err.message);
                res.status(500).json({ error: 'Internal Server Error' }); // Corrected typo here
            } else {
                res.json({
                    message: 'Variant added successfully',
                    variantId: this.lastID
                });
            }
        });
});


// Update details of a specific variant
router.put('/variants/:variantId', (req, res) => {
    const { variantId } = req.params;
    const { name, value, price, cost, quantity } = req.body;
    const profitValue = price - cost;
    const profitPercentage = (profitValue / cost) * 100;

    db.run(`UPDATE variants SET name = ?, value = ?, price = ?, cost = ?, profit_value = ?, profit_percentage = ?, quantity = ? WHERE id = ?`,
        [name, value, price, cost, profitValue, profitPercentage, quantity, variantId], function (err) {
            if (err) {
                console.error('Error updating variant:', err.message);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.json({ message: `Variant with ID ${variantId} updated successfully` });
            }
        });
});

// Get details of a specific variant by its ID
router.get('/variants/:variantId', (req, res) => {
    const { variantId } = req.params;

    db.get(`SELECT * FROM variants WHERE id = ?`, [variantId], (err, row) => {
        if (err) {
            console.error('Error fetching variant:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (row) {
                res.json(row);
            } else {
                res.status(404).json({ error: 'Variant not found' });
            }
        }
    });
});


// Delete a specific variant
router.delete('/variants/:variantId', (req, res) => {
    const { variantId } = req.params;

    db.run(`DELETE FROM variants WHERE id = ?`, [variantId], function (err) {
        if (err) {
            console.error('Error deleting variant:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ message: `Variant with ID ${variantId} deleted successfully` });
        }
    });
});

module.exports = router;
