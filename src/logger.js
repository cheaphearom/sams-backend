const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => {
      const { timestamp, level, message, ...meta } = info;

      // Handle object messages like logger.info(req.body)
      const msg =
        typeof message === 'object'
          ? JSON.stringify(message, null, 2)
          : message;

      // Handle meta data like logger.info('msg', { body: req.body })
      const metaStr =
        Object.keys(meta).length > 0
          ? `\nMETA: ${JSON.stringify(meta, null, 2)}`
          : '';

      return `${timestamp} [${level.toUpperCase()}]: ${msg}${metaStr}`;
    })
  ),
  transports: [
    new transports.Console(),
    // Vercel's filesystem is read-only, it collects console output instead
    ...(process.env.VERCEL
      ? []
      : [
          new DailyRotateFile({
            filename: 'logs/%DATE%-app.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d'
          })
        ])
  ]
});

module.exports = logger;
