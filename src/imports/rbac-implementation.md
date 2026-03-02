I need to build a complete role-based access control system 
into this app with 4 user roles. Please implement everything 
below in one pass.

---

## 1. MOCK USER SYSTEM

At the top of the app (in a context or constants file), 
create a mock currentUser object:

const currentUser = {
  id: "u1",
  name: "John Davies",
  role: "campaign_manager", // Change to test: ops_manager | campaign_manager | campaign_backup | client
  assignedClients: ["client_1", "client_2"] // ignored for ops_manager and client role
}

All role logic must read from this object.

---

## 2. FOUR ROLES & ROUTING

After login, redirect based on role:
- ops_manager → /dashboard/ops
- campaign_manager → /dashboard/manager
- campaign_backup → /dashboard/manager (same view, limited edit)
- client → /dashboard (existing client view)

---

## 3. OPS MANAGER DASHBOARD (/dashboard/ops)

Build a new ops dashboard page with:

HEADER:
- Title: "Operations Overview"
- Subtitle: "All clients and campaigns"
- A "My Account" avatar top right

CLIENT TABLE with these columns:
- Client Name
- Industry
- Campaign Manager (name)
- Backup Manager (name)
- Campaign Status (badge: Active / Paused / Completed)
- Leads Uploaded (number)
- Last Activity (relative date e.g. "2 days ago")
- Actions column: "View" button + "Switch to Client View" button

Use 5-6 mock client rows with realistic data.

STATS ROW above the table (4 cards):
- Total Clients: 6
- Active Campaigns: 4
- Leads Uploaded This Month: 1,240
- Team Members: 5

SIDEBAR NAVIGATION for ops role:
- Overview (home icon)
- All Clients (users icon)
- All Campaigns (bar chart icon)
- Lead Uploads (upload icon)
- Team Management (people icon)
- Settings (gear icon)

---

## 4. CAMPAIGN MANAGER DASHBOARD (/dashboard/manager)

Build a campaign manager view with:

TOP BAR:
- "My Clients" label
- Client switcher dropdown (shows only their assignedClients)
- Currently viewing: [Client Name]

CONTENT (same layout as existing client dashboard but scoped 
to selected client):
- Campaign performance stats
- Leads table for that client
- Activity feed

EXTRA PANEL only visible to campaign_manager and ops_manager 
(NOT campaign_backup or client):
- "Upload Leads" button that opens the Lead Upload modal

SIDEBAR NAVIGATION for manager role:
- My Clients (home icon)
- Campaigns (chart icon)
- Lead Upload (upload icon)
- Reports (document icon)
- Settings (gear icon)

---

## 5. LEAD UPLOAD MODAL

When "Upload Leads" is clicked, open a modal with:

STEP 1 - Upload:
- Drag and drop zone for .xlsx / .csv files
- OR click to browse
- File size limit note: "Max 10MB"

STEP 2 - Preview (after file selected):
- Show a table preview of first 5 rows of data
- Column mapping dropdowns: map each column to 
  (First Name / Last Name / Email / Phone / Company / 
  Job Title / Source / Ignore)
- "Confirm & Upload" button

STEP 3 - Success:
- Green checkmark animation
- "247 leads uploaded successfully to [Client Name]"
- "View Leads" button

Use mock data for the preview step.

---

## 6. TEAM MANAGEMENT PAGE (/dashboard/ops/team)

Only accessible to ops_manager. Show a team table:

Columns:
- Name
- Role badge (Campaign Manager / Backup / Ops Manager)
- Assigned Clients (comma separated pills)
- Active Campaigns (count)
- Status (Active / Away)

Use 4-5 mock team members. Include an "Edit Assignments" 
button per row (can be a no-op for now).

---

## 7. VISUAL STYLE RULES

- Match existing app design: white background, #BA2027 red 
  accent, clean sans-serif typography
- Ops dashboard sidebar should use a dark sidebar 
  (#1A1A2E or similar dark navy) to visually distinguish 
  it from the client-facing dashboard
- All badges and status pills should use soft colored 
  backgrounds (green for Active, yellow for Paused, 
  gray for Completed)
- Keep all animations consistent with the existing app 
  (subtle hover scales, smooth transitions)
- Mobile responsive

---

## 8. NAVIGATION GUARD

Add a simple route guard: if currentUser.role is "client" 
and they try to navigate to /dashboard/ops or 
/dashboard/manager, redirect them back to /dashboard.

---

Build all of this now. Use mock data throughout — 
no backend calls needed. Everything should work 
end-to-end in the browser.
