import { Router } from 'express';
import jwt from 'jsonwebtoken';
import {
  createAssignmentHandler,
  getAssignmentHandler,
  listAssignmentsHandler,
  updateAssignmentHandler,
  deleteAssignmentHandler,
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

  router.post('/', authenticate, authorize('teacher', 'admin'), createAssignmentHandler);
  router.get('/', authenticate, listAssignmentsHandler);
  router.get('/:id', authenticate, getAssignmentHandler);
  router.put('/:id', authenticate, authorize('teacher', 'admin'), updateAssignmentHandler);
  router.delete('/:id', authenticate, authorize('teacher', 'admin'), deleteAssignmentHandler);

  app.use('/api/assignments', router);
}
