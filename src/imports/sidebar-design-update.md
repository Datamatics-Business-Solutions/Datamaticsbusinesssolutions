I love the current dashboard design. Now apply 
this sidebar layout and behavior across the 
ENTIRE app — every page should use this same 
sidebar. Do not break any existing functionality 
or routing.

---

## SIDEBAR COLOR

Change the sidebar background from white to 
#F8F7F7 (light warm gray). The main content 
area stays pure white (#FFFFFF). This creates 
a subtle but clear visual separation between 
navigation and content.

Add a very light right border to the sidebar: 
border-right: 1px solid #EEECEC

---

## COLLAPSIBLE SIDEBAR

The sidebar must be collapsible. Here is the 
exact behavior:

EXPANDED STATE (default):
- Width: 240px
- Shows logo + company name at top
- Shows full menu item labels + icons
- Shows section headings (PLATFORM, ORGANIZATION)
- Shows Dark Mode and Settings at the bottom

COLLAPSED STATE:
- Width: 64px
- Shows only icons, no labels
- Logo shrinks to just the icon/symbol
- Section headings completely hidden
- Dark Mode and Settings show as icons only
- All items remain fully clickable

TOGGLE BUTTON:
- Place a small toggle button at the very bottom 
  of the sidebar above the Dark Mode option
- When expanded: shows « (collapse) arrow icon
- When collapsed: shows » (expand) arrow icon
- Button style: subtle, small, gray, full width, 
  with a hover background of #F0EEEE

TOOLTIPS when collapsed:
- When hovering over any icon in collapsed state, 
  show a small tooltip to the right of the icon 
  with the menu item name
- Tooltip style: dark background (#1A1A1A), 
  white text, small rounded corners, 
  appears with a 200ms fade in

SMOOTH ANIMATION:
- The sidebar width transition should be smooth: 
  transition: width 250ms ease-in-out
- Main content area should expand to fill the 
  space when sidebar collapses
- All text labels should fade out (opacity 0) 
  as the sidebar collapses, not just hide abruptly

---

## APPLY TO ALL PAGES

This exact sidebar component must appear on 
every page in the app:
- Dashboard (client view)
- Campaigns page
- Leads page
- Reports page
- Invoices page
- Documents page
- Support page
- Account page
- Campaign Manager view
- Ops Manager view

The sidebar should know which page is active 
and highlight it in red (#BA2027 background, 
white text) exactly as it does now on Dashboard.

---

## ADDITIONAL VISUAL IMPROVEMENTS

1. Add a thin red left border accent on the 
   active menu item instead of or in addition 
   to the red background:
   border-left: 3px solid #BA2027

2. Menu item hover state: on hover show a very 
   light red tint background: #FFF5F5

3. The user avatar / profile area at the very 
   bottom of the sidebar (below Settings) should 
   show:
   - Small circular avatar with initials
   - Name and role when expanded
   - Just avatar when collapsed
   - Clicking it goes to Account page

4. Add a thin subtle drop shadow to the right 
   edge of the sidebar:
   box-shadow: 2px 0 8px rgba(0,0,0,0.04)

---

## MOBILE BEHAVIOR

On screens smaller than 768px:
- Sidebar starts hidden (off-screen left)
- A hamburger menu icon (☰) appears in the 
  top left of the main content header
- Clicking it slides the sidebar in from the 
  left as an overlay
- A dark overlay covers the main content 
  when mobile sidebar is open
- Clicking the overlay closes the sidebar

---

## IMPORTANT: DO NOT CHANGE

- Do not change any routing or navigation logic
- Do not change the main content area design 
  of any page
- Do not change the color scheme (#BA2027 red 
  accents, white backgrounds)
- Do not remove the "My Account Team" section 
  from the client dashboard
- Do not change the login page
- Preserve all role-based access rules
