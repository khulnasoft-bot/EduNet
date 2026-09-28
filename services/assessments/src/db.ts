import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/edunet';
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// Quiz operations
export async function findQuizById(id: string) {
  const result = await db.select().from(schema.quizzes).where(eq(schema.quizzes.id, id)).limit(1);
  return result[0] || null;
}

export async function listQuizzesByCourse(courseId: string, limit = 50, offset = 0) {
  return db.select()
    .from(schema.quizzes)
    .where(eq(schema.quizzes.courseId, courseId))
    .limit(limit)
    .offset(offset);
}

export async function createQuiz(data: typeof schema.quizzes.$inferInsert) {
  const result = await db.insert(schema.quizzes).values(data).returning();
  return result[0];
}

export async function updateQuiz(id: string, data: Partial<typeof schema.quizzes.$inferInsert>) {
  const result = await db.update(schema.quizzes)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.quizzes.id, id))
    .returning();
  return result[0];
}

export async function deleteQuiz(id: string) {
  const result = await db.delete(schema.quizzes).where(eq(schema.quizzes.id, id)).returning();
  return result[0];
}

// Question operations
export async function findQuestionById(id: string) {
  const result = await db.select().from(schema.questions).where(eq(schema.questions.id, id)).limit(1);
  return result[0] || null;
}

export async function listQuestionsByQuiz(quizId: string, limit = 100, offset = 0) {
  return db.select()
    .from(schema.questions)
    .where(eq(schema.questions.quizId, quizId))
    .orderBy(schema.questions.order)
    .limit(limit)
    .offset(offset);
}

export async function createQuestion(data: typeof schema.questions.$inferInsert) {
  const result = await db.insert(schema.questions).values(data).returning();
  return result[0];
}

export async function updateQuestion(id: string, data: Partial<typeof schema.questions.$inferInsert>) {
  const result = await db.update(schema.questions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.questions.id, id))
    .returning();
  return result[0];
}

export async function deleteQuestion(id: string) {
  const result = await db.delete(schema.questions).where(eq(schema.questions.id, id)).returning();
  return result[0];
}

// Quiz Attempt operations
export async function findQuizAttemptById(id: string) {
  const result = await db.select().from(schema.quizAttempts).where(eq(schema.quizAttempts.id, id)).limit(1);
  return result[0] || null;
}

export async function listQuizAttemptsByStudent(studentId: string, limit = 50, offset = 0) {
  return db.select()
    .from(schema.quizAttempts)
    .where(eq(schema.quizAttempts.studentId, studentId))
    .orderBy(schema.quizAttempts.startedAt)
    .limit(limit)
    .offset(offset);
}

export async function listQuizAttemptsByQuiz(quizId: string, limit = 50, offset = 0) {
  return db.select()
    .from(schema.quizAttempts)
    .where(eq(schema.quizAttempts.quizId, quizId))
    .orderBy(schema.quizAttempts.startedAt)
    .limit(limit)
    .offset(offset);
}

export async function createQuizAttempt(data: typeof schema.quizAttempts.$inferInsert) {
  const result = await db.insert(schema.quizAttempts).values(data).returning();
  return result[0];
}

export async function updateQuizAttempt(id: string, data: Partial<typeof schema.quizAttempts.$inferInsert>) {
  const result = await db.update(schema.quizAttempts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.quizAttempts.id, id))
    .returning();
  return result[0];
}

export async function deleteQuizAttempt(id: string) {
  const result = await db.delete(schema.quizAttempts).where(eq(schema.quizAttempts.id, id)).returning();
  return result[0];
}

import { eq } from 'drizzle-orm';
