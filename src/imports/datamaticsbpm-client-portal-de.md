Design a complete DatamaticsBPM Client Portal with BOTH light 
and dark mode versions across all 5 screens. Every screen must 
be designed in 3 breakpoints — Desktop, Tablet, and Mobile.

═══════════════════════════════════════════════════════
SECTION 1: BRAND IDENTITY
═══════════════════════════════════════════════════════

Company: Datamatics Business Solutions Limited
Product: B2B Lead Generation Client Portal
Domain: datamaticsbpm.com
Logo: "Datamatics Business Solutions" red wordmark 
      with abstract "D" mark in brand red

PRIMARY FONT: Gilroy (fallback: Inter)
Font weights: 400 Regular / 500 Medium / 
              600 SemiBold / 700 Bold

FONT SCALE — DESKTOP:
Page title:    28px SemiBold
Section title: 18px SemiBold
Card title:    14px SemiBold
Body:          14px Regular
Label:         12px Medium
Table header:  11px Medium uppercase

FONT SCALE — TABLET:
Page title:    24px SemiBold
Section title: 16px SemiBold
Card title:    13px SemiBold
Body:          13px Regular
Label:         11px Medium

FONT SCALE — MOBILE:
Page title:    20px SemiBold
Section title: 15px SemiBold
Card title:    13px SemiBold
Body:          13px Regular
Label:         11px Medium

═══════════════════════════════════════════════════════
SECTION 2: BREAKPOINTS & FRAME SIZES
═══════════════════════════════════════════════════════

DESKTOP:  1440px wide — full layout
TABLET:    768px wide — adapted layout
MOBILE:    390px wide — stacked layout (iPhone 14 size)

Grid system:
Desktop: 12-column, 32px gutter, 80px side margin
Tablet:  8-column,  24px gutter, 32px side margin
Mobile:  4-column,  16px gutter, 20px side margin

═══════════════════════════════════════════════════════
SECTION 3: LIGHT MODE — "Datamatics Clean"
═══════════════════════════════════════════════════════

BACKGROUNDS:
Page:          #FFFFFF
Page subtle:   #F8F9FA
Card:          #FFFFFF
Card hover:    #F8F9FA
Nav:           #FFFFFF
Input:         #F8F8F8
Table header:  #F8F9FA

TEXT:
Heading:       #1E1E1E
Body:          #4A4A4A
Muted:         #6B6B6B
Disabled:      #9E9E9E
On red:        #FFFFFF

BRAND ACCENT:
Primary red:   #BA2027
Red hover:     #A01C22
Red subtle:    rgba(186, 32, 39, 0.06)
Red border:    rgba(186, 32, 39, 0.10)

BORDERS + SHADOWS:
Card border:   1px solid rgba(186, 32, 39, 0.08)
Divider:       1px solid #F0F0F0
Card shadow:   0 2px 12px rgba(0, 0, 0, 0.06)
Card hover:    0 4px 24px rgba(186, 32, 39, 0.10)

STATUS PILLS (light):
In Progress:  #FFF8E1 bg / #F4B400 text
Completed:    #E8F5E9 bg / #0F9D58 text
Paused:       #FFEBEE bg / #BA2027 text
Not Started:  #F5F5F5 bg / #9E9E9E text

BUTTONS (light):
Primary:   #BA2027 / #FFFFFF / 8px radius
Secondary: #FFFFFF / #BA2027 border+text
Ghost:     transparent / #5A555D text

CARDS:
Radius: 12px / Border: rgba(186,32,39,0.08)
Shadow: 0 2px 12px rgba(0,0,0,0.06)
Padding desktop: 24px
Padding tablet:  20px
Padding mobile:  16px
KPI left accent: 4px solid #BA2027

TABLES (light):
Header:  #F8F9FA / #9E9E9E 11px uppercase
Row:     #FFFFFF / #F0F0F0 divider
Hover:   #FFF5F5 + 2px left #BA2027
Text:    #4A4A4A

CHARTS (light):
Grid: #E2E8F0 / Axis: #94A3B8
Tooltip: #FFFFFF / #E2E8F0 border
Colors: #BA2027 / #5A555D / #0891B2 /
        #0F9D58 / #F4B400 / #8E44AD

═══════════════════════════════════════════════════════
SECTION 4: DARK MODE — "Datamatics Midnight"
═══════════════════════════════════════════════════════

BACKGROUNDS (blue-tinted deep darks):
Page:          #0D0D0F
Page lifted:   #111013
Card:          #16151A
Card hover:    #1E1C24
Nav:           #111013
Modal:         #1A1820
Input:         #1A1820
Table header:  #1A1820

TEXT (warm gray-purple):
H1/H2:         #F1F0F5
H3/H4:         #D8D6E3
Body:          #B0AEBB
Labels:        #6B6880
Disabled:      #3D3B48
On red:        #FFFFFF

BRAND ACCENT (brighter in dark):
Primary red:   #E63946
Red hover:     #FF4D5A
Red subtle:    rgba(230, 57, 70, 0.10)
Red border:    rgba(230, 57, 70, 0.15)
Red glow:      0 0 20px rgba(230, 57, 70, 0.15)

BORDERS + SHADOWS (glow-based):
Card border:   1px solid rgba(230, 57, 70, 0.12)
Divider:       rgba(255, 255, 255, 0.04)
Nav border:    rgba(255, 255, 255, 0.06)
Card shadow:   0 2px 12px rgba(0, 0, 0, 0.40)
Card hover:    0 4px 24px rgba(230, 57, 70, 0.12)
Button glow:   0 4px 16px rgba(230, 57, 70, 0.30)

STATUS PILLS (dark):
In Progress:  rgba(244,180,0,0.12) / #F4B400
Completed:    rgba(15,157,88,0.12) / #34D399
Paused:       rgba(230,57,70,0.12) / #E63946
Not Started:  rgba(255,255,255,0.05) / #6B6880

BUTTONS (dark):
Primary:   #E63946 / #FFFFFF / glow on hover
Secondary: transparent / #E63946 border+text
Ghost:     transparent / #B0AEBB

CHARTS (dark):
Grid: rgba(255,255,255,0.05) / Axis: #6B6880
Tooltip: #1E1C24 / rgba(230,57,70,0.20) border
Colors: #E63946 / #78757D / #0EA5E9 /
        #34D399 / #FBBC04 / #A569BD

═══════════════════════════════════════════════════════
SECTION 5: RESPONSIVE NAVIGATION
═══════════════════════════════════════════════════════

DESKTOP NAV (64px height):
Left:   Datamatics logo
Center: Campaigns / Leads / Reports / Invoices / Account
Right:  Dark mode toggle + bell + avatar
Active: brand red underline

TABLET NAV (56px height):
Left:   Logo (smaller)
Center: HIDDEN — moved to hamburger
Right:  Dark mode toggle + bell + hamburger menu icon
Hamburger opens: full width slide-down menu
  showing all nav links stacked vertically

MOBILE NAV (52px height):
Left:   "D" logo mark only (no wordmark)
Right:  Bell icon + hamburger icon
Hamburger opens: full screen overlay menu
  Logo top, nav links center stacked,
  avatar + name at bottom
  Close X button top right

BOTTOM TAB BAR (mobile only, 56px):
Fixed to bottom of screen
5 tabs with icons + labels:
[Campaigns] [Leads] [Reports] [Invoices] [Account]
Active tab: red icon + red label
Inactive: gray icon + gray label
Background: matches nav color per mode

═══════════════════════════════════════════════════════
SECTION 6: RESPONSIVE LAYOUT RULES PER SCREEN
═══════════════════════════════════════════════════════

--- SCREEN 1: CAMPAIGN LIST ---

DESKTOP (1440px):
- Welcome heading + subtitle left
- 4 KPI cards in a row (grid-cols-4)
- Filter row: search + dropdowns + button in one row
- Full data table with all 7 columns visible
- "View Details" button rightmost column

TABLET (768px):
- Welcome heading + subtitle left
- 4 KPI cards → 2×2 grid
- Filter row: search full width top,
  dropdowns + button in row below
- Table: hide "End Date" column
  remaining 6 columns visible
- Horizontal scroll on table if needed

MOBILE (390px):
- Welcome heading smaller, centered
- 4 KPI cards → 2×2 grid, compact padding
- Search bar full width
- Filters: horizontally scrollable pill row
  below search
- TABLE REPLACED by campaign cards:
  Each campaign = stacked card showing:
  Top row: Campaign name (bold) + status pill
  Row 2: Service type + dates
  Row 3: Progress bar full width
         "X of Y leads" label right
  Bottom: "View Details" red button full width
  Cards separated by 12px gap

--- SCREEN 2: CAMPAIGN DETAIL ---

DESKTOP (1440px):
- Breadcrumb + title + status pill row
- 4 KPI cards in a row
- 60/40 two column layout
- Timeline full width at bottom

TABLET (768px):
- Breadcrumb + title stacked
- 4 KPI cards → 2×2 grid
- Two columns → stacked single column
  Left content first, right actions below
- Timeline full width at bottom

MOBILE (390px):
- Breadcrumb hidden (back arrow only)
- Title 20px, status pill inline
- 4 KPI cards → 2×2 compact grid
- Donut chart: smaller (160px)
  centered above details grid
- Details grid: 1 column (label above value)
- Actions card: full width, buttons stacked
- Documents: full width list
- Timeline: full width, smaller dots

--- SCREEN 3: INTERNAL OPS VIEW ---

DESKTOP (1440px):
- 5 KPI cards in a row
- Progress input: 3×2 grid of fields
- Full table visible
- Line chart + billing preview side by side

TABLET (768px):
- 5 KPI cards → grid 3+2 layout
- Progress input: 2×3 grid
- Table: horizontally scrollable
- Line chart full width, billing below

MOBILE (390px):
- 5 KPI cards → 2×2 + 1 full width below
- Progress input: 1 column stacked fields
- Table replaced by scrollable cards
- Chart full width (200px height)
- Billing card full width
- Action buttons: full width stacked

--- SCREEN 4: JOB CARD ---

DESKTOP (1440px):
- Dark overlay, centered modal 800px
- All sections visible in scroll
- 2-col signature block at bottom
- Buttons in a row

TABLET (768px):
- Modal 90% width (max 600px)
- Same layout with tighter padding
- Buttons in a row

MOBILE (390px):
- Full screen (no overlay modal)
- Back arrow top left
- Sections stacked, full width
- Criteria grid: 1 column
- Signature blocks: stacked
- "Send for E-Signature" full width button
- "Download PDF" full width below
- Fixed bottom bar with both action buttons

--- SCREEN 5: INVOICES ---

DESKTOP (1440px):
- 3 KPI cards in a row
- Filter row: all in one line
- Full table with all columns

TABLET (768px):
- 3 KPI cards in a row (compact)
- Filter row: search top, rest below
- Table: hide "Issue Date" column
  remaining 6 columns visible

MOBILE (390px):
- 3 KPI cards → stacked 1 column
  (horizontal scroll alternative)
- Search full width
- TABLE REPLACED by invoice cards:
  Each invoice = card showing:
  Top: Invoice # (bold) + status pill
  Row 2: Campaign name (truncated)
  Row 3: Due date + amount (bold red)
  Bottom: View button + Download button
  side by side, full width

═══════════════════════════════════════════════════════
SECTION 7: GLOBAL COMPONENTS (all breakpoints)
═══════════════════════════════════════════════════════

FOOTER:

DESKTOP + TABLET:
Height: 56px / single row
Left: © 2026 Datamatics Business Solutions Limited.
      All Rights Reserved. — 11px muted
Right: Terms of Use | Privacy Policy | 
       Cookie Policy | Legal
       11px links / hover → brand red

MOBILE:
Height: 80px / 2 rows centered
Row 1: © 2026 Datamatics Business Solutions Limited.
Row 2: Terms of Use · Privacy Policy · 
       Cookie Policy · Legal
Sits ABOVE bottom tab bar

FOOTER LINKS:
Terms of Use   → datamaticsbpm.com/terms-of-use/
Privacy Policy → datamaticsbpm.com/privacy-policy/
Cookie Policy  → datamaticsbpm.com/cookie-policy/
Legal          → datamaticsbpm.com/legal/

TOUCH TARGETS (mobile only):
All buttons: minimum 44×44px
All table rows: minimum 48px height
All nav tabs: minimum 44px height
All links: minimum 44px tap area

═══════════════════════════════════════════════════════
SECTION 8: PROTOTYPE CONNECTIONS
═══════════════════════════════════════════════════════

Transitions: Smart Animate / 300ms / Ease In-Out

Screen 1 "View Details" → Screen 2
Screen 1 "Invoices" nav → Screen 5
Screen 2 back arrow / breadcrumb → Screen 1
Screen 2 "Generate Job Card" → Screen 4
Screen 4 "Send for E-Signature" → Screen 2
Screen 4 "Cancel" / back → Screen 2
All "Campaigns" nav → Screen 1
All "Invoices" nav → Screen 5
Dark mode toggle → same screen dark version
Mobile hamburger → opens nav overlay
Mobile bottom tabs → correct screen

═══════════════════════════════════════════════════════
SECTION 9: DELIVERABLES & FRAME NAMING
═══════════════════════════════════════════════════════

TOTAL FRAMES: 30
(5 screens × 3 breakpoints × 2 modes)

NAMING:
Desktop Light:  DL1 through DL5
Desktop Dark:   DD1 through DD5
Tablet Light:   TL1 through TL5
Tablet Dark:    TD1 through TD5
Mobile Light:   ML1 through ML5
Mobile Dark:    MD1 through MD5

FRAME SIZES:
Desktop: 1440 × 900px
Tablet:   768 × 1024px
Mobile:   390 × 844px

ARRANGEMENT IN FIGMA:
Row 1: All Desktop Light (DL1-DL5)
Row 2: All Desktop Dark  (DD1-DD5)
Row 3: All Tablet Light  (TL1-TL5)
Row 4: All Tablet Dark   (TD1-TD5)
Row 5: All Mobile Light  (ML1-ML5)
Row 6: All Mobile Dark   (MD1-MD5)

Spacing between frames: 80px horizontal
Spacing between rows:   120px vertical
