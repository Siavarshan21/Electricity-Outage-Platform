# Electricity Outage Dashboard

Enterprise-grade electricity outage intelligence dashboard built with React, TypeScript, and TailwindCSS.

## Stack

- **React 18** with TypeScript (strict)
- **Vite** for build tooling
- **TailwindCSS** for styling
- **React Router v6** with nested routes
- **TanStack Query** for server state
- **TanStack Table** for data tables
- **Zustand** for client state
- **Zod** for schema validation
- **i18next** for internationalization (EN + AR)
- **Framer Motion** for animations
- **Three.js** via @react-three/fiber for 3D visualizations
- **MSW** for mock API

## Getting Started

```bash
pnpm install
pnpm dev
```

## Architecture

Feature-Sliced Design:

- `app/` - Application setup, providers, router
- `pages/` - Page components
- `widgets/` - Composed UI blocks
- `features/` - Feature logic (API, stores, UI)
- `entities/` - Domain types and mini-components
- `shared/` - Reusable utilities, hooks, UI components, API client

## Mock API

All data comes from MSW handlers. No real backend required.
