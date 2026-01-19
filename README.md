# FinanceBro - Plataforma de Comparación Financiera

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![n8n](https://img.shields.io/badge/n8n-Automation-FF6D5A?logo=n8n)](https://n8n.io/)
[![NestJS](https://img.shields.io/badge/NestJS-Backend-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?logo=redis&logoColor=white)](https://redis.io/)


Plataforma de comparación de productos financieros en Colombia con arquitectura de microservicios, automatización mediante n8n y web scraping inteligente.

## Descripción General

**FinanceBro** es un ecosistema financiero que democratiza el acceso a información de productos crediticios en Colombia. Combina automatización de workflows (n8n), scraping inteligente, almacenamiento dual (PostgreSQL + Google Sheets) y una interfaz web moderna (React + TypeScript) para ofrecer comparaciones transparentes y actualizadas en tiempo real.

### Componentes del Proyecto

1. **Backend de Automatización (n8n)**: Sistema de workflows para scraping, procesamiento y normalización de datos financieros
2. **Almacenamiento de Datos**: PostgreSQL (n8n cloud) + Google Sheets con sincronización bidireccional
3. **Frontend Web (React)**: Plataforma de comparación, simulación y visualización
4. **Backend API (NestJS)**: [En desarrollo] Microservicios con arquitectura distribuida

### Objetivo

Democratizar el acceso a información financiera en Colombia mediante una plataforma gratuita que permite comparar créditos hipotecarios, seguros, tarjetas de crédito e inversiones con datos actualizados en tiempo real desde múltiples entidades financieras.

## Arquitectura del Proyecto

### Arquitectura de Microservicios

La plataforma FinanceBro utiliza una **arquitectura de microservicios** que divide la aplicación en servicios independientes con responsabilidades específicas y bases de datos propias. Esta decisión arquitectónica responde a necesidades de escalabilidad, mantenibilidad y despliegue independiente.

### Justificación Técnica

**Escalabilidad selectiva**: El módulo de productos crediticios experimentará mayor carga que notificaciones. Los microservicios permiten escalar horizontalmente solo los componentes necesarios, optimizando recursos y reduciendo costos operativos.

**Despliegue independiente**: Cada microservicio puede desplegarse, actualizarse y revertirse de forma independiente sin afectar otros servicios, minimizando interrupciones.

**Aislamiento de fallos**: Errores en el scraping no comprometen consultas de productos almacenados. Las fallas se contienen y no se propagan.

**Stack homogéneo**: Se mantiene NestJS + PostgreSQL en todos los servicios para simplificar operación y mantenimiento.

### Servicios del Sistema

#### 1. MS Usuarios (Authentication & Profile Service)

**Dominio**: Gestión de identidad, autenticación y perfiles financieros.

**Responsabilidades**:

Gestiona el ciclo de vida completo del usuario, desde registro hasta administración de perfil financiero. Implementa autenticación segura mediante JWT, garantizando acceso controlado a funcionalidades personalizadas.

Administra perfiles financieros (ingresos, tipo de empleo, antigüedad laboral, capacidad de endeudamiento) para personalizar comparaciones y recomendaciones. Gestiona preferencias de notificación consumidas por el servicio de notificaciones vía eventos asíncronos.

**Operaciones**:
- Registro con verificación de correo
- Autenticación y gestión de sesiones JWT
- Recuperación de contraseñas
- Gestión de perfil financiero
- Productos favoritos
- Historial de simulaciones

#### 2. MS Productos Crediticios (Credit Products Service)

**Dominio**: Gestión integral del catálogo de productos crediticios, ingesta de datos, comparación y simulación.

**Responsabilidades**:

Núcleo funcional de la plataforma. Mantiene actualizado el catálogo completo de productos crediticios de entidades financieras colombianas, garantizando precisión y vigencia.

Coordina ingesta de datos desde n8n, normalizando información heterogénea de múltiples fuentes bancarias. Valida consistencia, detecta cambios en tasas y genera eventos para notificaciones.

El motor de comparación evalúa elegibilidad, calcula capacidad de endeudamiento y genera rankings personalizados considerando tasas, plazos, montos y beneficios adicionales. El simulador proyecta escenarios de financiamiento con cálculo de cuotas, intereses y costo total.

**Operaciones**:
- Catálogo de entidades financieras
- Almacenamiento y actualización de productos
- Registro de tasas vigentes e históricas
- Procesamiento de datos desde n8n (scraping)
- Evaluación de elegibilidad y rankings
- Simulación de créditos
- Comparación avanzada entre productos

#### 3. MS Notificaciones (Notification Service)

**Dominio**: Gestión centralizada de comunicaciones salientes.

**Responsabilidades**:

Canal de comunicación unificado implementando arquitectura orientada a eventos. Consume eventos del servicio de productos (cambios en tasas, nuevos productos) para reaccionar en tiempo real.

Gestiona múltiples canales: correo electrónico para notificaciones formales, push para alertas inmediatas. La selección del canal se basa en preferencias del usuario y naturaleza de la notificación.

Sistema de templates para comunicaciones consistentes con personalización dinámica. Mantiene historial completo para auditoría y prevención de duplicados.

**Operaciones**:
- Correos transaccionales y marketing
- Notificaciones push
- Procesamiento de eventos de cambio de tasas
- Alertas personalizadas por perfil de usuario
- Gestión de templates
- Auditoría de notificaciones

#### 4. MS Configuración (Configuration Service)

**Dominio**: Centralización de parámetros de configuración y valores regulatorios del mercado financiero colombiano.

**Responsabilidades**:

Fuente única de verdad para parámetros y valores de referencia consumidos por múltiples servicios. Elimina duplicación y garantiza consistencia en cálculos.

Mantiene valores regulatorios críticos: UVR (Unidad de Valor Real, actualización diaria Banco de la República) para cálculo de tasas en créditos denominados en UVR; SMMLV (Salario Mínimo) para clasificación VIS/No VIS; tasa de usura (Superintendencia Financiera, mensual) como límite legal de tasas de interés.

Gestiona feature flags para habilitar/deshabilitar funcionalidades sin despliegues, facilitando lanzamientos graduales y respuesta rápida ante incidentes.

**Operaciones**:
- Valor UVR (actualización diaria)
- SMMLV vigente
- Tasa de usura certificada
- Parámetros de clasificación de vivienda
- Feature flags
- API con cache de alto rendimiento

### Comunicación entre Servicios

**Comunicación síncrona (HTTP/REST)**: Operaciones con respuesta inmediata (consulta de productos, obtención de UVR). API Gateway centraliza comunicaciones con balanceo de carga y circuit breakers para resiliencia.

**Comunicación asíncrona (Message Broker)**: Redis Pub/Sub o RabbitMQ para eventos diferidos. Cambios en tasas generan eventos consumidos por notificaciones sin bloquear actualización de datos.

### Estructura del Repositorio

```
Proyecto-FinanceBro/
└── finance-bro-web/
    ├── .claude/                    # Configuración de Claude Code
    │   ├── settings.local.json
    │   └── claude.md               # Contexto del proyecto para IA
    │
    ├── n8n/                        # Sistema de automatización y scraping
    │   ├── sync-workflow.js        # Herramienta de sincronización de workflows
    │   ├── TextScrapperTool.json   # Workflow principal de scraping
    │   ├── backups/                # Backups automáticos de workflows
    │   └── README.md               # Documentación específica de n8n
    │
    ├── finance-bro-web/            # Aplicación web frontend
    │   ├── src/                    # Código fuente de React
    │   ├── public/                 # Archivos estáticos
    │   ├── components.json         # Configuración de shadcn/ui
    │   └── README.md               # Documentación específica del frontend
    │
    └── README.md                   # Documentación principal (este archivo)
```

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     ARQUITECTURA FINANCEBRO                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐       ┌──────────────┐                    │
│  │   Bancos     │──────▶│     n8n      │ (Scraping)         │
│  │  Websites    │       │   Workflows  │                    │
│  └──────────────┘       └──────┬───────┘                    │
│                                 │                             │
│                                 ▼                             │
│                    ┌────────────────────┐                    │
│                    │   PostgreSQL DB    │ (Datos)           │
│                    │   (n8n Cloud)      │                    │
│                    └─────────┬──────────┘                    │
│                              │                               │
│                              ├──────────────┐                │
│                              │              │                │
│                              ▼              ▼                │
│                    ┌──────────────┐  ┌────────────┐         │
│                    │ Google Sheets│  │ [FUTURO]   │         │
│                    │   Database   │  │ Backend API│         │
│                    └──────┬───────┘  │  (NestJS)  │         │
│                           │          │ + Redis    │         │
│                           │          └─────┬──────┘         │
│                           │                │                │
│                           └────────┬───────┘                │
│                                    │                        │
│                                    ▼                        │
│                          ┌──────────────┐                   │
│                          │   Frontend   │                   │
│                          │  React + TS  │                   │
│                          └──────────────┘                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Componente 1: Sistema de Automatización (n8n)

Motor de datos del proyecto con workflows automatizados para web scraping, procesamiento, normalización y almacenamiento de información financiera.

### Características

- **TextScrapperTool Workflow**: 22+ nodos para scraping inteligente
- **Sistema de Backups**: Copias automáticas antes de actualizaciones
- **Sincronización Cloud**: Script para sincronizar workflows locales con n8n cloud
- **Control de Versiones**: Workflows versionados en Git
- **Validación de Datos**: Garantiza calidad y consistencia
- **Almacenamiento Dual**: PostgreSQL (n8n cloud) + Google Sheets

### Almacenamiento de Datos

**PostgreSQL (n8n Cloud)**: Base de datos principal con información estructurada

**Google Sheets**: Base de datos secundaria para visualización y respaldo
- [Ver Google Sheets Database](https://docs.google.com/spreadsheets/d/1yUR0Tow3yrbSemyzmsqDY4VoF113wrxfCwVDhSTOsoM/edit?usp=sharing)

### Quick Start

```bash
cd n8n
npm install
cp .env.example .env
# Editar .env con credenciales de n8n
npm run sync
```

**Documentación completa**: [n8n/README.md](n8n/README.md)

---

## Componente 2: Plataforma Web Frontend

Interfaz de usuario para comparación visual, intuitiva y en tiempo real de productos financieros.

### Características

- **Comparación de Créditos Hipotecarios**: Tasas, mensualidades y requisitos de 50+ bancos
- **Filtros Avanzados**: Búsquedas por monto, plazo y tipo de propiedad
- **Interfaz Moderna**: Diseño responsive con animaciones fluidas (Framer Motion)
- **Componentes Reutilizables**: 40+ componentes UI (shadcn/ui + Radix UI)
- **Gratuito**: Sin costo para usuarios finales
- **Análisis Detallado**: Tasas, comisiones, seguros y requisitos desglosados

### Categorías de Productos

**En Desarrollo**: Créditos Hipotecarios

### Stack Tecnológico

**Core**: React 18.3.1, TypeScript 5.8.3, Vite 5.4.19
**UI/UX**: Tailwind CSS, shadcn/ui, Radix UI, Framer Motion
**Estado**: TanStack Query, React Hook Form, Zod
**Visualización**: Recharts, Lucide Icons

### Quick Start

```bash
cd finance-bro-web
npm install
npm run dev
# http://localhost:5173
```

**Documentación completa**: [finance-bro-web/README.md](finance-bro-web/README.md)

---

## Componente 3: Backend API (En Desarrollo)

Backend robusto como capa intermedia entre datos y frontend.

### Stack Tecnológico

- **NestJS**: Framework backend progresivo con TypeScript
- **PostgreSQL**: Base de datos relacional principal
- **Redis**: Sistema de cache para performance
- **TypeORM**: ORM para gestión de base de datos
- **JWT**: Autenticación y autorización
- **Swagger**: Documentación automática de API

### Características Planificadas

- API RESTful con endpoints para información financiera
- GraphQL (opcional) para queries flexibles
- Sistema de cache con Redis
- Rate limiting por usuario
- Sistema de autenticación y permisos
- Logging avanzado para monitoreo
- Tests automatizados (unit, integration, E2E)

### Endpoints Planificados

```typescript
// Créditos
GET    /api/v1/creditos/hipotecarios
GET    /api/v1/creditos/hipotecarios/:id
GET    /api/v1/creditos/personales
POST   /api/v1/creditos/comparar

// Bancos
GET    /api/v1/bancos
GET    /api/v1/bancos/:id

// Seguros
GET    /api/v1/seguros
GET    /api/v1/seguros/:tipo
```

### Migración de Datos

**Fase 1**: Migrar datos de Google Sheets a PostgreSQL (NestJS)
**Fase 2**: Configurar n8n para escribir directamente en PostgreSQL (NestJS)
**Fase 3**: Implementar Redis cache
**Fase 4**: Integrar frontend con API

---

## Instalación Completa

### Requisitos Previos

- Node.js >= 18.0.0
- npm, yarn o bun
- Cuenta de n8n con acceso a la API

### Instalación

```bash
# Clonar repositorio
git clone <URL_DEL_REPOSITORIO>
cd Proyecto-FinanceBro

# Configurar n8n
cd n8n
npm install
cp .env.example .env
# Editar .env con N8N_API_KEY y N8N_HOST
npm run sync

# Configurar frontend
cd ../finance-bro-web
npm install
npm run dev

# Acceso
# Frontend: http://localhost:5173
# n8n Cloud: Tu instancia personal
# Google Sheets: Ver link en documentación
```

---

## Flujo de Datos

### Actual

```
Bancos → n8n (Scraping) → PostgreSQL (n8n) → Google Sheets → Frontend
```

### Futuro (Backend NestJS)

```
Bancos → n8n (Scraping) → PostgreSQL (NestJS) → API REST → Redis Cache → Frontend
```

---

## Recursos y Enlaces

### Documentación
- [README Principal](README.md) (este archivo)
- [README n8n](n8n/README.md)
- [README Frontend](finance-bro-web/README.md)
- [Contexto Claude](.claude/claude.md)

### Datos
- [Google Sheets Database](https://docs.google.com/spreadsheets/d/1yUR0Tow3yrbSemyzmsqDY4VoF113wrxfCwVDhSTOsoM/edit?usp=sharing)

### Tecnologías
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [n8n Documentation](https://docs.n8n.io/)
- [NestJS Documentation](https://docs.nestjs.com/)

---

## Roadmap

### Q1 2026
- [x] Comparador de créditos hipotecarios
- [x] Sistema n8n con scraping automatizado
- [x] Almacenamiento dual (PostgreSQL n8n + Google Sheets)
- [ ] Backend API con NestJS + PostgreSQL + Redis
- [ ] Integración frontend con API
- [ ] Tests unitarios y E2E

### Q2 2026
- [ ] Migración completa a backend NestJS
- [ ] Sistema de cache con Redis
- [ ] Créditos personales y automotriz
- [ ] Dashboard de administración

### Q3 2026
- [ ] Tarjetas de crédito y seguros
- [ ] Sistema de recomendaciones con IA
- [ ] Autenticación de usuarios

### Q4 2026
- [ ] Inversiones (CDT, Fondos, Acciones)
- [ ] App móvil (React Native)
- [ ] Marketplace de productos financieros

---

## Contribución

### Flujo de Trabajo

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit cambios (`git commit -m 'Add nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abrir Pull Request

### Convenciones de Código

- TypeScript para todos los archivos nuevos
- Seguir reglas de ESLint configuradas
- Componentes funcionales con hooks
- Componentes pequeños y reutilizables (< 200 líneas)
- Documentar funciones complejas con JSDoc

---

## Reporte de Bugs

Para reportar bugs o sugerencias:

1. Abrir issue en el repositorio
2. Describir el problema con detalle
3. Incluir pasos para reproducir
4. Adjuntar capturas de pantalla si es relevante

---

## Licencia

Este proyecto es privado y no tiene licencia pública.

---

## Autores y Equipo

- **Desarrollo Frontend**: Desarrollado originalmente con [Lovable](https://lovable.dev)
- **Desarrollo n8n**: Sistema de workflows personalizado
- **Backend**: En desarrollo con NestJS
- **Mantenimiento**: Equipo FinanceBro

---

## Agradecimientos

- n8n por la plataforma de automatización de workflows
- shadcn/ui por los componentes UI de alta calidad
- Lovable por el desarrollo inicial del frontend
- Google Sheets por el almacenamiento temporal de datos
- Comunidad Open Source por las librerías utilizadas

---

**Nota**: Proyecto en desarrollo activo. Características marcadas como pendientes serán implementadas según roadmap establecido.
