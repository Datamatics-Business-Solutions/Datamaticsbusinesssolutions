# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm i          # Install dependencies
npm run dev    # Start dev server on port 3000
npm run build  # Production build (output: dist/)
```

No test framework is configured.

## Architecture

**Datamatics Business Solutions** is a B2B campaign management and lead generation portal — a Figma-exported React SPA.

**Stack:** React 18 + React Router 7 + Vite 6 + Tailwind CSS 4 + TypeScript

**Entry points:**
- `src/main.tsx` — bootstraps the app with a splash screen
- `src/app/App.tsx` — wraps the router with `AuthContext` and `NotificationContext`
- `src/app/routes.tsx` — defines all 18 routes

**Auth & roles:** `src/app/context/AuthContext.tsx` implements mock role-based access with four roles: `ops_manager`, `campaign_manager`, `campaign_backup`, `client`. There is no real backend auth — everything is mocked.

**Pages split by persona:**
- Client-facing: Dashboard, CampaignList, CampaignDetailGlass, Invoices, Payment, Leads, Reports, Documents, Support, Feedback
- Internal/ops: InternalDashboard, InternalCampaignList, InternalReports, OpsOverviewPage, ManagerDashboardPage, TeamManagementPage, ClientAssignmentPage, CampaignApprovalsPage

**Component library:** `src/app/components/ui/` contains Radix UI primitives (shadcn-style). `src/app/components/figma/` contains Figma-generated components.

**Types:** All shared TypeScript interfaces live in `src/app/types.ts`.

**Mock data:** `src/app/mockData.ts`, `src/app/mockInvoices.ts`, `src/app/data/mockClients.ts` — the app has no live API; all data is local.

**Styling:** Tailwind CSS is the primary styling system. Global CSS files live in `src/styles/` (`index.css`, `theme.css`, `design-system.css`, `animations.css`, `components.css`).

**Path alias:** `@` resolves to `src/`.

**Vite chunk splitting:** react-vendor, chart-vendor (Recharts), icon-vendor (Lucide), ui-vendor (Radix UI), animation-vendor (Motion).

## Design & Coding Rules

- **Never** use `figma:asset` imports or local file paths for images — use external URLs (Unsplash, `https://placehold.co`) or icons instead.
- No inline styles; use Tailwind classes.
- Primary brand color: `#BA2027`. Do not hardcode colors outside the Tailwind config/design tokens.
- All components must support dark **and** light mode.
- Data tables must be sortable with clear column headers; empty states must show a helpful message.
- Currency: `$12,500` format. Dates: `Jan 15, 2026` format.
- Buttons need hover and active states; form inputs need focus states using the brand color.
- Keep files small — extract reusable components and helpers into their own files.
- Use flexbox/grid for layout; avoid absolute positioning unless truly necessary.
