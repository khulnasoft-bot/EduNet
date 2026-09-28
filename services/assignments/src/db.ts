import { drizzle } from 'drizzle-orm/postgres-js';
import { assignments, submissions } from '@edunet/database';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';

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

export async function findAssignmentById(id: string) {
  const db = getDb();
  const result = await db.select().from(assignments).where(eq(assignments.id, id));
  return result[0] || null;
}

export async function listAssignmentsByCourse(courseId: string, limit = 50, offset = 0) {
  const db = getDb();
  return db.select().from(assignments).where(eq(assignments.courseId, courseId)).limit(limit).offset(offset);
}

export async function createAssignment(data: {
  courseId: string;
  title: string;
  description: string;
  dueDate: Date;
  maxPoints: number;
}) {
  const db = getDb();
  const [assignment] = await db.insert(assignments).values({
    id: crypto.randomUUID(),
    courseId: data.courseId,
    title: data.title,
    description: data.description,
    dueDate: data.dueDate,
    maxPoints: data.maxPoints,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();
  return assignment;
}

export async function updateAssignment(id: string, data: {
  title?: string;
  description?: string;
  dueDate?: Date;
  maxPoints?: number;
}) {
  const db = getDb();
  const [assignment] = await db
    .update(assignments)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(assignments.id, id))
    .returning();
  return assignment;
}

export async function deleteAssignment(id: string) {
  const db = getDb();
  const [assignment] = await db.delete(assignments).where(eq(assignments.id, id)).returning();
  return assignment;
}

export async function getAssignmentSubmissionCount(assignmentId: string) {
  const db = getDb();
  const result = await db.select().from(submissions).where(eq(submissions.assignmentId, assignmentId));
  return result.length;
}
