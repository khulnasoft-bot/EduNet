import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { courses, users, assignments, organizations } from '@edunet/database';
import { eq, or, and, ilike, sql } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/edunet';
const client = postgres(connectionString);
export const db = drizzle(client);

// Search functions using PostgreSQL ILIKE for case-insensitive search
export async function searchCourses(query: string, organizationId?: string, limit = 20, offset = 0) {
  const conditions = [
    ilike(courses.title, `%${query}%`),
    ilike(courses.description, `%${query}%`),
    ilike(courses.subject, `%${query}%`),
  ];

  if (organizationId) {
    conditions.push(eq(courses.organizationId, organizationId));
  }

  return db.select()
    .from(courses)
    .where(and(
      eq(courses.isActive, true),
      or(...conditions)
    ))
    .limit(limit)
    .offset(offset);
}

export async function searchUsers(query: string, organizationId?: string, role?: string, limit = 20, offset = 0) {
  const conditions = [
    ilike(users.firstName, `%${query}%`),
    ilike(users.lastName, `%${query}%`),
    ilike(users.email, `%${query}%`),
  ];

  if (organizationId) {
    conditions.push(eq(users.organizationId, organizationId));
  }

  if (role) {
    conditions.push(eq(users.role, role));
  }

  return db.select({
    id: users.id,
    firstName: users.firstName,
    lastName: users.lastName,
    email: users.email,
    role: users.role,
    organizationId: users.organizationId,
    isVerified: users.isVerified,
  })
    .from(users)
    .where(or(...conditions))
    .limit(limit)
    .offset(offset);
}

export async function searchAssignments(query: string, organizationId?: string, limit = 20, offset = 0) {
  const conditions = [
    ilike(assignments.title, `%${query}%`),
    ilike(assignments.description, `%${query}%`),
  ];

  const courseConditions = [];
  if (organizationId) {
    courseConditions.push(eq(courses.organizationId, organizationId));
  }

  return db.select({
    id: assignments.id,
    title: assignments.title,
    description: assignments.description,
    dueDate: assignments.dueDate,
    maxPoints: assignments.maxPoints,
    courseId: assignments.courseId,
  })
    .from(assignments)
    .innerJoin(courses, eq(assignments.courseId, courses.id))
    .where(and(
      eq(assignments.isActive, true),
      or(...conditions),
      ...courseConditions
    ))
    .limit(limit)
    .offset(offset);
}

export async function searchOrganizations(query: string, limit = 20, offset = 0) {
  return db.select()
    .from(organizations)
    .where(and(
      eq(organizations.isActive, true),
      or(
        ilike(organizations.name, `%${query}%`),
        ilike(organizations.code, `%${query}%`)
      )
    ))
    .limit(limit)
    .offset(offset);
}

// Global search across all entities
export async function globalSearch(query: string, organizationId?: string, limit = 10) {
  const coursesResult = await searchCourses(query, organizationId, limit, 0);
  const usersResult = await searchUsers(query, organizationId, undefined, limit, 0);
  const assignmentsResult = await searchAssignments(query, organizationId, limit, 0);

  return {
    courses: coursesResult,
    users: usersResult,
    assignments: assignmentsResult,
  };
}
