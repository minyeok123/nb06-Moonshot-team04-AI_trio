import { ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';

export function validate(schema: ZodType, source: 'body' | 'params' | 'query' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[source]);
      if (source === 'query') {
        req.validatedQuery = parsed;
      } else {
        Object.assign(req[source], parsed);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

/*
validate(createProject,body)
*/
