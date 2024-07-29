const mongoose = require('mongoose');

const sharedTaskSchema = new mongoose.Schema({
    sharedBy: {
        type: String,
        required: true,
    },
    sharedWith: {
        type: String,
        required: true,
    },
    taskId: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('SharedTask', sharedTaskSchema);
