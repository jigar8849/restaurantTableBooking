const mongoose = require('mongoose');

const tableSchema = mongoose.Schema(
    {
        tableNumber: {
            type: Number,
            required: true,
            unique: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
        location: {
            type: String, // e.g., 'Indoor', 'Outdoor', 'Window'
            required: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
