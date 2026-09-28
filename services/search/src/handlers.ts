import { Request, Response } from 'express';
import {
  searchCourses,
  searchUsers,
  searchAssignments,
  searchOrganizations,
  globalSearch,
} from './db';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    organizationId?: string;
  };
}

// Search handlers
export async function searchHandler(req: AuthRequest, res: Response) {
  try {
    const { q, type, organizationId } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query (q) is required' });
    }

    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    const orgId = organizationId as string || req.user?.organizationId;

    let results;
    switch (type) {
      case 'courses':
        results = await searchCourses(q, orgId, limit, offset);
        break;
      case 'users':
        results = await searchUsers(q, orgId, req.query.role as string, limit, offset);
        break;
      case 'assignments':
        results = await searchAssignments(q, orgId, limit, offset);
        break;
      case 'organizations':
        results = await searchOrganizations(q, limit, offset);
        break;
      case 'all':
      default:
        results = await globalSearch(q, orgId, limit);
        break;
    }
    
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
