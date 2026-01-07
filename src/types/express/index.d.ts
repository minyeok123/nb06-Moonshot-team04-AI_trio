import { UserInfo } from '../user';

declare global {
  namespace Express {
    interface Request {
      userId: number;
      user: UserInfo;
      refresh?: {
        id: number;
      };
      validatedQuery?: string | number | unknown;
    }
  }
}
