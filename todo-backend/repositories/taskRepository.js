// repositories/taskRepository.js
const Task = require('../models/taskModel');
const TaskFactory = require('../factories/taskFactory');
const logger = require('../utils/logger');

class TaskRepository {
  /**
   * Retrieve all tasks from the database.
   * @returns {Array} List of all tasks sorted by due date and priority.
   */
  async getAll() {
    try {
      const tasks = await Task.find().sort({ dueDate: 1, priority: -1 });
      logger.info("✅ Retrieved all tasks", { count: tasks.length });
      return tasks;
    } catch (error) {
      logger.error("❌ Error retrieving tasks", { error });
      throw error;
    }
  }

  /**
   * Retrieve a specific task by its ID.
   * @param {string} id - Task ID.
   * @returns {Object} Task object or null.
   */
  async getById(id) {
    try {
      const task = await Task.findById(id);
      if (!task) {logger.warn(`⚠️ Task not found (ID: ${id})`);}
      logger.info("✅ Task: ", task);
      return task;
    } catch (error) {
      logger.error(`❌ Error retrieving task (ID: ${id})`, { error });
      throw error;
    }
  }

  /**
   * Create a new task using the Factory Pattern.
   * @param {Object} taskData - Task details (title, priority, dueDate).
   * @returns {Object} Created Task object.
   */
  async create(taskData) {
    try {
      const newTask = TaskFactory.createTask(taskData);
      const savedTask = await newTask.save();
      logger.info("✅ Task created", savedTask);
      return savedTask;
    } catch (error) {
      logger.error("❌ Error creating task", { error });
      throw error;
    }
  }

  /**
   * Update an existing task.
   * @param {string} id - Task ID.
   * @param {Object} updateData - Fields to update.
   * @returns {Object} Updated Task object.
   */
  async update(id, updateData) {
    try {
      const task = await Task.findById(id);
      if (!task) {
          logger.warn(`⚠️ Task not found before updating (ID: ${id})`);
          return null;
      }

      const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });

      if (!updatedTask) {
          logger.warn(`⚠️ Task not found for update (ID: ${id})`);
      } else {
          logger.info("🔄 Task updated", updatedTask);
      }

      return updatedTask;
  } catch (error) {
      logger.error(`❌ Error updating task (ID: ${id})`, { error });
      throw error;
  }
  }

  /**
   * Delete a task by its ID.
   * @param {string} id - Task ID.
   * @returns {Object} Deleted Task object or null.
   */
  async delete(id) {
    try {
      const deletedTask = await Task.findByIdAndDelete(id);
      if (!deletedTask) logger.warn(`⚠️ Task not found for deletion (ID: ${id})`);
      else logger.info("🗑️ Task deleted", { id });
      return deletedTask;
    } catch (error) {
      logger.error(`❌ Error deleting task (ID: ${id})`, { error });
      throw error;
    }
  }
}

module.exports = new TaskRepository();
