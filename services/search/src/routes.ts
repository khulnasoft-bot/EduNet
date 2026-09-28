import { Router } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { searchHandler } from './handlers';

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
      id: payload.userId as string,
      role: payload.role as string,
      organizationId: payload.organizationId as string,
    };
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function registerRoutes(app: any) {
  const router = Router();

  // Search routes
  router.get('/', authenticate, searchHandler);

  app.use('/api/search', router);
}
