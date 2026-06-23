# Build from the monorepo root context:
#   docker build -f apps/worker/Dockerfile -t worker .

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

FROM base AS builder
# Workspace manifests + lockfile + turbo config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/config/package.json ./packages/config/package.json
COPY packages/queue/package.json ./packages/queue/package.json
COPY apps/worker/package.json ./apps/worker/package.json
RUN pnpm install --frozen-lockfile
# Sources
COPY packages ./packages
COPY apps/worker ./apps/worker
RUN pnpm --filter worker... build

FROM base AS runner
COPY --from=builder /app ./
CMD ["node", "apps/worker/dist/index.js"]
