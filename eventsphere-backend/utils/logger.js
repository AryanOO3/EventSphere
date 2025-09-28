const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = {
  info: (message) => {
    const log = `[${new Date().toISOString()}] INFO: ${typeof message === 'object' ? JSON.stringify(message) : message}\n`;
    console.log(log.trim());
    fs.appendFileSync(path.join(logDir, 'app.log'), log);
  },
  
  error: (message) => {
    const log = `[${new Date().toISOString()}] ERROR: ${typeof message === 'object' ? JSON.stringify(message) : message}\n`;
    console.error(log.trim());
    fs.appendFileSync(path.join(logDir, 'error.log'), log);
  },
  
  warn: (message) => {
    const log = `[${new Date().toISOString()}] WARN: ${typeof message === 'object' ? JSON.stringify(message) : message}\n`;
    console.warn(log.trim());
    fs.appendFileSync(path.join(logDir, 'app.log'), log);
  }
};

module.exports = logger;