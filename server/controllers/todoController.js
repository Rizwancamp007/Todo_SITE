const Todo = require('../models/Todo');

// @desc    Get all todos with filtering, sorting, searching
// @route   GET /api/todos
const getTodos = async (req, res, next) => {
  try {
    const { status, priority, category, search, sort, order } = req.query;

    // Build query object
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;
    if (category && category !== 'all') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Sort options
    const sortField = sort || 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sortField]: sortOrder };

    const todos = await Todo.find(query)
      .populate('category', 'name color icon')
      .sort(sortObj);

    res.json({ success: true, count: todos.length, data: todos });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/todos/stats
const getTodoStats = async (req, res, next) => {
  try {
    const now = new Date();

    const [total, completed, inProgress, pending, overdue, highPriority] = await Promise.all([
      Todo.countDocuments(),
      Todo.countDocuments({ status: 'completed' }),
      Todo.countDocuments({ status: 'in-progress' }),
      Todo.countDocuments({ status: 'pending' }),
      Todo.countDocuments({ deadline: { $lt: now }, status: { $ne: 'completed' } }),
      Todo.countDocuments({ priority: 'high', status: { $ne: 'completed' } }),
    ]);

    // Upcoming deadlines (next 7 days, not completed)
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcoming = await Todo.find({
      deadline: { $gte: now, $lte: nextWeek },
      status: { $ne: 'completed' },
    })
      .populate('category', 'name color icon')
      .sort({ deadline: 1 })
      .limit(5);

    // Recent todos
    const recent = await Todo.find()
      .populate('category', 'name color icon')
      .sort({ updatedAt: -1 })
      .limit(5);

    // Priority breakdown
    const priorityBreakdown = await Todo.aggregate([
      { $match: { status: { $ne: 'completed' } } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        total,
        completed,
        inProgress,
        pending,
        overdue,
        highPriority,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        upcoming,
        recent,
        priorityBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single todo
// @route   GET /api/todos/:id
const getTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id).populate('category', 'name color icon');
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a todo
// @route   POST /api/todos
const createTodo = async (req, res, next) => {
  try {
    const { title, description, priority, category, deadline, tags } = req.body;
    const todo = await Todo.create({ title, description, priority, category, deadline, tags });
    const populated = await todo.populate('category', 'name color icon');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
const updateTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name color icon');

    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle todo status
// @route   PATCH /api/todos/:id/status
const toggleStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('category', 'name color icon');

    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.json({ success: true, message: 'Todo deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTodos, getTodoStats, getTodo, createTodo, updateTodo, toggleStatus, deleteTodo };
