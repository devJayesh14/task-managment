const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Task = require('../models/Task');
const Category = require('../models/Category');
const { check, validationResult } = require('express-validator');
const SharedTask = require('../models/shared')

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ Status: { code: 1, message: "User already exists" } });
    }

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      (err, token) => {
        if (err) throw err;
        res.json({ id: user.id, token: token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ Status: { code: 2, message: "Invalid Credentials" } });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ Status: { code: 2, message: "Invalid Credentials" } });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      (err, token) => {
        if (err) throw err;
        res.json({ id: user.id, token: token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ Status: { code: 2, message: "Server error" } });
  }
};

exports.prioritiesDDL = async (req, res) => {
  const priorities = [
    { id: 1, name: 'High' },
    { id: 2, name: 'Medium' },
    { id: 3, name: 'Low' }
  ];
  res.json({ data: priorities, Status: { code: 0 } });
};

exports.userDDL = async (req, res) => {
  try {
    let users = await User.find({});
    const userId = req.user.id;

    let filteredUsers = users
      .filter((user) => !user._id.equals(ObjectId.createFromHexString(userId)))
      .map((user) => ({
        name: user.name,
        id: user._id
      }));


    res.json({ data: filteredUsers, Status: { code: 0 } });
  } catch (err) {
    res.status(400).send({ Status: { code: 2, message: 'Something went wrong!' } });
  }
};



exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ data: tasks, Status: { code: 0 } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, priorityId, priorityName, categoryName, categoryId, sharedWith } = req.body;

  const task = new Task({
    title,
    description,
    priorityId,
    categoryId,
    priorityName,
    categoryName,
  });

  try {
    const newTask = await task.save();

    if (sharedWith) {
      const userId = req.user.id;
      const sharedTask = new SharedTask({
        "sharedBy": userId,
        sharedWith,
        taskId: newTask._id
      });
      await sharedTask.save();
    }

    res.status(201).json({ data: newTask, Status: { code: 0 } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task == null) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.body.title != null) {
      task.title = req.body.title;
    }
    if (req.body.description != null) {
      task.description = req.body.description;
    }
    if (req.body.priorityId != null) {
      task.priorityId = req.body.priorityId;
    }
    if (req.body.categoryId != null) {
      task.categoryId = req.body.categoryId;
    }

    const updatedTask = await task.save();

    if (req.body.sharedBy != null && req.body.sharedWith != null) {
      let sharedTask = await SharedTask.findOne({ taskId: task._id });
      if (sharedTask) {
        sharedTask.sharedBy = req.body.sharedBy;
        sharedTask.sharedWith = req.body.sharedWith;
        await sharedTask.save();
      } else {
        sharedTask = new SharedTask({
          sharedBy: req.body.sharedBy,
          sharedWith: req.body.sharedWith,
          taskId: task._id
        });
        await sharedTask.save();
      }
    } else if (req.body.sharedBy === null && req.body.sharedWith === null) {
      await SharedTask.deleteOne({ taskId: task._id });
    }

    res.json({ data: updatedTask, Status: { code: 0 } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    console.log(task);
    if (task == null) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ Status: { code: 0, message: 'Task deleted' } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ data: categories, Status: { code: 0 } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = req.body;

  try {
    let catName = await Category.findOne({ name: name });
    console.log(catName);

    if (catName) {
      return res.status(400).json({ message: "Duplicate Category" });
    }

    const category = new Category({
      name,
    });

    const newCategory = await category.save();
    res.status(201).json({ data: newCategory, Status: { code: 0 } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const category = await Category.findById(req.params.id);
    if (category == null) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (req.body.name != null) {
      category.name = req.body.name;
    }

    const updatedCategory = await category.save();
    res.json({ data: updatedCategory, Status: { code: 0 } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category == null) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.remove();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSharedTasks = async (req, res) => {
  try {

    const userId = req.user.id;;
    const sharedTasks = await SharedTask.find({});
    let temData = sharedTasks.filter(x => x.sharedBy == userId)

    if (sharedTasks.length === 0) {
      return res.status(200).json({ data: [], Status: { code: 0, message: 'No shared tasks found' } });
    }

    const task = temData.filter(st => {
      st.data = Task.find({ _id: { $in: st.taskId } });
    });




    // const taskData = tasks.map(task => ({
    //   _id: task._id,
    //   title: task.title,
    //   description: task.description,
    //   priorityId: task.priorityId,
    //   priorityName: task.priorityName,
    //   categoryName: task.categoryName,
    //   categoryId: task.categoryId,
    //   createdAt: task.createdAt,
    //   updatedAt: task.updatedAt,
    // }));

    // const response = {
    //   data: taskData,
    // };

    res.status(200).json({ data: task, Status: { code: 0 } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};