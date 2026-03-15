# CI/CD Quick Start Guide

## 🚀 Guía Rápida de CI/CD para FinanceBro

### Badges de Estado

Agrega estos badges al README.md:

```markdown
![CI Pipeline](https://github.com/tu-usuario/Proyecto-FinanceBro/actions/workflows/ci.yml/badge.svg)
![CD Pipeline](https://github.com/tu-usuario/Proyecto-FinanceBro/actions/workflows/cd.yml/badge.svg)
![Release](https://github.com/tu-usuario/Proyecto-FinanceBro/actions/workflows/release.yml/badge.svg)
```

---

## 📋 Prerequisitos

### 1. Configurar Secrets en GitHub

Ve a: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

```bash
# EC2
EC2_HOST=tu-ip-elastica-o-dominio
EC2_USER=ubuntu
EC2_SSH_KEY=<contenido-completo-del-archivo-.pem>

# Docker Hub
DOCKER_USERNAME=tu-usuario-dockerhub
DOCKER_PASSWORD=tu-password-dockerhub

# Base de datos
DATABASE_PASSWORD=tu-password-seguro-postgres

# Redis
REDIS_PASSWORD=tu-password-seguro-redis

# JWT
JWT_SECRET=tu-jwt-secret-de-64-caracteres

# N8N
N8N_API_KEY=tu-n8n-api-key
N8N_HOST=https://tu-instancia.n8n.cloud

# pgAdmin (opcional)
PGADMIN_PASSWORD=tu-password-pgadmin
```

### 2. Verificar Workflows

Los workflows ya están configurados en `.github/workflows/`:
- ✅ `ci.yml` - Tests automáticos en cada push
- ✅ `cd.yml` - Deploy automático a producción
- ✅ `release.yml` - Crear releases con tags

---

## 🔄 Workflow de Desarrollo

### Opción 1: Desarrollo Simple (sin branches)

```bash
# 1. Hacer cambios en el código
code .

# 2. Commit y push a main
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# 3. GitHub Actions automáticamente:
#    - Ejecuta tests (CI)
#    - Construye imágenes Docker
#    - Despliega a producción (CD)
```

### Opción 2: Desarrollo con Feature Branches

```bash
# 1. Crear feature branch
git checkout -b feature/mi-nueva-funcionalidad

# 2. Hacer cambios
code .

# 3. Commit y push
git add .
git commit -m "feat: agregar mi nueva funcionalidad"
git push origin feature/mi-nueva-funcionalidad

# 4. Crear Pull Request en GitHub
# - GitHub Actions ejecuta CI automáticamente
# - Revisar resultados de tests

# 5. Mergear PR a main
# - Merge en GitHub
# - GitHub Actions despliega automáticamente
```

---

## 📦 Crear un Release

### Paso 1: Actualizar Versión

```bash
# En finance-bro-api/package.json
cd finance-bro-api

# Incrementar versión automáticamente
npm version patch   # 1.0.0 → 1.0.1 (bug fixes)
npm version minor   # 1.0.1 → 1.1.0 (new features)
npm version major   # 1.1.0 → 2.0.0 (breaking changes)
```

### Paso 2: Crear Tag y Push

```bash
# Crear tag anotado
git tag -a v1.0.1 -m "Release v1.0.1: Bug fixes y mejoras"

# Push tag y commits
git push origin main --follow-tags
```

### Paso 3: Automático

GitHub Actions automáticamente:
1. ✅ Crea release en GitHub
2. ✅ Genera changelog
3. ✅ Lista imágenes Docker
4. ✅ Despliega a producción

---

## 🎯 Convenciones de Commits

Usa [Conventional Commits](https://www.conventionalcommits.org/) para changelog automático:

```bash
# Features
git commit -m "feat: agregar endpoint de mejores tasas"
git commit -m "feat(api): implementar búsqueda por nombre"

# Bug Fixes
git commit -m "fix: corregir error en validación de UUIDs"
git commit -m "fix(frontend): resolver problema de CORS"

# Documentation
git commit -m "docs: actualizar README con instrucciones de deploy"

# Refactor
git commit -m "refactor: mejorar estructura de endpoints"

# Tests
git commit -m "test: agregar tests para productos controller"

# Chores
git commit -m "chore: actualizar dependencias"
```

---

## 🔍 Monitorear Deployments

### En GitHub

1. Ve a **Actions** tab
2. Selecciona el workflow (CI/CD/Release)
3. Ver logs en tiempo real

### En EC2

```bash
# SSH a EC2
ssh -i ~/financebro-key.pem ubuntu@<IP>

# Ver logs
cd ~/Proyecto-FinanceBro
docker compose -f docker-compose.prod.yml logs -f

# Ver estado
docker compose -f docker-compose.prod.yml ps
```

---

## 🚨 Rollback

### Si el deploy falla automáticamente

GitHub Actions hace rollback automático si:
- Health check falla
- Migraciones fallan
- Contenedores no inician

### Rollback manual

```bash
# Opción 1: Revertir commit
git revert <commit-sha>
git push origin main
# GitHub Actions despliega versión anterior

# Opción 2: SSH a EC2
ssh -i ~/financebro-key.pem ubuntu@<IP>
cd ~/Proyecto-FinanceBro

# Restaurar desde backup
gunzip -c ~/backups/pre-deploy/backup_<timestamp>.sql.gz | \
docker compose -f docker-compose.prod.yml exec -T postgres psql -U financebro -d financebro_db

# Volver a versión anterior
git checkout <commit-anterior>
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 📊 Ver Estado del Pipeline

### GitHub Actions Dashboard

```
Repository → Actions

Filters:
- ✅ Success
- ❌ Failure
- ⏸️  Pending
- 🔄 Running
```

### Notificaciones

Configurar en: **Settings** → **Notifications**
- Email en failures
- Slack webhook (opcional)

---

## 🔐 Seguridad

### ⚠️ NUNCA subir secrets al código

```bash
# Archivos que NUNCA deben estar en el repo:
.env
.env.production
*.pem
*.key
secrets.json
```

### ✅ Usar GitHub Secrets

Todos los valores sensibles deben estar en:
**Settings** → **Secrets and variables** → **Actions**

---

## 🆘 Troubleshooting

### Error: "No se puede conectar a EC2"

**Solución**:
1. Verificar que `EC2_SSH_KEY` esté en secrets
2. Verificar que Security Group permita SSH desde GitHub Actions IPs
3. Verificar que la IP de EC2 sea correcta

### Error: "Docker login failed"

**Solución**:
1. Verificar `DOCKER_USERNAME` y `DOCKER_PASSWORD`
2. Crear repositorios en Docker Hub:
   - `financebro-backend`
   - `financebro-frontend`

### Error: "Migrations failed"

**Solución**:
1. SSH a EC2
2. Ver logs: `docker compose -f docker-compose.prod.yml logs backend`
3. Ejecutar manualmente: `docker compose -f docker-compose.prod.yml exec backend npm run migration:run`

### CI Pipeline falla en tests

**Solución**:
1. Verificar que los tests pasen localmente
2. Ver logs en GitHub Actions
3. Ajustar timeouts si es necesario

---

## 📚 Recursos

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Docker Hub](https://hub.docker.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

---

## ✅ Checklist de Configuración

Antes del primer deploy, asegúrate de:

- [ ] Todos los secrets configurados en GitHub
- [ ] Docker Hub account creado y repositorios listos
- [ ] EC2 configurada y accesible por SSH
- [ ] Aplicación funciona localmente con Docker Compose
- [ ] Tests pasan localmente
- [ ] `.env.example` actualizado (sin valores reales)
- [ ] `.gitignore` incluye archivos sensibles

---

## 🎉 ¡Listo!

Una vez configurado todo, el flujo es simple:

```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# GitHub Actions se encarga del resto:
# ✅ Tests
# ✅ Build
# ✅ Deploy
# ✅ Health Check
# ✅ Notificación
```

**¡Tu aplicación está en producción automáticamente! 🚀**
