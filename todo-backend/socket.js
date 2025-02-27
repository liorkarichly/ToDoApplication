// socket.js
let io;

/**
 * Initializes and returns a Socket.IO instance.
 * @param {object} server - The HTTP server.
 * @returns {object} The Socket.IO server instance.
 */
module.exports = {
  init: (server) => {
    const socketIo = require('socket.io');
    io = socketIo(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        transports: ["websocket"]
      }
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Listening for a task created event from the client
      socket.on('taskCreated', (task) => {
        console.log('New Task Created (from client):', task);
        
        // Broadcasting to all clients
        io.emit('taskCreated', task);
      });

    // Listen for task lock
    socket.on('taskLocked', (task) => {
        console.log('Task locked:', task);
    });
  
    // Listen for task unlock
    socket.on('taskUnlocked', (task) => {
        console.log('Task unlocked:', task);
    });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    return io;
  },

  /**
   * Retrieves the existing Socket.IO instance.
   * @returns {object} The Socket.IO server instance.
   */
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
