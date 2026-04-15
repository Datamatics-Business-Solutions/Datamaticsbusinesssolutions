# Backend Developer Handover Guide

## 1. Prerequisites

Install these first:
- **Node.js** (v18 or later) — https://nodejs.org
- **Git** — https://git-scm.com
- **A code editor** (VS Code recommended)
- **A GitHub account** (accept the org invite first)

## 2. Clone the Repository

```bash
git clone https://github.com/Datamatics-Business-Solutions/Datamaticsbusinesssolutions.git
cd Datamaticsbusinesssolutions
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Run the Dev Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser. You should see the app running.

## 5. Build for Production

To verify nothing is broken:

```bash
npm run build
```

## 6. Understand the Project

- Read `CLAUDE.md` in the project root — it has the full architecture overview, coding rules, and folder structure.
- There is **no backend** — all data is mocked in these files:
  - `src/app/mockData.ts`
  - `src/app/mockInvoices.ts`
  - `src/app/data/mockClients.ts`
- There is **no real authentication** — login is mocked in `src/app/context/AuthContext.tsx` with 4 roles: `ops_manager`, `campaign_manager`, `campaign_backup`, `client`
- There are **no tests** — no test framework is set up
- There is **no database** — everything lives in memory

## 7. Tech Stack

- React 18
- React Router 7
- Vite 6 (build tool)
- Tailwind CSS 4 (styling)
- TypeScript
- Path alias: `@` maps to `src/`

## 8. Project Structure

```
src/
├── main.tsx                    # App entry point
├── app/
│   ├── App.tsx                 # Root component (auth + routing)
│   ├── routes.tsx              # All 18 routes defined here
│   ├── context/                # Auth and notification contexts
│   ├── types.ts                # All shared TypeScript interfaces
│   ├── mockData.ts             # Mock campaign/lead data
│   ├── mockInvoices.ts         # Mock invoice data
│   ├── data/mockClients.ts     # Mock client data
│   ├── pages/                  # All page components
│   ├── components/
│   │   ├── ui/                 # Reusable UI primitives (Radix/shadcn-style)
│   │   └── figma/              # Figma-exported components
│   └── services/               # (create this for API integration)
├── styles/                     # Global CSS (theme, design system, animations)
```

## 9. Your Role — Backend Integration

- Your job is to replace the mock data with real API calls and set up the backend.
- **Do not modify component files or page layouts** — frontend changes are handled separately.
- Create a `src/app/services/` or `src/app/api/` folder for all your API integration code.
- The TypeScript interfaces in `src/app/types.ts` are the contract — your API responses must match these shapes.
- Look at the mock data files to understand exactly what data the frontend expects and in what format.

## 10. Git Workflow

- **Never push directly to `main`**
- Create branches with the prefix `backend/` (e.g. `backend/api-setup`, `backend/auth-integration`)
- Frontend branches use the `frontend/` prefix
- Open a Pull Request for every change
- Always pull latest before starting work:

```bash
git pull origin main
git checkout -b backend/your-feature-name
```

When done:

```bash
git add .
git commit -m "description of what you did"
git push origin backend/your-feature-name
```

Then open a PR on GitHub.

## 11. Key Files to Study First

1. `CLAUDE.md` — project rules and architecture
2. `src/app/types.ts` — all data interfaces
3. `src/app/mockData.ts` — see what data exists and its shape
4. `src/app/context/AuthContext.tsx` — understand the 4 user roles
5. `src/app/routes.tsx` — see all the pages/routes

## 12. What Needs to Be Built (Backend)

- Real authentication system (replace the mock auth)
- Database setup and schema (matching the types in `types.ts`)
- API endpoints for: campaigns, leads, invoices, payments, documents, reports, clients, users
- Data migration — move all mock data into the real database
- File storage for documents
- Connect the frontend to real APIs (replace mock imports with fetch/axios calls)

## 13. If You Use Claude Code

- Install it and run it in the project directory
- It will automatically read `CLAUDE.md` for project context
- Use it for help understanding the codebase, writing API code, etc.

## 14. Integrations to Build

### Core Automations (Priority)

| Integration | Purpose | Timeline | Details |
|---|---|---|---|
| **Salesforce** | Auto-create Opportunities when campaigns are created, two-way sync | Q3 2026 | Config: Instance URL, Client ID, Client Secret |
| **DocuSign** | Auto-generate Job Card PDFs, send for signature, track status, reminders, audit trail | Q3 2026 | Multiple signatories (client, account manager, ops) |
| **Convertr** | Real-time lead delivery to client platforms via HTTP POST, validation, dedup, accept/reject feedback | Q4 2026 | Config: Endpoint URL, Auth token. Integrates with 45+ downstream platforms |
| **Tally (TallyPrime)** | Auto-sync invoices & payments to accounting — vouchers, receivables, credit notes, ledger entries | Q4 2026 | Requires TallyPrime running or TallyConnector/api2books middleware |

### Lead Delivery Methods (UI exists, needs backend wiring)

| Method | Config Fields |
|---|---|
| **Email (CSV/Excel)** | Recipient email, delivery frequency, file format |
| **Google Sheets** | Sheet URL, OAuth authentication |
| **Custom Webhook** | Endpoint URL, HTTP method (POST/PUT), auth header |
| **Salesforce CRM** | Instance URL, Client ID, Client Secret, OAuth |
| **HubSpot CRM** | OAuth authentication |
| **Pipedrive CRM** | API Key, Pipeline ID |
| **Convertr** | HTTP POST endpoint URL, Auth token |
| **LeadByte** | Postback URL, Campaign token |
| **FTP/SFTP** | Host, Username, Password, Destination folder, Delivery frequency |

### Already Active (verify and maintain)

| Service | Purpose | Notes |
|---|---|---|
| **EmailJS** | Sends feedback form emails | Service ID: `service_2cz8e3g`, already configured |
| **Sentry** | Error tracking | Package installed but inactive — needs `VITE_SENTRY_DSN` env var |
| **Vercel Speed Insights** | Performance monitoring | Passive, already working |
| **jsPDF** | Invoice PDF generation | Already in `src/app/utils/exportUtils.ts` |

### Planned — AI Assistant ("Praful")

- Campaign intelligence, lead insights, KPIs, payment tracking, automated actions (uploads, anomaly flagging, reminders)
- No implementation yet — conceptual only

### Still Needs a Backend Solution (no integration chosen yet)

| Feature | Current State | What's Needed |
|---|---|---|
| **Authentication** | Mocked with 4 roles | Real auth (OAuth, Auth0, or custom) |
| **Payments** | Mock Visa/MasterCard/AmEx/bank | Payment gateway (Stripe, PayPal, etc.) |
| **Document Storage** | Mock uploads/downloads | Cloud storage (S3, R2, etc.) |
| **Support Tickets** | Mock ticket system | Ticketing system or custom backend |
| **Database** | No database — all in-memory mocks | Database setup + schema matching `src/app/types.ts` |

### Key Files for Integration Work

- `src/app/types.ts` — all data shapes your APIs must match
- `src/app/mockData.ts` — campaign/lead data structure
- `src/app/mockInvoices.ts` — invoice data structure
- `src/app/data/mockClients.ts` — client data structure
- `src/app/pages/Feedback.tsx` — integration configs and automation details
- `src/app/components/NewCampaignModal.tsx` — all delivery method UI forms
- `src/imports/management-automations.md` — detailed automation specs
