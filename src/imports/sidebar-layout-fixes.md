Fix the sidebar default state and layout 
behavior. There are two specific issues 
to fix:

---

## FIX 1 — DEFAULT STATE

The sidebar must start EXPANDED (240px wide) 
by default when any page loads.

Change the initial state from:
const [isCollapsed, setIsCollapsed] = 
  useState(true)

To:
const [isCollapsed, setIsCollapsed] = 
  useState(false)

Also update localStorage logic:
- If no localStorage value exists → 
  default to EXPANDED (false)
- If localStorage has a saved value → 
  use that saved value
- This means first-time visitors always 
  see the full sidebar

---

## FIX 2 — CONTENT PUSH BEHAVIOR

Right now when the sidebar expands it 
floats OVER the main content and covers it.
This is wrong. Fix it so the main content 
always pushes and makes room for the sidebar.

The entire app layout must use this structure:

<div style={{
  display: 'flex',
  width: '100vw',
  height: '100vh',
  overflow: 'hidden'
}}>
  
  {/* SIDEBAR */}
  <div style={{
    width: isCollapsed ? '64px' : '240px',
    minWidth: isCollapsed ? '64px' : '240px',
    flexShrink: 0,
    transition: 'width 260ms cubic-bezier(0.4,0,0.2,1),
                 min-width 260ms cubic-bezier(0.4,0,0.2,1)',
    height: '100vh',
    position: 'relative',
    zIndex: 1
  }}>
    {/* sidebar content */}
  </div>

  {/* MAIN CONTENT */}
  <div style={{
    flex: 1,
    minWidth: 0,
    overflow: 'auto',
    height: '100vh',
    transition: 'none'
  }}>
    {/* page content */}
  </div>

</div>

The key fix is:
- Sidebar has flexShrink: 0 so it never 
  compresses
- Sidebar has minWidth that matches width 
  and also transitions
- Main content has flex: 1 and minWidth: 0 
  so it always fills exactly the remaining 
  space
- Main content NEVER has a fixed left margin 
  or padding-left — it always uses flex 
  to calculate its width automatically
- Do NOT use position: fixed or 
  position: absolute on the sidebar
- Do NOT use margin-left on the main content
- The transition on the sidebar width causes 
  the main content to smoothly resize as 
  the sidebar opens and closes

---

## FIX 3 — HOVER BEHAVIOR UPDATE

Since the sidebar now starts expanded and 
pushes content, update the hover behavior:

WHEN SIDEBAR IS EXPANDED (default):
- Mouse leaving does NOT auto-collapse it
- It stays expanded until the user 
  explicitly clicks the collapse/pin button

WHEN SIDEBAR IS COLLAPSED (icon rail):
- Hovering expands it AND pushes the 
  main content to the right smoothly
- Mouse leaving after 350ms delay 
  collapses it back and main content 
  slides back to fill the space

This way the default experience is always 
a fully visible, fully functional sidebar 
that the user can choose to collapse 
for more space when needed.

---

## DO NOT CHANGE

- All navigation links and routing
- Active page highlighting
- User profile at the bottom
- Settings and Log Out links
- Any page content or data
- The pin button functionality
- Tooltip behavior on icon-only state
