export interface Task {
  _id?: string;        // The ID (from DB)
  title: string;       // Task text
  isCompleted: boolean;
  isEditing: boolean;  // Flag: is someone currently editing
  lockedBy?: string;   // The user ID that locked this task for editing
  priority: 'High' | 'Medium' | 'Low'; // Task priority
  dueDate?: Date;       // Due date for the task
}
