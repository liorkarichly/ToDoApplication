// utils/logger.js
class Logger {
    constructor() {
      if (!Logger.instance) {
        Logger.instance = this;
      }
      return Logger.instance;
    }
  
    log(level, message, data = null) {
      const timestamp = new Date().toISOString();
      let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
      if (data) {
        logMessage += ` | Data: ${JSON.stringify(data)}`;
      }
  
      switch (level) {
        case 'info':
          console.log(`\x1b[32m${logMessage}\x1b[0m`); // Green
          break;
        case 'warn':
          console.warn(`\x1b[33m${logMessage}\x1b[0m`); // Yellow
          break;
        case 'error':
          console.error(`\x1b[31m${logMessage}\x1b[0m`); // Red
          break;
        case 'debug':
          console.debug(`\x1b[36m${logMessage}\x1b[0m`); // Cyan
          break;
        default:
          console.log(logMessage);
      }
    }
  
    info(message, data = null) {
      this.log('info', message, data);
    }
  
    warn(message, data = null) {
      this.log('warn', message, data);
    }
  
    error(message, data = null) {
      this.log('error', message, data);
    }
  
    debug(message, data = null) {
      this.log('debug', message, data);
    }
  }
  
  const logger = new Logger();
  module.exports = logger;
  