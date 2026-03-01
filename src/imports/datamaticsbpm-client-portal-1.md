Design a complete 5-screen premium glassmorphism client 
portal web app for DatamaticsBPM, a B2B lead generation 
company. Create ALL screens interconnected as one app.

GLOBAL STYLE (apply to ALL screens):
- Background: Deep dark gradient (#0F172A to #1E1B4B)
- Cards: White 12% opacity, backdrop blur 20px, 16px radius
- Accent: Purple #8B5CF6 with soft glow effects
- Typography: Inter font, white/light text throughout
- Status pills: glass style (green=Completed, amber=In Progress, 
  red=Paused, gray=Not Started)
- All frames: 1440px wide

GLOBAL NAVIGATION (identical on ALL screens):
- Left: DatamaticsBPM logo in purple gradient
- Right: [Campaigns][Invoices][Account] tabs + bell + avatar
- Height: 64px, background #0F172A, white 10% bottom border
- Active tab: purple underline + bright white text

---SCREEN 1: CAMPAIGN LIST---
Title: "Welcome back, John" (32px bold white)
Hero row: 3 glass KPI cards (Active:3, Leads Delivered:1245, 
Total Spend:$24,500)
Search bar + Status dropdown + Date filter (glass style)
Campaign table with 6 rows showing:
Enterprise IT Security Q1 | Leads | In Progress | 320/500
Healthcare Content Syndication | Content Syndication | 
  Completed | 850/800
Financial Services BANT | BANT | In Progress | 65/150
SaaS Appointment Setting | Appointments | Paused | 18/60
Manufacturing Lead Gen | Leads | Not Started | 0/400
Retail Technology Appointments | Appointments | In Progress | 
  12/25
Each row has purple progress bar + "View Details" button

---SCREEN 2: CAMPAIGN DETAIL (CLIENT VIEW)---
Breadcrumb: Campaigns > Enterprise IT Security Q1
4 KPI cards: Target 500 | Delivered 320 | Accepted 285 | 
  End Apr 14
Left (60%): Large donut chart 57% completion (285/500), 
  Campaign details grid (Geo/Industry/Revenue/Employees/
  Job Titles/Pricing)
Right (40%): Actions card (Request Pause, Contact Support), 
  Documents card (Job Card download, Lead File, Invoice)
Bottom: Activity timeline (RFP Received → Job Card Signed → 
  Campaign Started → Batches Delivered → In Progress)

---SCREEN 3: INTERNAL OPS VIEW---
Same layout but orange accent #F59E0B for internal elements
Purple badge "INTERNAL VIEW" top right
5 KPI cards: Active:12, Leads Today:145, 
  Pending Job Cards:3, Overdue:1, Monthly Revenue:$124,500
Progress input section: editable fields for Leads Sourced, 
  Validated, Rejected, BANT Qualified, Appointments Set
Daily progress table with 6 rows of data
Line chart: sourced vs accepted leads over 30 days
Billing preview card: 500 leads @ $45 = $22,500 target, 
  285 accepted, billable $12,825
Buttons: "Generate Job Card" (purple) + "Mark Complete" (green)

---SCREEN 4: JOB CARD PREVIEW---
Dark blurred background, centered white glass modal (800px)
Purple gradient header: DatamaticsBPM logo + JOB CARD title + 
  reference JC-2026-001234
Sections inside card (white 95% opacity, dark text):
  Client Details: Acme Agency, John Smith
  Scope of Work: bullet points of deliverables
  Campaign Criteria: 2-column grid (Geo/Industry/Revenue/
    Employees/Job Titles/Exclusions)
  Commercial Terms: CPL $45/lead, 500 target, $22,500 value
  T&C placeholder text
Two signature blocks: Client left, DatamaticsBPM right
Bottom buttons: "Send for E-Signature" (purple glow, large) + 
  "Download PDF" (glass outline)

---SCREEN 5: INVOICES PAGE---
3 hero KPI cards: Total Paid $55,400 (green glow), 
  Pending $7,800 (amber glow), Overdue $3,600 (red glow)
Filter row: search + status dropdown
Invoice table 5 rows:
INV-2026-001234 | Healthcare Content Syndication | 
  Feb 28 | Mar 30 | $29,750 | Paid
INV-2026-001189 | Enterprise IT Security Q1 | 
  Feb 14 | Mar 16 | $14,400 | Paid
INV-2026-001298 | Financial Services BANT | 
  Feb 19 | Apr 4 | $7,800 | Pending
INV-2026-001156 | Enterprise IT Security Q1 | 
  Jan 30 | Mar 1 | $11,250 | Paid
INV-2026-001087 | SaaS Appointment Setting | 
  Jan 14 | Feb 13 | $3,600 | Overdue (red glow)
Each row: view eye icon + download icon (glass style)

---PROTOTYPE CONNECTIONS---
Connect these interactions:
Screen 1 "View Details" button → Screen 2
Screen 1 "Invoices" nav tab → Screen 5
Screen 2 breadcrumb back → Screen 1
Screen 2 "Generate Job Card" → Screen 4
Screen 4 "Send for E-Signature" → Screen 2
All nav "Campaigns" tabs → Screen 1
All nav "Invoices" tabs → Screen 5
Transitions: Smart Animate, 300ms, Ease In-Out
