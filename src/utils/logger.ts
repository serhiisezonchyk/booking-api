import winston from 'winston';
declare global {
  var logger: winston.Logger;
}

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.cli(),
    winston.format.printf((info: any) => `${info.level}\t[${info.timestamp}]\t${info.message}`),
  ),
  transports: [new winston.transports.Console()],
});

globalThis.logger = logger;
export default logger;
