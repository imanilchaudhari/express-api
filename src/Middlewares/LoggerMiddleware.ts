import { NextFunction, Request, Response } from 'express';
import Logger from '../Helpers/Logger';

const LoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  global._requestId = (new Date).getTime();
  const start = process.hrtime();
  res.on('finish', () => {
    const elapsedTime = process.hrtime(start);
    const responseTime = Math.round(elapsedTime[0] * 1000 + elapsedTime[1] / 1e6);
    Logger.info(JSON.stringify({
      'clientIP': req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      'status': res.statusCode,
      'method': req.method,
      'url': req.url,
      'payload': (req.body),
      'responseTime': responseTime + 'ms'
    }));
  });
  next();
};

export default LoggerMiddleware;
