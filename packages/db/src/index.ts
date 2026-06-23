import { eq } from "drizzle-orm";
import { db } from "./postgres.js";
import { apiKeys, projects } from "./schema.js";

export * from "./clickhouse.js";
export * from "./postgres.js";
export * from "./schema.js";

export async function lookupApiKey(hash: string) {
  return db.query.apiKeys.findFirst({
    where: eq(apiKeys.keyHash, hash),
  });
}

export async function createProject(name: string, ownerId: string) {
  const [project] = await db.insert(projects).values({ name, ownerId }).returning();
  return project;
}

export async function createApiKey(projectId: string, keyHash: string, label?: string) {
  const [apiKey] = await db.insert(apiKeys).values({ projectId, keyHash, label }).returning();
  return apiKey;
}

export async function listProjectApiKeys(projectId: string) {
  return db.query.apiKeys.findMany({
    where: eq(apiKeys.projectId, projectId),
  });
}

export async function listUserProjects(ownerId: string) {
  return db.query.projects.findMany({
    where: eq(projects.ownerId, ownerId),
  });
}
