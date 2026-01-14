# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (Vite)
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

**FinanceBro** - A financial comparison platform for comparing credit rates across banks in Colombia.

### Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS with CSS variables for theming (light/dark mode via `class`)
- shadcn/ui components (Radix UI primitives in `src/components/ui/`)
- Framer Motion for animations
- React Router for routing
- TanStack Query for data fetching
- Zod + React Hook Form for form validation

### Project Structure
Feature-based architecture for scalability:

```
src/
├── features/                    # Feature modules (business domains)
│   ├── mortgage-loans/         # Mortgage loans feature
│   │   ├── BankComparison.tsx  # Main comparison view
│   │   ├── BankCard.tsx        # Individual bank card
│   │   ├── CreditFilters.tsx   # Filter controls
│   │   └── index.ts            # Barrel export
│   │
│   └── shared/                 # Shared components
│       ├── layout/             # Layout components
│       │   ├── Header.tsx      # Main navigation
│       │   ├── Footer.tsx      # Footer
│       │   └── index.ts
│       │
│       └── common/             # Common components
│           ├── Hero.tsx        # Hero section
│           ├── Features.tsx    # Features section
│           ├── CategoriesPreview.tsx
│           ├── NavLink.tsx     # Router link wrapper
│           └── index.ts
│
├── components/
│   └── ui/                     # shadcn/ui primitives (don't modify directly)
│
├── pages/                      # Route pages
│   ├── Index.tsx               # Landing page
│   └── NotFound.tsx            # 404 page
│
├── hooks/                      # Custom React hooks
├── lib/
│   └── utils.ts                # cn() helper for Tailwind class merging
└── index.css                   # Global styles + CSS variables
```

**Import conventions:**
- Use barrel exports: `import { Header, Footer } from '@/features/shared/layout'`
- Feature components stay in their feature folder
- Shared components can be imported across features
- UI components always from `@/components/ui/`

### Styling Conventions
- Use `cn()` from `@/lib/utils` for conditional Tailwind classes
- CSS variables defined in `src/index.css` (HSL format)
- Import paths use `@/` alias (configured in tsconfig)

### Color Palette
Always use these brand colors:

**Blues (Primary)**
- `#0466C8` - Primary blue
- `#0353A4` - Primary hover
- `#023E7D` - Dark blue
- `#002855` - Darker blue
- `#001845` - Navy
- `#001233` - Darkest (backgrounds)

**Grays (Neutral)**
- `#33415C` - Dark gray
- `#5C677D` - Medium gray
- `#7D8597` - Gray
- `#979DAC` - Light gray

**Dark Accents**
- `#000814` - Near black
- `#001D3D` - Dark navy
- `#003566` - Deep blue

**Yellow (Accent)**
- `#FFC300` - Gold
- `#FFD60A` - Primary accent yellow

### Key Patterns
- Page components in `src/pages/` compose feature components
- Routes defined in `src/App.tsx` with React Router
- Toast notifications via Sonner (`@/components/ui/sonner`)
- Icons from `lucide-react`
