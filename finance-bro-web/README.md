# FinanceBro - Frontend Web 💰

> **📌 Nota Importante**: Este es el componente de **frontend** del proyecto FinanceBro. Para ver la documentación completa del proyecto (incluyendo el sistema de automatización con n8n y el backend futuro), consulta el [README principal](../README.md).

Una aplicación web moderna construida con React y TypeScript para comparar productos financieros en Colombia.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?logo=tailwind-css)

## 📋 Descripción

Este es el **frontend web** de FinanceBro, una aplicación React que permite a los usuarios comparar diferentes productos financieros de los principales bancos colombianos. La plataforma ofrece información transparente y actualizada sobre tasas de interés, costos totales, comisiones y requisitos para ayudar a los usuarios a tomar decisiones financieras informadas.

### 🔗 Relación con el Proyecto Global

- **Backend/Datos**: Los datos financieros son extraídos y procesados por workflows de [n8n](../n8n/README.md)
- **Almacenamiento**: Datos guardados en PostgreSQL (n8n cloud) y [Google Sheets](https://docs.google.com/spreadsheets/d/1yUR0Tow3yrbSemyzmsqDY4VoF113wrxfCwVDhSTOsoM/edit?usp=sharing)
- **Frontend** (este proyecto): Presenta los datos de forma visual y permite a los usuarios comparar productos
- **Backend API (Futuro)**: Se desarrollará con NestJS + PostgreSQL + Redis para servir datos al frontend

### 🎯 Características Principales

- **Comparación de Créditos Hipotecarios**: Compara tasas, mensualidades y requisitos de más de 50 bancos
- **Filtros Avanzados**: Personaliza tu búsqueda según monto, plazo y tipo de propiedad
- **Información Transparente**: Datos actualizados directamente de los bancos, sin sorpresas
- **Interfaz Moderna**: Diseño limpio con animaciones fluidas y responsivo
- **100% Gratuito**: Sin costo para los usuarios
- **Análisis Detallado**: Tasas, comisiones, seguros y requisitos desglosados

### 🚀 Categorías de Productos

#### Disponibles
- ✅ **Créditos Hipotecarios**: Compara las mejores opciones del mercado

#### Próximamente
- 🔜 **Créditos Personales, Automotriz y Empresariales**
- 🔜 **Seguros**: Vida, Auto, Hogar, Gastos Médicos
- 🔜 **Tarjetas de Crédito**: Sin anualidad, Cashback, Millas
- 🔜 **Inversiones**: CDT, Fondos, Bonos, Acciones

## 🛠️ Tecnologías Utilizadas

### Core
- **React 18.3.1** - Librería UI
- **TypeScript 5.8.3** - Tipado estático
- **Vite 5.4.19** - Build tool y dev server

### UI/UX
- **Tailwind CSS 3.4.17** - Framework de estilos
- **shadcn/ui** - Componentes UI accesibles y customizables
- **Radix UI** - Primitivos UI sin estilos
- **Framer Motion 12.23** - Animaciones
- **Lucide React** - Iconos

### Manejo de Estado y Formularios
- **TanStack Query 5.83** - Manejo de estado del servidor
- **React Hook Form 7.61** - Manejo de formularios
- **Zod 3.25** - Validación de esquemas

### Routing
- **React Router DOM 6.30** - Navegación

### Gráficos y Visualización
- **Recharts 2.15** - Gráficos y visualización de datos

## 📁 Estructura del Proyecto

```
finance-bro-web/ (frontend)
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ui/                    # Componentes shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ... (40+ componentes)
│   │   ├── BankCard.tsx           # Tarjeta de banco individual
│   │   ├── BankComparison.tsx     # Comparador de bancos
│   │   ├── CategoriesPreview.tsx  # Vista previa de categorías
│   │   ├── CreditFilters.tsx      # Filtros de búsqueda
│   │   ├── Features.tsx           # Características del servicio
│   │   ├── Footer.tsx             # Pie de página
│   │   ├── Header.tsx             # Encabezado
│   │   ├── Hero.tsx               # Sección hero
│   │   └── NavLink.tsx            # Enlace de navegación
│   ├── hooks/
│   │   ├── use-mobile.tsx         # Hook para detección de móvil
│   │   └── use-toast.ts           # Hook para notificaciones
│   ├── lib/
│   │   └── utils.ts               # Utilidades
│   ├── pages/
│   │   ├── Index.tsx              # Página principal
│   │   └── NotFound.tsx           # Página 404
│   ├── App.tsx                    # Componente principal
│   ├── main.tsx                   # Punto de entrada
│   └── index.css                  # Estilos globales
├── components.json                # Configuración shadcn/ui
├── package.json
├── tailwind.config.ts             # Configuración Tailwind
├── tsconfig.json                  # Configuración TypeScript
└── vite.config.ts                 # Configuración Vite
```

## 🔧 Requisitos Previos

- **Node.js** >= 16.0.0
- **npm** o **yarn** o **bun**

## 📦 Instalación

1. Navega al directorio del frontend:
```bash
cd finance-bro-web
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
# o
bun install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
# o
bun dev
```

4. Abre tu navegador en [http://localhost:5173](http://localhost:5173)

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia el servidor de desarrollo

# Producción
npm run build            # Construye la aplicación para producción
npm run build:dev        # Construye en modo desarrollo
npm run preview          # Vista previa de la build de producción

# Calidad de código
npm run lint             # Ejecuta ESLint
```

## 🧩 Componentes Principales

### BankComparison
Componente principal que muestra la comparación de créditos hipotecarios de diferentes bancos. Incluye:
- Datos de 6 bancos principales (Bancolombia, Davivienda, Banco de Bogotá, BBVA Colombia, Banco Popular, Scotiabank Colpatria)
- Sistema de ordenamiento por tasa, mensualidad, costo total o calificación
- Integración con filtros

### BankCard
Tarjeta individual que muestra información detallada de cada banco:
- Tasa de interés y costo total
- Mensualidad estimada
- Características principales
- Tiempo de procesamiento
- Calificación

### CreditFilters
Sistema de filtros para personalizar la búsqueda:
- Monto del crédito
- Plazo en años
- Tipo de propiedad
- Opciones de ordenamiento

### Hero
Sección hero con:
- Animaciones fluidas con Framer Motion
- Estadísticas destacadas (50+ bancos, 100K+ usuarios, $2M+ ahorrados)
- Call-to-action principal

### Features
Sección que destaca las características del servicio:
- Información transparente
- Comparación instantánea
- Análisis detallado
- 100% gratuito
- Proceso simplificado
- Expertos financieros

### CategoriesPreview
Vista previa de todas las categorías de productos financieros disponibles y próximos.

## 🎨 Personalización

### Temas
El proyecto usa Tailwind CSS y shadcn/ui con soporte para temas personalizables. Los colores y estilos se configuran en:
- `tailwind.config.ts` - Configuración de Tailwind
- `src/index.css` - Variables CSS para temas

### Componentes UI
Los componentes de shadcn/ui se pueden personalizar individualmente en `src/components/ui/`.

## 🌐 Despliegue

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Otros proveedores
El proyecto genera una carpeta `dist/` con la build de producción que puede desplegarse en cualquier hosting estático.

## 📊 Datos

### Estado Actual

Actualmente, los datos de los bancos están **hardcodeados** en `src/components/BankComparison.tsx`. Esto es temporal mientras se desarrolla el backend API.

### Flujo de Datos (Futuro)

Cuando el backend NestJS esté disponible, el flujo será:

```
n8n (Scraping) → PostgreSQL → Backend API (NestJS + Redis Cache) → Frontend (React)
```

### Integración con API Real (Próximamente)

Para conectar con la API del backend:

1. Crea un servicio en `src/services/api.ts`
2. Usa TanStack Query para el fetching de datos
3. Actualiza el componente BankComparison para usar los datos de la API

Ejemplo:
```typescript
import { useQuery } from '@tanstack/react-query';

const { data: banks } = useQuery({
  queryKey: ['banks'],
  queryFn: fetchBanks,
});
```

### Enlaces Relacionados

- 📊 [Google Sheets Database](https://docs.google.com/spreadsheets/d/1yUR0Tow3yrbSemyzmsqDY4VoF113wrxfCwVDhSTOsoM/edit?usp=sharing) - Base de datos temporal
- 🤖 [Sistema n8n](../n8n/README.md) - Documentación de workflows de scraping
- 📖 [README Principal](../README.md) - Arquitectura completa del proyecto

## 🤝 Contribución

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Notas de Desarrollo

### Convenciones de Código
- Usa TypeScript para todos los nuevos archivos
- Sigue las reglas de ESLint configuradas
- Usa componentes funcionales con hooks
- Mantén componentes pequeños y reutilizables

### Testing
Actualmente no hay tests configurados. Se recomienda agregar:
- Vitest para unit testing
- Testing Library para component testing
- Playwright o Cypress para E2E testing

## 📄 Licencia

Este proyecto es privado y no tiene licencia pública.

## 👥 Autores

- Desarrollado originalmente con [Lovable](https://lovable.dev)

## 🐛 Reporte de Bugs

Si encuentras algún bug o tienes sugerencias, por favor abre un issue en el repositorio.

## 📞 Contacto

Para más información sobre el proyecto, contacta al equipo de desarrollo.

---

**Nota**: Este proyecto está en desarrollo activo. Muchas características están marcadas como "Próximamente" y serán implementadas en futuras versiones.
