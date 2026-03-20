# DatamaticsBPM Client Portal — Complete Feature Reference

> **Version:** March 2026  
> **Scope:** All 21 pages, 4 user roles, every interactive element, filter, export, modal, and action available across the platform.

---

## Table of Contents

1. [Authentication & User Roles](#1-authentication--user-roles)
2. [Global Navigation & Shell](#2-global-navigation--shell)
3. [Notifications](#3-notifications)
4. [Homepage / Role Router](#4-homepage--role-router)
5. [My Campaigns (Client Dashboard)](#5-my-campaigns-client-dashboard)
6. [Campaign List (Client)](#6-campaign-list-client)
7. [Campaign Detail (Client)](#7-campaign-detail-client)
8. [Leads](#8-leads)
9. [Reports (Client)](#9-reports-client)
10. [Invoices](#10-invoices)
11. [Payment Methods](#11-payment-methods)
12. [Documents](#12-documents)
13. [Support & Tickets](#13-support--tickets)
14. [Account Settings](#14-account-settings)
15. [Feedback](#15-feedback)
16. [Internal Dashboard (Ops)](#16-internal-dashboard-ops)
17. [Ops Overview](#17-ops-overview)
18. [Internal Campaign List (Ops)](#18-internal-campaign-list-ops)
19. [Internal Campaign Detail (Ops)](#19-internal-campaign-detail-ops)
20. [Internal Reports (Ops)](#20-internal-reports-ops)
21. [Manager Dashboard](#21-manager-dashboard)
22. [Lead Upload Dashboard](#22-lead-upload-dashboard)
23. [Team Management](#23-team-management)
24. [Client Assignment](#24-client-assignment)
25. [Campaign Approvals](#25-campaign-approvals)
26. [Coming Features (Roadmap)](#26-coming-features-roadmap)

---

## 1. Authentication & User Roles

### Login Page (`/`)
- Select any of the 4 mock user accounts from a dropdown to log in instantly
- No password required in demo mode — role switches immediately on selection
- Redirects to the correct home screen based on the user's role after login

### User Roles & Permissions

| Role | Key Access |
|------|-----------|
| **client** | Campaigns, Leads, Reports, Invoices, Payment, Documents, Support, Account, Feedback |
| **campaign_manager** | All client views + Internal Dashboard, Campaign List, Campaign Detail, Lead Upload, Approvals, Manager Dashboard, Reports, Team Management, Client Assignment |
| **campaign_backup** | Same as campaign_manager (read + upload, no team/client management) |
| **ops_manager** | Full access to every page including Team Management, Client Assignment, Ops Overview, Internal Reports |

### Permission Helpers (available platform-wide)
- `canUploadLeads()` — `true` for ops_manager and campaign_manager
- `canAccessOps()` — `true` for ops_manager only
- `canManageTeam()` — `true` for ops_manager only
- `canEditCampaigns()` — `true` for ops_manager and campaign_manager

---

## 2. Global Navigation & Shell

### Left Sidebar (all pages)
- Persistent vertical navigation bar visible on every page across all roles
- Collapses to icon-only mode on medium screens
- Fully hidden on mobile (replaced by the bottom tab bar)
- Active route is highlighted with the brand colour
- Role-based menu items — ops-only links are hidden from client users
- Displays the current user's name, role badge, and avatar at the bottom
- **Switch Role** button opens the role-switcher for demo purposes

### Mobile Bottom Tab Bar
- Appears on small screens as a fixed bottom navigation strip
- Shows the 4–5 most relevant shortcuts for the active user's role
- Active tab is highlighted with the brand colour

### Top Header Bar
- **Bell icon** — opens the Notifications panel (see Section 3)
- **User avatar / name** — navigates to Account Settings
- **Page title** — updates dynamically via `useDocumentTitle` for every route
- **Route Loader** — a 2 px brand-coloured progress bar appears at the top of the screen during lazy-loaded route transitions

### Splash Loader
- Full-screen branded loading screen shown only on first application load
- Animated logo, progress bar, and tagline

---

## 3. Notifications

### Notification Bell
- Unread count badge displayed on the bell icon in the top header
- Clicking the bell opens the Notification Panel as a floating dropdown

### Notification Panel
- Displays all notifications in reverse-chronological order
- Unread notifications have a red dot indicator and a subtle tinted background
- **Mark all as read** button clears all unread indicators at once
- Each notification is **clickable** and navigates directly to the relevant page (campaign detail, invoice, etc.)
- Notification types surfaced:
  - Campaign went live
  - 25% / 50% / 75% / 100% delivery milestones reached
  - Invoice generated

---

## 4. Homepage / Role Router (`/dashboard`)

The homepage automatically renders the correct dashboard view based on the logged-in user's role:

| Role | View Rendered |
|------|--------------|
| client | My Campaigns dashboard |
| campaign_manager | Manager Dashboard |
| campaign_backup | Manager Dashboard |
| ops_manager | Ops Overview |

---

## 5. My Campaigns (Client Dashboard) (`/campaigns`)

### KPI Cards (3–4 cards depending on pending campaigns)
- **Active Campaigns** — shows count for selected time period; time selector cycles through Day / Week / Month / Year
- **Total Leads Delivered** — shows count for selected time period; own time selector (Day / Week / Month / Year)
- **Total Spend** — shows $ value for selected time period; own time selector (Day / Week / Month / Year)
- **Awaiting Approval** — conditionally shown only when one or more campaigns are pending; lists each pending campaign name with a pulsing red dot

### Campaign Table
- Columns: Campaign, Type, Status, Progress (bar + percentage + delivered/target count), Actions
- **Search bar** — debounced real-time filter by campaign name
- **Status dropdown** — filter by All / Pending Approval / In Progress / Completed / Paused
- **Progress bar** — animated fill on load, percentage shown inline
- **Delivered vs Target** — live lead count with animated counter
- **View button (Eye icon)** — navigates to Campaign Detail
- Clicking any row navigates to Campaign Detail
- Empty state shown with "No campaigns found" message and a "Create Campaign" action button

### Start a Campaign Button
- Opens the **New Campaign Modal** (multi-step form — see Section 6 for full detail)

### Account Team Section
- Displays the assigned Campaign Manager and Campaign Backup for the client
- Shows real photo, name, role, and email for each team member
- Clicking an email opens the default mail client

---

## 6. Campaign List (Client) (`/campaigns` — alternate view)

### Submission Tracker Banner
- Shown when there are Pending Approval or Changes Requested submissions
- Coloured header (brand gradient) with count of submissions awaiting review
- Per-submission row with: status badge, service type, submitted date, campaign name, assigned manager
- **3-step timeline stepper** per submission: Submitted → Under Review / Changes Needed → Goes Live
- **Changes Requested feedback callout** — shows the manager's notes in an amber box when changes are requested

### Filters
- **Search** — filter by campaign name (real-time)
- **Status dropdown** — All Statuses / Pending Approval / Changes Requested / Not Started / In Progress / Paused / Completed
- **Date range dropdown** — All time / This month / Last 3 months / This year

### Campaign Table
- Columns: Campaign Name, Service Type, Status, Start Date, End Date, Delivered vs Target, Last Updated, Action
- **Animated progress bar** per row, with animated counter on delivered leads
- **Live pulsing dot** for active campaigns
- **View details button** — links to Campaign Detail
- **Three-dot menu (⋮)** per row:
  - View Details
  - **Clone Campaign** — opens Clone Confirmation Modal, then pre-fills New Campaign Modal with the source campaign's name and type

### Submit a Campaign Button
- Opens the **New Campaign Modal** (full multi-step form):
  - Step 1: Campaign name, service type, target geography, locations (multi-select)
  - Step 2: Job titles (multi-select), employee size range, revenue size range
  - Step 3: CPL (cost per lead), additional information / notes
  - Submitting adds the campaign to the list and the Submission Tracker instantly
  - Success toast and animated confirmation banner appear after submission

### Clone Campaign Modal
- Confirmation dialog showing the source campaign name
- Confirm → pre-fills New Campaign Modal with name suffixed "— Copy" and service type

### Empty State
- Shown when no campaigns match the current filters
- Displays a helpful message (not a blank screen)

---

## 7. Campaign Detail (Client) (`/campaigns/:id`)

### Campaign Header
- Campaign name, status badge (with pulsing animation for active), client name
- **Back arrow** — returns to campaigns list
- **Download Job Card button** — opens the Job Card Modal

### KPI Cards
- Target Leads, Delivered Leads, Acceptance Rate, Budget — all with animated counters

### Animated Donut Chart
- Visualises delivered vs remaining leads
- Centre shows delivered count with a live animated counter

### Delivery Schedule Section
- Timeline of scheduled delivery batches with dates and quantities
- Shows historical vs upcoming deliveries

### Campaign Details Panel
- Geography, locations, industry, revenue range, employee size, job titles
- Pricing model, scope of work, client details

### Activity Feed
- Chronological list of recent updates, uploads, and status changes for this campaign

### Job Card Modal
- Full job card document rendered in the modal
- Shows all campaign terms, client details, scope of work, and pricing
- **Download PDF button** — triggers a download toast

### Clone Campaign Button
- Opens Clone Confirmation Modal → then New Campaign Modal pre-filled

---

## 8. Leads (`/leads`)

### KPI Cards (4 cards)
- Total Leads, Accepted, Rejected, Average Lead Score — all animated

### Lead Distribution Chart
- Bar chart showing lead distribution by campaign or status

### Alert Banner
- Dismissible warning banner shown when there are rejected/flagged leads requiring attention
- **Dismiss (×)** button closes the banner

### Filters
- **Search** — real-time filter by first name, last name, company, or email
- **Status dropdown** — All / Accepted / Pending / Rejected / Under Review
- **Campaign dropdown** — filter by a specific campaign
- **Advanced Filters panel** (toggle button):
  - Lead Score range slider (0–100)
  - Date range picker (All / Last 7 days / Last 30 days / Last quarter)
  - Industry multi-select checkboxes
  - Tags multi-select checkboxes
  - **Apply Filters** button
  - **Reset** button — clears all advanced filters

### View Toggle
- **Table view** / **Grid view** toggle buttons

### Sorting (Table View)
- Sortable columns: Lead Score, Delivery Date, Company, Status
- Clicking a column header toggles ascending / descending order
- Sort arrow indicator shown on the active column

### Lead Selection (Table View)
- **Select all checkbox** in the header row — selects / deselects all visible leads
- Individual row checkboxes for multi-select
- Selected count badge shown when leads are selected

### Lead Actions (per row)
- **Lead Score Ring** — animated circular ring showing the lead's score (0–100) with colour coding
- **Star / Favourite** — toggles lead as starred (amber star when active)
- **More actions (⋮) menu**:
  - View Details — opens Lead Detail Drawer
  - Tag / label options
  - Export lead

### Lead Detail Drawer
- Slides in from the right without leaving the page
- Shows full lead profile: name, company, job title, email, phone, industry
- Lead score ring with score breakdown
- Status badge and delivery date
- Associated campaign
- Tags assigned to the lead
- **Close (×)** button

### Pagination
- Shows page X of Y
- Previous / Next page buttons
- Page size adjusts automatically between table (10/page) and grid (12/page) views

### Download Button
- Triggers export toast for selected or all leads

---

## 9. Reports (Client) (`/reports`)

### KPI Cards (5 cards)
- Total Leads, Acceptance Rate, Conversions, Revenue, Active Campaigns — all animated

### Campaign Selector
- Dropdown to filter all charts and KPIs by a specific campaign or show all

### Date Range Picker
- Custom date range picker component
- Presets: Last 7 days / Last 30 days / Last 90 days / This year / Custom

### Charts (4 charts, all interactive)
- **Revenue & Leads Over Time** — area chart with dual Y-axis, animated on load
- **Lead Status Distribution** — pie chart with coloured segments and legend
- **Campaign Performance Comparison** — bar chart across campaigns
- **Lead Title Distribution** — horizontal bar chart (C-Level, VP/Director, Manager, etc.)

### Bookmark / Save Report
- **Bookmark icon** per chart — toggles the chart as saved/bookmarked
- Bookmarked state persists in session; icon fills amber when saved

### Export Report Button
- Opens **Export Modal**:
  - Select format: PDF Report / Excel Workbook / CSV Data
  - Toggle: Include Charts (on/off)
  - Toggle: Include Raw Data (on/off)
  - **Export** button — triggers export with success toast

### Share Button
- Toast notification confirming report share link copied

---

## 10. Invoices (`/invoices`)

### KPI Cards (4 cards)
- Total Revenue, Paid, Pending, Overdue — all with formatted dollar values ($12,500 format) and animated counters

### Filters
- **Search** — real-time filter by invoice number or campaign name (debounced)
- **Status dropdown** — All / Paid / Pending / Overdue

### Invoice Table
- Columns: (Checkbox), Invoice #, Campaign, Amount, Status, Due Date, Issued Date, Actions
- **Select all checkbox** — selects all visible invoices
- Individual row checkboxes for multi-select
- Clicking a row navigates to invoice preview

### Per-Invoice Actions
- **Preview (Eye icon)** — opens Invoice Preview Modal
- **Download (Download icon)** — triggers download toast

### Invoice Preview Modal
- Full-page rendered invoice with DatamaticsBPM branding
- Invoice number, dates, line items, taxes, and total amount
- **Download PDF** button
- **Close** button

### Pay Now Button (Overdue/Pending invoices)
- Links to `/payment/:invoiceId` — opens the Payment page pre-loaded with the invoice

---

## 11. Payment Methods (`/payment`)

### Payment Summary Card
- Shows the invoice being paid (if accessed from an invoice), or general payment summary

### Saved Payment Methods
- List of saved cards and bank accounts with last 4 digits, brand, and expiry
- **Default badge** shown on the currently selected default method
- **Set as Default button** — updates the default payment method (toast confirmation)
- **Delete (Trash) button** — removes the payment method (toast confirmation)

### Add Payment Method Modal
- Triggered by **+ Add Payment Method** button
- Input fields: Card number, cardholder name, expiry date, CVV
- Alternatively: Bank account / routing number entry
- **Save** button — adds the method to the list

---

## 12. Documents (`/documents`)

### KPI Cards (4 cards)
- Total Documents, Active, Contracts & Legal, Reports — all animated

### Filters
- **Search** — real-time filter by document name, uploader, or campaign
  - Clear (×) button inside the search field
- **Type dropdown** — All Types / Contract / SOW / NDA / Invoice / Report / Other
- **Status dropdown** — All Statuses / Active / Expired / Pending / Archived
- **Starred filter button** — toggles showing only starred documents
  - Amber badge on the button shows the count of currently starred documents
  - Button gets an amber border and tinted background when active

### View Toggle
- **Table view** / **Grid view** toggle buttons

### Table View Columns
- Star, Document Name + Campaign, Type badge, Status badge, Uploaded By, Date, Size, Actions

### Per-Document Actions (Table & Grid)
- **Star toggle** — clearly visible grey star when unstarred; fills amber when starred; filters via Starred button
- **Preview (Eye icon)** — opens Document Viewer Modal
- **Download (Download icon)** — triggers download toast
- **Three-dot (⋮) menu**:
  - Download
  - Delete (with toast confirmation)

### Document Viewer Modal
- Full-screen document preview pane
- Document name, type, status, and uploader shown in header
- **Download** button inside the modal
- **Close** button

### Upload Document Button
- Opens **Upload Zone Modal**:
  - Drag-and-drop zone for file upload (CSV, PDF, DOCX, XLSX, etc.)
  - Click to browse files
  - Progress animation on upload
  - Success confirmation

### Results Count
- Live count of documents matching current filters: "X documents found"

### Empty State
- Folder icon + "No documents match your filters" message

---

## 13. Support & Tickets (`/support`)

### KPI Cards
- Open Tickets, In Progress, Resolved, Response Time — all animated

### View Toggle
- **List view** / **Grid view** toggle

### Filters
- **Search** — filter by ticket title or description
- **Status filter** — All / Open / In Progress / Waiting / Resolved / Closed
- **Priority filter** — All / Low / Medium / High / Urgent
- **Category filter** — All / Technical / Billing / Campaign / Lead Quality / General

### Ticket Table / Grid
- Each ticket shows: ID, Title, Status badge, Priority badge, Category, Created By, Created Date, Last Updated, Messages count, Assigned To
- Clicking a ticket opens the **Ticket Detail Panel** (inline expansion or drawer):
  - Full description
  - Message thread with timestamps
  - Assigned agent
  - Campaign linked to the ticket
  - **Reply / Send Message** input with **Send** button
  - **Attachment (Paperclip)** button for file attachments
  - Close / resolve actions

### Create New Ticket Button (`+ New Ticket`)
- Modal form with fields: Title, Description, Category, Priority, linked Campaign (optional)
- **Submit** button — adds the ticket with "Open" status and toast confirmation

### Star / Priority Mark
- Star icon on each ticket toggles a high-priority flag

---

## 14. Account Settings (`/account`)

### Tab Navigation (5 tabs)
Tabs are individually selectable and each shows a distinct form section.

#### My Profile Tab
- Edit fields: Full Name, Email Address, Phone Number, Job Title
- Profile photo display (avatar with initials fallback)
- **Save Changes** button — toast confirmation
- Active sessions list (device, browser, last active)

#### Company Info Tab
- View/edit: Company Name, Address, City/State/Zip, Country, Website
- Primary contact details
- **Save Changes** button

#### Team Members Tab
- List of all team members under the account
- Each member shows: name, role, email, status
- **Invite Team Member** button — opens invite modal with email and role fields
- **Edit (pencil icon)** — inline edit of member role
- **Remove (trash icon)** — remove member with confirmation

#### Security Tab
- **Change Password** form: Current Password, New Password, Confirm Password
- Show/hide password toggle (Eye / EyeOff icon)
- Password strength indicator
- **Two-Factor Authentication** — toggle switch to enable/disable 2FA
- **Active Sessions** — list of logged-in devices with option to revoke each

#### Notifications Tab
- Toggle switches for each notification type:
  - Campaign status updates
  - Lead delivery milestones (25% / 50% / 75% / 100%)
  - Invoice generated
  - Invoice overdue reminders
  - Team member activity
  - Support ticket updates
- **Email** and **In-app** toggles per notification type
- **Save Preferences** button

---

## 15. Feedback (`/feedback`)

### Page Header
- Shows the current user's name and role pre-filled
- **Download feature list icon** (right of "Share Feedback" heading) — triggers an instant download of this feature reference document as a `.md` file

### Feedback Form
- **Type selector** (pill buttons): Bug Report / Feature Request / Improvement / General
- **Priority selector** (pill buttons): Low / Medium / High
- **Name field** — pre-filled from logged-in user
- **Email field** — pre-filled from logged-in user
- **Subject field** — free text
- **Message textarea** — free text
- **Voice Dictation button (Mic icon)**:
  - Starts/stops Web Speech API recording
  - Interim transcription shown live in the textarea as you speak
  - Final transcript appended to any existing message text
  - Error handling: explains that the feature requires Chrome/Edge (not available in embedded webviews)
  - **Stop (square icon)** replaces mic icon while recording; pulsing red ring animation
- **Submit button** — sends feedback via EmailJS to the platform owner
  - Loading spinner during submission
  - **Success state** — green confirmation message
  - **Error state** — red error message with retry option
- Form resets automatically 3 seconds after successful submission

### Why This Platform Matters (collapsible)
- Click to expand/collapse an accordion panel
- Contains: Core Problem We're Solving (3 bullet points), 4 strategic pillars (Operational Efficiency, Professional Brand, Client Visibility, Faster Payments), The Strategic Play explanation

### Coming Features (collapsible)
- Click to expand/collapse
- Shows badge count ("5 features")
- Time savings strip showing hours saved per automation
- Each automation is its own collapsible card:
  - **Salesforce — Auto-Create Opportunities** (ETA Q3 2026)
  - **DocuSign — Auto-Generate & Send Job Cards** (ETA Q3 2026)
  - **Convertr — Auto-Deliver Leads** (ETA Q4 2026)
  - **Tally — Invoice & Payment Sync** (ETA Q4 2026)
  - **Ask Praful AI** — AI assistant with 5 capability cards (Campaign Intelligence, Lead Insights, Metrics & Performance, Outstanding Payments, Automated Actions)
- Each card when expanded shows: full description, bullet list of capabilities, build time, and what it eliminates

---

## 16. Internal Dashboard (Ops) (`/internal/dashboard`)

### KPI Cards (6 cards)
- Total Campaigns, Active Campaigns, Completed Campaigns, Total Clients, Total Leads Delivered, Processing Uploads — all animated

### Upload Quick Action
- **Upload Leads** button — opens Lead Upload Modal directly from the dashboard

### Recent Campaigns Table
- Shows the 5 most recently active campaigns across all clients
- Columns: Campaign Name, Client, Status, Leads Delivered
- Clicking a row navigates to the Internal Campaign Detail

### Top Clients by Leads
- 4-client leaderboard card showing client name, total leads, and a mini progress bar

### Recent Upload Batches
- List of the most recent lead upload batches with status badges (Processing / Completed / Failed)

---

## 17. Ops Overview (`/dashboard/ops`)

### KPI Cards
- Total Clients, Total Campaigns, Active Campaigns, Total Leads, Processing Uploads, Failed Uploads — all animated

### All Clients Table (sortable)
- Columns: Client Name, Industry, Manager, Campaigns, Total Leads, Acceptance Rate, Status
- **Search** — filter by client name
- **Sort** — clicking column headers sorts ascending/descending

### Per-Client Actions
- **View (Eye icon)** — navigates to that client's campaign list
- **Upload Leads button** — pre-selects the client and opens the Lead Upload Modal

### Upload Status Section
- Live status of all recent upload batches (Processing / Completed / Failed / Pending)
- Progress bars for batches currently processing

---

## 18. Internal Campaign List (Ops) (`/internal/campaigns`)

### Search & Filter
- **Search bar** — filter by campaign name (real-time)
- **Status dropdown** — All / Active / Completed / Paused / Pending Approval

### Sortable Table
- Columns: Campaign, Client, Status, Leads Delivered, Target, Acceptance Rate
- Clicking any column header sorts ascending/descending with a chevron indicator

### Per-Campaign Actions
- **View (Eye icon)** — navigates to Internal Campaign Detail

---

## 19. Internal Campaign Detail (Ops) (`/internal/campaigns/:id`)

### Campaign Header
- Campaign name, status badge, client name
- **Back arrow** — returns to Internal Campaign List

### KPI Cards
- Target Leads, Delivered, Acceptance Rate, Budget — all animated

### Animated Donut Chart
- Delivered vs remaining visualisation

### Delivery Schedule Section
- Scheduled batches with dates and quantities

### Campaign Info Panel
- Geography, locations, job titles, employee size, industry, revenue range

### Upload Leads Button
- Opens Lead Upload Modal pre-selected to this client and campaign

---

## 20. Internal Reports (Ops) (`/internal/reports`)

### KPI Cards (5 cards)
- Total Leads, Total Revenue, Active Campaigns, Avg Acceptance Rate, Total Clients — all animated with trend indicators (▲/▼)

### Charts (4 charts)
- **Monthly Performance** — area chart (Leads & Revenue over 6 months)
- **Campaign Performance** — bar chart per campaign
- **Industry Breakdown** — pie chart (Technology, Healthcare, Financial, Manufacturing, Other)
- **Operator Performance** — bar chart comparing team members by leads and acceptance rate

### Operator Performance Table
- Columns: Operator Name (with avatar), Leads Uploaded, Acceptance Rate, Clients Managed
- Sortable rows

### Bookmark Reports
- **Bookmark icon** per chart — saves/unsaves individual charts (amber fill when saved)

### Export Report Button
- Opens Export Modal (PDF / Excel / CSV with chart/data toggles)

---

## 21. Manager Dashboard (`/dashboard/manager`)

### Client Switcher
- Dropdown or tab selector to switch between assigned clients
- Shows only the clients assigned to the logged-in campaign_manager or campaign_backup

### KPI Cards (per selected client)
- Total Campaigns, Active Campaigns, Total Leads, Acceptance Rate — all animated

### Campaign Table (for selected client)
- Columns: Campaign Name, Status, Total Leads, Acceptance Rate
- **Sortable** by Name, Status, Total Leads, Acceptance Rate (clicking header toggles asc/desc)
- Clicking a row navigates to Internal Campaign Detail

### Per-Campaign Upload Action
- **Upload (Upload icon) button** — opens Lead Upload Modal pre-selected to this client and campaign

### Recent Activity
- Timeline of recent lead uploads and status changes for the selected client

---

## 22. Lead Upload Dashboard (`/internal/leads` or `/internal/uploads`)

### KPI Cards (5 cards)
- Processing, Completed, Failed, Pending, Leads Uploaded Today — all animated

### Pending Uploads Alert Banner
- Amber dismissible banner alerting the team to uploads awaiting action
- **Dismiss (×)** closes the banner

### Filters
- **Search** — filter upload batches by file name, client, or campaign
- **Status filter tabs** — All / Processing / Completed / Failed / Pending

### Upload Batches Table
- Columns: File Name, Client, Campaign, Uploaded By, Date/Time, Status, Total Rows, Processed, Success, Errors, Actions
- **Progress bar** shown inline for batches currently processing
- Status badges: Processing (amber) / Completed (green) / Failed (red) / Pending (grey)

### Per-Batch Actions
- **View (Eye icon)** — navigates to the associated campaign detail
- **Retry (Refresh icon)** — re-queues a failed upload with toast confirmation
- **Download error report** — available for failed/partial batches

### Upload Leads Button (primary CTA)
- Opens the **Lead Upload Modal** (full 4-step flow):
  - **Step 0 — Select Client & Campaign** (shown when not pre-selected):
    - Client dropdown (all clients)
    - Campaign dropdown (filtered by selected client)
  - **Step 1 — Upload File**:
    - Drag-and-drop zone accepts CSV, XLS, XLSX
    - Click to browse files
    - File name and size shown after selection
    - Progress animation on upload
  - **Step 2 — Map Columns**:
    - Auto-detected CSV columns listed
    - Dropdown per column to map to: First Name / Last Name / Email / Phone / Company / Job Title / Source / Ignore
    - Live preview of the first few rows
  - **Step 3 — Success**:
    - Animated success state with upload count
    - "Upload Another" button resets to Step 0/1
    - "Done" closes the modal
- **Close (×)** available at every step

---

## 23. Team Management (`/dashboard/ops/team`)

### KPI Cards
- Total Team Members, Active, Away/On Leave, Inactive — all animated

### View Toggle
- **Table view** / **Grid view** toggle

### Team Member Table
- Columns: Member (avatar + name), Role badge, Status dot, Clients Assigned, Leads Uploaded, Acceptance Rate, Last Active, Actions

### Sorting
- Sortable by: Name, Role, Status, Clients, Leads, Acceptance Rate

### Per-Member Actions (Three-dot menu ⋮)
- **Edit Member** — opens Edit Member Modal:
  - Edit name, email, role, status
  - Save / Cancel
- **View Client Coverage** — opens Client Coverage Modal:
  - Shows all clients assigned to this team member with campaign counts
- **View Activity Log** — opens Activity Log Modal:
  - Timestamped log of all recent actions by this member
- **Deactivate Member** — opens Deactivate Confirmation Modal:
  - Warning that campaigns will need to be reassigned
  - Confirm / Cancel
- **Send Email** — opens default mail client with team member's address pre-filled

### Add Team Member Button
- Opens Add Member Modal:
  - Fields: Name, Email, Role (dropdown), Assign Clients (multi-select)
  - **Send Invite** button — adds member and shows toast confirmation

### Bulk Reassign Button
- Opens Bulk Reassign Modal:
  - Select source member (whose clients/campaigns to reassign)
  - Select target member (who will receive the assignments)
  - **Confirm Reassign** button

---

## 24. Client Assignment (`/internal/client-assignment`)

### KPI Cards
- Total Clients, Fully Assigned, Unassigned, Total Managers — all animated

### Filters
- **Search** — filter by client name
- **Status filter** — All / Assigned / Unassigned

### Client Assignment Table
- Columns: Client Name, Industry, Current Manager, Current Backup, Campaigns, Actions
- Each row shows the current manager and backup with their names and email addresses

### Per-Client Actions
- **View (Eye icon)** — navigates to Internal Campaign List filtered for that client
- **Assign / Transfer / Revoke button** — opens the Assignment Modal:
  - Assignment type selector: Assign / Transfer / Revoke
  - **Campaign Manager dropdown** — lists all available managers with current client counts
  - **Campaign Backup dropdown** — lists all available backups
  - **Confirm** button — updates the assignment live in the table with toast confirmation
  - **Send notification email** option (checkbox)

---

## 25. Campaign Approvals (`/internal/approvals`)

### Submission Queue
- Lists all pending campaign submissions from clients, ordered by submission date
- Shows count of pending vs "Changes Requested" submissions in the header

### Per-Submission Card (expandable)
- Client name, company, submitted date ("X days ago" relative label)
- Service type, geography, locations
- Job titles, employee size, industry
- Target leads and CPL
- Assigned manager name
- **Expand/Collapse chevron** — reveals the full submission detail

### Approval Actions (per submission)
- **Approve button (green)** — marks the submission as Approved with toast; removes it from the queue
- **Request Changes button (amber)** — opens the **Changes Modal**:
  - Free-text notes field for the manager to explain what changes are needed
  - **Send Feedback** button — submits the notes; updates the submission status to "Changes Requested" and shows the manager's notes back to the client in their Submission Tracker
  - **Cancel** button
- **Decline button (red)** — marks submission as Declined with toast; removes from queue

### Empty State
- Inbox icon + "No pending approvals" message when the queue is clear

---

## 26. Coming Features (Roadmap)

The following integrations are planned and visible in the **Feedback page** under "Coming Features":

| Integration | What it Automates | ETA |
|-------------|-------------------|-----|
| **Salesforce** | Auto-create Opportunities on campaign creation; two-way sync | Q3 2026 |
| **DocuSign** | Auto-generate and send Job Cards for signature on campaign approval | Q3 2026 |
| **Convertr** | Auto-deliver leads directly to client's Convertr campaigns in real time | Q4 2026 |
| **Tally (TallyPrime)** | Auto-post invoices, receipts, credit notes, and new client ledgers | Q4 2026 |
| **Ask Praful AI** | In-platform AI assistant for campaign intelligence, lead insights, KPI summaries, overdue payment visibility, and automated actions | TBD |

---

## Appendix: Cross-Platform Behaviours

### Empty States
Every list, table, and data section shows a meaningful empty state with an icon and helpful message rather than a blank screen.

### Toast Notifications
All create, update, delete, download, and export actions produce a toast notification confirming success or reporting an error.

### Animated Counters
All numeric KPI values animate from 0 to their target value on page load.

### Responsive Design
All pages are fully responsive. Tables scroll horizontally on small screens. The sidebar collapses on medium screens and is replaced by a bottom tab bar on mobile.

### Glassmorphism Cards
All cards use a glass-card style (frosted glass effect, subtle border, soft shadow) consistent across every page.

### Date Format
All dates display in the format: **Jan 15, 2026**

### Currency Format
All currency values display with `$` prefix and commas: **$12,500**

### Loading States
- Route transitions show a 2 px brand-coloured top progress bar
- Tables show animated skeleton rows while data loads
- Buttons show a spinner while async actions are in flight

---

*Generated: Mar 4, 2026 · DatamaticsBPM Client Portal*
