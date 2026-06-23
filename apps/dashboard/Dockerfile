# syntax=docker/dockerfile:1
# Build context: monorepo root (/home/justin/relog)
# Build:  docker build -f apps/dashboard/Dockerfile -t dashboard .
# Run:    docker run -p 3000:3000 dashboard

# ---- Base: provision node + pnpm from mise.toml (single source of truth) ----
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

# ---- Dependencies ----
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/config/package.json ./packages/config/package.json
COPY apps/dashboard/package.json ./apps/dashboard/package.json
RUN pnpm install --frozen-lockfile

# ---- Build ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/dashboard/node_modules ./apps/dashboard/node_modules
COPY . .
RUN pnpm --filter dashboard... build

# ---- Runtime ----
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/.next/static ./apps/dashboard/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/public ./apps/dashboard/public

USER nextjs
EXPOSE 3000
CMD ["node", "apps/dashboard/server.js"]
