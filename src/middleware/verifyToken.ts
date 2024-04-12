import { NextFunction, Request, Response } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { JwtType } from '../controllers/auth.controller';

declare global {
  namespace Express {
    interface Request {
      user?: JwtType;
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Not Authenticated' });
  jwt.verify(token, process.env.SECRET_KEY, async (error: VerifyErrors | any, decoded: any) => {
    const decodedValue: JwtType = decoded;
    if (error) return res.status(403).json({ error: 'Not Authenticated' });
    req.user = decodedValue;
    next();
  });
};
