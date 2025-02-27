const Task = require('../models/taskModel');
const logger = require('../utils/logger');

class TaskFactory {
  /**
   * Creates a new Task instance.
   * @param {Object} taskData - The task details (title, priority, dueDate).
   * @returns {Object} Task instance.
   */
  static createTask(taskData) {
    const { title, priority = 'medium', dueDate = null } = taskData;

    const newTask = new Task({
      title,
      priority: priority.toLowerCase(), // ✅ Lowercase conversion only happens once here
      dueDate
    });

    logger.info("🛠️ Task instance created using Factory", newTask);
    return newTask;
  }
}

module.exports = TaskFactory;
