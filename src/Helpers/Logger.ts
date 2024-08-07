import dotenv from 'dotenv';
import winston from 'winston';
import { SyslogTransport } from '../Transports/SyslogTransport';

dotenv.config();

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'warn';
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const transports = [
  // new winston.transports.Console(),
  new SyslogTransport({
    name: process.env.APP_NAME || 'express-api-service',
    host: process.env.LOGGER_HOST || 'localhost',
    post: process.env.LOGGER_PORT || 514,
    level: 'debug'
  })
];

const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports
});

export default Logger;
