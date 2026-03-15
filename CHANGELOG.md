# Changelog

All notable changes to FinanceBro will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- CI/CD Pipeline con GitHub Actions
- Despliegue automático a AWS EC2
- Workflows para testing, build, y deploy
- Control de versiones con Semantic Versioning
- Documentación completa de despliegue

---

## [1.0.0] - 2026-01-29

### Added
- ✨ Backend API con NestJS
  - Endpoints CRUD completos para productos
  - Búsqueda por UUID o nombre normalizado/código
  - Endpoint de mejores tasas
  - Soft delete y hard delete
  - Swagger documentation
  - Health check endpoint

- ✨ Base de Datos PostgreSQL
  - Esquema completo con migraciones
  - Catálogos de entidades financieras
  - Tipos de crédito, vivienda, denominaciones
  - Seeds para datos de prueba
  - Soporte para idempotencia de n8n

- ✨ Frontend React
  - Comparador de créditos hipotecarios
  - UI con Tailwind CSS y shadcn/ui
  - Integración con API (preparada)

- ✨ Infraestructura
  - Docker Compose para desarrollo y producción
  - Nginx como reverse proxy
  - Redis para caché
  - pgAdmin para gestión de BD

- 📚 Documentación
  - README completo
  - Guía de despliegue en AWS EC2
  - Guía de CI/CD
  - Quick start guides

### Technical Details
- Node.js 20
- NestJS 10
- PostgreSQL 16
- Redis 7
- React 18
- TypeScript 5
- Docker & Docker Compose

---

## [0.1.0] - 2026-01-15

### Added
- 🎨 Prototipo inicial del frontend
- 📊 Datos hardcoded de créditos hipotecarios
- 🤖 Sistema de scraping con n8n
- 📁 Almacenamiento en Google Sheets

### Technical Details
- React 18.3.1
- Vite 5.4.19
- Tailwind CSS 3.4.17
- n8n Cloud automation

---

## Release Notes

### v1.0.0 - Primera Versión Completa

Esta es la primera versión completa de FinanceBro con backend, base de datos, y sistema de despliegue.

**Highlights**:
- ✅ 8 endpoints REST completamente funcionales
- ✅ Swagger UI para documentación interactiva
- ✅ Búsqueda amigable por nombre (no solo UUID)
- ✅ Sistema de versiones y rollback
- ✅ CI/CD completamente automatizado
- ✅ Dockerizado y listo para producción

**Breaking Changes**: Ninguno (primera release)

**Migration Guide**:
1. Clonar repositorio
2. Configurar variables de entorno
3. Ejecutar migraciones
4. Ejecutar seeds
5. Acceder a Swagger: http://localhost:3000/api/docs

---

## Convenciones

### Tipos de Cambios
- `Added` - Nueva funcionalidad
- `Changed` - Cambios en funcionalidad existente
- `Deprecated` - Funcionalidad que será removida
- `Removed` - Funcionalidad removida
- `Fixed` - Corrección de bugs
- `Security` - Correcciones de seguridad

### Semantic Versioning
- **MAJOR** (X.0.0): Breaking changes
- **MINOR** (0.X.0): Nueva funcionalidad compatible
- **PATCH** (0.0.X): Bug fixes y mejoras menores

---

## Roadmap 2026

### Q2 2026
- [ ] Integración completa frontend-backend
- [ ] Sistema de cache con Redis
- [ ] Créditos personales y automotriz
- [ ] Tests E2E completos
- [ ] Monitoreo con Prometheus y Grafana

### Q3 2026
- [ ] Tarjetas de crédito
- [ ] Seguros (auto, vida, hogar)
- [ ] Sistema de recomendaciones con IA
- [ ] Autenticación de usuarios (JWT)

### Q4 2026
- [ ] Inversiones (CDT, Fondos, Acciones)
- [ ] App móvil (React Native)
- [ ] Notificaciones push
- [ ] Dashboard analytics

---

[Unreleased]: https://github.com/tu-usuario/Proyecto-FinanceBro/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/tu-usuario/Proyecto-FinanceBro/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/tu-usuario/Proyecto-FinanceBro/releases/tag/v0.1.0
