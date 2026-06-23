# Build context is the MONOREPO ROOT (e.g. `docker build -f apps/ingest/Dockerfile .`).
# All COPY paths below are relative to the repo root so the pnpm workspace is available.

# ---- base: provision node + pnpm from mise.toml (single source of truth) ----
FROM debian:bookworm-20260610-slim@sha256:96e378d7e6531ac9a15ad505478fcc2e69f371b10f5cdf87857c4b8188404716 AS base
ENV MISE_DATA_DIR="/usr/local/share/mise" \
    MISE_CONFIG_DIR="/usr/local/share/mise" \
    MISE_CACHE_DIR="/usr/local/share/mise/cache" \
    PATH="/usr/local/share/mise/shims:${PATH}"
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates curl git libatomic1 && \
    rm -rf /var/lib/apt/lists/*
RUN curl https://mise.run | MISE_VERSION=2026.6.12 MISE_INSTALL_PATH=/usr/local/bin/mise sh
WORKDIR /app
COPY mise.toml ./
RUN mise trust && mise install && chmod -R a+rX "$MISE_DATA_DIR"

# ---- build ----
FROM base AS build

# Copy workspace manifests first to maximize layer caching.
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json ./
COPY apps/ingest/package.json apps/ingest/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/queue/package.json packages/queue/package.json
COPY packages/config/package.json packages/config/package.json

RUN pnpm install --frozen-lockfile

# Copy the rest of the sources and build the ingest app (and its deps).
COPY . .
RUN pnpm --filter ingest... build

# ---- runtime ----
FROM base AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy the built app and the installed dependencies from the build stage.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=build /app/apps/ingest/package.json ./apps/ingest/package.json
COPY --from=build /app/apps/ingest/node_modules ./apps/ingest/node_modules
COPY --from=build /app/apps/ingest/dist ./apps/ingest/dist
COPY --from=build /app/packages ./packages

EXPOSE 3001
CMD ["node", "apps/ingest/dist/index.js"]
