const Table = require('../models/Table');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Public
const getTables = async (req, res) => {
    try {
        const tables = await Table.find({});
        res.json(tables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get table by ID
// @route   GET /api/tables/:id
// @access  Public
const getTableById = async (req, res) => {
    try {
        const table = await Table.findById(req.params.id);
        if (table) {
            res.json(table);
        } else {
            res.status(404).json({ message: 'Table not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a table
// @route   POST /api/tables
// @access  Private/Admin
const createTable = async (req, res) => {
    const { tableNumber, capacity, location } = req.body;

    try {
        const tableExists = await Table.findOne({ tableNumber });

        if (tableExists) {
            return res.status(400).json({ message: 'Table already exists' });
        }

        const table = await Table.create({
            tableNumber,
            capacity,
            location,
        });

        res.status(201).json(table);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a table
// @route   PUT /api/tables/:id
// @access  Private/Admin
const updateTable = async (req, res) => {
    try {
        const table = await Table.findById(req.params.id);

        if (table) {
            table.tableNumber = req.body.tableNumber || table.tableNumber;
            table.capacity = req.body.capacity || table.capacity;
            table.location = req.body.location || table.location;
            table.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : table.isAvailable;

            const updatedTable = await table.save();
            res.json(updatedTable);
        } else {
            res.status(404).json({ message: 'Table not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a table
// @route   DELETE /api/tables/:id
// @access  Private/Admin
const deleteTable = async (req, res) => {
    try {
        const table = await Table.findById(req.params.id);

        if (table) {
            await table.deleteOne();
            res.json({ message: 'Table removed' });
        } else {
            res.status(404).json({ message: 'Table not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTables, getTableById, createTable, updateTable, deleteTable };
