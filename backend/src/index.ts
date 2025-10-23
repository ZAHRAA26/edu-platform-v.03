import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { config, validateConfig } from './config/environment';
import connectDB from './config/db';
import logger from './config/logger';
import register from './config/metrics';

// Validate configuration
validateConfig();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = config.server.port;

// Middlewares
app.use(cors({
  origin: config.server.corsOrigin,
  credentials: true,
}));
app.use(helmet());
app.use(morgan(config.logging.format));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Auth0 JWT Middleware - will be applied to protected routes individually

// Health check routes
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', message: 'Backend server is running.' });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', message: 'Backend server is running.' });
});

// Prometheus metrics endpoint
app.get('/metrics', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
});

import authRouter from './api/routes/auth.route';
import userRouter from './api/routes/user.route';
import courseRouter from './api/routes/course.route';
import lessonRouter from './api/routes/lesson.route';
import enrollmentRouter from './api/routes/enrollment.route';
import ratingRouter from './api/routes/rating.route';
import uploadRouter from './api/routes/upload.route';

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/courses', courseRouter);
app.use('/api/lessons', lessonRouter);
app.use('/api/enrollments', enrollmentRouter);
app.use('/api/ratings', ratingRouter);
app.use('/api/upload', uploadRouter);

// Sentry error handler must be before any other error middleware and after all controllers
// app.use(SentryErrorMiddleware);

// The default error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message, err);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
