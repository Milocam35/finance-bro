# Contexto del Proyecto FinanceBro

## Descripción

**FinanceBro** es una plataforma de comparación de productos financieros en Colombia con arquitectura de microservicios.

**Stack**: React + TypeScript + NestJS + PostgreSQL + Redis + n8n

**Objetivo**: Democratizar el acceso a información financiera transparente y actualizada en tiempo real.

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
- `tasa_minima`, `tasa_maxima`, `es_rango`, `spread_uvr`, `fecha_vigencia`

**tasas_historicas**
- `producto_id`, `tasa_valor`, `fecha_extraccion`, `hora_extraccion`
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

### Backend (En Desarrollo)
- NestJS + PostgreSQL + Redis + TypeORM
- JWT + Swagger

### Automatización
- n8n Cloud + Google Sheets API + Node.js 18+

---

## Flujo de Datos

### Actual
```
Bancos → n8n Scraping → Google Sheets

Frontend (hardcoded)
```

### Futuro
```
Bancos → n8n → PostgreSQL (NestJS) → Backend API → Redis Cache → Frontend
```

---

## Estructura del Repositorio

```
Proyecto-FinanceBro/
├── .claude/
│   ├── settings.local.json
│   └── claude.md                  # Este archivo
├── n8n/
│   ├── TextScrapperTool.json      # Workflow principal (22+ nodos)
│   ├── sync-workflow.js
│   ├── backups/
│   └── .env
├── finance-bro-web/               # Frontend React
│   ├── src/
│   │   ├── components/ui/         # shadcn/ui (40+)
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── lib/
│   ├── components.json
│   └── tailwind.config.ts
└── README.md
```

---

## Variables de Entorno

### n8n
```env
N8N_API_KEY=tu_api_key
N8N_HOST=https://tu-instancia.n8n.cloud
```

### Backend NestJS (Futuro)
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=financebro
DATABASE_PASSWORD=password
DATABASE_NAME=financebro_db

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=secret
JWT_EXPIRATION=7d
```

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

**Q1 2026**
- [x] Comparador de créditos hipotecarios
- [x] Sistema n8n con scraping automatizado
- [x] Almacenamiento dual (PostgreSQL + Google Sheets)
- [ ] Backend API con NestJS + PostgreSQL + Redis
- [ ] Integración frontend con API real

**Q2 2026**
- [ ] Migración completa a backend NestJS
- [ ] Sistema de cache con Redis
- [ ] Créditos personales y automotriz

**Q3 2026**
- [ ] Tarjetas de crédito y seguros
- [ ] Sistema de recomendaciones con IA
- [ ] Autenticación de usuarios

**Q4 2026**
- [ ] Inversiones (CDT, Fondos, Acciones)
- [ ] App móvil (React Native)

---

## Comandos Útiles

### Frontend
```bash
cd finance-bro-web
npm run dev               # Desarrollo
npm run build             # Producción
npm run lint              # Linter
```

### n8n
```bash
cd n8n
npm run sync              # Sincronizar workflow a cloud
```

### Backend (Futuro)
```bash
cd backend
npm run start:dev         # Desarrollo
npm run test              # Tests
npm run migration:run     # Migraciones
```

---

## Enlaces Importantes

- **Google Sheets Database**: https://docs.google.com/spreadsheets/d/1yUR0Tow3yrbSemyzmsqDY4VoF113wrxfCwVDhSTOsoM/edit?usp=sharing
- **n8n Docs**: https://docs.n8n.io/api/
- **NestJS Docs**: https://docs.nestjs.com/

---

## Estado del Proyecto

- **Fase Actual**: Prototipo funcional con datos hardcoded
- **Siguiente Fase**: Backend NestJS + PostgreSQL + Redis (Q1 2026)
- **Objetivo**: Plataforma completa con datos en tiempo real desde múltiples bancos

---

## Notas Clave

1. **Frontend actual**: Datos hardcoded, pendiente integración con API
2. **n8n**: Scraping automatizado a PostgreSQL (n8n cloud) + Google Sheets
3. **Idempotencia**: Campo `id_unico_scraping` en productos para evitar duplicados
4. **Eventos**: Cambios de tasas publican eventos al message broker para notificaciones
5. **Cache**: Redis para queries frecuentes (UVR, SMMLV, productos populares)
6. **Analytics**: Redirecciones y simulaciones para usuarios anónimos (session_id)