import { Request, Response } from 'express';
import {
  findNotificationById,
  listNotificationsByUser,
  listUnreadNotificationsByUser,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  findNotificationPreferencesByUser,
  updateNotificationPreferences,
} from './db';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    organizationId?: string;
  };
}

// Notification handlers
export async function createNotificationHandler(req: AuthRequest, res: Response) {
  try {
    const { userId, type, title, message } = req.body;
    
    if (!userId || !type || !title || !message) {
      return res.status(400).json({ error: 'userId, type, title, and message are required' });
    }

    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create notifications' });
    }

    const notification = await createNotification({
      userId,
      type,
      title,
      message,
      metadata: req.body.metadata,
      actionUrl: req.body.actionUrl,
    });
    
    res.status(201).json(notification);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getNotificationHandler(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const notification = await findNotificationById(id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (req.user?.id !== notification.userId && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'You can only view your own notifications' });
    }
    
    res.json(notification);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function listNotificationsHandler(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const unreadOnly = req.query.unreadOnly === 'true';
    
    let notifications;
    if (unreadOnly) {
      notifications = await listUnreadNotificationsByUser(userId, limit, offset);
    } else {
      notifications = await listNotificationsByUser(userId, limit, offset);
    }
    
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function markAsReadHandler(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    
    const notification = await findNotificationById(id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (req.user?.id !== notification.userId) {
      return res.status(403).json({ error: 'You can only mark your own notifications as read' });
    }

    const updated = await markNotificationAsRead(id);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function markAllAsReadHandler(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const updated = await markAllNotificationsAsRead(userId);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteNotificationHandler(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    
    const notification = await findNotificationById(id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (req.user?.id !== notification.userId) {
      return res.status(403).json({ error: 'You can only delete your own notifications' });
    }

    const deleted = await deleteNotification(id);
    res.json(deleted);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// Notification Preferences handlers
export async function getNotificationPreferencesHandler(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const preferences = await findNotificationPreferencesByUser(userId);
    
    if (!preferences) {
      return res.json({
        userId,
        emailEnabled: true,
        pushEnabled: true,
        assignmentReminders: true,
        gradeNotifications: true,
        enrollmentNotifications: true,
        announcementNotifications: true,
      });
    }
    
    res.json(preferences);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateNotificationPreferencesHandler(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const data = req.body;
    const preferences = await updateNotificationPreferences(userId, data);
    res.json(preferences);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
