/**
 * models/taskModel.js
 * Mongoose model for a Task in the To-Do application.
 */
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }, // Task priority
    dueDate: { type: Date, required: false }, // Optional due date
    // Lock fields
    isBeingEdited: { type: Boolean, default: false },
    editingUserId: { type: String, default: null } 
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);
