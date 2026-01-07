import z, { ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../libs/error';

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

export function tokenValidate() {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenSchema = z.object({
        authorization: z.string().startsWith('Bearer'),
      });
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new CustomError(401, '로그인이 필요합니다');
      const validatedToken = tokenSchema.parse({ authorization: authHeader });
      if (!validatedToken) throw new CustomError(400, '잘못된 토큰 형식');
      next();
    } catch (e) {
      next(e);
    }
  };
}
