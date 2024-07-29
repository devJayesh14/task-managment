const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priorityId: {
      type: Number,
      required: true,
    },
    priorityName: {
      type: String,
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
  }, { timestamps: true });
  
  module.exports = mongoose.model('Task', taskSchema);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
