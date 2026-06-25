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

## Estado Actual (Junio 2026)

| Componente | Estado |
|---|---|
| Backend API NestJS — MS Productos (20+ endpoints) | ✅ Implementado |
| MS Usuarios — Autenticación JWT (registro / login / me) | ✅ Implementado |
| Frontend React (4 comparadores + login/registro) | ✅ Implementado |
| Simulador de créditos (backend + frontend) | ✅ Implementado |
| Comparación multi-producto | ✅ Implementado |
| Base de datos PostgreSQL (2 DBs: productos + usuarios) | ✅ Implementado |
| Ingesta desde n8n (scraping) | ✅ Implementado |
| Pipeline anti-bot (Playwright PDF + Tunnel Proxy) | ✅ Implementado |
| Docker Compose (dev + prod) | ✅ Implementado |
| CI/CD GitHub Actions | ✅ Implementado |
| n8n Workflows (scraping + PDF) | 🚧 Testing |
| Migración a Supabase (Postgres gestionado) | 🚧 In Progress |
| Sistema de caché Redis | 🚧 Infraestructura lista |
| Despliegue en producción (AWS / Hostinger) | 📋 Pendiente |

---

## Descripción General

**FinanceBro** democratiza el acceso a información financiera en Colombia. Combina scraping automatizado (n8n), una API REST robusta (NestJS + PostgreSQL) y una interfaz moderna (React + TypeScript) para ofrecer comparaciones transparentes, simulaciones de cuotas y comparaciones multi-producto en tiempo real.

---

## Arquitectura

```
                    Bancos (sitios web + PDFs)
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                    ▼
   n8n Scraping (6AM)              Playwright PDF Service (anti-bot)
            │                                    │
            └──────────► Tunnel Proxy :3002 ◄────┘
                         (Cloudflare Tunnel)
                              │
                  POST /api/scraping/ingest
                              ▼
              ┌──────── PostgreSQL ────────┐
              │  financebro_db   |  financebro_users_db
              ▼                           ▼
   MS Productos (NestJS :3000)   MS Usuarios (NestJS :3001)
   catálogo · simulación · API    auth JWT · perfiles
              │                           │
              └─────────────┬─────────────┘
                            ▼
                 Frontend React (TanStack Query) :5173
            Comparadores · Simulador · Login / Registro
```

### Microservicios

| Servicio | Responsabilidad | Estado |
|---|---|---|
| MS Productos Crediticios (`finance-bro-api`) | Catálogo, ingesta, simulación, comparación | ✅ Implementado |
| MS Usuarios (`finance-bro-users-api`) | Autenticación JWT (registro / login / me) | ✅ Implementado |
| MS Notificaciones | Email, push, alertas de tasas | 📋 Q4 2026 |
| MS Configuración | UVR, SMMLV, tasa de usura, feature flags | 📋 Futuro |

### Servicios de soporte (pipeline de scraping)

| Servicio | Puerto | Responsabilidad |
|---|---|---|
| `playwright-pdf-service` | 3001 (local) | Extracción de PDFs con Chromium real, evadiendo protección anti-bot |
| `tunnel-proxy` | 3002 | Unifica API NestJS (`/api/*`) y Playwright PDF (`/pdf/*`) bajo un único túnel Cloudflare hacia n8n Cloud |

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

## Componente 2: MS Usuarios (Autenticación)

Microservicio independiente (`finance-bro-users-api`, puerto **3001**) con su propia base de datos (`financebro_users_db`). Maneja registro, login y sesión vía JWT, completamente aislado del MS de Productos.

### Endpoints (`/api/auth`)

- `POST /registro` — Crear cuenta de usuario
- `POST /login` — Autenticar y emitir JWT
- `GET /me` — Obtener perfil del usuario autenticado (requiere `Authorization: Bearer <token>`)

### Stack

- NestJS 11 + TypeScript + TypeORM 0.3
- PostgreSQL (`financebro_users_db`) — base de datos separada del catálogo
- JWT con Passport (strategies + guards) — `JWT_SECRET` / `JWT_EXPIRATION`
- Health check (`/health`)

### Quick Start

```bash
cd finance-bro-users-api
npm install
cp .env.example .env
npm run start:dev
# API: http://localhost:3001
```

---

## Componente 3: Frontend React

Interfaz de comparación con 4 tipos de crédito, simulador de cuotas por producto y comparación multi-producto.

### Rutas

| Página | Ruta | Productos en DB |
|---|---|---|
| Inicio | `/` | — |
| Hub de créditos | `/creditos` | — |
| Crédito Hipotecario | `/creditos-hipotecarios` | 55+ |
| Crédito de Vehículo | `/creditos-vehiculo` | ~20 |
| Crédito Educativo | `/creditos-educativos` | ~15 |
| Crédito de Libre Inversión | `/creditos-libre-inversion` | 21 |
| Login | `/login` | — |
| Registro | `/registro` | — |

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

## Componente 4: Automatización n8n

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

### Servicios (docker-compose)

| Contenedor | Puerto | Descripción |
|---|---|---|
| `financebro-backend` | 3000 | MS Productos — API NestJS + Swagger |
| `financebro-users-api` | 3001 | MS Usuarios — Autenticación JWT |
| `financebro-frontend` | 5173 | React + Vite (dev) |
| `financebro-postgres` | 5432 | PostgreSQL 16 (`financebro_db` + `financebro_users_db`) |
| `financebro-redis` | 6379 | Redis 7 |
| `financebro-pgadmin` | 5050 | Gestión de BD (opcional) |

> **Pipeline de scraping** (`playwright-pdf-service` + `tunnel-proxy`) se ejecuta **localmente** —fuera de docker-compose— porque expone un túnel Cloudflare hacia n8n Cloud. Ver `tunnel-proxy/README.md`.

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

## Diseño y Branding

Identidad visual completa definida en el Manual de Marca oficial de FinanceBro.  
Todos los assets están disponibles en `finance-bro-web/public/brand/`.

---

### Paleta de Colores

La paleta está compuesta por 5 colores con proporciones de uso definidas.

| Token | Nombre | Hex | HSL | Proporción | Uso principal |
|-------|--------|-----|-----|-----------|---------------|
| `brand-electric` | **Blue Electric** | `#303AE4` | `237 77% 54%` | 35% | Primario — botones, logo, CTAs, links |
| `brand-ocean` | **Deep Ocean** | `#052659` | `216 89% 18%` | 25% | Secundario — navbar, headers, fondos oscuros |
| `brand-mist` | **Sky Mist** | `#C2E8FF` | `203 100% 88%` | 20% | Neutro — fondos claros, equilibrio visual |
| `brand-sunset` | **Sunset Orange** | `#FBB347` | `36 96% 63%` | 10% | Acento — badges, highlights, énfasis puntual |
| `brand-dark` | **Dark Blue** | `#0D1B2A` | `211 53% 11%` | 10% | Texto principal sobre fondo claro |

**Reglas de color:**
- Los fondos de marca son **mesh gradients** combinando los 5 colores, dominados por Blue Electric y Deep Ocean
- Nunca usar Blue Electric como fondo extenso de texto de cuerpo — solo en elementos de acento
- Sunset Orange se reserva para highlights puntuales; el overuse lo debilita
- Sobre fondos azul oscuro siempre usar texto blanco o Sky Mist, nunca gris neutro

**Archivos de gradientes disponibles:**

| Archivo | Ruta pública |
|---------|-------------|
| Gradiente 01 | `/brand/gradients/gradient-01.jpg` |
| Gradiente 02 | `/brand/gradients/gradient-02.jpg` |
| Gradiente 03 | `/brand/gradients/gradient-03.jpg` |
| Gradiente 04 | `/brand/gradients/gradient-04.jpg` |

---

### Tipografía

Dos familias con roles distintos y complementarios.

#### Syne — Display / Titulares

| Uso | Tamaño ref. | Peso |
|-----|-------------|------|
| Hero / Display principal | 88pt | Bold 700 |
| H1 de sección | 74pt | Bold 700 |
| H2 | 62pt | Bold 700 |
| H3 | 52pt | Bold 700 |
| H4 | 42pt | Bold 700 |
| H5 | 36pt | Bold 700 |

#### Poppins — Cuerpo / UI

| Uso | Tamaño ref. | Peso |
|-----|-------------|------|
| Subtítulo grande | 25pt | Semibold 600 |
| Subtítulo regular | 20pt | Semibold 600 |
| Cuerpo de texto | 16pt | Regular 400 |
| Labels / captions | 12pt | Light 300 |

**Reglas tipográficas:**
- Syne se usa **exclusivamente** en títulos y display — nunca en párrafos
- Poppins Light solo para textos secundarios y captions, nunca en titulares
- No mezclar más de dos familias en una misma pantalla
- Descarga: `/brand/fonts/Syne.zip` y `/brand/fonts/Poppins.zip`

---

### Sistema de Logos

El sistema de identidad tiene tres piezas con aplicaciones diferentes.

#### Las tres piezas

| Pieza | Descripción | Uso | Tamaño mínimo |
|-------|-------------|-----|---------------|
| **Imagotipo** | Símbolo F + wordmark "FinanceBro" | Versión **principal** en toda comunicación | 80px ancho |
| **Logotipo** | Solo wordmark "FinanceBro" | Uso secundario cuando el símbolo ya está presente | 80px ancho |
| **Isotipo / Símbolo** | Solo el símbolo geométrico F | App icon, favicon, espacios reducidos | 35px ancho |

#### Construcción del símbolo

El isotipo es un **F geométrico** formado por tres polígonos en Blue Electric (`#303AE4`):
- **Barra horizontal superior** — triángulo trapecio orientado a la derecha
- **Barra vertical izquierda** — rectángulo diagonal que define la altura
- **Detalle central** — triángulo de remate en la intersección

#### Variantes de color

| Variante | Descripción | Cuándo usar |
|----------|-------------|-------------|
| **Color** | Símbolo en Blue Electric + wordmark en Dark Blue | Fondos blancos o claros |
| **Positivo** | Todo en Dark Blue (`#0D1B2A`) | Fondos muy claros, impresión monocromo |
| **Negativo** | Todo en blanco (`#FFFFFF`) | Fondos oscuros, Deep Ocean, Blue Electric, fotografías |

#### Archivos disponibles

```
/brand/logos/
├── svg/
│   ├── imagotipo-color.svg       ← USO PRINCIPAL en web
│   ├── imagotipo-negativo.svg    ← sobre fondos azul/oscuro
│   ├── imagotipo-positivo.svg
│   ├── logotipo-color.svg
│   ├── logotipo-negativo.svg
│   ├── logotipo-positivo.svg
│   ├── simbolo-color.svg         ← favicon / app icon
│   ├── simbolo-negativo.svg
│   └── simbolo-positivo.svg
├── png/                          ← mismas variantes
└── jpg/                          ← variantes color y positivo
```

**Zona de seguridad:** el espacio libre alrededor del logo debe ser ≥ la altura del símbolo aislado.

#### Reglas de uso del logo

✅ **Permitido**
- Logo color sobre fondo blanco o Sky Mist
- Logo negativo (blanco) sobre Deep Ocean, Blue Electric o fotografías oscuras
- Escalar proporcionalmente manteniendo relación de aspecto

❌ **Prohibido**
- Cambiar los colores del logo por colores no definidos en la paleta
- Deformar, rotar o sesgar el logo
- Usar el logo sobre fondos que no generen suficiente contraste
- Agregar sombras, contornos o efectos visuales al logo
- Usar por debajo del tamaño mínimo (80px imagotipo / 35px isotipo)

---

### Iconografía

10 iconos de marca con estilo **line icon bicolor**.

**Estilo:** trazos en Deep Ocean (`#052659`) con detalles de acento en Blue Electric (`#303AE4`). Stroke uniforme, sin relleno sólido.

| Icono | Descripción | Archivo SVG | Archivo PNG |
|-------|-------------|-------------|-------------|
| Buscar | Lupa de búsqueda | `/brand/icons/svg/buscar.svg` | `/brand/icons/png/buscar.png` |
| Dinero | Billete / moneda | `/brand/icons/svg/dinero.svg` | `/brand/icons/png/dinero.png` |
| Dinero 2 | Variante billete | `/brand/icons/svg/dinero-2.svg` | `/brand/icons/png/dinero-2.png` |
| Dinero 3 | Variante monedas | `/brand/icons/svg/dinero-3.svg` | `/brand/icons/png/dinero-3.png` |
| Esquema | Diagrama / estructura | `/brand/icons/svg/esquema.svg` | `/brand/icons/png/esquema.png` |
| Flecha | Dirección / acción | `/brand/icons/svg/flecha.svg` | `/brand/icons/png/flecha.png` |
| Gráfico | Chart de barras | `/brand/icons/svg/grafico.svg` | `/brand/icons/png/grafico.png` |
| Gráfico 2 | Variante chart línea | `/brand/icons/svg/grafico-2.svg` | `/brand/icons/png/grafico-2.png` |
| Nube | Nube / cloud | `/brand/icons/svg/nube.svg` | `/brand/icons/png/nube.png` |
| Porcentaje | Símbolo % / tasa | `/brand/icons/svg/porcentaje.svg` | `/brand/icons/png/porcentaje.png` |

**Nota:** Para la UI del producto se usa la librería **Lucide React** (ya instalada). Los iconos de marca se usan en materiales de comunicación, presentaciones y piezas gráficas.

---

### Patrones de Marca

Patrón decorativo basado en la repetición del isotipo F en distintos tamaños y opacidades. Disponible en las 5 variantes de color de la paleta.

| Color | Archivos |
|-------|---------|
| **Blue Electric** | `/brand/patterns/blue-electric/patron-01.png` · `patron-02.png` · `patron-03.png` |
| **Dark Blue** | `/brand/patterns/dark-blue/patron-01.png` · `patron-02.png` · `patron-03.png` |
| **Deep Ocean** | `/brand/patterns/deep-ocean/patron-01.png` · `patron-02.png` · `patron-03.png` |
| **Sky Mist** | `/brand/patterns/sky-mist/patron-01.png` · `patron-02.png` · `patron-03.png` |
| **Sunset Orange** | `/brand/patterns/sunset-orange/patron-01.png` · `patron-02.png` · `patron-03.png` |

Los tres archivos por color corresponden a variaciones de densidad/escala del patrón.

---

### Assets de Marca — Índice Completo

```
finance-bro-web/public/brand/
├── logos/
│   ├── svg/    (9 archivos — formato recomendado para web)
│   ├── png/    (9 archivos — con fondo transparente)
│   └── jpg/    (6 archivos — variantes color y positivo)
├── gradients/
│   └── gradient-01.jpg … gradient-04.jpg
├── icons/
│   ├── svg/    (10 iconos de marca)
│   └── png/    (10 iconos de marca)
├── patterns/
│   ├── blue-electric/   (3 variantes)
│   ├── dark-blue/       (3 variantes)
│   ├── deep-ocean/      (3 variantes)
│   ├── sky-mist/        (3 variantes)
│   └── sunset-orange/   (3 variantes)
├── fonts/
│   ├── Syne.zip
│   └── Poppins.zip
└── manual-de-marca.pdf
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
├── finance-bro-api/                  # MS Productos — Backend NestJS (:3000)
│   └── src/
│       ├── catalogos/                # Entidades, tipos, denominaciones
│       ├── productos/                # Productos crediticios (8 endpoints)
│       ├── scraping/                 # Ingesta desde n8n
│       ├── simulaciones/             # PMT + calcular-lote
│       └── health/                   # Health checks
│
├── finance-bro-users-api/            # MS Usuarios — Auth NestJS (:3001)
│   └── src/
│       ├── auth/                     # registro / login / me (JWT, guards, strategies)
│       ├── users/                    # Entidad y servicio de usuarios
│       └── health/                   # Health checks
│
├── finance-bro-web/                  # Frontend React (:5173)
│   └── src/
│       ├── features/
│       │   ├── mortgage-loans/       # BankCard + BankComparison
│       │   ├── vehicle-credits/      # VehicleCard + VehicleComparison
│       │   ├── education-credits/    # EducationCard + EducationComparison
│       │   ├── inversion-credits/    # InversionCard + InversionComparison
│       │   └── shared/common/        # SimulationSheet, ComparisonFloatingBar, ComparisonDialog
│       ├── pages/                    # Index, Credits, Login, Registro, comparadores
│       └── lib/
│           ├── api.ts                # HTTP client centralizado
│           └── query-keys.ts         # TanStack Query key factory + types
│
├── playwright-pdf-service/           # Extracción de PDFs anti-bot (Express + Chromium)
├── tunnel-proxy/                     # Reverse proxy Cloudflare (API + PDF) → n8n (:3002)
│
├── n8n/                              # Workflows de automatización
│   ├── TextScrapperTool.json         # Scraping diario
│   └── PDFUrlUpdater.json            # Actualización PDFs (Gemini AI)
│
├── scripts/                          # Utilidades (convert-to-webp.js, etc.)
├── docs/                             # Guías: Docker, CI/CD, CHANGELOG, costos de despliegue
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
- [x] MS Usuarios — Autenticación JWT (registro / login / me) + páginas frontend
- [x] Pipeline anti-bot (Playwright PDF Service + Tunnel Proxy Cloudflare)
- [ ] Migración de PostgreSQL a Supabase (Postgres gestionado) — 🚧 en progreso
- [ ] Sistema de caché Redis en endpoints frecuentes
- [ ] Despliegue en producción (AWS / Hostinger)
- [ ] Créditos personales y automotriz (scraping + comparador)
- [ ] Tests unitarios backend y frontend
- [ ] Monitoreo con Prometheus + Grafana

### Q3 2026
- [ ] Dashboard de usuario (favoritos, historial de simulaciones)
- [ ] Perfiles financieros (ingresos, capacidad de endeudamiento)
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
# MS Productos (finance-bro-api/.env)
DATABASE_HOST=localhost        # "postgres" en Docker
DATABASE_PORT=5432
DATABASE_USER=financebro
DATABASE_PASSWORD=password123
DATABASE_NAME=financebro_db
REDIS_HOST=localhost           # "redis" en Docker
REDIS_PORT=6379
PORT=3000
N8N_API_KEY=tu_clave_secreta

# MS Usuarios (finance-bro-users-api/.env)
DATABASE_HOST=localhost        # "postgres" en Docker
DATABASE_PORT=5432
DATABASE_USER=financebro
DATABASE_PASSWORD=password123
DATABASE_NAME=financebro_users_db
PORT=3001
JWT_SECRET=min_32_caracteres
JWT_EXPIRATION=7d

# Frontend (finance-bro-web/.env)
VITE_API_URL=http://localhost:3000
```

---

## Links

- **Swagger UI** (MS Productos): http://localhost:3000/api/docs
- **Health Check** (MS Productos): http://localhost:3000/health
- **MS Usuarios** (Auth): http://localhost:3001/api/auth
- **Google Sheets** (respaldo): https://docs.google.com/spreadsheets/d/1yUR0Tow3yrbSemyzmsqDY4VoF113wrxfCwVDhSTOsoM/edit?usp=sharing
- **Guía de Despliegue (Hostinger VPS + Supabase + Playwright local)**: [docs/HOSTINGER_DEPLOYMENT.md](docs/HOSTINGER_DEPLOYMENT.md)
- **Guía Docker**: [docs/DOCKER_DEPLOYMENT_GUIDE.md](docs/DOCKER_DEPLOYMENT_GUIDE.md)
- **Guía CI/CD**: [docs/CICD_QUICKSTART.md](docs/CICD_QUICKSTART.md)
- **Changelog**: [docs/CHANGELOG.md](docs/CHANGELOG.md)
- **Costos de despliegue**: [docs/Costos_Despliegue_FinanceBro.xlsx](docs/Costos_Despliegue_FinanceBro.xlsx)

---

**Versión**: v1.3.0 | **Última actualización**: Junio 2026
