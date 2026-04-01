# FinanceBro - Plataforma de Comparación Financiera

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![n8n](https://img.shields.io/badge/n8n-Automation-FF6D5A?logo=n8n)](https://n8n.io/)

Plataforma de comparación de productos financieros en Colombia con arquitectura de microservicios, automatización mediante n8n y web scraping inteligente.

---

## Estado Actual (Abril 2026)

| Componente | Estado |
|---|---|
| Backend API NestJS (20+ endpoints) | ✅ Implementado |
| Frontend React (4 comparadores) | ✅ Implementado |
| Simulador de créditos (backend + frontend) | ✅ Implementado |
| Comparación multi-producto | ✅ Implementado |
| Base de datos PostgreSQL (15 tablas) | ✅ Implementado |
| Ingesta desde n8n (scraping) | ✅ Implementado |
| Docker Compose (dev + prod) | ✅ Implementado |
| CI/CD GitHub Actions | ✅ Implementado |
| n8n Workflows (scraping + PDF) | ✅ Implementado |
| Sistema de caché Redis | 🚧 Infraestructura lista |
| Autenticación de usuarios | 📋 Roadmap Q3 2026 |
| Despliegue en producción (AWS EC2) | 📋 Pendiente |

---

## Descripción General

**FinanceBro** democratiza el acceso a información financiera en Colombia. Combina scraping automatizado (n8n), una API REST robusta (NestJS + PostgreSQL) y una interfaz moderna (React + TypeScript) para ofrecer comparaciones transparentes, simulaciones de cuotas y comparaciones multi-producto en tiempo real.

---

## Arquitectura

```
Bancos → n8n Scraping → PostgreSQL (NestJS Backend)
                              ↓
                     API REST (20+ endpoints)
                       ↙            ↘
              Swagger UI         Frontend React
                              (TanStack Query)
                                     ↓
                          Comparador + Simulador
                          FloatingBar + Dialog
```

### Microservicios (Diseño Target)

| Servicio | Responsabilidad | Estado |
|---|---|---|
| MS Productos Crediticios | Catálogo, ingesta, simulación, comparación | ✅ Implementado |
| MS Usuarios | Autenticación JWT, perfiles financieros | 📋 Q3 2026 |
| MS Notificaciones | Email, push, alertas de tasas | 📋 Q4 2026 |
| MS Configuración | UVR, SMMLV, tasa de usura, feature flags | 📋 Futuro |

---

## Componente 1: Backend API (NestJS)

API REST completamente implementada con 20+ endpoints, documentación Swagger, validación con DTOs y tests E2E.

### Módulos

#### Catálogos (`/api/catalogos`)
- `GET /entidades` — Listar entidades financieras
- `GET /entidades/:id` — Obtener entidad por UUID o nombre normalizado
- `POST /entidades` — Crear entidad financiera
- `PUT /entidades/:id` — Actualizar entidad
- `DELETE /entidades/:id` — Soft delete
- `DELETE /entidades/:id/hard` — Hard delete
- `PATCH /entidades/:id/restore` — Restaurar entidad inactiva
- `GET /tipos-credito` — Tipos de crédito
- `GET /tipos-vivienda` — Tipos de vivienda
- `GET /denominaciones` — Denominaciones (pesos, UVR)

#### Productos (`/api/productos`)
- `GET /` — Listar con filtros y paginación
- `GET /tipo-credito/:tipoCreditoId` — Filtrar por tipo (acepta código como `hipotecario`)
- `GET /entidad/:entidadId` — Filtrar por entidad
- `GET /mejores-tasas/:tipoCreditoId` — Ranking de mejores tasas
- `GET /:id` — Obtener producto completo
- `POST /` — Crear producto
- `PUT /:id` — Actualizar producto
- `DELETE /:id` — Soft delete
- `DELETE /:id/hard` — Hard delete con cascade

#### Scraping (`/api/scraping`)
- `POST /ingest` — Ingesta idempotente desde n8n (requiere `x-api-key`)

#### Simulaciones (`/api/simulaciones`)
- `POST /calcular` — Calcula cuota mensual dado monto, plazo y tasa (PMT, Sistema Francés)
- `POST /calcular-lote` — Calcula cuotas para múltiples productos en un solo request; resuelve TEA desde la DB automáticamente

#### Health (`/health`)
- `GET /health` — Estado de la API y conexión a base de datos

### Lógica de Simulación (PMT)

```
r = (1 + TEA/100)^(1/12) - 1          ← tasa mensual equivalente
PMT = P × [r(1+r)^n] / [(1+r)^n − 1] ← cuota fija (Sistema Francés)
```

- **UVR**: usa `tasa_final` (ya incluye spread + variación UVR)
- **Rango**: usa `tasa_minima` como representativa
- **Pesos**: usa `tasa_valor`

### Stack

- NestJS 11 + TypeScript 5.7
- PostgreSQL 16 + TypeORM 0.3
- Redis 7 (caché, infraestructura lista)
- Swagger UI (`/api/docs`)
- class-validator + class-transformer
- Tests E2E (7/7 passing)

### Quick Start

```bash
cd finance-bro-api
npm install
cp .env.example .env
npm run migration:run
npm run seed:catalogs
npm run start:dev

# API:     http://localhost:3000
# Swagger: http://localhost:3000/api/docs
```

---

## Componente 2: Frontend React

Interfaz de comparación con 4 tipos de crédito, simulador de cuotas por producto y comparación multi-producto.

### Comparadores disponibles

| Tipo | Ruta | Productos en DB |
|---|---|---|
| Crédito Hipotecario | `/hipotecario` | 55+ |
| Crédito de Vehículo | `/vehiculo` | ~20 |
| Crédito Educativo | `/educativo` | ~15 |
| Crédito de Libre Inversión | `/libre-inversion` | 21 |

### Funcionalidades por card

Cada card de producto (formato 3D flip, `h-[540px]`) incluye:

- **Tasa anual** con badge de nivel (Excelente / Buena / Promedio / Alta)
- **Cuota mensual estimada** calculada via `POST /api/simulaciones/calcular-lote`
- **Descripción, quick stats y beneficios**
- **4 acciones**:
  - Balanza — agregar/quitar de comparación (máx. 4 productos)
  - Calculadora — abrir `SimulationSheet` (simulador detallado)
  - Más info — voltear card (cara trasera con detalle completo)
  - Flecha — ir a la página oficial del banco

### Componentes compartidos (`/features/shared/common/`)

**`SimulationSheet`** — Panel lateral por producto con:
- Sliders editables de monto y plazo
- Cuota mensual reactiva (re-fetch automático al mover sliders vía TanStack Query)
- Total a pagar, total intereses, ahorro vs. promedio del lote
- Botón para agregar a comparación

**`ComparisonFloatingBar`** — Barra flotante (Framer Motion, slide desde abajo) que aparece al seleccionar ≥2 productos. Muestra chips con logo de cada banco y CTA "Comparar N →"

**`ComparisonDialog`** — Tabla comparativa lado a lado con:
- Tasa anual con badge de nivel
- Cuota mensual (mejor marcada con fondo esmeralda + icono TrendingDown)
- Total a pagar, total intereses, denominación, plazo máx., monto máx.

### Stack

- React 18.3.1 + TypeScript 5.8.3 + Vite 5.4.19
- Tailwind CSS 3.4 + shadcn/ui + Radix UI + Framer Motion
- TanStack Query (staleTime 5min para lote, Infinity para cálculo individual)
- HTTP client centralizado (`src/lib/api.ts`)
- Query key factory (`src/lib/query-keys.ts`)

### Quick Start

```bash
cd finance-bro-web
npm install
npm run dev
# http://localhost:5173
```

---

## Componente 3: Automatización n8n

Dos workflows automatizados para mantener los datos actualizados.

### Workflows

**TextScrapperTool** — Scraping diario (6AM Bogotá)
- 22+ nodos
- ScraperAPI + Cheerio + Gemini 2.5 Flash + GPT-4.1
- Envía datos a `POST /api/scraping/ingest` con idempotencia por `id_unico`

**PDFUrlUpdater** — Actualización quincenal (1 y 15 de cada mes, 5AM)
- 20 nodos
- Gemini 2.5 Flash para detección inteligente de URLs de PDF
- Actualiza Google Sheets (respaldo secundario)

### Quick Start

```bash
cd n8n
npm install
npm run sync  # Sube PDFUrlUpdater a n8n Cloud
```

---

## Docker (Recomendado)

El setup de desarrollo usa volúmenes montados — los cambios en código local se reflejan automáticamente sin rebuilds.

```bash
# Levantar toda la stack
docker compose up -d

# Verificar estado
docker ps

# Ver logs del backend
docker logs financebro-backend -f

# Ejecutar migraciones
docker compose exec backend npm run migration:run
docker compose exec backend npm run seed:catalogs
```

### Servicios

| Contenedor | Puerto | Descripción |
|---|---|---|
| `financebro-backend` | 3000 | API NestJS + Swagger |
| `financebro-frontend` | 5173 | React + Vite (dev) |
| `financebro-postgres` | 5432 | PostgreSQL 16 |
| `financebro-redis` | 6379 | Redis 7 |

---

## Flujo de Datos

```
Bancos → n8n (scraping diario 6AM)
              ↓
    POST /api/scraping/ingest
              ↓
    PostgreSQL (15 tablas, histórico de tasas)
              ↓
    GET /api/productos/tipo-credito/:tipo
    POST /api/simulaciones/calcular-lote
              ↓
    Frontend (TanStack Query, 5min stale)
    ├── Cards con cuota estimada
    ├── SimulationSheet (simulador individual)
    └── ComparisonDialog (comparación multi-producto)
```

---

## Estructura del Repositorio

```
Proyecto-FinanceBro/
├── .claude/
│   ├── CLAUDE.md                     # Contexto para Claude Code
│   └── settings.local.json
│
├── .github/workflows/                # CI/CD GitHub Actions
│   ├── ci.yml                        # Lint, tests, Docker builds, Trivy
│   ├── cd.yml                        # Build + push Docker Hub + deploy EC2
│   └── release.yml                   # GitHub releases automáticos
│
├── finance-bro-api/                  # Backend NestJS
│   └── src/
│       ├── catalogos/                # Entidades, tipos, denominaciones
│       ├── productos/                # Productos crediticios (8 endpoints)
│       ├── scraping/                 # Ingesta desde n8n
│       ├── simulaciones/             # PMT + calcular-lote
│       └── health/                   # Health checks
│
├── finance-bro-web/                  # Frontend React
│   └── src/
│       ├── features/
│       │   ├── mortgage-loans/       # BankCard + BankComparison
│       │   ├── vehicle-credits/      # VehicleCard + VehicleComparison
│       │   ├── education-credits/    # EducationCard + EducationComparison
│       │   ├── inversion-credits/    # InversionCard + InversionComparison
│       │   └── shared/common/        # SimulationSheet, ComparisonFloatingBar, ComparisonDialog
│       └── lib/
│           ├── api.ts                # HTTP client centralizado
│           └── query-keys.ts         # TanStack Query key factory + types
│
├── n8n/                              # Workflows de automatización
│   ├── TextScrapperTool.json         # Scraping diario
│   └── PDFUrlUpdater.json            # Actualización PDFs (Gemini AI)
│
├── docker-compose.yml                # Stack de desarrollo
├── docker-compose.prod.yml           # Stack de producción
└── .env.example                      # Variables de entorno de ejemplo
```

---

## Roadmap

### Q1 2026 ✅ Completado
- [x] Backend API NestJS (20+ endpoints, tests E2E 7/7)
- [x] PostgreSQL con 15 tablas, migraciones y seeds
- [x] Ingesta desde n8n con idempotencia
- [x] Swagger UI documentado
- [x] Frontend integrado con API (TanStack Query)
- [x] 4 comparadores de crédito (hipotecario, vehículo, educativo, libre inversión)
- [x] Simulador de cuotas por producto (PMT, Sistema Francés)
- [x] Simulación por lote (`calcular-lote`) para mostrar cuotas en cards
- [x] Comparación multi-producto (FloatingBar + Dialog)
- [x] Cards 3D flip con cuota estimada, 4 acciones y SimulationSheet
- [x] Docker Compose (desarrollo con volúmenes + producción multi-stage)
- [x] CI/CD GitHub Actions (lint, tests, build, deploy EC2, releases)
- [x] n8n TextScrapperTool (scraping diario) + PDFUrlUpdater (Gemini AI)

### Q2 2026
- [ ] Sistema de caché Redis en endpoints frecuentes
- [ ] Despliegue en producción (AWS EC2)
- [ ] Créditos personales y automotriz (scraping + comparador)
- [ ] Tests unitarios backend y frontend
- [ ] Monitoreo con Prometheus + Grafana

### Q3 2026
- [ ] Autenticación de usuarios (JWT + refresh tokens)
- [ ] Dashboard de usuario (favoritos, historial de simulaciones)
- [ ] Tarjetas de crédito y seguros
- [ ] Sistema de alertas de cambios de tasas

### Q4 2026
- [ ] Inversiones (CDT, Fondos, Acciones)
- [ ] App móvil (React Native)
- [ ] Sistema de recomendaciones con IA
- [ ] Notificaciones push

---

## Variables de Entorno

```bash
# Backend (finance-bro-api/.env)
DATABASE_HOST=localhost        # "postgres" en Docker
DATABASE_PORT=5432
DATABASE_USER=financebro
DATABASE_PASSWORD=password123
DATABASE_NAME=financebro_db
REDIS_HOST=localhost           # "redis" en Docker
REDIS_PORT=6379
PORT=3000
N8N_API_KEY=tu_clave_secreta
JWT_SECRET=min_32_caracteres

# Frontend (finance-bro-web/.env)
VITE_API_URL=http://localhost:3000
```

---

## Links

- **Swagger UI**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/health
- **Google Sheets** (respaldo): https://docs.google.com/spreadsheets/d/1yUR0Tow3yrbSemyzmsqDY4VoF113wrxfCwVDhSTOsoM/edit?usp=sharing
- **Guía Docker**: [DOCKER_DEPLOYMENT_GUIDE.md](DOCKER_DEPLOYMENT_GUIDE.md)
- **Guía AWS EC2**: [AWS_EC2_DEPLOYMENT.md](AWS_EC2_DEPLOYMENT.md)
- **Guía CI/CD**: [CICD_QUICKSTART.md](CICD_QUICKSTART.md)

---

**Versión**: v1.2.0 | **Última actualización**: Abril 2026
