# Project Structure

Industry-standard React + Vite + TypeScript layout. **Pages** live in `src/pages/`; feature-specific logic and UI stay in `src/features/`.

```
src/
├── assets/                  # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
├── components/              # Reusable UI components
│   ├── common/              # Breadcrumb, buttons, modals, etc.
│   └── layout/              # AppLayout, AuthLayout
├── features/                # Feature modules (no pages here)
│   ├── devices/
│   │   └── components/      # DeviceCard, FormDevice, DeleteModalDevice
│   ├── embedding/
│   │   └── components/
│   └── chat/
│       └── components/
├── pages/                   # Route-level views only
│   ├── auth/
│   ├── dashboard/
│   ├── devices/
│   ├── admins/
│   ├── embedding/
│   ├── logger/
│   ├── scheduler/
│   ├── settings/
│   ├── profile/
│   ├── chat/
│   └── NotFound/
├── routes/                  # Routing configuration
│   ├── AppRoutes.tsx
│   └── routes.ts
├── hooks/                   # Global custom hooks
│   └── api/                 # TanStack Query hooks
├── context/                 # React Context providers
├── services/                # API layer (axios, client, query keys)
├── utils/                   # Helpers & validators
├── types/                   # TypeScript interfaces
├── styles/                  # Theme & global styles
├── config/                  # App configuration (env)
├── providers/               # App-level providers (Query, App context)
├── test/                    # Vitest setup & helpers
├── App.tsx
└── main.tsx
```

## Conventions

| Concern | Location |
|---------|----------|
| Route screens | `src/pages/<domain>/` |
| Feature UI/logic | `src/features/<domain>/components/` |
| Shared UI | `src/components/common/` |
| API calls | `@/hooks/api` (TanStack Query) |
| Route paths | `@/routes/routes` (`ROUTES` constant) |
| Imports | `@/` alias → `src/` |

## Adding a new page

1. Create view in `src/pages/<domain>/MyPage.tsx`
2. Add route constant in `src/routes/routes.ts`
3. Register lazy route in `src/routes/AppRoutes.tsx`
4. If needed, add feature components under `src/features/<domain>/components/`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm test` | Tests (watch) |
| `npm run test:run` | Tests (CI) |
