import { mkdir } from 'fs';
import pino from 'pino';

const transport = pino.transport({
  target: 'pino/file',
  options: {
    destination: './src/logs/output.log',
    mkdir: true
  }
})

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: () => {
    const now = new Date();
    const formattedTime = new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, 
      timeZone: "Asia/Kolkata", 
    }).format(now);

    return `,"time":"${formattedTime}"`;
  },
}, transport)

process.on('uncaughtException', (err) => {
    logger.fatal(`Uncaught Exception: ${err.message}`);
    logger.fatal(err.stack || 'No stack trace available');
  });
  
process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
  });

export default logger;