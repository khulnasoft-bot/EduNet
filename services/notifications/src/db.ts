import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { eq, and, desc } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/edunet';
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// Notification operations
export async function findNotificationById(id: string) {
  const result = await db.select().from(schema.notifications).where(eq(schema.notifications.id, id)).limit(1);
  return result[0] || null;
}

export async function listNotificationsByUser(userId: string, limit = 50, offset = 0) {
  return db.select()
    .from(schema.notifications)
    .where(eq(schema.notifications.userId, userId))
    .orderBy(desc(schema.notifications.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function listUnreadNotificationsByUser(userId: string, limit = 50, offset = 0) {
  return db.select()
    .from(schema.notifications)
    .where(and(
      eq(schema.notifications.userId, userId),
      eq(schema.notifications.isRead, false)
    ))
    .orderBy(desc(schema.notifications.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function createNotification(data: typeof schema.notifications.$inferInsert) {
  const result = await db.insert(schema.notifications).values(data).returning();
  return result[0];
}

export async function markNotificationAsRead(id: string) {
  const result = await db.update(schema.notifications)
    .set({ isRead: true, readAt: new Date() })
    .where(eq(schema.notifications.id, id))
    .returning();
  return result[0];
}

export async function markAllNotificationsAsRead(userId: string) {
  const result = await db.update(schema.notifications)
    .set({ isRead: true, readAt: new Date() })
    .where(and(
      eq(schema.notifications.userId, userId),
      eq(schema.notifications.isRead, false)
    ))
    .returning();
  return result;
}

export async function deleteNotification(id: string) {
  const result = await db.delete(schema.notifications).where(eq(schema.notifications.id, id)).returning();
  return result[0];
}

// Notification Preferences operations
export async function findNotificationPreferencesByUser(userId: string) {
  const result = await db.select()
    .from(schema.notificationPreferences)
    .where(eq(schema.notificationPreferences.userId, userId))
    .limit(1);
  return result[0] || null;
}

export async function createNotificationPreferences(data: typeof schema.notificationPreferences.$inferInsert) {
  const result = await db.insert(schema.notificationPreferences).values(data).returning();
  return result[0];
}

export async function updateNotificationPreferences(userId: string, data: Partial<typeof schema.notificationPreferences.$inferInsert>) {
  const existing = await findNotificationPreferencesByUser(userId);
  if (existing) {
    const result = await db.update(schema.notificationPreferences)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.notificationPreferences.id, existing.id))
      .returning();
    return result[0];
  } else {
    return createNotificationPreferences({ userId, ...data });
  }
}
