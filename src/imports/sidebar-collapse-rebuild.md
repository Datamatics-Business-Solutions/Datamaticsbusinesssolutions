Completely rebuild the sidebar collapse system.
Remove the current "< Collapse" arrow entirely.
Replace it with the following behavior:

---

## DEFAULT STATE (Icon Rail)

The sidebar always shows as a 64px wide 
icon rail by default on every page load.

In this state:
- Show ONLY icons, perfectly centered in 64px
- No text labels
- No section headings (PLATFORM, ORGANIZATION)
- Logo shows only the "D" icon mark, no text
- User avatar at bottom shows initials only (SM)
- Settings and Log Out show icons only
- Active page icon: red background pill 
  (#BA2027) centered around the icon, 
  white icon color
- Inactive icons: #9CA3AF gray

The icon rail must ALWAYS be visible.
It must NEVER disappear completely.
It must NEVER show a collapse arrow 
that makes itself invisible.

---

## HOVER TO EXPAND

When the user moves their mouse anywhere 
onto the sidebar:

- Sidebar expands from 64px to 240px wide
- It floats OVER the main content as an overlay
- Main content does NOT shift or resize
- The sidebar gets a drop shadow:
  box-shadow: 4px 0 24px rgba(0,0,0,0.12)
- Background stays #F8F7F7
- All text labels fade in (opacity 0 → 1)
- Section headings appear (PLATFORM, ORGANIZATION)
- User name and role appear below the avatar
- Transition: 220ms cubic-bezier(0.4,0,0.2,1)

When mouse leaves the sidebar:
- Wait 350ms delay before collapsing
  (prevents snapping shut accidentally)
- Then smoothly collapse back to 64px
- Text labels fade out
- Drop shadow disappears

---

## PIN BUTTON

When sidebar is in hover-expanded state,
show a small pin icon in the top-right 
corner of the sidebar.

Pin icon style:
- Size: 16px
- Color: #9CA3AF when unpinned
- Appears with fade-in when sidebar expands
- Disappears when sidebar collapses

When clicked (PINNED state):
- Sidebar stays permanently expanded at 240px
- Main content shrinks to accommodate 
  (no longer floats as overlay)
- Pin icon turns #BA2027 red
- Hover/collapse behavior is disabled
- Save pinned state to localStorage so it 
  persists on page refresh and navigation

When pin clicked again (UNPINNED):
- Returns to hover-expand behavior
- Main content expands back to full width
- Pin icon returns to gray
- Clear the localStorage value

---

## TOOLTIPS (icon rail state only)

When the sidebar is in its 64px collapsed 
icon-only state, hovering over any individual 
icon shows a tooltip:

- Tooltip appears to the RIGHT of the icon
- Style: background #1A1A1A, white text, 
  font-size 12px, font-weight 500,
  padding 6px 10px, border-radius 8px
- Appears after 400ms hover delay
- Fades in over 150ms
- Disappears immediately on mouse leave
- DO NOT show tooltips when sidebar 
  is in expanded state (hover or pinned)
- Tooltip text matches the nav label exactly:
  Dashboard, Campaigns, Leads, Reports, 
  Invoices, Documents, Support, Account,
  Settings, Log Out

---

## MOBILE (screens under 768px)

- Icon rail is hidden completely on mobile
- A hamburger icon (☰) appears in the 
  top-left of the main content header
- Tapping it slides the full 240px sidebar 
  in from the left as an overlay
- A semi-transparent dark overlay 
  rgba(0,0,0,0.4) covers the main content
- Tapping the overlay closes the sidebar
- No pin button on mobile

---

## REMOVE

- Delete the "< Collapse" text button entirely
- Delete the "> Expand" text button entirely
- Delete any arrow-based toggle buttons
- Remove any text-based collapse controls

---

Do not change any routing, navigation links,
active states, user profile data, or any 
page content. Only rebuild the sidebar 
collapse/expand behavior.
