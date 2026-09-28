import { drizzle } from 'drizzle-orm/postgres-js';
import { enrollments } from '@edunet/database';
import { eq, and } from 'drizzle-orm';
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

export async function findEnrollmentById(id: string) {
  const db = getDb();
  const result = await db.select().from(enrollments).where(eq(enrollments.id, id));
  return result[0] || null;
}

export async function findEnrollment(studentId: string, courseId: string) {
  const db = getDb();
  const result = await db.select().from(enrollments).where(
    and(eq(enrollments.studentId, studentId), eq(enrollments.courseId, courseId))
  );
  return result[0] || null;
}

export async function listEnrollmentsByStudent(studentId: string, limit = 50, offset = 0) {
  const db = getDb();
  return db.select().from(enrollments).where(eq(enrollments.studentId, studentId)).limit(limit).offset(offset);
}

export async function listEnrollmentsByCourse(courseId: string, limit = 50, offset = 0) {
  const db = getDb();
  return db.select().from(enrollments).where(eq(enrollments.courseId, courseId)).limit(limit).offset(offset);
}

export async function createEnrollment(data: {
  studentId: string;
  courseId: string;
}) {
  const db = getDb();
  const [enrollment] = await db.insert(enrollments).values({
    id: crypto.randomUUID(),
    studentId: data.studentId,
    courseId: data.courseId,
    enrolledAt: new Date(),
    status: 'active',
  }).returning();
  return enrollment;
}

export async function updateEnrollmentStatus(id: string, status: 'active' | 'completed' | 'dropped') {
  const db = getDb();
  const [enrollment] = await db
    .update(enrollments)
    .set({ status })
    .where(eq(enrollments.id, id))
    .returning();
  return enrollment;
}

export async function deleteEnrollment(id: string) {
  const db = getDb();
  const [enrollment] = await db.delete(enrollments).where(eq(enrollments.id, id)).returning();
  return enrollment;
}
