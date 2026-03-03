Redesign a B2B SaaS client dashboard called "Datamatics Business Solutions" 
to align with Apple's iOS 26 Liquid Glass design language. Light mode only. 
KPI number animations are already handled in code — treat all KPI values 
as static in the design.

— TYPOGRAPHY —
Primary font: Inter (or SF Pro Display via system font stack)
- KPI numbers (e.g. "1,265", "$198.3K", "93%"): Inter Bold 700, 48–56px
- Section headers (e.g. "Recent Activity", "Campaign Snapshot"): 
  Inter SemiBold 600, 18px
- Card labels (e.g. "Total Leads This Month"): Inter Regular 400, 12px, 
  sentence case (NOT ALL CAPS), color #6E6E73
- Body / list text: Inter Regular 400, 14px
- Navigation items: Inter Medium 500, 15px

— COLOR PALETTE —
Background: #F2F2F7 (Apple system background)
Card surface: rgba(255, 255, 255, 0.72) with backdrop-filter blur(20px), 
  1px border rgba(255,255,255,0.6), border-radius 20px
Sidebar background: rgba(255,255,255,0.6) with backdrop-filter blur(24px), 
  right border 1px rgba(0,0,0,0.06)
Primary accent: #007AFF (iOS blue) — used for active nav, primary buttons, 
  progress bars (default)
Success / Completed: #34C759 (iOS green)
Warning / Pending: #FF9F0A (iOS amber)
Critical / Overdue: #FF3B30 (iOS red)
Neutral text primary: #1C1C1E
Neutral text secondary: #6E6E73
Dividers / borders: rgba(0,0,0,0.08)

— CARDS & LAYOUT —
All cards: border-radius 20px, glassmorphism surface (see above), 
  no hard drop shadows — use box-shadow: 0 2px 12px rgba(0,0,0,0.06) only
Card grid: 24px gap between all cards
Page margin: 24px on all sides
KPI cards (top row): equal width, min-height 120px, 
  icon top-right in a soft tinted circle (12px radius, 32x32px)

— SIDEBAR —
Width: 220px
Logo top-left with brand name
User avatar + name + role moved to TOP of sidebar, just below the logo, 
  with a subtle divider below
Nav items: full-width pill shape on active state (border-radius 12px), 
  #007AFF tinted background at 10% opacity with #007AFF text when active, 
  #3C3C43 at 60% opacity for inactive
Notification badges: retain existing red and green dot badges 
  (Campaigns: 3, Leads: 1234)
"Log Out" at the very bottom in #FF3B30, small 13px

— NEEDS YOUR ATTENTION PANEL —
Convert from flat list into individual alert cards, each with:
  - A 3px left border in the alert's semantic color 
    (red for overdue, amber for pending, gray for paused)
  - Rounded corners 12px
  - White/glass surface
  - Icon left of title (SF Symbols style: clock.fill, 
    person.fill, pause.fill)
  - CTA styled as a small tinted pill button 
    (e.g. red pill "Pay Now ↗" for overdue, amber pill "Review ↗" 
    for pending, gray pill "View ↗" for paused)
  - Subtle background tint matching the alert color at 5% opacity

— PROGRESS BARS —
Height: 6px
Border-radius: 9999px (fully rounded ends)
Track background: rgba(0,0,0,0.08)
Fill: #007AFF for in-progress, #34C759 for completed
Label below bar: "320/500" left-aligned, "64%" right-aligned, 
  both in Inter Regular 12px #6E6E73

— CAMPAIGN SNAPSHOT CARDS —
Border-radius 20px
Hover state: border 1.5px solid rgba(0, 122, 255, 0.4), 
  box-shadow 0 4px 20px rgba(0,122,255,0.08)
Status badge: pill shape, fully rounded, 
  tinted background (blue for In Progress, green for Completed)

— RECENT ACTIVITY —
Each item: left-side icon in a 32px soft gray circle, 
  activity text in #1C1C1E 14px, timestamp in #6E6E73 12px
Divider between items: 1px rgba(0,0,0,0.06)

— GENERAL RULES —
No dark mode toggle needed
No mixed all-caps labels anywhere — sentence case throughout
Consistent 20–24px internal card padding
All interactive elements (buttons, nav, campaign cards) 
  must have clearly defined hover and focus states
Design at 1440px wide desktop breakpoint
Use Auto Layout throughout for all frames and components
Deliver as a single-page Figma frame with all components 
  using local styles and variables for colors and typography
