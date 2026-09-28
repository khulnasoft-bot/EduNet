import { drizzle } from 'drizzle-orm/postgres';
import { organizations } from '@edunet/database/schema';
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

export async function findOrganizationById(id: string) {
  const db = getDb();
  const result = await db.select().from(organizations).where(eq(organizations.id, id));
  return result[0] || null;
}

export async function findOrganizationByCode(code: string) {
  const db = getDb();
  const result = await db.select().from(organizations).where(eq(organizations.code, code));
  return result[0] || null;
}

export async function createOrganization(data: {
  name: string;
  type: string;
  code: string;
  address?: string;
}) {
  const db = getDb();
  const [org] = await db.insert(organizations).values({
    id: crypto.randomUUID(),
    name: data.name,
    type: data.type as any,
    code: data.code,
    address: data.address,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();
  return org;
}

export async function updateOrganization(id: string, data: {
  name?: string;
  address?: string;
  isActive?: boolean;
}) {
  const db = getDb();
  const [org] = await db
    .update(organizations)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(organizations.id, id))
    .returning();
  return org;
}

export async function listOrganizations(limit = 50, offset = 0) {
  const db = getDb();
  return db.select().from(organizations).limit(limit).offset(offset);
}
