Optimize the entire app for performance.
Do NOT change any design, colors, fonts, 
layouts, or functionality.
Only apply the performance improvements below.

---

## 1 — LAZY LOAD ALL PAGES

Every page must only load when navigated to.
Wrap every route in React.lazy() and Suspense.

Replace all direct page imports like:
import Dashboard from './pages/Dashboard'
import Campaigns from './pages/Campaigns'

With lazy imports:
const Dashboard = React.lazy(() => 
  import('./pages/Dashboard'))
const Campaigns = React.lazy(() => 
  import('./pages/Campaigns'))
const Leads = React.lazy(() => 
  import('./pages/Leads'))
const Reports = React.lazy(() => 
  import('./pages/Reports'))
const Invoices = React.lazy(() => 
  import('./pages/Invoices'))
const Documents = React.lazy(() => 
  import('./pages/Documents'))
const Support = React.lazy(() => 
  import('./pages/Support'))
const Account = React.lazy(() => 
  import('./pages/Account'))

Wrap all routes in a Suspense boundary:
<Suspense fallback={
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100%'
  }}>
    <div style={{
      width: '32px',
      height: '32px',
      border: '3px solid #F3F4F6',
      borderTop: '3px solid #BA2027',
      borderRadius: '50%',
      animation: 'spin 600ms linear infinite'
    }} />
  </div>
}>
  {/* all routes here */}
</Suspense>

---

## 2 — MEMOIZE ALL LIST COMPONENTS

Any component that renders a list or table 
must be wrapped in React.memo() to prevent 
unnecessary re-renders.

Apply React.memo() to:
- Campaign list/table component
- Leads list/table component
- Invoice list/table component
- Documents list/table component
- Support tickets list/table component
- Activity feed component
- KPI card component
- Sidebar nav items

Example:
const KPICard = React.memo(({ title, value, icon }) => {
  return ( ... )
})

---

## 3 — MEMOIZE EXPENSIVE CALCULATIONS

Any value that is calculated from data 
must use useMemo() so it only recalculates 
when the data actually changes.

Apply useMemo() to:
- Total revenue calculations
- Acceptance rate calculations  
- Campaign progress percentages
- Any filtered or sorted table data
- Any aggregated stats

Example:
const acceptanceRate = useMemo(() => {
  return Math.round((accepted / total) * 100)
}, [accepted, total])

---

## 4 — MEMOIZE ALL CALLBACK FUNCTIONS

Any function passed as a prop to a child 
component must use useCallback() to prevent 
the child from re-rendering on every 
parent render.

Apply useCallback() to:
- Search/filter handler functions
- Sort handler functions
- Button click handlers passed as props
- Any onSelect, onChange, onSubmit handlers 
  passed down to child components

Example:
const handleSearch = useCallback((term) => {
  setSearchTerm(term)
}, [])

---

## 5 — OPTIMIZE ICON IMPORTS

Right now Lucide icons may be imported 
as a full library. Change every icon import 
to be individual named imports only.

Replace any:
import * as Icons from 'lucide-react'
import { ... many icons ... } from 'lucide-react'

With individual imports per file:
import { LayoutDashboard } from 'lucide-react'
import { Users } from 'lucide-react'

Only import the specific icons used 
in each file. This reduces bundle size 
significantly.

---

## 6 — OPTIMIZE VITE BUILD CONFIG

Update vite.config.ts to split vendor 
chunks for better caching:

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': [
            'react', 
            'react-dom', 
            'react-router-dom'
          ],
          'chart-vendor': [
            'recharts'
          ],
          'icon-vendor': [
            'lucide-react'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})

---

## 7 — DEBOUNCE ALL SEARCH INPUTS

Every search input must wait 300ms after 
the user stops typing before filtering.
Never filter on every single keystroke.

Add this custom hook to the project at
src/hooks/useDebounce.ts:

import { useState, useEffect } from 'react'

export function useDebounce<T>(
  value: T, 
  delay: number = 300
): T {
  const [debouncedValue, setDebouncedValue] = 
    useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

Apply this hook to every search input 
in the app:
- Campaigns search
- Leads search
- Invoices search
- Documents search
- Support tickets search

---

## 8 — LAZY INITIALIZE LOCALSTORAGE

Any useState that reads from localStorage 
must use lazy initialization so it only 
reads once — not on every render.

Replace:
const [isPinned, setIsPinned] = useState(
  localStorage.getItem('sidebarPinned') === 'true'
)

With:
const [isPinned, setIsPinned] = useState(
  () => localStorage.getItem('sidebarPinned') 
  === 'true'
)

Apply this to all localStorage reads 
in the sidebar and anywhere else in the app.

---

## 9 — ADD PAGE TITLES

Every page must set the browser tab title.
Add this to every page component:

import { useEffect } from 'react'

// Inside each page component:
useEffect(() => {
  document.title = 'Dashboard — Datamatics'
}, [])

Page titles:
- Dashboard: 'Dashboard — Datamatics'
- Campaigns: 'Campaigns — Datamatics'
- Leads: 'Leads — Datamatics'
- Reports: 'Reports & Analytics — Datamatics'
- Invoices: 'Invoices — Datamatics'
- Documents: 'Documents — Datamatics'
- Support: 'Support — Datamatics'
- Account: 'Account Settings — Datamatics'
- Login: 'Login — Datamatics'

---

## DO NOT CHANGE

- Any colors, fonts, or styles
- Any layouts or designs
- Any component functionality
- Any routing logic
- Any data or mock data
- Any authentication logic
