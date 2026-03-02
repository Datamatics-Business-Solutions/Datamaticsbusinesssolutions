Update the role-based dashboard system with the 
following exact business rules. This is how the 
real business operates.

---

## CAMPAIGN MANAGER & CAMPAIGN BACKUP VIEW

When a Campaign Manager or Campaign Backup logs in:

- Show a LEFT SIDEBAR CLIENT LIST with all clients 
  assigned to them (show 3 mock clients for now, 
  representing that they handle multiple accounts)

- At the top show: "My Clients (3)" as the heading

- Each client in the sidebar shows:
  - Client company name
  - A colored status dot (green = active, yellow = paused)
  - Unread notifications badge if any

- Clicking a client in the sidebar loads THAT 
  CLIENT'S full dashboard on the right side:
  - Campaign performance stats
  - Leads table with all their leads
  - Campaign activity feed

- At the top of the main content area show 
  a breadcrumb: "My Clients > [Selected Client Name]"

DIFFERENCE BETWEEN MANAGER AND BACKUP:
- Campaign Manager: can see Upload Leads button, 
  can edit campaign notes, full access
- Campaign Backup: same view but Upload Leads 
  button is hidden, all data is read-only 
  (no edit buttons)

Mock clients to use for manager/backup view:
1. Acme Corp – Active – 847 leads
2. TechCo Ltd – Active – 1,203 leads  
3. Meridian Group – Paused – 412 leads

---

## OPS MANAGER VIEW

When Ops Manager logs in they see a master 
control center with:

TOP STATS BAR (4 cards):
- Total Clients: 6
- Active Campaigns: 4
- Total Leads This Month: 3,847
- Team Members: 5

MAIN TABLE — "All Campaigns" with these columns:
- Client Name
- Campaign Name
- Campaign Manager (name)
- Backup Manager (name)
- Status badge (Active / Paused / Completed)
- Total Leads (number)
- Leads This Month (number)
- Last Activity (relative time)
- Actions: "View Campaign" | "View Client Portal"

FILTER BAR above the table with:
- Search by client name (text input)
- Filter by Status dropdown (All / Active / 
  Paused / Completed)
- Filter by Campaign Manager dropdown 
  (All / John Davies / Lisa Park)
- Filter by date range (This Week / This Month / 
  All Time)
- "Clear Filters" button

SORTING: every column header should be clickable 
to sort ascending/descending with a chevron icon.

When Ops Manager clicks "View Client Portal" on 
any row, it should switch the view to show 
exactly what that client sees — with a banner 
at the top saying:
"👁 Viewing as: Acme Corp — [Exit Client View]"

Use 6 mock client rows in the table.

---

## CLIENT VIEW

When a Client logs in they see ONLY their own data:

THEIR DASHBOARD shows:
- Their campaign stats and leads (existing design)

NEW SECTION at the bottom of their dashboard 
called "My Account Team":
- A card showing their Campaign Manager:
  - Photo placeholder (initials avatar)
  - Name: "John Davies"
  - Role: "Your Campaign Manager"  
  - Email: john.davies@datamatics.com
  - A "Send Message" button (no-op for now)

- A second card showing their Backup:
  - Name: "Lisa Park"
  - Role: "Your Campaign Backup"
  - Email: lisa.park@datamatics.com
  - A "Send Message" button (no-op for now)

Clients should NOT see any other client's data 
under any circumstances. No navigation item 
should reveal other clients exist.

---

## LOGIN DROPDOWN — UPDATE

Update the login dropdown to reflect these 
business rules clearly. Use these 4 accounts:

1. "Sarah Mitchell – Acme Corp (Client)"
   role: client
   → sees only Acme Corp data + their account team

2. "John Davies – Campaign Manager"  
   role: campaign_manager
   → sees Acme Corp, TechCo Ltd, Meridian Group
   → can upload leads and edit

3. "Lisa Park – Campaign Backup"
   role: campaign_backup  
   → sees same 3 clients as John
   → read-only, no upload button

4. "Robert Chen – Ops Manager"
   role: ops_manager
   → sees all 6 clients, full filter/sort table
   → can switch into any client view

---

## GENERAL RULES

- Keep all existing design styles: white background, 
  #BA2027 red accents, dark sidebar for ops
- All data is mock — no backend needed
- Mobile responsive
- Smooth transitions when switching between 
  clients in the sidebar
- The "Exit Client View" banner for ops manager 
  should be sticky at the top so it's always visible
