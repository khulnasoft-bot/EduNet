import { Request, Response } from 'express';
import {
  findParentChildRelationshipById,
  findParentChildRelationship,
  listChildrenByParent,
  listParentsByChild,
  createParentChildRelationship,
  updateParentChildRelationship,
  deleteParentChildRelationship,
  getChildEnrollments,
  getChildSubmissions,
} from './db';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    organizationId?: string;
  };
}

// Parent-Child Relationship handlers
export async function createParentChildRelationshipHandler(req: AuthRequest, res: Response) {
  try {
    const { parentId, childId, relationship } = req.body;
    
    if (!parentId || !childId || !relationship) {
      return res.status(400).json({ error: 'parentId, childId, and relationship are required' });
    }

    if (req.user?.role === 'parent' && req.user.id !== parentId) {
      return res.status(403).json({ error: 'Parents can only create relationships for themselves' });
    }

    const existing = await findParentChildRelationship(parentId, childId);
    if (existing) {
      return res.status(400).json({ error: 'Relationship already exists' });
    }

    const relationshipData = await createParentChildRelationship({
      parentId,
      childId,
      relationship,
      isPrimary: req.body.isPrimary || false,
      canViewGrades: req.body.canViewGrades !== undefined ? req.body.canViewGrades : true,
      canViewAttendance: req.body.canViewAttendance !== undefined ? req.body.canViewAttendance : true,
      canViewAssignments: req.body.canViewAssignments !== undefined ? req.body.canViewAssignments : true,
    });
    
    res.status(201).json(relationshipData);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getParentChildRelationshipHandler(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const relationship = await findParentChildRelationshipById(id);
    
    if (!relationship) {
      return res.status(404).json({ error: 'Relationship not found' });
    }

    if (req.user?.role === 'parent' && relationship.parentId !== req.user.id) {
      return res.status(403).json({ error: 'You can only view your own relationships' });
    }
    
    res.json(relationship);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function listChildrenHandler(req: AuthRequest, res: Response) {
  try {
    const parentId = req.user?.id;
    
    if (!parentId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (req.user?.role !== 'parent') {
      return res.status(403).json({ error: 'Only parents can view their children' });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const children = await listChildrenByParent(parentId, limit, offset);
    res.json(children);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function listParentsHandler(req: AuthRequest, res: Response) {
  try {
    const { childId } = req.query;
    
    if (!childId || typeof childId !== 'string') {
      return res.status(400).json({ error: 'childId is required' });
    }

    if (req.user?.role === 'parent' && req.user.id !== childId) {
      return res.status(403).json({ error: 'You can only view parents for your own children' });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const parents = await listParentsByChild(childId, limit, offset);
    res.json(parents);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateParentChildRelationshipHandler(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const existing = await findParentChildRelationshipById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Relationship not found' });
    }

    if (req.user?.role === 'parent' && existing.parentId !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own relationships' });
    }

    const relationship = await updateParentChildRelationship(id, data);
    res.json(relationship);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteParentChildRelationshipHandler(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    
    const existing = await findParentChildRelationshipById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Relationship not found' });
    }

    if (req.user?.role === 'parent' && existing.parentId !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own relationships' });
    }

    const relationship = await deleteParentChildRelationship(id);
    res.json(relationship);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// Child progress handlers for parents
export async function getChildEnrollmentsHandler(req: AuthRequest, res: Response) {
  try {
    const { childId } = req.query;
    
    if (!childId || typeof childId !== 'string') {
      return res.status(400).json({ error: 'childId is required' });
    }

    if (req.user?.role === 'parent') {
      const relationship = await findParentChildRelationship(req.user.id, childId);
      if (!relationship) {
        return res.status(403).json({ error: 'You are not authorized to view this child\'s data' });
      }
    }
    
    const enrollments = await getChildEnrollments(childId);
    res.json(enrollments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getChildSubmissionsHandler(req: AuthRequest, res: Response) {
  try {
    const { childId } = req.query;
    
    if (!childId || typeof childId !== 'string') {
      return res.status(400).json({ error: 'childId is required' });
    }

    if (req.user?.role === 'parent') {
      const relationship = await findParentChildRelationship(req.user.id, childId);
      if (!relationship || !relationship.canViewGrades) {
        return res.status(403).json({ error: 'You are not authorized to view this child\'s grades' });
      }
    }
    
    const submissions = await getChildSubmissions(childId);
    res.json(submissions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
