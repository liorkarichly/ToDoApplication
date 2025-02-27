/**
 * server.js
 * Main entry point for the server.
 * Sets up Express, MongoDB connection, Socket.IO for real-time updates,
 * and routes for the To-Do application.
 */

const express = require('express');
const http = require('http');
const cors = require('cors');
const { connectDB } = require('./config/database');
const tasksRouter = require('./routes/tasksRouter');
const authRouter = require('./routes/authRouter');
const { init: initSocket } = require('./socket'); 


// 1. Create an Express app
const app = express();

// 2. Apply middlewares
app.use(cors());
app.use(express.json());

// 3. Use routes (REST API endpoints)
app.use('/api/auth', authRouter);
app.use('/api/tasks', tasksRouter);

// 4. Create HTTP server and attach Socket.IO
const server = http.createServer(app);

// Initialize WebSocket server
initSocket(server);

// 5. Connect to MongoDB (Change the connection string to your own)
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todo_realtime';

// Connect to the DB and then start the server
connectDB(MONGO_URI).then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
  });
});

/**
 * OPTIONAL:
 * 
 * If you want to broadcast events from within your task controllers 
 * (e.g., after a successful create/update/delete), you can expose 'io'
 * in a separate file or a global object. But if you prefer a simpler approach,
 * you can have the client send a Socket.IO event after each REST call 
 * and handle it right here in the server.js (as shown above).
 */