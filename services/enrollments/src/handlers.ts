import { Request, Response } from 'express';
import {
  findEnrollmentById,
  findEnrollment,
  listEnrollmentsByStudent,
  listEnrollmentsByCourse,
  createEnrollment,
  updateEnrollmentStatus,
  deleteEnrollment,
} from './db';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    organizationId?: string;
  };
}

export async function createEnrollmentHandler(req: AuthRequest, res: Response) {
  try {
    const { studentId, courseId } = req.body;
    
    if (!studentId || !courseId) {
      return res.status(400).json({ error: 'studentId and courseId are required' });
    }

    if (req.user?.role === 'student' && req.user.id !== studentId) {
      return res.status(403).json({ error: 'Students can only enroll themselves' });
    }

    const existing = await findEnrollment(studentId, courseId);
    if (existing) {
      return res.status(409).json({ error: 'Already enrolled in this course' });
    }

    const enrollment = await createEnrollment({ studentId, courseId });
    res.status(201).json(enrollment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getEnrollmentHandler(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const enrollment = await findEnrollmentById(id);
    
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    if (req.user?.role === 'student' && enrollment.studentId !== req.user.id) {
      return res.status(403).json({ error: 'You can only view your own enrollments' });
    }
    
    res.json(enrollment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function listEnrollmentsHandler(req: AuthRequest, res: Response) {
  try {
    const { studentId, courseId } = req.query;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    
    let enrollments;
    if (studentId && typeof studentId === 'string') {
      if (req.user?.role === 'student' && req.user.id !== studentId) {
        return res.status(403).json({ error: 'You can only view your own enrollments' });
      }
      enrollments = await listEnrollmentsByStudent(studentId, limit, offset);
    } else if (courseId && typeof courseId === 'string') {
      enrollments = await listEnrollmentsByCourse(courseId, limit, offset);
    } else {
      return res.status(400).json({ error: 'studentId or courseId is required' });
    }
    
    res.json(enrollments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateEnrollmentHandler(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['active', 'completed', 'dropped'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be active, completed, or dropped' });
    }
    
    const existing = await findEnrollmentById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    const enrollment = await updateEnrollmentStatus(id, status);
    res.json(enrollment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteEnrollmentHandler(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    
    const existing = await findEnrollmentById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    if (req.user?.role === 'student' && existing.studentId !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own enrollments' });
    }

    const enrollment = await deleteEnrollment(id);
    res.json(enrollment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
