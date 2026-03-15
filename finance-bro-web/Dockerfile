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

# Instalar todas las dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build argument para la URL del backend
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

# Build de la aplicación con Vite
RUN npm run build

# ============================================
# Stage 3: Production (servir con Nginx)
# ============================================
FROM nginx:alpine AS production

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build desde el stage anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Nginx corre como daemon off por defecto
CMD ["nginx", "-g", "daemon off;"]

# ============================================
# Stage 4: Development (para docker-compose)
# ============================================
FROM node:20-alpine AS development

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar todas las dependencias
RUN npm ci

# El código se montará como volumen en docker-compose
# Exponer puerto de Vite
EXPOSE 5173

# Comando de inicio en desarrollo (con hot-reload)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
