import express from 'express';
import { PORT } from './libs/constants';
import cors from 'cors';
import authRouter from './modules/auth/auth.router';
import userRouter from './modules/user/user.router';
import { defaultNotFoundHandler, globalErrorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/user', userRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => console.log('Server Running'));
