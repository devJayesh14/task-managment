const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://Jayesh:vu1fIT2tCjrfMzfk@taskmanagement.xljt718.mongodb.net/TaskManagement?retryWrites=true&w=majority");
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
