ARG NODE_VERSION=22-bookworm-slim

FROM node:${NODE_VERSION} AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json

RUN npm ci --no-audit --no-fund

FROM node:${NODE_VERSION} AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json /app/package-lock.json ./
COPY --from=deps /app/frontend/package.json frontend/package.json
COPY --from=deps /app/backend/package.json backend/package.json
COPY backend ./backend
COPY frontend ./frontend
COPY api ./api
RUN rm -f .env .env.local frontend/.env frontend/.env.local

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV SESSION_SECRET=build-only-not-used-at-runtime
ENV HAMBA_DATA_DIR=/tmp/hamba-build

RUN mkdir -p /tmp/hamba-build && npm run build --workspace=frontend

FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV HAMBA_DATA_DIR=/data

RUN mkdir -p /data

COPY --from=builder /app/frontend/.next/standalone ./
COPY --from=builder /app/frontend/.next/static ./frontend/.next/static
COPY --from=builder /app/frontend/public ./frontend/public

RUN rm -rf /app/backend/data

EXPOSE 3000

CMD ["node", "frontend/server.js"]
