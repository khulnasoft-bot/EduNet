import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = '7d';
const REFRESH_TOKEN_EXPIRY = '30d';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: any, isRefresh = false): string {
  const expiry = isRefresh ? REFRESH_TOKEN_EXPIRY : JWT_EXPIRY;
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiry });
}

export function verifyToken(token: string, isRefresh = false): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}
