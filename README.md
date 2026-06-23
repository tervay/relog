# analytics-platform

A monorepo for the analytics platform, managed with [pnpm](https://pnpm.io) workspaces and [Turbo](https://turbo.build).

## Setup

1. Install [mise](https://mise.jdx.dev) (manages the Node and pnpm toolchain versions).
2. Install the pinned toolchain:

   ```bash
   mise install
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Start the local infrastructure (Postgres, ClickHouse, RabbitMQ, SeaweedFS, etc.):

   ```bash
   docker compose up
   ```

Copy `.env.example` to `.env` and adjust values as needed.

## Monorepo layout

- `apps/ingest` — service that receives and validates incoming analytics events.
- `apps/worker` — background worker that processes queued events.
- `apps/dashboard` — web dashboard for visualizing analytics.
- `packages/sdk` — client SDK for emitting events.
- `packages/db` — database schema, migrations, and access helpers.
- `packages/queue` — shared message queue client and helpers.
- `packages/config` — shared TypeScript, lint, and format configuration.
- `infra/docker` — Docker and Compose definitions for local infrastructure.
