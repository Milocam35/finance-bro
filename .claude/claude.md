# Contexto del Proyecto FinanceBro

## Descripción General

**FinanceBro** es una plataforma completa de comparación de productos financieros en Colombia que combina:
- Automatización de web scraping con **n8n**
- Almacenamiento dual de datos (**PostgreSQL** + **Google Sheets**)
- Frontend moderno con **React** + **TypeScript**
- Backend futuro con **NestJS** + **PostgreSQL** + **Redis**

## Arquitectura del Proyecto

### Componentes Actuales

1. **n8n Workflows (Scraping & Automatización)**
   - Ubicación: `/n8n`
   - Función: Extrae datos financieros de sitios web de bancos
   - Almacena en: PostgreSQL (n8n cloud) + Google Sheets
   - Workflow principal: `TextScrapperTool.json` (22+ nodos)

2. **Google Sheets Database**
   - URL: https://docs.google.com/spreadsheets/d/1yUR0Tow3yrbSemyzmsqDY4VoF113wrxfCwVDhSTOsoM/edit?usp=sharing
   - Función: Almacenamiento secundario y visualización de datos
   - Acceso: Público (solo lectura)

3. **Frontend Web (React)**
   - Ubicación: `/finance-hub-main`
   - Stack: React 18.3.1 + TypeScript 5.8.3 + Vite 5.4.19
   - UI: Tailwind CSS + shadcn/ui + Radix UI + Framer Motion
   - Estado actual: Datos hardcoded (sin integración con API real)

### Componentes Futuros (En Desarrollo)

4. **Backend API (NestJS)** 🔜
   - Stack planificado:
     - **NestJS**: Framework backend
     - **PostgreSQL**: Base de datos principal
     - **Redis**: Sistema de cache para performance
     - **TypeORM**: ORM para gestión de datos
     - **JWT**: Autenticación
     - **Swagger**: Documentación de API

   - Endpoints planificados:
     ```
     GET /api/v1/creditos/hipotecarios
     GET /api/v1/creditos/hipotecarios/:id
     GET /api/v1/creditos/personales
     POST /api/v1/creditos/comparar
     GET /api/v1/bancos
     GET /api/v1/bancos/:id
     ```

## Flujo de Datos

### Flujo Actual
```
Bancos (Web)
  → n8n Scraping
    → PostgreSQL (n8n cloud)
      → Google Sheets
        → Frontend (datos hardcoded)
```

### Flujo Futuro (Con Backend NestJS)
```
Bancos (Web)
  → n8n Scraping
    → PostgreSQL (NestJS)
      → Backend API (NestJS)
        → Redis Cache
          → Frontend (React)
```

## Almacenamiento de Datos

### Actual
- **PostgreSQL (n8n cloud)**: Base de datos principal integrada en n8n
- **Google Sheets**: Base de datos secundaria para visualización
  - Link: https://docs.google.com/spreadsheets/d/1yUR0Tow3yrbSemyzmsqDY4VoF113wrxfCwVDhSTOsoM/edit?usp=sharing

### Futuro
- **PostgreSQL (NestJS)**: Base de datos principal independiente
- **Redis**: Cache para optimizar performance
- n8n escribirá directamente en PostgreSQL del backend NestJS

## Estructura del Repositorio

```
Proyecto-FinanceBro/
└── finance-bro-web/
    ├── .claude/
    │   ├── settings.local.json     # Configuración de Claude Code
    │   └── claude.md               # Este archivo (contexto del proyecto)
    │
    ├── n8n/                        # Sistema de automatización
    │   ├── sync-workflow.js        # Script para sincronizar workflows
    │   ├── TextScrapperTool.json   # Workflow principal de scraping
    │   ├── backups/                # Backups automáticos (no versionado)
    │   ├── .env                    # Variables de entorno (no versionado)
    │   ├── package.json
    │   └── README.md
    │
    ├── finance-bro-web/            # Frontend React
    │   ├── src/
    │   │   ├── components/         # Componentes React
    │   │   │   ├── ui/             # Componentes shadcn/ui (40+)
    │   │   │   ├── BankCard.tsx
    │   │   │   ├── BankComparison.tsx
    │   │   │   ├── CreditFilters.tsx
    │   │   │   └── ...
    │   │   ├── pages/
    │   │   │   ├── Index.tsx
    │   │   │   └── NotFound.tsx
    │   │   ├── hooks/
    │   │   ├── lib/
    │   │   ├── App.tsx
    │   │   └── main.tsx
    │   ├── public/
    │   ├── components.json         # Config shadcn/ui
    │   ├── tailwind.config.ts
    │   ├── package.json
    │   └── README.md
    │
    ├── .git/                       # Repositorio Git
    ├── .gitignore
    └── README.md                   # Documentación principal
```

## Tecnologías Utilizadas

### Frontend (Actual)
- **React 18.3.1**: Librería UI
- **TypeScript 5.8.3**: Tipado estático
- **Vite 5.4.19**: Build tool
- **Tailwind CSS 3.4.17**: Framework CSS
- **shadcn/ui**: Componentes UI
- **Framer Motion**: Animaciones
- **TanStack Query**: Estado del servidor
- **React Hook Form**: Formularios
- **Zod**: Validación

### Backend Automatización (Actual)
- **n8n Cloud**: Plataforma de workflows
- **PostgreSQL**: Base de datos (n8n cloud)
- **Google Sheets API**: Almacenamiento secundario
- **Node.js 18+**: Runtime

### Backend API (Futuro - En Desarrollo)
- **NestJS**: Framework backend
- **PostgreSQL**: Base de datos principal
- **Redis**: Sistema de cache
- **TypeORM**: ORM
- **JWT**: Autenticación
- **Swagger**: Documentación API

## Variables de Entorno

### n8n
```env
N8N_API_KEY=tu_api_key_de_n8n
N8N_HOST=https://tu-instancia.n8n.cloud
```

### Frontend (Futuro - con API)
```env
VITE_API_URL=https://api.financebro.com
VITE_API_KEY=tu_api_key
```

### Backend NestJS (Futuro)
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=financebro
DATABASE_PASSWORD=password
DATABASE_NAME=financebro_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=secret
JWT_EXPIRATION=7d
```

## Productos Financieros

### Disponibles
- ✅ **Créditos Hipotecarios**: Comparación de 50+ bancos colombianos

### En Desarrollo (Futuro)
- 🔜 **Créditos Personales**
- 🔜 **Créditos Automotriz**
- 🔜 **Créditos Empresariales**
- 🔜 **Seguros** (Vida, Auto, Hogar, Gastos Médicos)
- 🔜 **Tarjetas de Crédito** (Sin anualidad, Cashback, Millas)
- 🔜 **Inversiones** (CDT, Fondos, Bonos, Acciones)

## Modelo de Datos

### Crédito Hipotecario
```typescript
interface CreditoHipotecario {
  id: string;
  banco: string;
  logo: string;
  tasaInteres: number;        // Porcentaje anual
  mensualidad: number;        // COP
  costoTotal: number;         // COP
  plazo: number;              // Años
  monto: number;              // COP
  comisiones: {
    apertura: number;
    estudio: number;
  };
  requisitos: string[];
  tiempoProcesamiento: string;
  calificacion: number;       // 1-5 estrellas
  caracteristicas: string[];
  activo: boolean;
  fechaActualizacion: Date;
}
```

## Roadmap

### Q1 2026
- [x] Comparador de créditos hipotecarios
- [x] Sistema n8n con scraping automatizado
- [x] Almacenamiento dual (PostgreSQL + Google Sheets)
- [ ] **Backend API con NestJS + PostgreSQL + Redis**
- [ ] Integración frontend con API real
- [ ] Tests unitarios y E2E

### Q2 2026
- [ ] Migración completa a backend NestJS
- [ ] Sistema de cache con Redis
- [ ] Créditos personales y automotriz
- [ ] Dashboard de administración

### Q3 2026
- [ ] Tarjetas de crédito
- [ ] Seguros
- [ ] Sistema de recomendaciones con IA
- [ ] Autenticación de usuarios

### Q4 2026
- [ ] Inversiones
- [ ] App móvil (React Native)
- [ ] Análisis de perfil financiero
- [ ] Marketplace de productos

## Comandos Útiles

### n8n
```bash
cd n8n
npm install
npm run sync              # Sincronizar workflow a n8n cloud
```

### Frontend
```bash
cd finance-bro-web
npm install
npm run dev               # Servidor de desarrollo
npm run build             # Build de producción
npm run preview           # Preview del build
npm run lint              # Linter
```

### Backend (Futuro)
```bash
cd backend
npm install
npm run start:dev         # Desarrollo
npm run start:prod        # Producción
npm run test              # Tests
npm run migration:run     # Ejecutar migraciones
```

## Enlaces Importantes

- **Google Sheets Database**: https://docs.google.com/spreadsheets/d/1yUR0Tow3yrbSemyzmsqDY4VoF113wrxfCwVDhSTOsoM/edit?usp=sharing
- **n8n API Docs**: https://docs.n8n.io/api/
- **React Docs**: https://react.dev/
- **NestJS Docs**: https://docs.nestjs.com/

## Notas Importantes

1. **Datos Actuales**: El frontend usa datos hardcoded. La integración con API real está pendiente.
2. **n8n Storage**: n8n guarda datos en PostgreSQL (n8n cloud) y Google Sheets simultáneamente.
3. **Backend en Desarrollo**: El backend con NestJS + PostgreSQL + Redis está planificado para Q1 2026.
4. **Migración Futura**: Cuando el backend NestJS esté listo, n8n escribirá directamente en la nueva base de datos.
5. **Redis**: Se usará para cache de queries frecuentes y mejorar performance.

## Estado del Proyecto

- **Fase Actual**: Prototipo funcional con datos hardcoded
- **Siguiente Fase**: Desarrollo del backend NestJS con PostgreSQL y Redis
- **Objetivo**: Plataforma completa con datos en tiempo real desde múltiples bancos
