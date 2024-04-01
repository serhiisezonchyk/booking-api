import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodType, ZodTypeDef } from 'zod';

type SchemaType<T extends ZodTypeDef = ZodTypeDef> = ZodType<any, T>;

export function validateData(schema: SchemaType) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body.data);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          path: issue.path[0],
          message: issue.message,
        }));
        res.status(401).json({ error: 'Invalid data', details: errorMessages });
      } else {
        res.status(501).json({ error: 'Internal Server Error' });
      }
    }
  };
}
