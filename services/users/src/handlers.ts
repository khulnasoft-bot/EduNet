import { Request, Response } from 'express';
import { userSchema } from '@edunet/validation';
import bcrypt from 'bcryptjs';
import {
  findUserById,
  listUsersByOrganization,
  updateUser,
  updateUserPassword,
  verifyUser,
  deleteUser,
} from './db';

export async function getUserHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await findUserById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { passwordHash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function listUsersHandler(req: Request, res: Response) {
  try {
    const { organizationId } = req.query;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    
    let users;
    if (organizationId && typeof organizationId === 'string') {
      users = await listUsersByOrganization(organizationId, limit, offset);
    } else {
      return res.status(400).json({ error: 'organizationId is required' });
    }
    
    const usersWithoutPasswords = users.map(({ passwordHash, ...user }) => user);
    res.json(usersWithoutPasswords);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateUserHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = userSchema.partial().parse(req.body);
    
    const existing = await findUserById(id);
    if (!existing) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = await updateUser(id, data);
    const { passwordHash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updatePasswordHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'oldPassword and newPassword are required' });
    }
    
    const existing = await findUserById(id);
    if (!existing) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValid = await bcrypt.compare(oldPassword, existing.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid current password' });
    }

    const user = await updateUserPassword(id, newPassword);
    const { passwordHash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function verifyUserHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const existing = await findUserById(id);
    if (!existing) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = await verifyUser(id);
    const { passwordHash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteUserHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const existing = await findUserById(id);
    if (!existing) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = await deleteUser(id);
    const { passwordHash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
