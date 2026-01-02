import express from 'express';
import { PORT } from './libs/constants';
import cors from 'cors';
import authRouter from './modules/auth/auth.router';
import userRouter from './modules/user/user.router';
import projectRouter from './modules/project/project.router';
import { defaultNotFoundHandler, globalErrorHandler } from './middlewares/errorHandler';
import memberRouter from './modules/member/member.router';
import invitationRouter from './modules/invitation/invitation.router';
import subtaskRouter from './modules/subtask/subtask.router';
import subtasksRouter from './modules/subtask/subtasks.router';
import fileRouter from './modules/file/file.router';
import commentRouter from './modules/comment/comment.router';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/files', fileRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/projects', memberRouter);
app.use('/projects', projectRouter);
app.use('/invitations', invitationRouter);
app.use('/tasks', subtaskRouter);
app.use('/tasks', commentRouter);
app.use('/subtasks', subtasksRouter);
app.use('/comments', commentRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => console.log('Server Running'));
