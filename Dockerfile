FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Check for OpenSSL (required for Prisma)
RUN apk add --no-cache openssl

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY scripts/start.sh ./start.sh

# Ensure prisma directory is writable for SQLite dev/prod handling if needed
# Although best practice is to mount volume at /app/prisma/prod.db or similar
RUN mkdir -p /app/prisma_data && chown nextjs:nodejs /app/prisma_data

RUN chmod +x ./start.sh

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["./start.sh"]
