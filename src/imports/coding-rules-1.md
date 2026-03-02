Before making ANY future changes, perform 
a full self-audit and apply these coding 
rules permanently.

---

## STEP 1 — SELF AUDIT NOW

Check the entire codebase for these 
issues and fix them all:

1. DUPLICATE COMPONENTS
   Find any component that exists in more 
   than one file with the same name.
   Keep only one version. Delete all others.
   Examples to check:
   - Sidebar (should exist in exactly ONE file)
   - KPICard (should exist in exactly ONE file)
   - Button (should exist in exactly ONE file)

2. BROKEN IMPORTS
   Find any import statement that references 
   a file or component that does not exist.
   Either create the missing file or 
   remove the broken import.

3. MISSING DEPENDENCIES
   Check package.json and verify every 
   package that is imported in any file 
   is listed in dependencies.
   If anything is imported but not in 
   package.json, add it now.

4. CIRCULAR IMPORTS
   Find any file that imports from a file 
   that imports back from it.
   Break the cycle by moving shared code 
   to a separate shared utility file.

5. UNUSED IMPORTS
   Remove any import statement at the top 
   of any file that is not actually used 
   in that file.

---

## STEP 2 — FOLDER STRUCTURE RULES

Enforce this exact folder structure.
Move files if they are in the wrong place:

src/
  components/       ← shared reusable components only
    Sidebar/
      Sidebar.tsx
      Sidebar.css
    KPICard/
      KPICard.tsx
    Button/
      Button.tsx
    Badge/
      Badge.tsx
    Table/
      Table.tsx
    EmptyState/
      EmptyState.tsx
    SkeletonLoader/
      SkeletonLoader.tsx
  pages/            ← one file per page, nothing else
    Dashboard.tsx
    Campaigns.tsx
    Leads.tsx
    Reports.tsx
    Invoices.tsx
    Documents.tsx
    Support.tsx
    Account.tsx
    Login.tsx
  hooks/            ← all custom hooks
    useDebounce.ts
    useAuth.ts
  styles/           ← all CSS files
    design-system.css
    animations.css
    components.css
  utils/            ← helper functions
    formatDate.ts
    formatCurrency.ts
  context/          ← React context providers
    AuthContext.tsx
  app/
    App.tsx
    routes.tsx

---

## STEP 3 — CODING RULES (follow forever)

These rules must be followed on every 
single change from this point forward:

RULE 1 — ONE COMPONENT PER FILE
Never put two components in the same file.
Every component gets its own file.

RULE 2 — NEVER REWRITE WORKING CODE
If a component is working, do not rewrite 
it. Only modify the specific lines 
that need to change.

RULE 3 — IMPORTS MUST BE VERIFIED
Before adding any import, confirm the 
file or package actually exists.
Never import something that doesn't exist.

RULE 4 — SMALL CHANGES ONLY
Make one change at a time.
Never change more than 3 files in 
a single response.
After each change verify it works 
before moving to the next.

RULE 5 — NEVER DUPLICATE COMPONENTS
Before creating any new component, 
search the entire codebase to confirm 
it doesn't already exist.

RULE 6 — SHARED CODE GOES IN /utils
Any function used by more than one 
component must live in /utils.
Never copy-paste the same function 
into multiple files.

RULE 7 — CSS VARIABLES ONLY
Never hardcode any color, font size, 
spacing, or shadow value.
Always use the CSS variables from 
design-system.css.

RULE 8 — VERIFY BUILD AFTER EVERY CHANGE
After every change, mentally verify:
- All imports resolve correctly
- No duplicate component names exist
- package.json has all required packages
- No TypeScript errors exist

---

## STEP 4 — DEPENDENCY RULES

For package.json, follow these rules:

- Never add a package without checking 
  if it is already installed
- Never remove a package without checking 
  if it is used somewhere in the code
- Always use exact version numbers, 
  never use * or latest
- After adding any new package, add it 
  to BOTH dependencies and verify it 
  is imported correctly

Current required packages that must 
always be present:
- react
- react-dom
- react-router-dom
- lucide-react
- recharts
- typescript
- vite
- @vitejs/plugin-react

---

## STEP 5 — BEFORE EVERY FUTURE RESPONSE

Before making any change I ask for, 
always do this checklist silently first:

✓ Does the component I need already exist?
✓ Will this change break any existing imports?
✓ Am I modifying fewer than 3 files?
✓ Are all packages I need in package.json?
✓ Am I using CSS variables not hardcoded values?
✓ Will the build still pass after this change?

Only proceed with the change after 
confirming all 6 points.

---

Do not change any design, colors, 
functionality, or routing.
Only reorganize, deduplicate, and 
apply these structural rules.
