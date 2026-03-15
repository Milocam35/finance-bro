-- Active: 1769715475029@@127.0.0.1@5432@financebro_db
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

4. Ejecutar migraciones:
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

## 🔄 Guía de Migraciones TypeORM

### Conceptos Básicos

Las **migraciones** son archivos de control de versiones para tu esquema de base de datos. Cada vez que modificas una entidad TypeORM, debes generar una migración para aplicar esos cambios a PostgreSQL.

### Scripts Disponibles

```bash
# Generar migración desde cambios en entidades
npm run migration:generate -- src/database/migrations/NombreDeLaMigracion

# Ejecutar migraciones pendientes
npm run migration:run

# Revertir última migración ejecutada
npm run migration:revert

# Mostrar estado de migraciones (ejecutadas vs pendientes)
npm run migration:show

# Crear migración vacía (para SQL personalizado)
npm run migration:create -- src/database/migrations/NombreDeLaMigracion

# Ejecutar seeds de catálogos
npm run seed:catalogs
```

---

### 📋 Flujo de Trabajo: Modificar una Entidad

#### **Escenario**: Agregaste un nuevo campo a `ProductoCredito`

**Paso 1: Modificar la entidad**
```typescript
// src/productos/entities/producto-credito.entity.ts
@Entity('productos_credito')
export class ProductoCredito {
  // ... campos existentes

  @Column({ type: 'text', nullable: true })
  nuevo_campo: string;  // ← Campo nuevo
}
```

**Paso 2: Generar migración**
```bash
npm run migration:generate -- src/database/migrations/AddNuevoCampoToProducto
```

**Resultado**: Se crea archivo `src/database/migrations/1769123456789-AddNuevoCampoToProducto.ts`

**Paso 3: Revisar la migración generada**
```typescript
export class AddNuevoCampoToProducto1769123456789 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "productos_credito" ADD "nuevo_campo" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "productos_credito" DROP COLUMN "nuevo_campo"`);
    }
}
```

**Paso 4: Ejecutar la migración**
```bash
npm run migration:run
```

**Paso 5: Verificar en PostgreSQL**
```bash
docker exec financebro-postgres psql -U financebro -d financebro_db -c "\d productos_credito"
```

---

### 🔥 Recrear Base de Datos desde Cero

#### **Escenario**: Quieres eliminar toda la DB y empezar de nuevo

**⚠️ ADVERTENCIA**: Esto eliminará TODOS los datos.

**Paso 1: Detener la aplicación**
```bash
# Ctrl+C en terminal donde corre npm run start:dev
```

**Paso 2: Eliminar contenedor y volumen de PostgreSQL**
```bash
cd docker
docker compose down -v  # -v elimina volúmenes (datos persistentes)
```

**Paso 3: Levantar PostgreSQL limpio**
```bash
docker compose up -d
```

**Paso 4: Ejecutar TODAS las migraciones**
```bash
npm run migration:run
```

**Resultado**: Se ejecutan todas las migraciones en orden:
```
✓ 1769107001162-InitialSchema.ts
✓ 1769108445014-UpdateProductoCreditoFields.ts
✓ [Otras migraciones futuras...]
```

**Paso 5: Ejecutar seeds**
```bash
npm run seed:catalogs
```

**Resultado**:
```
✓ 4 tipos_credito insertados
✓ 4 tipos_vivienda insertados
✓ 2 denominaciones insertadas
✓ 2 tipos_tasa insertados
✓ 2 tipos_pago insertados
```

---

### 🛠️ Comandos Útiles para Debugging

#### Ver qué migraciones se han ejecutado
```bash
npm run migration:show
```

**Output**:
```
[X] InitialSchema1769107001162
[X] UpdateProductoCreditoFields1769108445014
[ ] AddNewField1769999999999  ← Pendiente
```

#### Ver estructura de una tabla
```bash
docker exec financebro-postgres psql -U financebro -d financebro_db -c "\d productos_credito"
```

#### Contar registros en catálogos
```bash
docker exec financebro-postgres psql -U financebro -d financebro_db -c "
  SELECT 'tipos_credito' AS tabla, COUNT(*) FROM tipos_credito
  UNION ALL
  SELECT 'tipos_vivienda', COUNT(*) FROM tipos_vivienda
  UNION ALL
  SELECT 'denominaciones', COUNT(*) FROM denominaciones
  UNION ALL
  SELECT 'tipos_tasa', COUNT(*) FROM tipos_tasa
  UNION ALL
  SELECT 'tipos_pago', COUNT(*) FROM tipos_pago
  UNION ALL
  SELECT 'entidades_financieras', COUNT(*) FROM entidades_financieras;
"
```

#### Revertir última migración (si algo salió mal)
```bash
npm run migration:revert
```

**IMPORTANTE**: Solo revierte la **última** migración ejecutada.

#### Revertir múltiples migraciones
```bash
npm run migration:revert  # Revierte la última
npm run migration:revert  # Revierte la penúltima
npm run migration:revert  # Revierte la antepenúltima
# ... repetir según necesites
```

---

### 🚀 Setup Inicial para Nuevo Desarrollador

Si clonas el repositorio por primera vez:

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar .env
cp .env.example .env
# Editar .env con tus valores

# 3. Levantar PostgreSQL
cd docker
docker compose up -d
cd ..

# 4. Ejecutar migraciones
npm run migration:run

# 5. Ejecutar seeds
npm run seed:catalogs

# 6. Verificar
docker exec financebro-postgres psql -U financebro -d financebro_db -c "\dt"

# 7. Iniciar app
npm run start:dev
```

---

### ❌ Errores Comunes

#### Error: "Cannot find module 'dotenv'"
```bash
npm install dotenv
```

#### Error: "relation 'productos_credito' already exists"
- **Causa**: Intentaste ejecutar migraciones que ya se ejecutaron
- **Solución**: Verifica con `npm run migration:show`

#### Error: "Entity metadata for EntidadFinanciera was not found"
- **Causa**: La entidad no está registrada en `src/database/data-source.ts`
- **Solución**: Agrega la entidad al array `entities: [...]`

#### Error: "Database connection refused"
- **Causa**: PostgreSQL no está corriendo
- **Solución**: `cd docker && docker compose up -d`

#### Error: "ALTER TABLE ... DROP COLUMN" falla
- **Causa**: Hay datos en la columna o hay foreign keys
- **Solución**:
  1. Eliminar datos primero
  2. Eliminar constraints de foreign keys
  3. Luego eliminar columna

---

### 📚 Referencias

- [TypeORM Migrations Documentation](https://typeorm.io/migrations)
- [TypeORM Entity Documentation](https://typeorm.io/entities)
- [PostgreSQL ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)

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

### ✅ Día 3: Módulo de Catálogos (COMPLETADO)
- [x] Crear CatalogosModule
- [x] Implementar CatalogosService con métodos:
  - [x] `findEntidadByNombre(nombre_normalizado)`
  - [x] `createEntidad(data)`
  - [x] `findTipoCreditoByCodigo(codigo)`
  - [x] `findTipoViviendaByCodigo(codigo)`
  - [x] `findDenominacionByCodigo(codigo)`
  - [x] `findTipoTasaByCodigo(codigo)`
  - [x] `findTipoPagoByCodigo(codigo)`
  - [x] `getOrCreateEntidad(nombre_normalizado, nombre)` - Método helper
- [x] Tests unitarios de CatalogosService (11 test suites)
- [x] Registrar CatalogosModule en AppModule

**Archivos creados**:
- [src/catalogos/catalogos.module.ts](src/catalogos/catalogos.module.ts) - Módulo con imports TypeORM
- [src/catalogos/catalogos.service.ts](src/catalogos/catalogos.service.ts) - Servicio con 9 métodos
- [src/catalogos/catalogos.service.spec.ts](src/catalogos/catalogos.service.spec.ts) - Tests unitarios completos

**Funcionalidades implementadas**:
- Búsqueda de catálogos por código (tipos) o nombre normalizado (entidades)
- Creación de nuevas entidades financieras
- Pattern getOrCreate para entidades (upsert)
- Logging con contexto para debugging
- Todos los métodos retornan solo registros activos (activo: true)

### ✅ Día 4: Módulo de Productos (COMPLETADO)
- [x] Crear ProductosModule con imports de TypeORM
- [x] Implementar ProductosService con métodos:
  - [x] `findByIdUnico(id_unico_scraping)` - Búsqueda por ID único de n8n
  - [x] `create(data)` - Crear nuevo producto
  - [x] `update(id, data)` - Actualizar producto existente
  - [x] `findById(id)` - Obtener producto con relaciones
  - [x] `getTasaVigente(producto_id)` - Obtener tasa vigente
  - [x] `createTasaVigente(data)` - Crear nueva tasa vigente
  - [x] `updateTasaVigente(producto_id, data)` - Upsert de tasa vigente
  - [x] `insertTasaHistorica(data)` - Insertar en histórico
  - [x] `getHistoricoTasas(producto_id, limit)` - Obtener histórico
  - [x] `upsertMontos(producto_id, data)` - Upsert de montos
  - [x] `replaceCondiciones(producto_id, condiciones[])` - Reemplazar condiciones
  - [x] `replaceRequisitos(producto_id, requisitos[])` - Reemplazar requisitos
  - [x] `replaceBeneficios(producto_id, beneficios[])` - Reemplazar beneficios
  - [x] `registrarEjecucion(data)` - Registrar ejecución de scraping
  - [x] `actualizarEjecucion(id, data)` - Actualizar ejecución
- [x] Tests unitarios de ProductosService (20+ test cases)
- [x] Registrar ProductosModule en AppModule

**Archivos creados**:
- [src/productos/productos.module.ts](src/productos/productos.module.ts) - Módulo con imports de 8 entidades
- [src/productos/productos.service.ts](src/productos/productos.service.ts) - Servicio con 18 métodos (350 líneas)
- [src/productos/productos.service.spec.ts](src/productos/productos.service.spec.ts) - Tests unitarios completos (430 líneas)

**Funcionalidades implementadas**:
- CRUD completo de productos con logging integrado
- Búsqueda por ID único de scraping (idempotencia n8n)
- Upsert pattern para tasas vigentes y montos
- Replace pattern para relaciones one-to-many (condiciones, requisitos, beneficios)
- Gestión de histórico de tasas con orden DESC
- Registro y auditoría de ejecuciones de scraping
- Manejo de errores con NotFoundException
- Soporte para valores null/undefined con nullish coalescing (??)

### ✅ Día 5: Endpoint de Ingesta (COMPLETADO)
- [x] Crear ScrapingModule con imports de CatalogosModule y ProductosModule
- [x] Crear DTO: N8nProductoDto con validaciones class-validator (22 campos)
- [x] Implementar ApiKeyGuard para seguridad con header x-api-key
- [x] Crear ScrapingController:
  - [x] `POST /api/scraping/ingest` - Endpoint de ingesta desde n8n
- [x] Implementar ScrapingService con lógica completa (500+ líneas):
  - [x] Normalización de datos n8n (parseo de tasas, montos, plazos)
  - [x] Búsqueda/creación de entidad financiera con getOrCreate
  - [x] Resolución de catálogos (mapeo de códigos a UUIDs)
  - [x] Upsert de producto (crear o actualizar según id_unico)
  - [x] Detección de cambio de tasa (comparación con histórico)
  - [x] Upsert de tasa vigente y inserción en histórico
  - [x] Upsert de montos del producto
  - [x] Reemplazo de condiciones, requisitos y beneficios
  - [x] Logging contextual en todas las operaciones
- [x] Habilitar ValidationPipe global en main.ts
- [x] Manejo de errores y validaciones completo
- [x] Registrar ScrapingModule en AppModule

**Archivos creados**:
- [src/scraping/dto/n8n-producto.dto.ts](src/scraping/dto/n8n-producto.dto.ts) - DTO con 22 campos validados (220 líneas)
- [src/scraping/guards/api-key.guard.ts](src/scraping/guards/api-key.guard.ts) - Guard de seguridad con API key
- [src/scraping/scraping.service.ts](src/scraping/scraping.service.ts) - Servicio de ingesta (500+ líneas)
- [src/scraping/scraping.controller.ts](src/scraping/scraping.controller.ts) - Controlador con endpoint POST
- [src/scraping/scraping.module.ts](src/scraping/scraping.module.ts) - Módulo de scraping

**Archivos modificados**:
- [src/app.module.ts](src/app.module.ts) - Agregado ScrapingModule
- [src/main.ts](src/main.ts) - Habilitado ValidationPipe global

**Funcionalidades implementadas**:
- Validaciones con class-validator: @IsString(), @IsNotEmpty(), @IsOptional(), @IsUrl(), @Matches(), @MaxLength()
- Seguridad: ApiKeyGuard verifica header x-api-key contra N8N_API_KEY
- Normalización automática de datos: parseTasa(), parseMonto(), parsePlazo(), normalizarTexto()
- Resolución de catálogos: Mapeo de códigos n8n a UUIDs de PostgreSQL
- Idempotencia: Usa id_unico para upsert de productos
- Detección de cambios: Compara tasa_valor anterior vs nueva (tolerancia 0.01%)
- Histórico completo: Cada ingesta inserta en tasas_historicas
- Replace pattern: Elimina y recrea condiciones/requisitos/beneficios
- Logging completo: Trazabilidad de todas las operaciones
- Manejo de errores: BadRequestException para catálogos no encontrados

### 🧪 Día 6: Testing y Documentación
- [x] Tests E2E del endpoint de ingesta:
  - [x] Test sin API key (401)
  - [x] Test con API key inválida (401)
  - [x] Test crear nuevo producto con todos los parámetros (201)
  - [x] Test actualizar producto existente (201)
  - [x] Test detectar cambio de tasa
  - [x] Test validación de DTO (400)
  - [x] Test producto con campos opcionales vacíos
- [ ] Configurar Swagger/OpenAPI
- [ ] Documentar endpoint con decoradores
- [ ] Generar documentación en `/api/docs`
- [ ] Crear ejemplos de request/response

**Archivos creados**:
- [test/scraping.e2e-spec.ts](test/scraping.e2e-spec.ts) - Suite completa de tests E2E (500+ líneas, 7 casos de prueba)

**Archivos modificados**:
- [src/scraping/scraping.service.ts](src/scraping/scraping.service.ts) - Agregada validación para no insertar en histórico si tasa_valor es null, conversión de tasa_anterior a número
- [src/common/utils/parsers.util.ts](src/common/utils/parsers.util.ts) - Mejorado parseMonto() para manejar formato colombiano con puntos como separadores de miles

**Tests implementados** (7/7 ✅):
1. ✅ **Autenticación sin API key (401)**: Verifica que el endpoint rechaza requests sin header x-api-key
2. ✅ **Autenticación con API key inválida (401)**: Verifica que el endpoint rechaza requests con API key incorrecta
3. ✅ **Crear producto completo (201)**: Crea un producto con todos los 22 campos y verifica:
   - Producto creado con todos los campos
   - Entidad financiera creada/encontrada
   - Tasa vigente creada correctamente
   - Tasa insertada en histórico
   - Montos guardados correctamente
   - 3 condiciones creadas en orden
   - 4 requisitos creados en orden
   - 2 beneficios creados (descuento nómina + avalúo)
4. ✅ **Actualizar producto existente (201)**: Verifica idempotencia con id_unico_scraping
5. ✅ **Detectar cambio de tasa**: Verifica detección de cambio cuando tasa varía ≥ 0.01%
6. ✅ **Validación de DTO (400)**: Verifica que ValidationPipe rechaza payloads inválidos
7. ✅ **Producto con campos opcionales vacíos**: Verifica que se puede crear producto sin tasas, montos, condiciones, requisitos ni beneficios

**Correcciones realizadas**:
- Arreglado import de `normalizeString` (antes `normalizarTexto`)
- Cambiado `delete({})` a `clear()` y luego a queries SQL directas para cleanup entre tests
- Agregada validación para no insertar en `tasas_historicas` si `tasa_valor` es null
- Conversión de tipos BIGINT y DECIMAL de PostgreSQL (devueltos como strings) a números en tests
- Mejorado `parseMonto()` para eliminar puntos como separadores de miles (formato colombiano)
- Manejo flexible de fechas para evitar problemas de timezone
- Ordenamiento de histórico por `created_at` DESC en lugar de solo `fecha_extraccion`

**Cobertura de tests**: 100% de los casos críticos del endpoint de ingesta

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

**Fase**: Día 6 en progreso (Tests E2E ✅, falta Swagger)
**Progreso**: 5.5/7 días (79%)
**Siguiente tarea**: Documentación Swagger (Día 6) → Integración n8n (Día 7)

### Resumen del Día 2
- ✅ 15 tablas creadas en PostgreSQL (14 entidades + migrations)
- ✅ 14 registros insertados en catálogos iniciales
- ✅ Sistema de migraciones funcionando correctamente
- ✅ Seeds idempotentes (se pueden ejecutar múltiples veces)
- ✅ Modelo de datos alineado con formato de extracción n8n (22 columnas)
- ✅ Tabla `productos_credito`: 17 columnas con constraints correctos
- ✅ Tabla `tasas_vigentes`: Soporte para tasas únicas y rangos

### Resumen del Día 3
- ✅ CatalogosModule creado y registrado en AppModule
- ✅ CatalogosService con 9 métodos implementados
- ✅ 11 test suites (100% cobertura de métodos públicos)
- ✅ Soporte para búsqueda por código y nombre normalizado
- ✅ Pattern getOrCreate para creación idempotente de entidades
- ✅ Logging integrado para debugging y auditoría

### Resumen del Día 4
- ✅ ProductosModule creado y registrado en AppModule
- ✅ ProductosService con 18 métodos implementados (350 líneas)
- ✅ 20+ test cases con mocks de 8 repositorios
- ✅ CRUD completo para ProductoCredito
- ✅ Gestión de TasaVigente con upsert pattern
- ✅ Histórico de tasas con orden descendente
- ✅ Upsert de MontoProducto
- ✅ Replace pattern para arrays: Condiciones, Requisitos, Beneficios
- ✅ Gestión de EjecucionScraping (registro y actualización)
- ✅ Manejo de valores null → undefined con nullish coalescing
- ✅ Logging contextual en todas las operaciones
- ✅ Preparación para ScrapingModule (Día 5)

### Resumen del Día 5
- ✅ ScrapingModule creado e integrado con CatalogosModule y ProductosModule
- ✅ N8nProductoDto con 22 campos validados usando class-validator
- ✅ ValidationPipe global habilitado en main.ts
- ✅ ApiKeyGuard implementado para seguridad con header x-api-key
- ✅ ScrapingService con lógica completa de ingesta (500+ líneas):
  - Normalización de datos con parsers de utilidades
  - Resolución automática de catálogos (mapeo códigos → UUIDs)
  - Idempotencia con id_unico_scraping
  - Detección inteligente de cambios de tasa (tolerancia 0.01%)
  - Upsert completo de producto, tasas, montos y relaciones
  - Inserción en histórico de tasas
  - Replace pattern para condiciones/requisitos/beneficios
- ✅ ScrapingController con endpoint POST /api/scraping/ingest
- ✅ Logging completo y trazabilidad de operaciones
- ✅ Manejo robusto de errores con BadRequestException
- ✅ Listo para recibir datos desde n8n en producción

### Resumen del Día 6 (En progreso)
- ✅ Suite completa de tests E2E del endpoint de ingesta (7 casos de prueba)
- ✅ Test de autenticación (sin API key y con API key inválida)
- ✅ Test de creación de producto completo con todos los parámetros (22 campos)
- ✅ Test de actualización de producto existente (idempotencia)
- ✅ Test de detección de cambio de tasa
- ✅ Test de validación de DTO con class-validator
- ✅ Test de producto con campos opcionales vacíos
- ✅ Correcciones en parsers (manejo de formato colombiano con puntos)
- ✅ Conversión de tipos PostgreSQL (BIGINT/DECIMAL → number)
- ✅ Cleanup de datos entre tests con queries SQL directas
- ⏳ Pendiente: Documentación Swagger/OpenAPI
