# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# Contexto del Proyecto FinanceBro

## Descripción

**FinanceBro** es una plataforma de comparación de productos financieros en Colombia con arquitectura de microservicios.

**Stack**: React + TypeScript + NestJS + PostgreSQL + Redis + n8n + Docker

**Objetivo**: Democratizar el acceso a información financiera transparente y actualizada en tiempo real.

**Estado Actual**: Backend API completamente implementado (20+ endpoints incluyendo módulo de Simulaciones), Frontend integrado con API real via TanStack Query con 4 comparadores de crédito, simulador de cuotas individual (SimulationSheet) y comparación multi-producto (ComparisonFloatingBar + ComparisonDialog), Infraestructura Docker lista con volúmenes de desarrollo, CI/CD con GitHub Actions configurado, n8n con 2 workflows (scraping + PDF URL updater).

---

## Quick Start (Desarrollo Local)

### 1. Iniciar Backend (Primera Vez)

```bash
# 1. Iniciar PostgreSQL con Docker
cd docker
docker compose up -d

# 2. Configurar backend
cd ../finance-bro-api
npm install
cp .env.example .env  # Editar si es necesario

# 3. Ejecutar migraciones y seeds
npm run migration:run
npm run seed:catalogs

# 4. Iniciar backend
npm run start:dev

# 5. Acceder a Swagger: http://localhost:3000/api/docs
```

### 2. Iniciar Frontend

```bash
cd finance-bro-web
npm install
npm run dev

# Acceder a: http://localhost:5173
```

### 3. Probar Endpoint de Ingesta

1. Ir a [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
2. Click en "Authorize" (candado superior derecho)
3. Ingresar API key del .env (valor de `N8N_API_KEY`)
4. Probar `POST /api/scraping/ingest` con el ejemplo prellenado

### 4. Desarrollo con Docker

```bash
# Iniciar toda la stack (frontend + backend + DB + Redis)
docker compose up -d --build

# Ver logs
docker compose logs -f

# Ejecutar migraciones dentro del contenedor
docker compose exec backend npm run migration:run
docker compose exec backend npm run seed:catalogs
```

---

## Arquitectura de Microservicios

### Justificación

- **Escalabilidad selectiva**: Escalar solo los componentes que lo requieran
- **Despliegue independiente**: Sin afectar otros servicios
- **Aislamiento de fallos**: Errores contenidos y no propagados
- **Especialización tecnológica**: Stack homogéneo NestJS + PostgreSQL

### Microservicios

#### 1. MS Usuarios (Authentication & Profile)
**Responsabilidades**:
- Autenticación JWT y gestión de sesiones
- Perfiles financieros (ingresos, capacidad de endeudamiento)
- Preferencias de notificación
- Productos favoritos e historial de simulaciones

#### 2. MS Productos Crediticios (Core Business)
**Responsabilidades**:
- Catálogo de productos financieros actualizado
- Ingesta de datos desde n8n (scraping)
- Motor de comparación y rankings personalizados
- Simulador de créditos
- Detección de cambios en tasas (eventos al message broker)

#### 3. MS Notificaciones (Communication)
**Responsabilidades**:
- Email transaccional y marketing
- Notificaciones push
- Alertas de cambio de tasas
- Templates de comunicación
- Auditoría de notificaciones enviadas

#### 4. MS Configuración (Regulatory Data)
**Responsabilidades**:
- Valor UVR (actualización diaria)
- SMMLV (clasificación VIS/No VIS)
- Tasa de usura (límite legal)
- Feature flags
- API con cache de alto rendimiento

### Comunicación entre Servicios

- **Síncrona (HTTP/REST)**: Consultas de productos, valores UVR (API Gateway + circuit breakers)
- **Asíncrona (Redis Pub/Sub o RabbitMQ)**: Eventos de cambio de tasas, notificaciones

---

## Backend API - Módulos Implementados

### Módulo Scraping (Ingesta de Datos)

**Endpoint principal**: `POST /api/scraping/ingest`

**Autenticación**: Header `x-api-key` con valor de `N8N_API_KEY` del .env

**Funcionalidad**:
- Recibe datos desde n8n (workflow de scraping)
- Idempotencia: usa `id_unico_scraping` para evitar duplicados
- Detección automática de cambios en tasas
- Almacena histórico completo de tasas

**Ejemplo de request**:
```json
{
"id_unico":"bancolombia__creditohipotecarioparacompradevivienda__vis__uvr", 
"banco": 
"Bancolombia",
"tipo_credito": "Crédito hipotecario para compra de vivienda",
"tipo_vivienda": "VIS",
"denominacion": "UVR",
"tipo_tasa": "Tasa efectiva anual",
"tasa": "UVR + 6.50%",
"tasa_final": "12.04%",
"uvr_variacion_anual": "5.20%",
"tasa_minima": "",
"tasa_maxima": "",
"monto_minimo": "",
"monto_maximo": "$262,635,750 millones",
"plazo_maximo": "",
"tipo_pago": "",
"descripcion": "Crédito hipotecario para vivienda de interés social en UVR.", 
"condiciones": "Valor comercial del inmueble desde $0 hasta $262,635,750 millones (VIS); Financiación hasta el 80% para VIS; Valor mínimo del inmueble: 40 SMMLV",
"requisitos": "Ingresos desde 1 SMMLV; Avaluó y estudio jurídico; Documentación personal y laboral",
"descuento_nomina": "",  
"beneficio_avaluo": "",
"fecha_extraccion": "2026-01-30",
"hora_extraccion": "14:44:15",
"url_pagina": "https://www.bancolombia.com/personas/creditos/vivienda/credito-hipotecario-para-comprar-vivienda",
"url_pdf": "https://"
},
```

### Módulo Productos

**Endpoints**:
- `GET /api/productos` - Listar todos con filtros y paginación
- `GET /api/productos/tipo-credito/:tipoCreditoId` - Filtrar por tipo de crédito (acepta código como "hipotecario")
- `GET /api/productos/entidad/:entidadId` - Filtrar por entidad financiera
- `GET /api/productos/mejores-tasas/:tipoCreditoId` - Ranking de mejores tasas
- `GET /api/productos/:id` - Obtener producto completo por UUID o nombre
- `POST /api/productos` - Crear producto
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Soft delete (marca `activo: false`)
- `DELETE /api/productos/:id/hard` - Hard delete con cascade

**DTOs** (en `src/productos/dto/`):
- `create-producto.dto.ts` - Validación para crear productos
- `update-producto.dto.ts` - Validación parcial para actualizar
- `query-productos.dto.ts` - Paginación y filtros (`page`, `limit`, `entidad`, `tipo_vivienda`, `denominacion`)
- `producto-response.dto.ts` - Transformación de respuesta API

### Módulo Catálogos

**Endpoints**:
- `GET /api/catalogos/entidades` - Listar entidades financieras
- `GET /api/catalogos/entidades/:id` - Obtener entidad por UUID o nombre normalizado
- `POST /api/catalogos/entidades` - Crear entidad financiera
- `PUT /api/catalogos/entidades/:id` - Actualizar entidad
- `DELETE /api/catalogos/entidades/:id` - Soft delete (valida que no tenga productos)
- `DELETE /api/catalogos/entidades/:id/hard` - Hard delete
- `PATCH /api/catalogos/entidades/:id/restore` - Restaurar entidad inactiva
- `GET /api/catalogos/tipos-credito` - Tipos de crédito
- `GET /api/catalogos/tipos-vivienda` - Tipos de vivienda
- `GET /api/catalogos/denominaciones` - Denominaciones (pesos, UVR)

**DTOs** (en `src/catalogos/dto/`):
- `create-entidad-financiera.dto.ts`
- `update-entidad-financiera.dto.ts`
- `entidad-financiera-response.dto.ts`

### Módulo Simulaciones

**Endpoints**:
- `POST /api/simulaciones/calcular` — Calcula cuota mensual dado monto, plazo y tasa EA (PMT Sistema Francés). Cálculo puro, sin acceso a DB.
- `POST /api/simulaciones/calcular-lote` — Calcula cuotas para múltiples productos en un request. Resuelve la TEA desde la DB según denominación (UVR usa `tasa_final`, rango usa `tasa_minima`, pesos usa `tasa_valor`). Devuelve array de resultados + promedio.

**Fórmula PMT**:
```
r = (1 + TEA/100)^(1/12) - 1
PMT = P × [r(1+r)^n] / [(1+r)^n − 1]
```

**DTOs** (en `src/simulaciones/dto/`):
- `calcular-simulacion.dto.ts` — monto, plazo_meses, tasa_anual
- `calcular-lote.dto.ts` — monto, plazo_meses, producto_ids (array UUID, max 100)
- `resultado-simulacion.dto.ts` — ResultadoSimulacionDto, ResultadoLoteItemDto, ResultadoLoteDto

**Uso típico en frontend**: El comparador llama `calcular-lote` con todos los producto_ids visibles para mostrar la cuota estimada en cada card. La SimulationSheet llama `calcular` individualmente con los sliders del usuario (monto/plazo editables).

### Módulo Health

**Endpoint**: `GET /health`

**Respuesta**:
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" }
  }
}
```

### Documentación Swagger

Acceder a [http://localhost:3000/api/docs](http://localhost:3000/api/docs) para:
- Documentación interactiva de todos los endpoints
- Probar endpoints directamente desde el navegador
- Ver schemas de validación (DTOs)
- Autenticarse con API key

---

## Modelo de Datos - MS Productos Crediticios

### Catálogos (Datos Maestros)

**entidades_financieras**
- `id`, `nombre`, `nombre_normalizado` (para URLs), `logo_url`, `sitio_web`, `activo`

**tipos_credito**
- `id`, `codigo` (hipotecario, consumo, vehiculo), `nombre`, `activo`

**tipos_vivienda**
- `id`, `codigo` (vis, no_vis, vip, aplica_ambos), `valor_maximo_smmlv`

**denominaciones**
- `id`, `codigo` (pesos, uvr)

**tipos_tasa**
- `id`, `codigo` (efectiva_anual, nominal_mensual)

**tipos_pago**
- `id`, `codigo` (cuota_fija, cuota_variable)

### Productos

**productos_credito**
- `id`, `id_unico_scraping` (idempotencia N8N), `entidad_id`, `tipo_credito_id`
- `tipo_vivienda_id`, `denominacion_id`, `tipo_tasa_id`, `tipo_pago_id`
- `descripcion`, `url_pagina`, `url_pdf`, `activo`

### Tasas

**tasas_vigentes**
- `producto_id` (UNIQUE), `tasa_valor`, `tasa_texto_original`
- `tasa_final` (conversión UVR a EA), `uvr_variacion_anual` (variación del UVR)
- `tasa_minima`, `tasa_maxima`, `es_rango`, `fecha_vigencia`

**tasas_historicas**
- `producto_id`, `tasa_valor`, `tasa_final`, `uvr_variacion_anual`
- `fecha_extraccion`, `hora_extraccion`
- Histórico completo de cambios de tasas

### Condiciones

**montos_productos**
- `producto_id`, `monto_minimo`, `monto_maximo`
- `plazo_minimo_meses`, `plazo_maximo_meses`
- `porcentaje_financiacion_min`, `porcentaje_financiacion_max`

**condiciones_productos**
- `producto_id`, `condicion`, `orden`

**requisitos_productos**
- `producto_id`, `requisito`, `tipo_requisito`, `es_obligatorio`, `orden`

**beneficios_productos**
- `producto_id`, `tipo_beneficio`, `descripcion`, `valor`, `aplica_condicion`
- Ejemplo: `descuento_nomina`, `+200 pbs`, `Con Cuenta de Nómina`

### Auditoría Scraping

**ejecuciones_scraping**
- `entidad_id`, `fecha_inicio`, `fecha_fin`, `estado`
- `productos_encontrados`, `productos_actualizados`, `productos_nuevos`
- `errores`, `metadata` (jsonb)

**cambios_tasas**
- `producto_id`, `tasa_anterior`, `tasa_nueva`, `diferencia`
- `fecha_cambio`, `evento_publicado` (flag para message broker)

### Valores Regulatorios

**valor_uvr**
- `fecha` (UNIQUE), `valor`

**valor_smmlv**
- `anio` (UNIQUE), `valor`

### Analytics (Interno del Microservicio)

**redirecciones**
- `usuario_id` (externo MS Usuarios), `producto_id`, `session_id`
- `url_destino`, `user_agent`, `created_at`

**simulaciones**
- `usuario_id`, `session_id`, `producto_id`
- `monto_solicitado`, `plazo_meses`, `tasa_aplicada`
- `cuota_mensual_calculada`, `total_intereses`, `costo_total_credito`

---

## Diseño y Branding

### Paleta de Colores

**Blues (Primary)**
- `#0466C8` - Primary blue
- `#0353A4` - Primary hover
- `#023E7D` - Dark blue
- `#002855` - Darker blue (headers)
- `#001845` - Navy (navegación)
- `#001233` - Darkest (backgrounds)

**Grays (Neutral)**
- `#33415C` - Dark gray (texto principal)
- `#5C677D` - Medium gray (texto secundario)
- `#7D8597` - Gray (subtítulos)
- `#979DAC` - Light gray (bordes)

**Dark Accents**
- `#000814` - Near black
- `#001D3D` - Dark navy
- `#003566` - Deep blue (CTAs secundarios)

**Yellow (Accent)**
- `#FFC300` - Gold (CTAs, highlights)
- `#FFD60A` - Primary accent yellow (badges)

**Uso**:
- Botones primarios: `#0466C8` → `#0353A4` (hover)
- Botones acción: `#FFC300` → `#FFD60A` (hover)
- Acentos: `#FFC300` para tasas y descuentos

---

## Stack Tecnológico

### Frontend
- React 18.3.1 + TypeScript 5.8.3 + Vite 5.4.19
- Tailwind CSS 3.4.17 + shadcn/ui + Radix UI + Framer Motion
- TanStack Query + React Hook Form + Zod

### Backend (✅ IMPLEMENTADO)
- NestJS 11 + TypeScript 5.7
- PostgreSQL 16 + TypeORM 0.3
- Redis 7 (caché)
- Swagger UI (documentación automática)
- class-validator + class-transformer (validación)

### Infraestructura
- Docker + Docker Compose (desarrollo y producción)
- Nginx (reverse proxy)
- pgAdmin (opcional, gestión de BD)

### Automatización
- n8n Cloud + Google Sheets API + Node.js 18+

---

## Flujo de Datos

### Implementado (Marzo 2026)
```
Bancos → n8n Scraping → PostgreSQL (NestJS Backend)
                              ↓
                        Histórico de tasas
                        Catálogos normalizados
                              ↓
                        Backend API (REST) ← Swagger UI
                              ↓
                        Frontend (TanStack Query) ✅ INTEGRADO
```

### Almacenamiento Dual (Temporal)
```
n8n → PostgreSQL (NestJS) ✅ PRINCIPAL
  └→ Google Sheets ⚠️ SECUNDARIO (respaldo)
```

### n8n Workflows
```
1. TextScrapperTool  → Scraping diario (6AM) → Ingesta a PostgreSQL
2. PDFUrlUpdater     → Actualización quincenal (1y15) → URLs de PDFs en Google Sheets
                       Usa Gemini 2.5 Flash para detección inteligente de URLs
```

### Objetivo Final
```
Bancos → n8n → PostgreSQL (NestJS) → Backend API → Redis Cache → Frontend
                    ↓                     ↓
              Histórico tasas      Swagger UI / API Docs
```

---

## Estructura del Repositorio

```
Proyecto-FinanceBro/
├── .claude/
│   ├── settings.local.json
│   └── CLAUDE.md                     # Este archivo
│
├── .github/                          # ✅ CI/CD con GitHub Actions
│   └── workflows/
│       ├── ci.yml                    # Lint, tests, Docker builds, security scans
│       ├── cd.yml                    # Build, push Docker Hub, deploy EC2
│       └── release.yml               # GitHub releases automáticos
│
├── finance-bro-api/                  # ✅ Backend NestJS (18+ endpoints)
│   ├── src/
│   │   ├── catalogos/                # Módulo de catálogos (controller, service, DTOs)
│   │   │   ├── catalogos.controller.ts  # 7 endpoints CRUD entidades
│   │   │   ├── catalogos.service.ts
│   │   │   ├── catalogos.module.ts
│   │   │   └── dto/                  # Create, Update, Response DTOs
│   │   ├── productos/                # Módulo de productos crediticios
│   │   │   ├── productos.controller.ts  # 8 endpoints (filtros, paginación, CRUD)
│   │   │   ├── productos.service.ts     # 15+ métodos de negocio
│   │   │   ├── productos.module.ts
│   │   │   ├── dto/                  # Create, Update, Query, Response DTOs
│   │   │   └── entities/             # Entidades TypeORM
│   │   ├── scraping/                 # Módulo de ingesta desde n8n
│   │   │   ├── scraping.controller.ts
│   │   │   ├── scraping.service.ts   # Idempotencia + detección de cambios
│   │   │   └── dto/
│   │   ├── simulaciones/             # Módulo de simulación de créditos
│   │   │   ├── simulaciones.controller.ts  # POST /calcular, POST /calcular-lote
│   │   │   ├── simulaciones.service.ts     # PMT Sistema Francés + resolución TEA
│   │   │   ├── simulaciones.module.ts
│   │   │   └── dto/                  # CalcularSimulacion, CalcularLote, Resultado DTOs
│   │   ├── health/                   # Health checks (Terminus)
│   │   ├── database/                 # Migraciones y data source
│   │   └── app.module.ts
│   ├── test/                         # Tests E2E (7/7 passing)
│   ├── scripts/                      # Seeds (seed-catalogs.ts)
│   ├── Dockerfile                    # Multi-stage build (4 stages)
│   ├── .dockerignore
│   └── STARTUP_GUIDE.md
│
├── finance-bro-web/                  # ✅ Frontend React (integrado con API)
│   ├── src/
│   │   ├── components/ui/            # shadcn/ui (40+)
│   │   ├── features/
│   │   │   ├── mortgage-loans/       # Comparador hipotecario
│   │   │   │   ├── BankCard.tsx      # Card 3D flip h-[540px] con cuota estimada
│   │   │   │   ├── BankComparison.tsx # Comparador con batch query + FloatingBar + Dialog
│   │   │   │   ├── CreditFilters.tsx  # Filtros de búsqueda
│   │   │   │   ├── useProductosHipotecarios.ts  # Hook TanStack Query
│   │   │   │   └── types.ts          # Interfaces TypeScript
│   │   │   ├── vehicle-credits/      # Comparador vehículo (mismo patrón)
│   │   │   ├── education-credits/    # Comparador educativo (mismo patrón)
│   │   │   ├── inversion-credits/    # Comparador libre inversión (mismo patrón)
│   │   │   └── shared/
│   │   │       ├── common/
│   │   │       │   ├── SimulationSheet.tsx       # Panel lateral de simulación individual
│   │   │       │   ├── ComparisonFloatingBar.tsx  # Barra flotante multi-selección
│   │   │       │   └── ComparisonDialog.tsx       # Tabla comparativa lado a lado
│   │   │       └── layout/
│   │   │           └── Header.tsx    # Sin botones auth, con badge Beta
│   │   ├── lib/
│   │   │   ├── api.ts               # HTTP client (fetch wrapper + apiFetch genérico)
│   │   │   ├── query-keys.ts        # TanStack Query key factory (productos + simulaciones)
│   │   │   └── utils.ts
│   │   ├── pages/
│   │   └── hooks/
│   ├── Dockerfile                    # Multi-stage build + Nginx
│   ├── nginx.conf                    # Reverse proxy + API proxy + gzip + caching
│   └── components.json
│
├── n8n/                              # Sistema de automatización (2 workflows)
│   ├── TextScrapperTool.json        # Workflow scraping diario (22+ nodos)
│   ├── PDFUrlUpdater.json           # Workflow actualización PDFs quincenal (20 nodos, Gemini AI)
│   ├── sync-workflow.js             # Herramienta de sync a n8n Cloud
│   └── backups/
│
├── docker-compose.yml                # Docker desarrollo
├── docker-compose.prod.yml           # Docker producción
├── .env.example                      # Variables de entorno de ejemplo
│
├── DOCKER_DEPLOYMENT_GUIDE.md        # Guía completa de Docker
├── AWS_EC2_DEPLOYMENT.md             # Guía de despliegue en AWS
├── CICD_QUICKSTART.md                # Guía rápida de CI/CD
├── CHANGELOG.md                      # Historial de cambios
└── README.md                         # Documentación principal
```

---

## Variables de Entorno

### Backend API (finance-bro-api/.env)
```env
# Database
DATABASE_HOST=localhost        # "postgres" en Docker
DATABASE_PORT=5432
DATABASE_USER=financebro
DATABASE_PASSWORD=password123  # Cambiar en producción
DATABASE_NAME=financebro_db

# Redis (opcional, para caché futuro)
REDIS_HOST=localhost          # "redis" en Docker
REDIS_PORT=6379
REDIS_PASSWORD=               # Opcional

# API
PORT=3000
NODE_ENV=development          # "production" en despliegue

# Security
N8N_API_KEY=tu_clave_secreta_para_n8n  # Debe coincidir con n8n
JWT_SECRET=secret             # Cambiar en producción (min 32 chars)
JWT_EXPIRATION=7d

# TypeORM
TYPEORM_LOGGING=false         # true para debug
```

### Frontend (finance-bro-web/.env)
```env
VITE_API_URL=http://localhost:3000  # URL del backend
```

### n8n
```env
N8N_API_KEY=tu_api_key        # Debe coincidir con backend
N8N_HOST=https://tu-instancia.n8n.cloud
```

### Docker (.env en raíz del proyecto)
```env
# PostgreSQL
POSTGRES_USER=financebro
POSTGRES_PASSWORD=password123
POSTGRES_DB=financebro_db

# Puertos
BACKEND_PORT=3000
FRONTEND_PORT=5173
POSTGRES_PORT=5432
REDIS_PORT=6379
PGADMIN_PORT=5050

# pgAdmin (opcional)
PGADMIN_DEFAULT_EMAIL=admin@financebro.com
PGADMIN_DEFAULT_PASSWORD=admin123
```

**⚠️ IMPORTANTE**: Nunca commitear archivos .env con valores reales. Usar .env.example con valores de ejemplo.

---

## Productos Financieros

### Disponibles
✅ **Créditos Hipotecarios**: 50+ bancos colombianos

### Roadmap
🔜 Créditos Personales, Automotriz, Empresariales
🔜 Seguros (Vida, Auto, Hogar)
🔜 Tarjetas de Crédito (Sin anualidad, Cashback, Millas)
🔜 Inversiones (CDT, Fondos, Bonos, Acciones)

---

## Roadmap 2026

**Q1 2026** (Enero - Abril)
- [x] Comparador de créditos hipotecarios (Frontend)
- [x] Sistema n8n con scraping automatizado
- [x] Backend API con NestJS + PostgreSQL + TypeORM
- [x] Endpoint de ingesta desde n8n (con tests E2E)
- [x] Swagger UI documentation
- [x] Docker Compose (desarrollo con volúmenes + producción multi-stage)
- [x] Documentación de despliegue (AWS EC2, Docker)
- [x] Sistema de migraciones y seeds
- [x] Integración frontend ↔ backend API (TanStack Query + api.ts + query-keys.ts)
- [x] CI/CD con GitHub Actions (ci.yml, cd.yml, release.yml)
- [x] Controllers completos: Productos (8 endpoints), Catálogos (7 endpoints)
- [x] DTOs con validación (class-validator) para todos los módulos
- [x] Workflow PDFUrlUpdater con Gemini AI para actualización de URLs
- [x] Cards 3D flip con tasa, cuota estimada, descripción, beneficios y 4 acciones
- [x] CORS para Cloudflare tunnels (desarrollo remoto)
- [x] Módulo Simulaciones (POST /calcular + POST /calcular-lote, PMT Sistema Francés)
- [x] SimulationSheet — panel lateral por producto con sliders reactivos
- [x] ComparisonFloatingBar — selección multi-producto con Framer Motion
- [x] ComparisonDialog — tabla comparativa lado a lado (mejor cuota destacada)
- [x] 4 comparadores completos: hipotecario, vehículo, educativo, libre inversión
- [x] Header simplificado (badge Beta, sin botones de autenticación)
- [ ] Despliegue en AWS EC2 (producción)

**Q2 2026** (Abril - Junio)
- [ ] Sistema de caché con Redis (implementación completa)
- [ ] Créditos personales y automotriz
- [ ] Tests unitarios completos (backend y frontend)
- [ ] Monitoreo con Prometheus y Grafana

**Q3 2026** (Julio - Septiembre)
- [ ] Tarjetas de crédito
- [ ] Seguros (auto, vida, hogar)
- [ ] Sistema de recomendaciones con IA
- [ ] Autenticación de usuarios (JWT + refresh tokens)
- [ ] Dashboard de usuario

**Q4 2026** (Octubre - Diciembre)
- [ ] Inversiones (CDT, Fondos, Acciones)
- [ ] App móvil (React Native)
- [ ] Notificaciones push
- [ ] Analytics dashboard
- [ ] Sistema de alertas de cambios de tasas

---

## Comandos Esenciales

### Backend API (NestJS)

```bash
cd finance-bro-api

# Desarrollo
npm install               # Instalar dependencias
npm run start:dev         # Iniciar en modo desarrollo (hot-reload)
npm run start:debug       # Iniciar con debugger
npm run build             # Compilar TypeScript
npm run start:prod        # Iniciar en producción

# Base de Datos
npm run migration:generate -- src/database/migrations/NombreMigracion
npm run migration:create -- src/database/migrations/NombreMigracion
npm run migration:run     # Ejecutar migraciones pendientes
npm run migration:revert  # Revertir última migración
npm run migration:show    # Ver estado de migraciones
npm run seed:catalogs     # Poblar catálogos iniciales

# Tests
npm run test              # Tests unitarios
npm run test:watch        # Tests en modo watch
npm run test:cov          # Coverage report
npm run test:e2e          # Tests E2E (endpoint de ingesta)
npm run test:debug        # Tests con debugger

# Calidad de código
npm run lint              # ESLint
npm run format            # Prettier
```

**URLs del Backend:**
- API: [http://localhost:3000](http://localhost:3000)
- Swagger UI: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- Health Check: [http://localhost:3000/health](http://localhost:3000/health)

### Frontend (React)

```bash
cd finance-bro-web

# Desarrollo
npm install               # Instalar dependencias
npm run dev               # Iniciar desarrollo (http://localhost:5173)
npm run build             # Build para producción
npm run build:dev         # Build en modo desarrollo
npm run preview           # Preview del build
npm run lint              # Linter
```

### Docker (Desarrollo y Producción)

```bash
# Desarrollo (con hot-reload)
docker compose up -d --build              # Iniciar todos los servicios
docker compose logs -f                    # Ver logs en tiempo real
docker compose logs -f backend            # Logs de un servicio específico
docker compose ps                         # Ver estado de servicios
docker compose down                       # Detener servicios
docker compose down -v                    # Detener y eliminar volúmenes

# Producción
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml logs -f
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml down

# Ejecutar comandos en contenedores
docker compose exec backend npm run migration:run
docker compose exec backend npm run seed:catalogs
docker compose exec backend npm run test:e2e
docker compose exec postgres psql -U financebro -d financebro_db
docker compose exec redis redis-cli

# Gestión de base de datos
docker compose exec postgres pg_dump -U financebro financebro_db > backup.sql
cat backup.sql | docker compose exec -T postgres psql -U financebro -d financebro_db
```

### n8n (Automatización)

```bash
cd n8n
npm install
npm run sync              # Sincronizar workflow a cloud
```

### Git y Deployment

```bash
# Desarrollo local
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# Crear release
cd finance-bro-api
npm version patch         # 1.0.0 → 1.0.1
npm version minor         # 1.0.1 → 1.1.0
npm version major         # 1.1.0 → 2.0.0
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin main --follow-tags
```

---

## Troubleshooting Común

### Backend no conecta a PostgreSQL

**Síntomas**: `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Soluciones**:
```bash
# 1. Verificar que PostgreSQL esté corriendo
docker ps | grep postgres

# 2. Si no está corriendo, iniciarlo
cd docker
docker compose up -d

# 3. Si estás en Docker, usar DATABASE_HOST=postgres (no localhost)
```

### Migraciones no se ejecutan

**Síntomas**: `No migrations were found`

**Soluciones**:
```bash
# 1. Verificar que existan archivos de migración
ls -la finance-bro-api/src/database/migrations/

# 2. Si no existen, generar migración inicial
npm run migration:generate -- src/database/migrations/InitialSchema

# 3. Ejecutar migraciones
npm run migration:run
```

### API key inválida en Swagger

**Síntomas**: `401 Unauthorized: API key requerida`

**Soluciones**:
1. Verificar que `N8N_API_KEY` esté en `.env`
2. Hacer click en "Authorize" en Swagger
3. Copiar exactamente el valor de `N8N_API_KEY` (sin espacios)
4. Si cambiaste el `.env`, reiniciar el backend

### Puerto 3000 ya está en uso

**Síntomas**: `Error: listen EADDRINUSE: address already in use :::3000`

**Soluciones**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9

# O cambiar puerto en .env
PORT=3001
```

### Docker: Permission denied

**Síntomas**: `Error: EACCES: permission denied` en volúmenes

**Soluciones**:
```bash
# Linux
sudo chown -R $USER:$USER finance-bro-api finance-bro-web

# Windows
# Verificar que Docker Desktop tenga acceso a la carpeta
# Settings → Resources → File Sharing
```

### Tests E2E fallan

**Síntomas**: Tests fallan con errores de timeout

**Soluciones**:
```bash
# 1. Verificar que PostgreSQL esté corriendo
docker ps

# 2. Limpiar base de datos de test
npm run migration:revert
npm run migration:run

# 3. Aumentar timeouts en jest.config (si es necesario)
```

---

## Enlaces y Documentación

### Documentación del Proyecto
- **README Principal**: [README.md](../README.md)
- **Guía de Inicio del Backend**: [finance-bro-api/STARTUP_GUIDE.md](../finance-bro-api/STARTUP_GUIDE.md)
- **Guía de Despliegue Docker**: [DOCKER_DEPLOYMENT_GUIDE.md](../DOCKER_DEPLOYMENT_GUIDE.md)
- **Guía de Despliegue AWS EC2**: [AWS_EC2_DEPLOYMENT.md](../AWS_EC2_DEPLOYMENT.md)
- **Guía Rápida CI/CD**: [CICD_QUICKSTART.md](../CICD_QUICKSTART.md)
- **Changelog**: [CHANGELOG.md](../CHANGELOG.md)

### Recursos Externos
- **Google Sheets Database** (respaldo): https://docs.google.com/spreadsheets/d/1yUR0Tow3yrbSemyzmsqDY4VoF113wrxfCwVDhSTOsoM/edit?usp=sharing
- **NestJS Docs**: https://docs.nestjs.com/
- **TypeORM Docs**: https://typeorm.io/
- **n8n Docs**: https://docs.n8n.io/api/
- **Swagger OpenAPI**: https://swagger.io/specification/
- **Docker Docs**: https://docs.docker.com/

---

## Recordatorios Importantes para Desarrollo

### Al Modificar Entidades (TypeORM)

1. **SIEMPRE generar migración** después de cambiar entidades:
   ```bash
   npm run migration:generate -- src/database/migrations/DescripcionCambio
   ```

2. **NO hacer** cambios destructivos sin migración (pérdida de datos)

3. **Probar migración** en desarrollo antes de producción:
   ```bash
   npm run migration:run
   npm run migration:show  # Verificar
   ```

### Al Agregar Nuevos Endpoints

1. **Documentar con Swagger**:
   ```typescript
   @ApiOperation({ summary: 'Descripción del endpoint' })
   @ApiResponse({ status: 200, description: 'Respuesta exitosa' })
   ```

2. **Validar entrada** con DTOs y `class-validator`

3. **Agregar tests E2E** en `test/` directory

4. **Actualizar Swagger** UI: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

### Al Hacer Deploy

1. **Verificar secrets** en .env (NO usar valores de ejemplo)

2. **Ejecutar tests** antes de deploy:
   ```bash
   npm run test
   npm run test:e2e
   ```

3. **Crear backup** de BD antes de cambios mayores:
   ```bash
   docker compose exec postgres pg_dump -U financebro financebro_db > backup.sql
   ```

4. **Verificar health check** después de deploy:
   ```bash
   curl http://localhost:3000/health
   ```

### Al Trabajar con Docker

1. **NO eliminar volúmenes** en producción (`docker compose down -v`)

2. **Usar multi-stage builds** para optimizar tamaño de imágenes

3. **Verificar logs** si algo falla:
   ```bash
   docker compose logs -f <service-name>
   ```

4. **Ejecutar comandos dentro del contenedor**:
   ```bash
   docker compose exec backend npm run migration:run
   ```

---

**Última actualización**: Abril 2026
**Versión del proyecto**: v1.2.0
**Estado**: Backend + Frontend integrados (20+ endpoints, 4 comparadores, simulador + comparación multi-producto), CI/CD configurado, Docker listo para producción

---

## Estado del Proyecto (Marzo 2026)

### ✅ Completado

- **Backend API NestJS**: 20+ endpoints REST
  - Productos: 8 endpoints (CRUD, filtros, paginación, mejores tasas)
  - Catálogos: 7 endpoints (CRUD entidades, soft/hard delete, restore)
  - Scraping: Ingesta idempotente desde n8n
  - Simulaciones: POST /calcular (PMT puro) + POST /calcular-lote (batch con resolución TEA desde DB)
  - Health: Health checks con Terminus
  - DTOs completos con class-validator para todos los módulos
  - Tests E2E (7/7 passing)
  - Swagger UI documentado
  - CORS multi-origen (localhost + Cloudflare tunnels)

- **Base de Datos PostgreSQL**: Esquema completo
  - 15 tablas creadas
  - Catálogos poblados
  - Histórico de tasas con tasa_final y uvr_variacion_anual
  - Sistema de idempotencia

- **Frontend React**: Integrado con API real
  - TanStack Query (5min stale para lote, Infinity para cálculo individual)
  - HTTP client centralizado (`src/lib/api.ts`)
  - Query key factory (`src/lib/query-keys.ts`) con interfaces de simulación
  - 4 comparadores: hipotecario, vehículo, educativo, libre inversión
  - Cards 3D flip `h-[540px]` con cuota estimada por batch query
  - SimulationSheet con sliders reactivos (re-fetch automático al cambiar monto/plazo)
  - ComparisonFloatingBar con Framer Motion (aparece ≥2 productos)
  - ComparisonDialog con tabla comparativa y mejor cuota destacada
  - Header con badge Beta (sin botones de auth)
  - 40+ componentes shadcn/ui reutilizables

- **Infraestructura Docker**:
  - `docker-compose.yml` - Desarrollo con volúmenes montados (hot-reload automático)
  - `docker-compose.prod.yml` - Producción (multi-stage, non-root, security hardening)
  - Nginx reverse proxy con gzip, caching, security headers
  - Dockerfiles multi-stage para backend y frontend

- **CI/CD con GitHub Actions**:
  - `ci.yml` - Lint, tests, Docker builds, Trivy security scans
  - `cd.yml` - Build + push Docker Hub + deploy EC2 con rollback
  - `release.yml` - GitHub releases automáticos en tags

- **n8n Automatización** (2 workflows):
  - `TextScrapperTool.json` - Scraping diario 6AM (22+ nodos, ScraperAPI + Gemini + GPT-4.1)
  - `PDFUrlUpdater.json` - Actualización PDFs quincenal 1y15 (20 nodos, Gemini 2.5 Flash)

### 🚧 En Progreso

- Sistema de caché con Redis (infraestructura lista, implementación pendiente)
- Despliegue en AWS EC2 (documentación lista, ejecución pendiente)

### 📋 Próximos Pasos

1. Implementar caché Redis en endpoints frecuentes
2. Desplegar en producción (AWS EC2)
3. Tests unitarios completos (backend y frontend)
4. Expandir a otros productos financieros (créditos personales, automotriz)

---

## Notas Clave para Desarrollo

### Backend (NestJS)

1. **Autenticación API**: Header `x-api-key` requerido para endpoint de ingesta
2. **Idempotencia**: Campo `id_unico_scraping` previene duplicados en ingesta
3. **Validación**: Usar DTOs con `class-validator` para toda entrada de datos
4. **Migraciones**: SIEMPRE generar migración después de cambiar entidades TypeORM
5. **Tests E2E**: Correr `npm run test:e2e` antes de hacer commits importantes
6. **Swagger**: Decoradores `@ApiProperty`, `@ApiOperation`, `@ApiTags` para documentación

### Frontend

1. **Integración API**: Conectado via TanStack Query + `src/lib/api.ts`
2. **Query Keys**: Usar factory en `src/lib/query-keys.ts` para type safety. Incluye `simulacionQueries.lote()` y `simulacionQueries.single()`
3. **Hooks**: Custom hooks por feature (ej: `useProductosHipotecarios`, `useProductosEducativos`)
4. **Componentes**: Usar shadcn/ui existentes antes de crear nuevos
5. **Cards (todos los tipos)**: 3D flip `h-[540px]`, frente con tasa, cuota estimada (batch API), descripción, beneficios, stats y 4 botones (comparar/simular/más info/solicitar). Reverso con detalle completo.
6. **Componentes compartidos** (`src/features/shared/common/`):
   - `SimulationSheet` — panel lateral con sliders editables, re-fetch automático al cambiar monto/plazo
   - `ComparisonFloatingBar` — barra flotante con AnimatePresence, aparece con ≥2 productos seleccionados
   - `ComparisonDialog` — tabla comparativa multi-producto con mejor cuota destacada
7. **Cálculos financieros**: SIEMPRE en el backend vía `/api/simulaciones`. Nunca calcular PMT en el frontend.
8. **Paleta de colores**: Seguir branding definido (blues, grays, yellow accent `#FFC300`)
9. **Responsive**: Mobile-first approach con Tailwind
10. **Env**: `VITE_API_URL` apunta al backend (default: `http://localhost:3000`)

### Base de Datos

1. **Catálogos**: Poblar con `npm run seed:catalogs` después de migraciones
2. **Histórico de tasas**: NUNCA eliminar, solo agregar (para análisis futuro)
3. **Soft Delete**: Productos usan soft delete por defecto (campo `activo`)
4. **UUIDs**: Todos los IDs usan UUID v4 para evitar colisiones

### Docker

1. **Desarrollo**: Usar `docker-compose.yml` (hot-reload habilitado)
2. **Producción**: Usar `docker-compose.prod.yml` (multi-stage builds optimizados)
3. **Volúmenes**: NO eliminar con `-v` en producción (pérdida de datos)
4. **Health Checks**: Configurados en todos los servicios para debugging

### Flujo de Trabajo Git

1. **Commits**: Usar Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)
2. **Versioning**: Semantic Versioning (MAJOR.MINOR.PATCH)
3. **Tags**: Crear tags para releases (`v1.0.0`)
4. **CI/CD**: GitHub Actions se activa automáticamente en push a main

### Seguridad

1. **Secrets**: NUNCA commitear `.env`, `.pem`, `*.key`
2. **API Keys**: Rotar periódicamente en producción
3. **Passwords**: Mínimo 32 caracteres para JWT_SECRET
4. **CORS**: Configurado para `localhost:5173` + `*.trycloudflare.com` (dev). En producción usar `CORS_ORIGIN` env var con dominios separados por coma
5. **Vite**: `allowedHosts: [".trycloudflare.com"]` para desarrollo con tunnels
6. **Cloudflare tunnels**: `cloudflared tunnel --url http://localhost:5173` para exponer frontend

### n8n Automatización

1. **TextScrapperTool**: Scraping diario a las 6AM (Bogotá). Usa ScraperAPI, Cheerio, Gemini 2.5 Flash, GPT-4.1
2. **PDFUrlUpdater**: Actualización quincenal (1 y 15 de cada mes, 5AM). Usa Gemini 2.5 Flash para detección inteligente de URLs
3. **Credenciales**: Google Sheets (`rWJE0ntmYwzYmIeB`), Gemini (`bntGnSACL2Hk8ZhX`), OpenAI (`f53Aggp0OmXdCukb`)
4. **Sync**: `cd n8n && npm run sync` sube PDFUrlUpdater.json a n8n Cloud por defecto
5. **Estrategias PDF**: Banks clasificados en pattern (URL predecible), crawl (Gemini), validate_only (URL estática), no_pdf