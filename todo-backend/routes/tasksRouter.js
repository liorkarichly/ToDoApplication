/**
 * routes/tasksRouter.js
 * This file defines the routes for tasks CRUD operations.
 */

const express = require('express');
const { checkAuth } = require('../middlewares/authMiddleware');
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  lockTaskForEdit,
  releaseTaskFromEdit
} = require('../controllers/tasksController');

const router = express.Router();

// GET all tasks
router.get('/',checkAuth, getAllTasks);

// POST create a new task
router.post('/',checkAuth, createTask);

// PUT update a specific task
router.put('/:id',checkAuth, updateTask);

// DELETE a specific task
router.delete('/:id',checkAuth, deleteTask);

// PUT lock a task for editing
router.put('/:id/lock',checkAuth, lockTaskForEdit);

// PUT release a task from editing
router.put('/:id/release',checkAuth, releaseTaskFromEdit);

module.exports = router;
