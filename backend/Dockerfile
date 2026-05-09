FROM node:20-alpine AS base

# Installa dipendenze di sistema
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# ── Fase 1: Dipendenze ──────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# ── Fase 2: Build ───────────────────────────────────────────
FROM base AS builder
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
COPY prisma ./prisma
RUN npx prisma generate
RUN npm run build

# ── Fase 3: Runner ──────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production

# Utente non-root per sicurezza
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 hornets

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY package.json .

# Directory uploads
RUN mkdir -p uploads && chown -R hornets:nodejs uploads

USER hornets

EXPOSE 4000

CMD ["node", "dist/index.js"]
