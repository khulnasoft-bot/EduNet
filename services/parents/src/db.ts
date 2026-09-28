import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { parentChildRelationships, users, enrollments, courses, submissions, assignments } from '@edunet/database';
import { eq, and } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/edunet';
const client = postgres(connectionString);
export const db = drizzle(client);

// Parent-Child Relationship operations
export async function findParentChildRelationshipById(id: string) {
  const result = await db.select().from(parentChildRelationships).where(eq(parentChildRelationships.id, id)).limit(1);
  return result[0] || null;
}

export async function findParentChildRelationship(parentId: string, childId: string) {
  const result = await db.select()
    .from(parentChildRelationships)
    .where(and(
      eq(parentChildRelationships.parentId, parentId),
      eq(parentChildRelationships.childId, childId)
    ))
    .limit(1);
  return result[0] || null;
}

export async function listChildrenByParent(parentId: string, limit = 50, offset = 0) {
  const relationships = await db.select()
    .from(parentChildRelationships)
    .where(eq(parentChildRelationships.parentId, parentId))
    .limit(limit)
    .offset(offset);

  const childIds = relationships.map(r => r.childId);
  if (childIds.length === 0) return [];

  const children = await db.select({
    id: users.id,
    firstName: users.firstName,
    lastName: users.lastName,
    email: users.email,
    role: users.role,
    organizationId: users.organizationId,
    isVerified: users.isVerified,
    createdAt: users.createdAt,
  })
    .from(users)
    .where(eq(users.role, 'student'));

  return children.filter(child => childIds.includes(child.id));
}

export async function listParentsByChild(childId: string, limit = 50, offset = 0) {
  const relationships = await db.select()
    .from(parentChildRelationships)
    .where(eq(parentChildRelationships.childId, childId))
    .limit(limit)
    .offset(offset);

  const parentIds = relationships.map(r => r.parentId);
  if (parentIds.length === 0) return [];

  const parents = await db.select({
    id: users.id,
    firstName: users.firstName,
    lastName: users.lastName,
    email: users.email,
    role: users.role,
    organizationId: users.organizationId,
    isVerified: users.isVerified,
    createdAt: users.createdAt,
  })
    .from(users)
    .where(eq(users.role, 'parent'));

  return parents.filter(parent => parentIds.includes(parent.id));
}

export async function createParentChildRelationship(data: typeof parentChildRelationships.$inferInsert) {
  const result = await db.insert(parentChildRelationships).values(data).returning();
  return result[0];
}

export async function updateParentChildRelationship(id: string, data: Partial<typeof parentChildRelationships.$inferInsert>) {
  const result = await db.update(parentChildRelationships)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(parentChildRelationships.id, id))
    .returning();
  return result[0];
}

export async function deleteParentChildRelationship(id: string) {
  const result = await db.delete(parentChildRelationships).where(eq(parentChildRelationships.id, id)).returning();
  return result[0];
}

// Child progress and grades for parents
export async function getChildEnrollments(childId: string) {
  return db.select({
    enrollmentId: enrollments.id,
    courseId: enrollments.courseId,
    enrolledAt: enrollments.enrolledAt,
    status: enrollments.status,
    courseTitle: courses.title,
    courseSubject: courses.subject,
    courseGrade: courses.grade,
  })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.studentId, childId));
}

export async function getChildSubmissions(childId: string) {
  return db.select({
    submissionId: submissions.id,
    assignmentId: submissions.assignmentId,
    content: submissions.content,
    submittedAt: submissions.submittedAt,
    grade: submissions.grade,
    gradedAt: submissions.gradedAt,
    assignmentTitle: assignments.title,
    assignmentMaxPoints: assignments.maxPoints,
    assignmentDueDate: assignments.dueDate,
  })
    .from(submissions)
    .innerJoin(assignments, eq(submissions.assignmentId, assignments.id))
    .where(eq(submissions.studentId, childId));
}
