import z, { ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../libs/error';

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

export function tokenValidate() {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const parsed = tokenSchema.parse({ authorization: authHeader });

      next();
    } catch {
      next(new CustomError(400, '잘못된 토큰 형식'));
    }
  };
}

export const tokenSchema = z.object({
  authorization: z.string().startsWith('Bearer '),
});
