/**
 * controllers/tasksController.js
 * This file handles the logic for CRUD operations on Tasks,
 * including the edit-lock mechanism (one client at a time).
 */

const TaskRepository = require('../repositories/taskRepository');
const { getIO } = require('../socket');
const logger = require('../utils/logger');

/**
 * getAllTasks
 * Fetches all tasks from the database.
 * @returns {Array} Array of Task objects.
 */
async function getAllTasks(req, res) {
  try {
    const tasks = await TaskRepository.getAll();
    logger.info("Fetched all tasks");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error });
  }
}

/**
 * createTask
 * Creates a new task in the database.
 * @param {string} title - The title of the task.
 * @returns {Object} The created Task object.
 */
async function createTask(req, res) {
  try {
    
    const { title, priority, dueDate } = req.body;

    const newTask = await TaskRepository.create({ title, priority, dueDate });

    // Emit an event to all connected clients
    getIO().emit('taskCreated', newTask);
    logger.info("Task created", newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("❌ Failed to create task:", error);
    res.status(500).json({ message: 'Failed to create task', error });
  }
}

/**
 * updateTask
 * Updates an existing task's fields (e.g., title, isCompleted).
 * Also checks if the task is locked for editing by someone else.
 * @param {string} id - Task ID.
 * @param {Object} fieldsToUpdate - Fields to update on the task.
 * @param {string} [clientId] - ID of the client requesting the edit (optional).
 * @returns {Object} The updated Task object.
 */
async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { title, isCompleted, priority, dueDate } = req.body;
    const userId = req.userId; // from authMiddleware

    // Check if the task exists
    const task = await TaskRepository.getById(id);
    if (!task) {
      logger.warn("Task not found for update", { id });
      return res.status(404).json({ message: 'Task not found' });
    }

    // If locked and locked by someone else
    if (task.isBeingEdited && task.editingUserId !== userId) {
      logger.warn("Task is locked for editing by another user", { id });
      return res.status(403).json({ message: 'Task is locked for editing by another user' });
    }

    if (priority) {
      priority = priority.toLowerCase();
    }

    const updatedTask = await TaskRepository.update(id, { title, isCompleted, priority, dueDate });


    // Emit an event about the updated task
    getIO().emit('taskUpdated', updatedTask);
    logger.info("Task updated", updatedTask);
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error });
  }
}

/**
 * deleteTask
 * Deletes a task from the database.
 * Checks if the task is locked for editing by someone else.
 * @param {string} id - Task ID to delete.
 */
async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const task = await TaskRepository.getById(id);
    if (!task) {
      logger.warn('Task not found for deletion', { id });
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.isBeingEdited && task.editingUserId !== userId) {
      return res.status(403).json({ message: 'Task is locked for editing by another user' });
    }

    await TaskRepository.delete(id);

    // Emit an event about the deleted task ID
    getIO().emit('taskDeleted', { _id: id });
    logger.info('Task deleted', { id });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    logger.error('Failed to release task lock', { error });
    res.status(500).json({ message: 'Failed to delete task', error });
  }
}

/**
 * lockTaskForEdit
 * Locks a task for editing by a specific client.
 * @param {string} id - Task ID.
 */
async function lockTaskForEdit(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const task = await TaskRepository.getById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // If it's already locked by another client
    if (task.isBeingEdited && task.editingUserId !== userId) {
      return res.status(403).json({ message: 'Task is already locked by another user' });
    }

    const lockedTask = await TaskRepository.update(id, { isBeingEdited: true, editingUserId: userId });

    res.status(200).json(lockedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to lock task', error });
  }
}

/**
 * releaseTaskFromEdit
 * Releases the edit lock on a task.
 * @param {string} id - Task ID.
 */
async function releaseTaskFromEdit(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const task = await TaskRepository.getById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Only the same client can release the lock
    if (task.editingUserId !== userId) {
      return res.status(403).json({ message: 'Only the editing client can release the lock' });
    }

    const unlockedTask = await TaskRepository.update(id, { isBeingEdited: false, editingUserId: null });

    // Emit event
    getIO().emit('taskUnlocked', unlockedTask);

    res.status(200).json(unlockedTask);
  } catch (error) {
    logger.error('Failed to release task lock', { error });
    res.status(500).json({ message: 'Failed to release task lock', error });
  }
}

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  lockTaskForEdit,
  releaseTaskFromEdit
};
