const express = require('express');
const router = express.Router();
const {
  getTodos,
  getTodoStats,
  getTodo,
  createTodo,
  updateTodo,
  toggleStatus,
  deleteTodo,
} = require('../controllers/todoController');

router.get('/stats', getTodoStats);
router.route('/').get(getTodos).post(createTodo);
router.route('/:id').get(getTodo).put(updateTodo).delete(deleteTodo);
router.patch('/:id/status', toggleStatus);

module.exports = router;
