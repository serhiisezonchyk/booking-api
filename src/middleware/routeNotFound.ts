import { NextFunction, Request, Response } from 'express';

export function routeNotFound(req: Request, res: Response, next: NextFunction) {
  const error = new Error('Route not found');
  logger.error(error);
  return res.status(404).json({ error: error.message });
}
