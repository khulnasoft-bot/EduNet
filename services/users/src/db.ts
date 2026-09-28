import { drizzle } from 'drizzle-orm/postgres';
import { users } from '@edunet/database/schema';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';

let client: postgres.Sql | null = null;
let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!db) {
    const connectionString = process.env.DATABASE_URL || 
      `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    
    client = postgres(connectionString);
    db = drizzle(client);
  }
  return db;
}

export async function findUserById(id: string) {
  const db = getDb();
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0] || null;
}

export async function findUserByEmail(email: string) {
  const db = getDb();
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0] || null;
}

export async function listUsersByOrganization(organizationId: string, limit = 50, offset = 0) {
  const db = getDb();
  return db.select().from(users).where(eq(users.organizationId, organizationId)).limit(limit).offset(offset);
}

export async function updateUser(id: string, data: {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
}) {
  const db = getDb();
  const [user] = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();
  return user;
}

export async function updateUserPassword(id: string, newPassword: string) {
  const db = getDb();
  const passwordHash = await bcrypt.hash(newPassword, 10);
  const [user] = await db
    .update(users)
    .set({
      passwordHash,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();
  return user;
}

export async function verifyUser(id: string) {
  const db = getDb();
  const [user] = await db
    .update(users)
    .set({
      isVerified: true,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();
  return user;
}

export async function deleteUser(id: string) {
  const db = getDb();
  const [user] = await db.delete(users).where(eq(users.id, id)).returning();
  return user;
}
