import express from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import 'tsconfig-paths/register';
import { FRONTEND_URL, PORT, SESSION_SECRET } from './libs/constants';

import { defaultNotFoundHandler, globalErrorHandler } from './middlewares/errorHandler';
import authRouter from './modules/auth/auth.router';
import userRouter from './modules/user/user.router';
import projectRouter from './modules/project/project.router';
import memberRouter from './modules/member/member.router';
import invitationRouter from './modules/invitation/invitation.router';
import subtaskRouter from './modules/subtask/subtask.router';
import subtasksRouter from './modules/subtask/subtasks.router';
import commentRouter from './modules/comment/comment.router';
import fileRouter from './modules/file/file.router';
import taskRouter from './modules/task/task.router';

const app = express();

// Swagger 설정
const isProd = process.env.NODE_ENV === 'production';
const options = {
  definition: {
    openapi: '3.0.0', // 표준 문법 사용 선언
    info: {
      // custom 가능 영역, 프로젝트의 정보를 작성
      title: 'Team4 Moonshot Project API Docs',
      version: '1.0.0',
      description: '코드잇 노드6기 Team4 [Moonshot Project] API 문서화 내용입니다',
    },
    servers: [{ url: 'http://localhost:3005' }], // baseURL 설정
  },
  apis: isProd ? ['./dist/modules/**/*.router.js'] : ['./src/modules/**/*.router.ts'], // Swagger 주석 읽을 위치
};

const specs = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(
  cors({
    origin: FRONTEND_URL!,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());

app.use(
  session({
    secret: SESSION_SECRET! || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    },
  }),
);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/files', fileRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/projects', memberRouter);
app.use('/projects', projectRouter);
app.use('/invitations', invitationRouter);
app.use('/tasks', taskRouter);
app.use('/tasks', subtaskRouter);
app.use('/tasks', commentRouter);
app.use('/subtasks', subtasksRouter);
app.use('/comments', commentRouter);
app.use('/projects', taskRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => console.log('Server Running'));
