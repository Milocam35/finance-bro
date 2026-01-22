# FinanceBro API - Backend de Ingesta

Backend NestJS para el sistema de ingesta de datos de productos financieros desde n8n hacia PostgreSQL.

## 🚀 Características

- **Framework**: NestJS 10+ con TypeScript
- **Base de datos**: PostgreSQL 16+ con TypeORM
- **Validación**: class-validator + class-transformer
- **Documentación**: Swagger/OpenAPI (próximamente)
- **Seguridad**: API Key authentication para n8n

## 📋 Requisitos Previos

- Node.js 18+
- Docker y Docker Compose
- npm o yarn

## 🛠️ Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus valores
```

3. Levantar PostgreSQL con Docker:
```bash
cd docker
docker compose up -d
```

4. Ejecutar migraciones (próximamente):
```bash
npm run migration:run
```

## 🏃 Ejecución

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start:prod
```

## 📁 Estructura del Proyecto

```
src/
├── catalogos/          # Entidades de catálogos (bancos, tipos, etc)
├── productos/          # Entidades de productos crediticios
├── scraping/           # Módulo de ingesta desde n8n (próximamente)
├── database/           # Configuración DB y migraciones
├── common/             # Utilidades compartidas
└── config/             # Configuración de variables de entorno
```

## 🔑 Variables de Entorno

Ver `.env.example` para todas las variables disponibles.

Variables críticas:
- `DATABASE_*`: Configuración de PostgreSQL
- `N8N_API_KEY`: API Key para autenticación de n8n
- `PORT`: Puerto de la aplicación (default: 3000)

## 📚 Documentación API

La documentación Swagger estará disponible en: `http://localhost:3000/api/docs` (próximamente)

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 🐳 Docker

```bash
# Levantar PostgreSQL
cd docker
docker compose up -d

# Ver logs
docker compose logs -f

# Detener
docker compose down
```

## 📝 Notas de Desarrollo

- Las entidades TypeORM están en `src/catalogos/entities` y `src/productos/entities`
- Los parsers de datos están en `src/common/utils/parsers.util.ts`
- La configuración de la base de datos está en `src/config/configuration.ts`

## 🔄 Roadmap de Desarrollo - Ingesta n8n → PostgreSQL

### ✅ Día 1: Setup Inicial (COMPLETADO)
- [x] Crear proyecto NestJS con estructura de carpetas
- [x] Instalar dependencias (@nestjs/typeorm, pg, class-validator, etc.)
- [x] Configurar Docker Compose para PostgreSQL
- [x] Definir 14 entidades TypeORM (6 catálogos + 8 productos)
- [x] Crear utilidades de parsing (montos, tasas, plazos)
- [x] Configurar variables de entorno
- [x] Crear .gitignore y documentación

### ✅ Día 2: Migraciones y Seeds (COMPLETADO)
- [x] Configurar TypeORM para migraciones (data-source.ts)
- [x] Agregar scripts de migración a package.json (6 scripts)
- [x] Generar migración inicial: InitialSchema (15 tablas)
- [x] Ejecutar migraciones con migration:run
- [x] Crear script de seed para catálogos iniciales
- [x] Ejecutar seed: 14 registros insertados (4+4+2+2+2)
- [x] Corregir modelo ProductoCredito según requisitos n8n
- [x] Actualizar entidad TasaVigente (tasa_valor nullable)
- [x] Verificar estructura en PostgreSQL

**Archivos creados**:
- [src/database/data-source.ts](src/database/data-source.ts) - Configuración TypeORM CLI
- [src/database/migrations/1769107001162-InitialSchema.ts](src/database/migrations/1769107001162-InitialSchema.ts) - Migración inicial
- [src/database/migrations/1769108445014-UpdateProductoCreditoFields.ts](src/database/migrations/1769108445014-UpdateProductoCreditoFields.ts) - Correcciones del modelo
- [scripts/seed-catalogs.ts](scripts/seed-catalogs.ts) - Script de seed idempotente

**Scripts npm agregados**:
- `migration:generate` - Generar migraciones desde entidades
- `migration:run` - Ejecutar migraciones pendientes
- `migration:revert` - Revertir última migración
- `migration:show` - Mostrar estado de migraciones
- `migration:create` - Crear migración vacía
- `seed:catalogs` - Ejecutar seed de catálogos

**Cambios en el modelo de datos**:
- `productos_credito`: Split `url_pagina` → `url_extraccion` + `url_redireccion`
- `productos_credito`: Agregados `fecha_extraccion` (DATE) y `hora_extraccion` (TIME)
- `productos_credito`: `tipo_vivienda_id` ahora NOT NULL (era nullable)
- `productos_credito`: `tipo_pago_id` ahora nullable (era NOT NULL)
- `productos_credito`: `descripcion` ahora NOT NULL (era nullable)
- `tasas_vigentes`: `tasa_valor` ahora nullable (permite rangos sin valor único)

### 📋 Día 3: Módulo de Catálogos
- [ ] Crear CatalogosModule
- [ ] Implementar CatalogosService con métodos:
  - [ ] `findEntidadByNombre(nombre_normalizado)`
  - [ ] `createEntidad(data)`
  - [ ] `findTipoCreditoByCodigo(codigo)`
  - [ ] `findTipoViviendaByCodigo(codigo)`
  - [ ] `findDenominacionByCodigo(codigo)`
  - [ ] `findTipoTasaByCodigo(codigo)`
  - [ ] `findTipoPagoByCodigo(codigo)`
- [ ] Tests unitarios de CatalogosService

### 📋 Día 4: Módulo de Productos
- [ ] Crear ProductosModule
- [ ] Implementar ProductosService con métodos:
  - [ ] `findByIdUnico(id_unico_scraping)`
  - [ ] `create(data)`
  - [ ] `update(id, data)`
  - [ ] `getTasaVigente(producto_id)`
  - [ ] `createTasaVigente(data)`
  - [ ] `updateTasaVigente(producto_id, data)`
  - [ ] `insertTasaHistorica(data)`
  - [ ] `upsertMontos(producto_id, data)`
  - [ ] `replaceCondiciones(producto_id, condiciones[])`
  - [ ] `replaceRequisitos(producto_id, requisitos[])`
  - [ ] `replaceBeneficios(producto_id, beneficios[])`
- [ ] Tests unitarios de ProductosService

### 🔌 Día 5: Endpoint de Ingesta
- [ ] Crear ScrapingModule
- [ ] Crear DTO: N8nProductoDto con validaciones
- [ ] Implementar ApiKeyGuard para seguridad
- [ ] Crear ScrapingController:
  - [ ] `POST /api/scraping/ingest`
- [ ] Implementar ScrapingService con lógica completa:
  - [ ] Normalización de datos
  - [ ] Búsqueda/creación de entidad financiera
  - [ ] Resolución de catálogos
  - [ ] Upsert de producto
  - [ ] Detección de cambio de tasa
  - [ ] Actualización de relaciones
  - [ ] Log de ejecución
- [ ] Manejo de errores y validaciones

### 🧪 Día 6: Testing y Documentación
- [ ] Tests E2E del endpoint de ingesta:
  - [ ] Test sin API key (401)
  - [ ] Test con API key inválida (401)
  - [ ] Test crear nuevo producto (201)
  - [ ] Test actualizar producto existente (201)
  - [ ] Test detectar cambio de tasa
  - [ ] Test validación de DTO (400)
- [ ] Configurar Swagger/OpenAPI
- [ ] Documentar endpoint con decoradores
- [ ] Generar documentación en `/api/docs`
- [ ] Crear ejemplos de request/response

### 🚀 Día 7: Integración n8n y Deploy
- [ ] Modificar workflow de n8n:
  - [ ] Agregar nodo HTTP Request después de "Prepare For Spreadsheet"
  - [ ] Configurar POST al endpoint de ingesta
  - [ ] Configurar header x-api-key
  - [ ] Configurar retry y timeout
- [ ] Testing manual con cURL
- [ ] Deploy del backend:
  - [ ] Railway / Render / otro servicio
  - [ ] Configurar PostgreSQL en producción
  - [ ] Configurar variables de entorno
- [ ] Testing end-to-end en producción
- [ ] Verificar datos en PostgreSQL
- [ ] Monitoreo de primeros scrapes

---

## 📊 Estado Actual del Proyecto

**Fase**: Día 2 completado ✅
**Progreso**: 2/7 días (29%)
**Siguiente tarea**: Implementar CatalogosModule y CatalogosService (Día 3)

### Resumen del Día 2
- ✅ 15 tablas creadas en PostgreSQL (14 entidades + migrations)
- ✅ 14 registros insertados en catálogos iniciales
- ✅ Sistema de migraciones funcionando correctamente
- ✅ Seeds idempotentes (se pueden ejecutar múltiples veces)
- ✅ Modelo de datos alineado con formato de extracción n8n (22 columnas)
- ✅ Tabla `productos_credito`: 17 columnas con constraints correctos
- ✅ Tabla `tasas_vigentes`: Soporte para tasas únicas y rangos
