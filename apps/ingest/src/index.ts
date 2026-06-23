import { serve } from "@hono/node-server";
import { Hono } from "hono";
// Imported but intentionally unused — wired up later.
import * as db from "@relog/db";
import * as queue from "@relog/queue";

void db;
void queue;

const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok" }));

const port = Number(process.env["PORT"] ?? process.env["INGEST_PORT"] ?? 3001);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Ingest listening on port ${info.port}`);
});
