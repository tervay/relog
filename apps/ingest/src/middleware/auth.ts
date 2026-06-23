import { createHash } from "crypto";
import { createMiddleware } from "hono/factory";
import { lookupApiKey } from "@relog/db";

export const apiKeyAuth = createMiddleware<{ Variables: { projectId: string } }>(
  async (c, next) => {
    const raw = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!raw) return c.json({ error: "unauthorized" }, 401);
    const hash = createHash("sha256").update(raw).digest("hex");
    const key = await lookupApiKey(hash);
    if (!key) return c.json({ error: "unauthorized" }, 401);
    c.set("projectId", key.projectId);
    await next();
  },
);
