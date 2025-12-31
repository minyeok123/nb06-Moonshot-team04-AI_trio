import express from 'express';
import { PORT } from './libs/constants';
import cors from 'cors';
import authRouter from './modules/auth/auth.router';
import userRouter from './modules/user/user.router';
import projectRouter from './modules/project/project.router';
import { defaultNotFoundHandler, globalErrorHandler } from './middlewares/errorHandler';
import memberRouter from './modules/member/member.router';
import invitationRouter from './modules/invitation/invitation.router';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/projects', memberRouter);
app.use('/projects', projectRouter);
app.use('/invitations', invitationRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => console.log('Server Running'));
