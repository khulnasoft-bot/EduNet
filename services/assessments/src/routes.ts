import { Router } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {
  createQuizHandler,
  getQuizHandler,
  listQuizzesHandler,
  updateQuizHandler,
  deleteQuizHandler,
  createQuestionHandler,
  getQuestionHandler,
  listQuestionsHandler,
  updateQuestionHandler,
  deleteQuestionHandler,
  createQuizAttemptHandler,
  getQuizAttemptHandler,
  listQuizAttemptsHandler,
  submitQuizAttemptHandler,
  deleteQuizAttemptHandler,
} from './handlers';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    organizationId?: string;
  };
}

function authenticate(req: AuthRequest, res: any, next: any) {
  try {
    const headers = req.headers as any;
    const authHeader = headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    req.user = {
      id: payload.userId,
      role: payload.role,
      organizationId: payload.organizationId,
    };
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function authorize(...allowedRoles: string[]) {
  return (req: AuthRequest, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

export function registerRoutes(app: any) {
  const router = Router();

  // Quiz routes
  router.post('/quizzes', authenticate, authorize('teacher', 'admin'), createQuizHandler);
  router.get('/quizzes', authenticate, listQuizzesHandler);
  router.get('/quizzes/:id', authenticate, getQuizHandler);
  router.put('/quizzes/:id', authenticate, authorize('teacher', 'admin'), updateQuizHandler);
  router.delete('/quizzes/:id', authenticate, authorize('teacher', 'admin'), deleteQuizHandler);

  // Question routes
  router.post('/questions', authenticate, authorize('teacher', 'admin'), createQuestionHandler);
  router.get('/questions', authenticate, listQuestionsHandler);
  router.get('/questions/:id', authenticate, getQuestionHandler);
  router.put('/questions/:id', authenticate, authorize('teacher', 'admin'), updateQuestionHandler);
  router.delete('/questions/:id', authenticate, authorize('teacher', 'admin'), deleteQuestionHandler);

  // Quiz Attempt routes
  router.post('/quiz-attempts', authenticate, authorize('student'), createQuizAttemptHandler);
  router.get('/quiz-attempts', authenticate, listQuizAttemptsHandler);
  router.get('/quiz-attempts/:id', authenticate, getQuizAttemptHandler);
  router.put('/quiz-attempts/:id/submit', authenticate, authorize('student'), submitQuizAttemptHandler);
  router.delete('/quiz-attempts/:id', authenticate, authorize('student', 'admin'), deleteQuizAttemptHandler);

  app.use('/api/assessments', router);
}
