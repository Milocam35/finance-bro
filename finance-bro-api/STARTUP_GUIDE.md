# 🚀 FinanceBro API - Guía de Inicio

Guía completa para iniciar el backend de FinanceBro y acceder a la documentación Swagger.

---

## 📋 Requisitos Previos

Antes de iniciar, asegúrate de tener instalado:

- **Node.js**: v18+ (verificar con `node --version`)
- **npm**: v9+ (verificar con `npm --version`)
- **Docker Desktop**: Para ejecutar PostgreSQL
- **Git**: Para clonar el repositorio

---

## 🔧 Configuración Inicial (Solo Primera Vez)

### 1. Instalar Dependencias

```bash
cd finance-bro-api
npm install
```

### 2. Configurar Variables de Entorno

Verifica que el archivo `.env` exista en la raíz del proyecto con la siguiente configuración:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=financebro
DATABASE_PASSWORD=password123
DATABASE_NAME=financebro_db

# API
PORT=3000
NODE_ENV=development

# Security
N8N_API_KEY=tu_clave_secreta_para_n8n

# TypeORM
TYPEORM_LOGGING=false
```

**⚠️ IMPORTANTE**: El valor de `N8N_API_KEY` debe coincidir con el que uses en n8n para autenticar las peticiones.

---

## 🐘 Paso 1: Iniciar PostgreSQL

### Opción A: Con Docker Compose (Recomendado)

```bash
# Desde la raíz del proyecto
cd docker
docker compose up -d

# Verificar que el contenedor esté corriendo
docker ps
```

**Salida esperada:**
```
CONTAINER ID   IMAGE                COMMAND                  STATUS
abc123def456   postgres:16-alpine   "docker-entrypoint.s…"   Up 2 seconds
```

### Opción B: Detener y Reiniciar

```bash
# Detener PostgreSQL
cd docker
docker compose down

# Iniciar nuevamente
docker compose up -d
```

### Verificar Conexión a PostgreSQL

```bash
# Conectarse con psql dentro del contenedor
docker exec -it financebro-postgres psql -U financebro -d financebro_db

# Listar tablas (debería mostrar 15 tablas)
\dt

# Salir de psql
\q
```

---

## 🗄️ Paso 2: Ejecutar Migraciones (Solo Primera Vez)

Si es la primera vez que inicias el proyecto, necesitas crear las tablas en la base de datos:

```bash
# Ejecutar migraciones
npm run migration:run

# Verificar migraciones aplicadas
npm run migration:show
```

**Salida esperada:**
```
 [X] InitialSchema1737342000000
```

### Ejecutar Seeds (Catálogos Iniciales)

```bash
# Poblar catálogos con datos iniciales
npm run seed:catalogs
```

**Salida esperada:**
```
🌱 Iniciando seed de catálogos...
✅ Conexión a base de datos establecida

📋 Seeding tipos_credito...
  ✓ Creado: Crédito Hipotecario (hipotecario)
  ✓ Creado: Crédito de Consumo (consumo)
  ✓ Creado: Crédito de Vehículo (vehiculo)
  ✓ Creado: Leasing Habitacional (leasing)

🏠 Seeding tipos_vivienda...
  ✓ Creado: VIS (vis)
  ✓ Creado: No VIS (no_vis)
  ✓ Creado: VIP (vip)
  ✓ Creado: Aplica para ambos (aplica_ambos)

💰 Seeding denominaciones...
  ✓ Creado: Pesos Colombianos (pesos)
  ✓ Creado: UVR (uvr)

📊 Seeding tipos_tasa...
  ✓ Creado: Tasa Efectiva Anual (efectiva_anual)
  ✓ Creado: Tasa Nominal Mensual Vencida (nominal_mensual)

💳 Seeding tipos_pago...
  ✓ Creado: Cuota Fija (cuota_fija)
  ✓ Creado: Cuota Variable (cuota_variable)

✅ Seed de catálogos completado exitosamente
```

---

## 🚀 Paso 3: Iniciar el Backend

### Modo Desarrollo (con hot-reload)

```bash
npm run start:dev
```

**Salida esperada:**
```
╔═══════════════════════════════════════════════════════════╗
║                             ~                              ║
║   🚀 FinanceBro API is running!                          ║
║                                                           ║
║   📍 API:     http://localhost:3000                      ║
║   📚 Swagger: http://localhost:3000/api/docs            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

### Otros Modos

```bash
# Modo producción
npm run build
npm run start:prod

# Modo debug (con inspector de Node.js)
npm run start:debug
```

---

## 📚 Paso 4: Acceder a Swagger UI

### 1. Abrir Swagger en el Navegador

Una vez que el backend esté corriendo, abre tu navegador y ve a:

**🔗 [http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

### 2. Interfaz de Swagger

Verás la documentación interactiva de la API con:

- **🏷️ Tags organizados**: `scraping`, `catalogos`, `productos`
- **📖 Descripción de endpoints**: Cada endpoint con su descripción completa
- **🔐 Autenticación**: Sistema de API Key configurado
- **✅ Schemas de validación**: DTOs documentados con ejemplos

---

## 🧪 Paso 5: Probar el Endpoint de Ingesta con Swagger

### 1. Autenticarse con API Key

1. Haz clic en el botón **"Authorize"** (candado) en la parte superior derecha
2. Ingresa tu API Key (el valor de `N8N_API_KEY` en tu `.env`)
   - Ejemplo: `tu_clave_secreta_para_n8n`
3. Haz clic en **"Authorize"**
4. Cierra el modal

### 2. Probar el Endpoint POST /api/scraping/ingest

1. Haz clic en **`POST /api/scraping/ingest`** para expandir
2. Haz clic en **"Try it out"**
3. Verás un ejemplo de payload prellenado. Puedes editarlo o usar el siguiente:

```json
{
  "id_unico": "bancolombia__hipotecario__vis__pesos",
  "banco": "Bancolombia",
  "tipo_credito": "Crédito hipotecario para compra de vivienda",
  "tipo_vivienda": "VIS",
  "denominacion": "Pesos",
  "descripcion": "Crédito hipotecario VIS en pesos con tasa fija",
  "fecha_extraccion": "2025-01-28",
  "hora_extraccion": "10:30:00",
  "url_pagina": "https://www.bancolombia.com/personas/creditos/hipotecario",
  "tasa": "11.50% EA",
  "tasa_minima": "10.50",
  "tasa_maxima": "12.50",
  "tipo_tasa": "Tasa efectiva anual",
  "monto_minimo": "$50.000.000",
  "monto_maximo": "$200.000.000",
  "plazo_maximo": "20 años",
  "tipo_pago": "Cuota fija",
  "condiciones": "Tener cuenta de nómina; Seguro de vida obligatorio",
  "requisitos": "Documento de identidad; Certificado de ingresos",
  "descuento_nomina": "+200 pbs con cuenta de nómina",
  "beneficio_avaluo": "Avalúo sin costo",
  "url_pdf": "https://www.bancolombia.com/wcm/connect/credito.pdf"
}
```

4. Haz clic en **"Execute"**

### 3. Ver la Respuesta

**Respuesta exitosa (201 Created):**
```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "success": true,
    "producto_id": "550e8400-e29b-41d4-a716-446655440000",
    "accion": "creado",
    "cambio_tasa": false,
    "tasa_anterior": undefined,
    "tasa_nueva": 11.5
  }
}
```

**Errores comunes:**

- **401 Unauthorized**: API key incorrecta o ausente
  ```json
  {
    "statusCode": 401,
    "message": "API key requerida. Incluye el header x-api-key",
    "error": "Unauthorized"
  }
  ```

- **400 Bad Request**: Validación fallida
  ```json
  {
    "statusCode": 400,
    "message": [
      "El id_unico debe tener al menos 5 caracteres",
      "La fecha_extraccion debe tener formato YYYY-MM-DD"
    ],
    "error": "Bad Request"
  }
  ```

---

## 🧪 Paso 6: Ejecutar Tests E2E (Opcional)

Si quieres verificar que todo funciona correctamente:

```bash
# Ejecutar todos los tests E2E
npm run test:e2e

# Ejecutar solo los tests del módulo scraping
npm run test:e2e -- scraping
```

**Salida esperada:**
```
 PASS  test/scraping.e2e-spec.ts (10.5 s)
  ScrapingController (e2e)
    ✓ debe rechazar peticiones sin API key (401) (150 ms)
    ✓ debe rechazar peticiones con API key inválida (401) (85 ms)
    ✓ debe crear un producto completo con todos los parámetros (450 ms)
    ✓ debe actualizar un producto existente (idempotencia) (380 ms)
    ✓ debe detectar cambios en tasas (320 ms)
    ✓ debe rechazar DTO inválidos (validación) (120 ms)
    ✓ debe permitir campos opcionales vacíos (290 ms)

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
```

---

## 📊 Verificar Datos en PostgreSQL

### Ver productos creados:

```bash
# Conectarse a PostgreSQL
docker exec -it financebro-postgres psql -U financebro -d financebro_db

# Ver productos
SELECT id, id_unico_scraping, descripcion FROM productos_credito;

# Ver tasas vigentes
SELECT p.id_unico_scraping, tv.tasa_valor, tv.tasa_minima, tv.tasa_maxima
FROM tasas_vigentes tv
JOIN productos_credito p ON p.id = tv.producto_id;

# Ver histórico de tasas
SELECT p.id_unico_scraping, th.tasa_valor, th.fecha_extraccion, th.hora_extraccion
FROM tasas_historicas th
JOIN productos_credito p ON p.id = th.producto_id
ORDER BY th.fecha_extraccion DESC, th.hora_extraccion DESC;

# Salir
\q
```

---

## 🛠️ Scripts Útiles

```bash
# Desarrollo
npm run start:dev          # Iniciar en modo desarrollo
npm run start:debug        # Iniciar con debugger
npm run build              # Compilar TypeScript

# Tests
npm run test               # Tests unitarios
npm run test:e2e           # Tests E2E
npm run test:cov           # Coverage

# Migraciones
npm run migration:generate -- src/database/migrations/NombreMigracion
npm run migration:create -- src/database/migrations/NombreMigracion
npm run migration:run      # Ejecutar migraciones pendientes
npm run migration:revert   # Revertir última migración
npm run migration:show     # Ver migraciones

# Seeds
npm run seed:catalogs      # Poblar catálogos

# Calidad de código
npm run lint               # ESLint
npm run format             # Prettier
```

---

## 🔥 Troubleshooting

### Error: "Cannot connect to database"

**Solución**:
```bash
# Verificar que PostgreSQL esté corriendo
docker ps

# Si no está corriendo, iniciarlo
cd docker
docker compose up -d

# Verificar logs
docker compose logs postgres
```

### Error: "Port 3000 is already in use"

**Solución 1**: Cambiar puerto en `.env`
```env
PORT=3001
```

**Solución 2**: Matar proceso en puerto 3000
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Error: "Migrations not found"

**Solución**:
```bash
# Generar migración inicial
npm run migration:generate -- src/database/migrations/InitialSchema

# Ejecutar migraciones
npm run migration:run
```

### Error: "API key inválida" en Swagger

**Solución**:
1. Verificar que el valor de `N8N_API_KEY` en `.env` sea correcto
2. Hacer clic en "Authorize" en Swagger y pegar el API key exacto
3. Reiniciar el backend si cambiaste el `.env`

### Error: "Validation failed" en Swagger

**Solución**:
- Revisar que todos los campos obligatorios estén presentes
- Verificar formatos:
  - `fecha_extraccion`: `YYYY-MM-DD` (ej: `2025-01-28`)
  - `hora_extraccion`: `HH:mm:ss` (ej: `14:30:00`)
  - `url_pagina`: URL válida con `http://` o `https://`

---

## 📖 Recursos Adicionales

- **Swagger UI Local**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **NestJS Docs**: https://docs.nestjs.com/
- **TypeORM Docs**: https://typeorm.io/
- **class-validator**: https://github.com/typestack/class-validator

---

## 🎯 Siguiente Paso: Integrar con n8n

Una vez que el backend esté corriendo y hayas probado el endpoint con Swagger, puedes configurar n8n para enviar datos al endpoint:

1. **URL del endpoint**: `http://localhost:3000/api/scraping/ingest`
2. **Método**: `POST`
3. **Header**: `x-api-key: tu_clave_secreta_para_n8n`
4. **Body**: JSON con los datos del producto (ver ejemplo en Swagger)

---

## ✅ Checklist de Inicio

- [ ] PostgreSQL corriendo (`docker ps`)
- [ ] Migraciones ejecutadas (`npm run migration:show`)
- [ ] Seeds ejecutados (`npm run seed:catalogs`)
- [ ] Backend iniciado (`npm run start:dev`)
- [ ] Swagger accesible en [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- [ ] API Key configurada en Swagger
- [ ] Primer producto creado exitosamente

---

**🎉 ¡Listo! Tu backend FinanceBro está funcionando y listo para recibir datos desde n8n.**
