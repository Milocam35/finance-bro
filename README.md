# FinanceBro - Plataforma de Comparación Financiera 💰

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![n8n](https://img.shields.io/badge/n8n-Automation-FF6D5A?logo=n8n)](https://n8n.io/)

Una plataforma web completa para comparar productos financieros en Colombia, con automatización de workflows y web scraping inteligente.

## 📋 Descripción General

**FinanceBro** es un ecosistema completo que combina automatización de workflows con n8n y una plataforma web moderna para ofrecer a los usuarios información transparente y actualizada sobre productos financieros colombianos.

### Componentes del Proyecto

1. **Backend de Automatización (n8n)**: Sistema de workflows para scraping y procesamiento de datos
2. **Almacenamiento de Datos**: PostgreSQL (n8n cloud) + Google Sheets
3. **Frontend Web (React)**: Plataforma de comparación y visualización
4. **Backend API (NestJS)** - 🔜 **Próximamente**

### 🎯 Objetivo

Democratizar el acceso a información financiera en Colombia, permitiendo a los usuarios comparar créditos, seguros, tarjetas de crédito e inversiones de manera transparente, gratuita y actualizada en tiempo real.

## 🏗️ Arquitectura del Proyecto

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

## 🤖 Componente 1: Sistema de Automatización (n8n)

### Descripción

El componente de **n8n** es el motor de datos del proyecto. Utiliza workflows automatizados para:

- **Web Scraping**: Extrae información de productos financieros de sitios web de bancos
- **Procesamiento de Datos**: Limpia, normaliza y valida información financiera
- **Actualización Automática**: Mantiene los datos sincronizados en tiempo real
- **Almacenamiento Dual**: Guarda datos en PostgreSQL (n8n cloud) y Google Sheets

### Características Principales

✅ **TextScrapperTool Workflow**: Workflow principal con 22+ nodos para scraping inteligente
✅ **Sistema de Backups Automático**: Crea copias de seguridad antes de cada actualización
✅ **Sincronización con la Nube**: Script para sincronizar workflows locales con n8n cloud
✅ **Control de Versiones**: Workflows versionados en Git para trazabilidad
✅ **Validación de Datos**: Asegura calidad y consistencia de la información extraída
✅ **Doble Almacenamiento**: PostgreSQL (n8n cloud) + Google Sheets para redundancia

### Almacenamiento de Datos

Los workflows de n8n guardan la información financiera en dos ubicaciones:

1. **PostgreSQL (n8n Cloud)**: Base de datos principal con información estructurada
2. **Google Sheets**: Base de datos secundaria para visualización y respaldo
   - [📊 Ver Google Sheets Database](https://docs.google.com/spreadsheets/d/1yUR0Tow3yrbSemyzmsqDY4VoF113wrxfCwVDhSTOsoM/edit?usp=sharing)

### Quick Start - n8n

```bash
# Navegar al directorio de n8n
cd n8n

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de n8n

# Sincronizar workflow a la nube
npm run sync
```

📖 **Documentación completa**: [n8n/README.md](n8n/README.md)

---

## 🌐 Componente 2: Plataforma Web Frontend

### Descripción

La **plataforma web** es la interfaz de usuario donde los clientes finales pueden comparar productos financieros de forma visual, intuitiva y en tiempo real.

### Características Principales

✅ **Comparación de Créditos Hipotecarios**: Compara tasas, mensualidades y requisitos de 50+ bancos
✅ **Filtros Avanzados**: Personaliza búsquedas por monto, plazo y tipo de propiedad
✅ **Interfaz Moderna**: Diseño responsive con animaciones fluidas (Framer Motion)
✅ **Componentes Reutilizables**: 40+ componentes UI basados en shadcn/ui y Radix UI
✅ **100% Gratuito**: Sin costo para los usuarios finales
✅ **Análisis Detallado**: Tasas, comisiones, seguros y requisitos desglosados

### Categorías de Productos

#### Disponibles Ahora
- ✅ **Créditos Hipotecarios**: Compara las mejores opciones del mercado colombiano

#### En Desarrollo
- 🔜 **Créditos Personales, Automotriz y Empresariales**
- 🔜 **Seguros**: Vida, Auto, Hogar, Gastos Médicos
- 🔜 **Tarjetas de Crédito**: Sin anualidad, Cashback, Millas
- 🔜 **Inversiones**: CDT, Fondos, Bonos, Acciones

### Stack Tecnológico

**Core**: React 18.3.1, TypeScript 5.8.3, Vite 5.4.19
**UI/UX**: Tailwind CSS, shadcn/ui, Radix UI, Framer Motion
**Estado**: TanStack Query, React Hook Form, Zod
**Visualización**: Recharts, Lucide Icons

### Quick Start - Frontend

```bash
# Navegar al directorio del frontend
cd finance-bro-web

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir navegador en http://localhost:5173
```

📖 **Documentación completa**: [finance-bro-web/README.md](finance-bro-web/README.md)

---

## 🚀 Componente 3: Backend API (Próximamente)

### 🔜 En Desarrollo

El proyecto incluirá un **backend robusto** desarrollado con tecnologías modernas para servir como capa intermedia entre los datos y el frontend.

### Stack Tecnológico Planificado

- **NestJS**: Framework backend progresivo con TypeScript
- **PostgreSQL**: Base de datos relacional principal
- **Redis**: Sistema de cache para mejorar performance
- **TypeORM**: ORM para gestión de base de datos
- **JWT**: Autenticación y autorización
- **Swagger**: Documentación automática de API

### Características Planificadas

🔜 **API RESTful**: Endpoints para acceder a información financiera
🔜 **GraphQL** (Opcional): Queries flexibles para el frontend
🔜 **Sistema de Cache**: Redis para reducir carga en PostgreSQL
🔜 **Rate Limiting**: Control de peticiones por usuario
🔜 **Autenticación**: Sistema de usuarios y permisos
🔜 **Logging Avanzado**: Monitoreo y debugging
🔜 **Tests Automatizados**: Unit, integration y E2E tests

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

// Seguros (Futuro)
GET    /api/v1/seguros
GET    /api/v1/seguros/:tipo
```

### Migración de Datos

Cuando el backend esté listo:

1. **Fase 1**: Migrar datos de Google Sheets a PostgreSQL (NestJS)
2. **Fase 2**: Configurar n8n para escribir directamente en PostgreSQL (NestJS)
3. **Fase 3**: Implementar Redis cache para optimización
4. **Fase 4**: Integrar frontend con nueva API

---

## 📦 Instalación Completa del Proyecto

### Requisitos Previos

- **Node.js** >= 18.0.0
- **npm**, **yarn** o **bun**
- **Cuenta de n8n** con acceso a la API

### Instalación Paso a Paso

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd finance-bro-web

# 2. Configurar n8n
cd n8n
npm install
cp .env.example .env
# Editar .env con N8N_API_KEY y N8N_HOST
npm run sync

# 3. Configurar frontend
cd ../finance-bro-web
npm install
npm run dev

# 4. Acceder a la aplicación
# Frontend: http://localhost:5173
# n8n Cloud: Tu instancia personal
# Google Sheets: Ver link en la documentación
```

---

## 🔄 Flujo de Trabajo del Proyecto

### Flujo Actual

```
Bancos → Scraping (n8n) → PostgreSQL (n8n) → Google Sheets → Frontend
```

### Flujo Futuro (Con Backend NestJS)

```
Bancos → Scraping (n8n) → PostgreSQL (NestJS) → API REST → Redis Cache → Frontend
```

---

## 📊 Recursos y Enlaces

### Documentación
- [📄 README Principal](README.md) ← Estás aquí
- [🤖 README n8n](n8n/README.md) - Sistema de automatización
- [🌐 README Frontend](finance-bro-web/README.md) - Aplicación web
- [📝 Contexto Claude](.claude/claude.md) - Contexto completo para IA

### Datos
- [📊 Google Sheets Database](https://docs.google.com/spreadsheets/d/1yUR0Tow3yrbSemyzmsqDY4VoF113wrxfCwVDhSTOsoM/edit?usp=sharing)

### Tecnologías
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [n8n Documentation](https://docs.n8n.io/)
- [NestJS Documentation](https://docs.nestjs.com/)

---

## 📝 Roadmap

### Q1 2026
- [x] Comparador de créditos hipotecarios
- [x] Sistema n8n con scraping automatizado
- [x] Almacenamiento dual (PostgreSQL n8n + Google Sheets)
- [ ] **Backend API con NestJS + PostgreSQL + Redis**
- [ ] Integración frontend con API real
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

## 🤝 Contribución

### Flujo de Trabajo

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convenciones de Código

- Usa **TypeScript** para todos los archivos nuevos
- Sigue las reglas de **ESLint** configuradas
- Usa **componentes funcionales** con hooks
- Mantén componentes **pequeños y reutilizables** (< 200 líneas)
- Documenta funciones complejas con **JSDoc**

---

## 🐛 Reporte de Bugs

Si encuentras un bug o tienes sugerencias:

1. Abre un **issue** en el repositorio
2. Describe el problema con detalle
3. Incluye pasos para reproducir
4. Adjunta capturas de pantalla si es relevante

---

## 📄 Licencia

Este proyecto es privado y no tiene licencia pública.

---

## 👥 Autores y Equipo

- **Desarrollo Frontend**: Desarrollado originalmente con [Lovable](https://lovable.dev)
- **Desarrollo n8n**: Sistema de workflows personalizado
- **Backend (Futuro)**: En desarrollo con NestJS
- **Mantenimiento**: Equipo FinanceBro

---

## 🙏 Agradecimientos

- **n8n**: Por la plataforma de automatización de workflows
- **shadcn/ui**: Por los componentes UI de alta calidad
- **Lovable**: Por el desarrollo inicial del frontend
- **Google Sheets**: Por el almacenamiento temporal de datos
- **Comunidad Open Source**: Por todas las librerías utilizadas

---

**Nota**: Este proyecto está en desarrollo activo. Muchas características están marcadas como "🔜 Próximamente" y serán implementadas en futuras versiones según el roadmap establecido.
