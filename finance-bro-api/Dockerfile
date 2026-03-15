# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production && \
    npm cache clean --force

# ============================================
# Stage 2: Build
# ============================================
FROM node:20-alpine AS build

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm ci

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# ============================================
# Stage 3: Production
# ============================================
FROM node:20-alpine AS production

# Instalar dumb-init para manejar señales correctamente
RUN apk add --no-cache dumb-init

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app

# Copiar dependencias de producción
COPY --from=dependencies --chown=nestjs:nodejs /app/node_modules ./node_modules

# Copiar build
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/package*.json ./

# Cambiar a usuario no-root
USER nestjs

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Usar dumb-init como entrypoint
ENTRYPOINT ["dumb-init", "--"]

# Comando de inicio
CMD ["node", "dist/main"]

# ============================================
# Stage 4: Development (para docker-compose)
# ============================================
FROM node:20-alpine AS development

WORKDIR /app

# Instalar dependencias globales útiles para desarrollo
RUN npm install -g @nestjs/cli

# Copiar package.json
COPY package*.json ./

# Instalar todas las dependencias
RUN npm ci

# El código se montará como volumen en docker-compose
# Exponer puerto
EXPOSE 3000

# Comando de inicio en desarrollo (con hot-reload)
CMD ["npm", "run", "start:dev"]
