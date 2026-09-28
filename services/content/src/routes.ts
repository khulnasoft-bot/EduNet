import { Router } from 'express';
import jwt from 'jsonwebtoken';
import {
  createLessonHandler,
  getLessonHandler,
  listLessonsHandler,
  updateLessonHandler,
  deleteLessonHandler,
  createLessonProgressHandler,
  getLessonProgressHandler,
  listLessonProgressHandler,
  updateLessonProgressHandler,
  deleteLessonProgressHandler,
  createResourceHandler,
  getResourceHandler,
  listResourcesHandler,
  updateResourceHandler,
  deleteResourceHandler,
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
    const payload = jwt.verify(token, JWT_SECRET);
    
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

  // Lesson routes
  router.post('/lessons', authenticate, authorize('teacher', 'admin'), createLessonHandler);
  router.get('/lessons', authenticate, listLessonsHandler);
  router.get('/lessons/:id', authenticate, getLessonHandler);
  router.put('/lessons/:id', authenticate, authorize('teacher', 'admin'), updateLessonHandler);
  router.delete('/lessons/:id', authenticate, authorize('teacher', 'admin'), deleteLessonHandler);

  // Lesson Progress routes
  router.post('/lesson-progress', authenticate, createLessonProgressHandler);
  router.get('/lesson-progress', authenticate, listLessonProgressHandler);
  router.get('/lesson-progress/:id', authenticate, getLessonProgressHandler);
  router.put('/lesson-progress/:id', authenticate, updateLessonProgressHandler);
  router.delete('/lesson-progress/:id', authenticate, deleteLessonProgressHandler);

  // Resource routes
  router.post('/resources', authenticate, authorize('teacher', 'admin'), createResourceHandler);
  router.get('/resources', authenticate, listResourcesHandler);
  router.get('/resources/:id', authenticate, getResourceHandler);
  router.put('/resources/:id', authenticate, authorize('teacher', 'admin'), updateResourceHandler);
  router.delete('/resources/:id', authenticate, authorize('teacher', 'admin'), deleteResourceHandler);

  app.use('/api/content', router);
}
