import { NextFunction, Request, Response } from 'express';
import { AuthRepo } from './auth.repo';
import { AuthService } from './auth.service';
import { generateState } from './utils/state';
import { FRONTEND_URL } from '../../libs/constants';
import { toRelativeUploadPath } from '../../libs/uploadPath';

export class AuthController {
  static register = async (req: Request, res: Response, next: NextFunction) => {
    const profileImgUrl = toRelativeUploadPath(req.body.profileImage);
    const data = { ...req.body, profileImgUrl };
    const userWithoutPassword = await authService.register(data);
    res.status(201).json(userWithoutPassword);
  };

  static login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await authService.login(email, password);
    res.status(200).json({ accessToken, refreshToken });
  };

  static refresh = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.refresh!.id;
    const token = await authService.refresh(userId);
    res.status(200).json(token);
  };

  static googleLogin = async (req: Request, res: Response) => {
    const createState = generateState(16);
    req.session.oauthState = createState;
    const googleRedirectUrl = await authService.googleLogin(createState);
    res.status(302).redirect(googleRedirectUrl);
  };

  static googleCallback = async (req: Request, res: Response) => {
    const { code } = req.query;
    const { accessToken, refreshToken } = (await authService.googleLoginByGoogleInfo(
      String(code),
    )) as { accessToken: string; refreshToken: string };

    res.cookie('access-token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(302).redirect(FRONTEND_URL!);
  };
}

const authRepo = new AuthRepo();
const authService = new AuthService(authRepo);
