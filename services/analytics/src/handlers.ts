import { Request, Response } from 'express';
import {
  getCourseAnalytics,
  getStudentPerformance,
  getAssignmentPerformance,
  getCourseEngagement,
} from './db';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    organizationId?: string;
  };
}

// Course Analytics handlers
export async function getCourseAnalyticsHandler(req: AuthRequest, res: Response) {
  try {
    const { courseId } = req.params;
    
    if (!courseId) {
      return res.status(400).json({ error: 'courseId is required' });
    }

    if (req.user?.role !== 'teacher' && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Only teachers and admins can view course analytics' });
    }
    
    const analytics = await getCourseAnalytics(courseId);
    res.json(analytics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getStudentPerformanceHandler(req: AuthRequest, res: Response) {
  try {
    const { courseId } = req.params;
    
    if (!courseId) {
      return res.status(400).json({ error: 'courseId is required' });
    }

    if (req.user?.role !== 'teacher' && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Only teachers and admins can view student performance' });
    }
    
    const performance = await getStudentPerformance(courseId);
    res.json(performance);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getAssignmentPerformanceHandler(req: AuthRequest, res: Response) {
  try {
    const { courseId } = req.params;
    
    if (!courseId) {
      return res.status(400).json({ error: 'courseId is required' });
    }

    if (req.user?.role !== 'teacher' && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Only teachers and admins can view assignment performance' });
    }
    
    const performance = await getAssignmentPerformance(courseId);
    res.json(performance);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getCourseEngagementHandler(req: AuthRequest, res: Response) {
  try {
    const { courseId } = req.params;
    const days = parseInt(req.query.days as string) || 30;
    
    if (!courseId) {
      return res.status(400).json({ error: 'courseId is required' });
    }

    if (req.user?.role !== 'teacher' && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Only teachers and admins can view course engagement' });
    }
    
    const engagement = await getCourseEngagement(courseId, days);
    res.json(engagement);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
