import { NextFunction, Request, Response } from 'express';

export function loggingHandler(req: Request, res: Response, next: NextFunction) {
  logger.info(`Method: [${req.method}] - url: [${req.url}] - IP:[${req.socket.remoteAddress}]`);
  res.on('finish', () => {
    if ((res.statusCode >= 200 && res.statusCode <= 299) || res.statusCode === 304)
      logger.info(
        `Method: [${req.method}] - url: [${req.url}] - IP:[${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`,
      );
    else
      logger.error(
        `Method: [${req.method}] - url: [${req.url}] - IP:[${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`,
      );
  });
  next();
}
