"use server";

import { createHash } from "crypto";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";
import { createApiKey, createProject } from "@relog/db";

export interface CreateKeyState {
  rawKey?: string;
  error?: string;
}

export async function createProjectAndKey(
  _prev: CreateKeyState,
  formData: FormData,
): Promise<CreateKeyState> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const name = formData.get("name") as string;
  const label = (formData.get("label") as string) || undefined;

  const project = await createProject(name, userId);
  if (!project) return { error: "Failed to create project" };

  const rawKey = "relog_" + nanoid(32);
  const hash = createHash("sha256").update(rawKey).digest("hex");
  await createApiKey(project.id, hash, label);

  return { rawKey };
}
