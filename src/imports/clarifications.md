Here are the answers to all 5 clarification 
questions. Please proceed with building.

---

1. LOGO
Modify the existing Logo component to support 
two states:
- Expanded: show full logo with company name
- Collapsed: show only the icon/symbol, no text
Add a prop "collapsed={true/false}" to the 
Logo component to control this.

---

2. USER PROFILE DATA
Pull from useAuth() context (currentUser).
Show the actual user name from mock data.
Use initials from the logged-in user's name 
for the circular avatar.
Example: "John Davies" → avatar shows "JD"
When expanded: show name + role label below it
When collapsed: show only the initials avatar

---

3. FOOTER
Remove the Footer component from all 
dashboard pages entirely. We have a full-height 
sidebar so a footer is not needed on any 
internal page. Keep the footer only on the 
Login page if it currently exists there.

---

4. DARK MODE
Remove dark mode completely from the app.

- Delete the Dark Mode toggle from the sidebar
- Delete all dark mode styles and classes 
  throughout the entire codebase
- Delete any dark mode context or theme switcher
- The app is light mode only, always

Sidebar background: always #F8F7F7
Main content background: always #FFFFFF

Do not add any theme switching capability.

---

5. MANAGER / OPS SIDEBARS
MERGE the client list into the new universal 
sidebar. Do not replace it. Here is exactly 
how each role should work:

CAMPAIGN MANAGER & CAMPAIGN BACKUP:
- Top section of sidebar = standard nav items
  (Dashboard, Campaigns, Leads, Reports, Settings)
- Below nav items, add a section labeled 
  "MY CLIENTS" with their assigned client list
- Each client shows name + status dot
- Clicking a client loads that client's data 
  in the main content area
- Smooth transition between clients

OPS MANAGER:
- Top section = standard nav items PLUS:
  All Clients, All Campaigns, 
  Lead Uploads, Team Management
- No client list in sidebar — they use the 
  main All Clients table instead

CLIENT:
- Standard nav only
  (Dashboard, Campaigns, Leads, 
  Reports, Invoices, Documents, 
  Support, Account)
- No client list section

---

Now proceed and apply the full sidebar system 
across the entire app with these answers 
as your guide. Do not change any routing, 
content layouts, role-based access rules, 
or the login page design.
