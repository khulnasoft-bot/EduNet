import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { courses, enrollments, submissions, assignments, users } from '@edunet/database';
import { eq, and, count, avg, sql } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/edunet';
const client = postgres(connectionString);
export const db = drizzle(client);

// Course analytics for teachers
export async function getCourseAnalytics(courseId: string) {
  const enrollmentCount = await db.select({ count: count() })
    .from(enrollments)
    .where(eq(enrollments.courseId, courseId));

  const assignmentCount = await db.select({ count: count() })
    .from(assignments)
    .where(eq(assignments.courseId, courseId));

  const submissionsCount = await db.select({ count: count() })
    .from(submissions)
    .innerJoin(assignments, eq(submissions.assignmentId, assignments.id))
    .where(eq(assignments.courseId, courseId));

  const gradedSubmissions = await db.select({ count: count() })
    .from(submissions)
    .innerJoin(assignments, eq(submissions.assignmentId, assignments.id))
    .where(and(
      eq(assignments.courseId, courseId),
      sql`${submissions.grade} is not null`
    ));

  const averageGrade = await db.select({ avg: avg(submissions.grade) })
    .from(submissions)
    .innerJoin(assignments, eq(submissions.assignmentId, assignments.id))
    .where(and(
      eq(assignments.courseId, courseId),
      sql`${submissions.grade} is not null`
    ));

  return {
    enrollmentCount: enrollmentCount[0]?.count || 0,
    assignmentCount: assignmentCount[0]?.count || 0,
    submissionsCount: submissionsCount[0]?.count || 0,
    gradedSubmissions: gradedSubmissions[0]?.count || 0,
    averageGrade: averageGrade[0]?.avg || 0,
  };
}

export async function getStudentPerformance(courseId: string) {
  const result = await db.select({
    studentId: submissions.studentId,
    studentFirstName: users.firstName,
    studentLastName: users.lastName,
    assignmentId: submissions.assignmentId,
    grade: submissions.grade,
    submittedAt: submissions.submittedAt,
    maxPoints: assignments.maxPoints,
    assignmentTitle: assignments.title,
  })
    .from(submissions)
    .innerJoin(assignments, eq(submissions.assignmentId, assignments.id))
    .innerJoin(users, eq(submissions.studentId, users.id))
    .where(eq(assignments.courseId, courseId));

  return result;
}

export async function getAssignmentPerformance(courseId: string) {
  const result = await db.select({
    assignmentId: assignments.id,
    assignmentTitle: assignments.title,
    dueDate: assignments.dueDate,
    maxPoints: assignments.maxPoints,
    submissionCount: count(submissions.id),
    averageGrade: avg(submissions.grade),
  })
    .from(assignments)
    .leftJoin(submissions, eq(assignments.id, submissions.assignmentId))
    .where(eq(assignments.courseId, courseId))
    .groupBy(assignments.id);

  return result;
}

export async function getCourseEngagement(courseId: string, days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recentSubmissions = await db.select({ count: count() })
    .from(submissions)
    .innerJoin(assignments, eq(submissions.assignmentId, assignments.id))
    .where(and(
      eq(assignments.courseId, courseId),
      sql`${submissions.submittedAt} >= ${cutoffDate}`
    ));

  const recentEnrollments = await db.select({ count: count() })
    .from(enrollments)
    .where(and(
      eq(enrollments.courseId, courseId),
      sql`${enrollments.enrolledAt} >= ${cutoffDate}`
    ));

  return {
    recentSubmissions: recentSubmissions[0]?.count || 0,
    recentEnrollments: recentEnrollments[0]?.count || 0,
  };
}
