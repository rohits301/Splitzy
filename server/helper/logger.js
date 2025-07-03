const { createLogger, transports, format } = require('winston');
const path = require('path');

// This format is much more robust for logging errors.
// It combines several of Winston's powerful formatters.
const customFormat = format.combine(
  // Add a timestamp to each log entry
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  
  // This is crucial. It tells Winston to treat error objects specially
  // and ensure their stack traces are included in the log output.
  format.errors({ stack: true }),
  
  // This allows you to pass arguments to your logger like logger.info('User %s logged in', username)
  format.splat(),

  // The custom printf function to define the final log format
  format.printf(({ level, message, timestamp, stack }) => {
    // If the log entry includes a stack trace (i.e., it's an error),
    // format it to include the stack. Otherwise, just log the message.
    if (stack) {
      return `${timestamp} | ${level.toUpperCase().padEnd(7)} | ${message}\n${stack}`;
    }
    return `${timestamp} | ${level.toUpperCase().padEnd(7)} | ${message}`;
  })
);

const logger = createLogger({
  format: customFormat,
  transports: [
    // Log 'info' level and above to app.log
    new transports.File({ filename: './logs/app.log', level: 'info' }),
    // Log 'error' level and above to error.log
    new transports.File({ filename: './logs/error.log', level: 'error' }),
    // Log 'debug' level and above to the console for development
    // new transports.Console({ level: 'debug' })
  ]
});

// We no longer need the complex `withCaller()` function.
// The logger is now ready to be used directly.
module.exports = logger;