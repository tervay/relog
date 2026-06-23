import { serve } from "@hono/node-server";
import { Hono } from "hono";
import * as queue from "@relog/queue";
import { apiKeyAuth } from "./middleware/auth.js";

void queue;

const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok" }));

const protected_ = new Hono<{ Variables: { projectId: string } }>();
protected_.use(apiKeyAuth);

app.route("/", protected_);

const port = Number(process.env["PORT"] ?? process.env["INGEST_PORT"] ?? 3001);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Ingest listening on port ${info.port}`);
});
