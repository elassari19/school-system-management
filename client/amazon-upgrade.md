# Library Upgrade Plan

## Core Framework (Breaking Changes — High Risk)

| Package | Current | Latest | Notes |
|---|---|---|---|
| `next` | 15.1.0 | 15.3.x | Minor upgrade, check turbopack changes |
| `eslint-config-next` | 15.1.0 | 15.3.x | Must match `next` version |
| `react` | 19.0.0 | 19.1.x | Minor, check new hooks |
| `react-dom` | 19.0.0 | 19.1.x | Must match `react` |
| `@types/react` | 19.0.1 | 19.1.x | Must match `react` |
| `@types/react-dom` | 19.0.2 | 19.1.x | Must match `react-dom` |

## Internationalization

| Package | Current | Latest | Notes |
|---|---|---|---|
| `next-intl` | ^3.19.1 | 4.x | **Major** — breaking API changes, routing config changed |

## UI & Radix Primitives (Low Risk)

| Package | Current | Latest | Notes |
|---|---|---|---|
| `lucide-react` | ^0.441.0 | ^0.511.0 | Icon names may have changed |
| `@radix-ui/*` (all) | ^1.x / ^2.x | latest patch | Mostly safe patch/minor bumps |
| `cmdk` | ^1.0.0 | ^1.1.x | Minor |
| `vaul` | ^1.1.2 | ^1.1.x | Minor |
| `sonner` | ^1.5.0 | ^2.x | **Major** — check toast API |
| `next-themes` | ^0.4.6 | ^0.4.x | Minor |

## Forms & Validation

| Package | Current | Latest | Notes |
|---|---|---|---|
| `react-hook-form` | ^7.53.0 | ^7.56.x | Minor, safe |
| `@hookform/resolvers` | ^3.9.0 | ^3.10.x | Minor, safe |
| `zod` | ^3.23.8 | ^3.24.x | Minor, safe |

## State Management

| Package | Current | Latest | Notes |
|---|---|---|---|
| `@reduxjs/toolkit` | ^2.2.7 | ^2.8.x | Minor, safe |
| `react-redux` | ^9.1.2 | ^9.2.x | Minor, safe |
| `redux-persist` | ^6.0.0 | ^6.0.0 | No update available |

## Charts & Data Visualization

| Package | Current | Latest | Notes |
|---|---|---|---|
| `recharts` | ^2.12.7 | ^2.15.x | Minor, safe |
| `chart.js` | ^4.4.8 | ^4.5.x | Minor |
| `react-chartjs-2` | ^5.3.0 | ^5.3.x | Minor |

## Utilities & Others

| Package | Current | Latest | Notes |
|---|---|---|---|
| `date-fns` | ^3.6.0 | ^4.x | **Major** — some function signatures changed |
| `embla-carousel-react` | ^8.2.1 | ^8.6.x | Minor |
| `embla-carousel-autoplay` | ^8.4.0 | ^8.6.x | Must match `embla-carousel-react` |
| `react-icons` | ^5.3.0 | ^5.5.x | Minor |
| `use-debounce` | ^10.0.4 | ^10.0.x | Minor |
| `react-hot-toast` | ^2.4.1 | ^2.5.x | Minor |
| `react-day-picker` | ^9.6.3 | ^9.7.x | Minor |
| `input-otp` | ^1.2.4 | ^1.4.x | Minor |
| `tailwind-merge` | ^2.5.2 | ^3.x | **Major** — config API changed |
| `tailwindcss` | ^3.4.1 | ^4.x | **Major** — complete config rewrite |
| `tailwindcss-animate` | ^1.0.7 | ^1.0.7 | No update |
| `class-variance-authority` | ^0.7.0 | ^0.7.1 | Minor |

## Dev Dependencies

| Package | Current | Latest | Notes |
|---|---|---|---|
| `typescript` | ^5 | ^5.8.x | Minor, safe |
| `@types/node` | ^20 | ^22.x | **Major** — Node 22 types |
| `postcss` | ^8 | ^8.5.x | Minor |
| `eslint` | ^8 | ^9.x | **Major** — flat config format required |

---

## Recommended Upgrade Order

### Phase 1 — Safe, low-risk (do first)
- All `@radix-ui/*` packages
- `react-hook-form`, `@hookform/resolvers`, `zod`
- `@reduxjs/toolkit`, `react-redux`
- `recharts`, `chart.js`, `react-chartjs-2`
- `react-icons`, `use-debounce`, `react-hot-toast`, `react-day-picker`
- `embla-carousel-react` + `embla-carousel-autoplay` (together)
- `typescript`, `postcss`

### Phase 2 — Minor framework bumps (test after each)
- `next` → 15.3.x + `eslint-config-next` (same version)
- `react` + `react-dom` + `@types/react` + `@types/react-dom` (all together)
- `lucide-react` (check renamed icons)
- `input-otp`, `cmdk`, `vaul`, `next-themes`

### Phase 3 — Major breaking changes (requires code changes)
1. `next-intl` 3.x → 4.x — routing and middleware API changed, update `i18n/routing.ts`, `middleware.ts`, and `i18n/request.ts`
2. `date-fns` 3.x → 4.x — review all usages in `weekly-schedule.tsx` and elsewhere
3. `sonner` 1.x → 2.x — review toast API usage
4. `tailwind-merge` 2.x → 3.x — review `cn()` utility in `lib/utils.ts`
5. `tailwindcss` 3.x → 4.x — **largest effort**: rewrite `tailwind.config.ts` to CSS-based config, update `postcss.config.mjs`, review all custom theme tokens in `globals.css`
6. `eslint` 8.x → 9.x — migrate `.eslintrc.json` to flat `eslint.config.js` format
7. `@types/node` 20 → 22 — verify Node.js runtime version matches
