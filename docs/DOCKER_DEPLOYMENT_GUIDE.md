# 🐳 FinanceBro - Guía de Despliegue con Docker

Guía completa para ejecutar FinanceBro usando Docker y Docker Compose.

---

## 📋 Requisitos Previos

- **Docker**: v20.10+ ([Instalar Docker](https://docs.docker.com/get-docker/))
- **Docker Compose**: v2.0+ (incluido con Docker Desktop)
- **Git**: Para clonar el repositorio

Verificar instalación:
```bash
docker --version
docker compose version
```

---

## 🏗️ Arquitectura de Contenedores

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Network                       │
│                  (financebro-network)                    │
│                                                          │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────┐ │
│  │   Frontend   │   │   Backend    │   │ PostgreSQL │ │
│  │ (React+Nginx)│◄──┤   (NestJS)   │◄──┤  Database  │ │
│  │  Port: 80    │   │  Port: 3000  │   │ Port: 5432 │ │
│  └──────────────┘   └──────────────┘   └────────────┘ │
│         │                   │                  │        │
│         │                   │           ┌──────────┐   │
│         │                   └───────────┤  Redis   │   │
│         │                               │  Cache   │   │
│         │                               └──────────┘   │
│         │                                               │
│         └─────► Proxy /api → Backend                   │
└─────────────────────────────────────────────────────────┘
```

### Servicios:

1. **frontend**: React + Vite (desarrollo) o Nginx (producción)
2. **backend**: NestJS API
3. **postgres**: PostgreSQL 16
4. **redis**: Redis 7 para caché
5. **pgadmin** (opcional): Administración de DB

---

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con tus valores
nano .env  # o tu editor favorito
```

**⚠️ IMPORTANTE**: Cambia las contraseñas en producción.

### 2. Ejecutar en Desarrollo

```bash
# Construir e iniciar todos los servicios
docker compose up --build

# O en segundo plano
docker compose up -d --build
```

### 3. Acceder a la Aplicación

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000](http://localhost:3000)
- **Swagger Docs**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **PgAdmin**: [http://localhost:5050](http://localhost:5050) (con profile tools)

### 4. Ejecutar Migraciones

```bash
# Entrar al contenedor del backend
docker compose exec backend sh

# Ejecutar migraciones
npm run migration:run

# Ejecutar seeds
npm run seed:catalogs

# Salir
exit
```

---

## 🛠️ Comandos Útiles

### Gestión de Contenedores

```bash
# Ver logs de todos los servicios
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f backend
docker compose logs -f frontend

# Detener todos los servicios
docker compose down

# Detener y eliminar volúmenes (¡CUIDADO! Elimina datos)
docker compose down -v

# Reiniciar un servicio específico
docker compose restart backend

# Reconstruir un servicio sin caché
docker compose build --no-cache backend
```

### Ejecutar Comandos en Contenedores

```bash
# Backend (NestJS)
docker compose exec backend npm run migration:run
docker compose exec backend npm run test
docker compose exec backend npm run lint

# Frontend (React)
docker compose exec frontend npm run build
docker compose exec frontend npm run lint

# PostgreSQL
docker compose exec postgres psql -U financebro -d financebro_db

# Redis
docker compose exec redis redis-cli
```

### Gestión de Base de Datos

```bash
# Backup de PostgreSQL
docker compose exec postgres pg_dump -U financebro financebro_db > backup.sql

# Restaurar backup
cat backup.sql | docker compose exec -T postgres psql -U financebro -d financebro_db

# Conectarse a PostgreSQL
docker compose exec postgres psql -U financebro -d financebro_db
```

---

## 🏭 Despliegue en Producción

### 1. Preparar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env.production

# Editar valores de producción
nano .env.production
```

**Valores CRÍTICOS a cambiar:**
```env
POSTGRES_PASSWORD=contraseña_segura_postgresql
REDIS_PASSWORD=contraseña_segura_redis
N8N_API_KEY=api_key_segura_n8n
JWT_SECRET=secreto_jwt_minimo_32_caracteres_aleatorios
```

### 2. Construir Imágenes de Producción

```bash
# Construir con docker-compose.prod.yml
docker compose -f docker-compose.prod.yml build

# Ver imágenes creadas
docker images | grep financebro
```

### 3. Ejecutar en Producción

```bash
# Iniciar servicios en producción
docker compose -f docker-compose.prod.yml --env-file .env.production up -d

# Verificar estado
docker compose -f docker-compose.prod.yml ps

# Ver logs
docker compose -f docker-compose.prod.yml logs -f
```

### 4. Ejecutar Migraciones en Producción

```bash
# Entrar al contenedor
docker compose -f docker-compose.prod.yml exec backend sh

# Ejecutar migraciones
npm run migration:run

# Ejecutar seeds (solo primera vez)
npm run seed:catalogs

# Salir
exit
```

### 5. Configurar Reverse Proxy (Opcional)

Si usas Nginx o Traefik como reverse proxy:

**Nginx:**
```nginx
server {
    listen 80;
    server_name financebro.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Traefik (labels en docker-compose):**
```yaml
frontend:
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.financebro.rule=Host(`financebro.com`)"
    - "traefik.http.services.financebro.loadbalancer.server.port=80"
```

---

## 🔧 Configuración Avanzada

### Ejecutar Solo Algunos Servicios

```bash
# Solo base de datos
docker compose up postgres redis

# Sin PgAdmin
docker compose up frontend backend postgres redis
```

### PgAdmin (Herramienta de Administración)

```bash
# Iniciar con profile tools
docker compose --profile tools up pgadmin

# Acceder a http://localhost:5050
# Email: admin@financebro.com
# Password: admin123 (cambiar en .env)
```

**Conectar PgAdmin a PostgreSQL:**
1. Crear nuevo servidor
2. Name: FinanceBro
3. Host: `postgres` (nombre del contenedor)
4. Port: `5432`
5. Username: `financebro`
6. Password: valor de `.env`

### Hot Reload en Desarrollo

Los volúmenes están configurados para hot reload:
- **Backend**: Cambios en `finance-bro-api/` se reflejan automáticamente
- **Frontend**: Cambios en `finance-bro-web/` se reflejan automáticamente

### Variables de Entorno por Servicio

**Backend (.env):**
```env
DATABASE_HOST=postgres
DATABASE_PORT=5432
REDIS_HOST=redis
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3000
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

**Solución:**
```bash
# Verificar que PostgreSQL esté corriendo
docker compose ps postgres

# Ver logs de PostgreSQL
docker compose logs postgres

# Reiniciar PostgreSQL
docker compose restart postgres

# Verificar conectividad desde backend
docker compose exec backend ping postgres
```

### Error: "Port already in use"

**Solución:**
```bash
# Cambiar puerto en .env
BACKEND_PORT=3001
FRONTEND_PORT=5174

# O detener proceso que usa el puerto
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Error: "Volume permission denied"

**Solución (Linux):**
```bash
# Dar permisos a carpetas
sudo chown -R $USER:$USER finance-bro-api
sudo chown -R $USER:$USER finance-bro-web

# O ejecutar con sudo
sudo docker compose up
```

### Contenedor se reinicia constantemente

**Solución:**
```bash
# Ver logs completos
docker compose logs --tail=100 backend

# Verificar health check
docker inspect financebro-backend | grep -A 10 Health

# Entrar al contenedor en modo debug
docker compose run --rm backend sh
```

### Reconstruir desde cero

```bash
# Detener y eliminar todo
docker compose down -v

# Eliminar imágenes
docker rmi financebro-backend financebro-frontend

# Limpiar caché de Docker
docker system prune -a

# Reconstruir
docker compose build --no-cache
docker compose up -d
```

---

## 📊 Monitoreo

### Ver Estado de Servicios

```bash
# Estado de contenedores
docker compose ps

# Uso de recursos
docker stats

# Health checks
docker compose ps --format json | jq '.[] | {name: .Name, health: .Health}'
```

### Ver Logs

```bash
# Todos los servicios
docker compose logs -f

# Solo errores
docker compose logs -f | grep -i error

# Últimas 100 líneas
docker compose logs --tail=100

# Desde hace 5 minutos
docker compose logs --since 5m
```

---

## 🔐 Seguridad

### Checklist de Producción

- [ ] Cambiar todas las contraseñas por defecto
- [ ] Usar JWT_SECRET de al menos 32 caracteres aleatorios
- [ ] No exponer PostgreSQL ni Redis externamente
- [ ] Habilitar SSL/TLS con certificado
- [ ] Configurar firewall para limitar acceso
- [ ] Revisar logs regularmente
- [ ] Mantener Docker actualizado
- [ ] Usar imágenes oficiales de Docker Hub
- [ ] Escanear imágenes con Trivy o similar
- [ ] Limitar recursos de contenedores

### Escanear Vulnerabilidades

```bash
# Instalar Trivy
# https://github.com/aquasecurity/trivy

# Escanear imagen del backend
trivy image financebro-backend:latest

# Escanear imagen del frontend
trivy image financebro-frontend:latest
```

---

## 📦 Backup y Restauración

### Backup Automático

Crear script `backup.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker compose exec -T postgres pg_dump -U financebro financebro_db | gzip > "backup_${DATE}.sql.gz"
```

Ejecutar diariamente con cron:
```bash
0 2 * * * /path/to/backup.sh
```

### Restauración

```bash
# Restaurar desde backup
gunzip < backup_20250128_020000.sql.gz | docker compose exec -T postgres psql -U financebro -d financebro_db
```

---

## 🎯 Mejores Prácticas

### Desarrollo
1. **Usar volúmenes** para hot reload
2. **Logs verbosos** (TYPEORM_LOGGING=true)
3. **PgAdmin** para inspeccionar DB
4. **Health checks** para debugging

### Producción
1. **Multi-stage builds** para imágenes pequeñas
2. **Usar secrets** de Docker Swarm o Kubernetes
3. **Limitar recursos** con `deploy.resources`
4. **Monitoreo** con Prometheus + Grafana
5. **Backups automáticos** diarios
6. **SSL/TLS** con Let's Encrypt
7. **Actualizar** imágenes regularmente

---

## 🆘 Soporte

### Verificar Salud del Sistema

```bash
# Verificar todos los servicios
docker compose ps
docker compose exec backend wget -qO- http://localhost:3000/health
docker compose exec frontend wget -qO- http://localhost/health

# Verificar conectividad entre servicios
docker compose exec backend ping postgres
docker compose exec backend ping redis
```

### Recursos Útiles

- **Docker Docs**: https://docs.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **NestJS Docker**: https://docs.nestjs.com/recipes/deployment#docker
- **PostgreSQL Docker**: https://hub.docker.com/_/postgres

---

## 📝 Estructura de Archivos Docker

```
Proyecto-FinanceBro/
├── docker-compose.yml              # Desarrollo
├── docker-compose.prod.yml         # Producción
├── .env.example                    # Variables de ejemplo
├── .env                            # Variables locales (no commitear)
│
├── finance-bro-api/
│   ├── Dockerfile                  # Multi-stage: development, production
│   ├── .dockerignore              # Archivos a ignorar
│   └── .env.example
│
└── finance-bro-web/
    ├── Dockerfile                  # Multi-stage: development, production
    ├── .dockerignore              # Archivos a ignorar
    ├── nginx.conf                  # Configuración Nginx (producción)
    └── .env.example
```

---

## ✅ Checklist de Despliegue

### Primera Vez

- [ ] Copiar .env.example a .env
- [ ] Actualizar contraseñas en .env
- [ ] Construir imágenes: `docker compose build`
- [ ] Iniciar servicios: `docker compose up -d`
- [ ] Ejecutar migraciones: `docker compose exec backend npm run migration:run`
- [ ] Ejecutar seeds: `docker compose exec backend npm run seed:catalogs`
- [ ] Verificar servicios: `docker compose ps`
- [ ] Probar frontend: http://localhost:5173
- [ ] Probar backend: http://localhost:3000/api/docs

### Actualización

- [ ] Pull última versión: `git pull`
- [ ] Reconstruir imágenes: `docker compose build`
- [ ] Detener servicios: `docker compose down`
- [ ] Iniciar servicios: `docker compose up -d`
- [ ] Ejecutar nuevas migraciones: `docker compose exec backend npm run migration:run`
- [ ] Verificar logs: `docker compose logs -f`

---

## 🎉 ¡Listo!

Tu aplicación FinanceBro está dockerizada y lista para:
- ✅ Desarrollo local con hot-reload
- ✅ Despliegue en producción optimizado
- ✅ CI/CD con Docker
- ✅ Escalabilidad horizontal
- ✅ Portabilidad total

**Próximos pasos:**
1. Configurar CI/CD (GitHub Actions, GitLab CI)
2. Desplegar en cloud (AWS, GCP, Azure, DigitalOcean)
3. Configurar monitoring (Prometheus, Grafana)
4. Implementar logging centralizado (ELK Stack)
