import { drizzle } from 'drizzle-orm/postgres-js';
import { courses, enrollments } from '@edunet/database';
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

export async function findCourseById(id: string) {
  const db = getDb();
  const result = await db.select().from(courses).where(eq(courses.id, id));
  return result[0] || null;
}

export async function listCoursesByOrganization(organizationId: string, limit = 50, offset = 0) {
  const db = getDb();
  return db.select().from(courses).where(eq(courses.organizationId, organizationId)).limit(limit).offset(offset);
}

export async function listCoursesByTeacher(teacherId: string, limit = 50, offset = 0) {
  const db = getDb();
  return db.select().from(courses).where(eq(courses.teacherId, teacherId)).limit(limit).offset(offset);
}

export async function createCourse(data: {
  organizationId: string;
  title: string;
  description: string;
  subject: string;
  grade?: string;
  teacherId: string;
}) {
  const db = getDb();
  const [course] = await db.insert(courses).values({
    id: crypto.randomUUID(),
    organizationId: data.organizationId,
    title: data.title,
    description: data.description,
    subject: data.subject,
    grade: data.grade,
    teacherId: data.teacherId,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();
  return course;
}

export async function updateCourse(id: string, data: {
  title?: string;
  description?: string;
  subject?: string;
  grade?: string;
  isActive?: boolean;
}) {
  const db = getDb();
  const [course] = await db
    .update(courses)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(courses.id, id))
    .returning();
  return course;
}

export async function deleteCourse(id: string) {
  const db = getDb();
  const [course] = await db.delete(courses).where(eq(courses.id, id)).returning();
  return course;
}

export async function getCourseEnrollmentCount(courseId: string) {
  const db = getDb();
  const result = await db.select().from(enrollments).where(eq(enrollments.courseId, courseId));
  return result.length;
}
