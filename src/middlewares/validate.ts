import { ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';

export function validate(schema: ZodType, source: 'body' | 'params' | 'query' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed; // 🔥 변환된 값으로 교체
      next();
    } catch (err) {
      next(err);
    }
  };
}

/*
validate(createProject,body)
*/
