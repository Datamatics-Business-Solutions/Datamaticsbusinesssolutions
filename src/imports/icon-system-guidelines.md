Establish and apply a unified icon system 
across the entire app. The current icons are 
inconsistent — some are 3D, some colored, 
some flat. Fix all of them.

---

## THE ONE RULE

Every icon in this app uses a single style:
Lucide React icons only.
No 3D icons. No emoji icons. No colored 
circle backgrounds. No custom SVGs unless 
absolutely necessary.

Lucide is already installed in this project.
Use it for 100% of icons everywhere.

---

## ICON STYLE RULES

STROKE WEIGHT: 1.5px on all icons
This is Lucide's default — do not override it.

SIZE SYSTEM — use only these sizes:
- 14px → tiny labels, table cells
- 16px → sidebar nav icons (collapsed state)
- 18px → sidebar nav icons (expanded), 
          buttons, input field icons
- 20px → KPI card icons, section headers
- 24px → page title area, empty states
- 32px → large feature icons, onboarding

Never mix sizes on the same row or card.
Icons next to text should always be the 
same optical size as the text.

---

## COLOR RULES — only 3 options

1. DEFAULT: #9CA3AF (gray)
   Use for: KPI card icons, sidebar inactive, 
   table action icons, secondary UI elements
   This is the default. When in doubt, gray.

2. ACTIVE/BRAND: #BA2027 (red)
   Use for: active sidebar nav icon, 
   primary button icons, selected state icons
   ONLY when the icon represents a primary 
   action or active state.

3. SEMANTIC (use SPARINGLY):
   #059669 green → confirmed, paid, success 
     (e.g. checkmark on a Paid invoice)
   #D97706 amber → warning, pending, overdue
     (e.g. clock on a Pending invoice)
   #DC2626 red → error, high priority, 
     destructive action
     (e.g. alert on overdue item)

   Semantic colors are ONLY for status 
   indicators directly next to a status label.
   Never use semantic colors on nav, KPI cards,
   buttons, or decorative purposes.

NO OTHER COLORS. Ever.
No blue icons. No purple icons. 
No gradient icons. No multi-color icons.
No colored circle backgrounds around icons.

---

## REMOVE IMMEDIATELY

Remove all of the following from the app:
- Any 3D icon or illustration
- Any emoji used as a UI icon (🎯 📊 etc)
- Any colored circle or square background 
  wrapping an icon on a KPI card
- Any icon with a gradient
- Any icon that does not match the 
  Lucide stroke style
- Any icon larger than 32px in a card context

---

## ICON ASSIGNMENTS — use these exactly

SIDEBAR NAVIGATION:
Dashboard      → LayoutDashboard
Campaigns      → BarChart2
Leads          → Users
Reports        → FileBarChart
Invoices       → Receipt
Documents      → FolderOpen
Support        → MessageCircle
Account        → UserCircle
Settings       → Settings
Log Out        → LogOut

OPS MANAGER SIDEBAR:
All Clients    → Building2
All Campaigns  → Layers
Lead Uploads   → Upload
Team Mgmt      → UsersRound

KPI CARDS — one small gray icon per card:
Total Leads    → TrendingUp
Active Campaigns → Play
Acceptance Rate → CheckCircle
Revenue        → DollarSign
Pending        → Clock
Overdue        → AlertCircle
Completed      → CheckCircle2
Growth         → TrendingUp
Total Tickets  → MessageSquare
Resolved       → CheckCheck
High Priority  → AlertTriangle
Total Docs     → Files
Favorites      → Star

ACTIONS IN TABLES:
View           → Eye
Download       → Download
Edit           → Pencil
Delete         → Trash2
More options   → MoreHorizontal

STATUS INDICATORS (semantic color only):
Active/Paid    → CheckCircle (green #059669)
Pending        → Clock (amber #D97706)
Overdue        → AlertCircle (red #DC2626)
Paused         → PauseCircle (amber #D97706)
Completed      → CheckCircle2 (gray #6B7280)

BUTTONS:
Save Report    → Bookmark
Export Data    → Download
Upload         → Upload
New Ticket     → Plus
Payment Methods → CreditCard
Download Selected → Download
Upload Document → Upload

FORM / INPUT FIELDS:
Email input    → Mail
Password input → Lock
Search input   → Search

ACCOUNT PAGE TABS:
My Profile     → User
Company Info   → Building2
Team Members   → Users
Security       → Shield
Notifications  → Bell

---

## KPI CARD ICON STYLING

On every KPI card the icon must be:
- Size: 18px
- Color: #9CA3AF (always gray, no exceptions)
- Position: top-right of the card
- No background, no circle, no border
- Just a plain gray icon floating top-right

Example structure:
┌─────────────────────────┐
│                    icon │ ← 18px gray icon
│ 1,265                   │ ← 32px bold number
│ +12% this month         │ ← 12px gray sublabel
│ TOTAL LEADS             │ ← 11px uppercase label
└─────────────────────────┘

The ONLY exception where a KPI icon can use 
a semantic color is if the card itself 
represents a negative state:
- An "Overdue" card → AlertCircle in #D97706
- A "High Priority" card → AlertCircle #DC2626
All other KPI card icons remain #9CA3AF gray.

---

## APPLY TO ALL PAGES

Go through every single page and component:

1. Reports page — fix all icons on KPI cards
2. Documents page — fix all icons on KPI cards
3. Support page — fix all icons on KPI cards
4. Invoices page — fix all icons on KPI cards
5. Dashboard — fix all icons on KPI cards
6. Sidebar — fix all nav icons
7. All table rows — fix action icons
8. All buttons — fix button icons
9. All form inputs — fix input icons
10. Account page tabs — fix tab icons

Do not change any layout, data, routing, 
or functionality. Only fix icons.
