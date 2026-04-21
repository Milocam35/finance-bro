# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && \
    npm cache clean --force

# ============================================
# Stage 2: Build
# ============================================
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# ============================================
# Stage 3: Production
# ============================================
FROM node:20-alpine AS production

RUN apk add --no-cache dumb-init

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app

COPY --from=dependencies --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/package*.json ./

USER nestjs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/main"]

# ============================================
# Stage 4: Development (para docker-compose)
# ============================================
FROM node:20-alpine AS development

WORKDIR /app

RUN npm install -g @nestjs/cli

COPY package*.json ./

RUN npm ci

EXPOSE 3001

CMD ["npm", "run", "start:dev"]
