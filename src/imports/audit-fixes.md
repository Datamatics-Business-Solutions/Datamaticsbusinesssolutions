Good audit. Here is exactly what to fix 
and in what order. Follow Rule 4 strictly — 
maximum 3 files per change.

---

## PHASE 1 — DO THIS FIRST
Consolidate duplicate components only.
Do not touch folder structure yet.

STEP 1 — Fix Button components:
Keep ONLY /src/app/components/ui/button.tsx
Make sure it supports these variants:
- primary (red #BA2027 background)
- outline (red border, transparent bg)
- ghost (no border, subtle hover)

Delete these files completely:
- ThemedComponents.tsx (Button part only)
- EnhancedButton.tsx
- AnimatedButton.tsx
- FloatingActionButton.tsx

Update every import across the codebase 
that references the deleted files to 
import from ui/button.tsx instead.

Verify the build still works before 
moving to Step 2.

---

STEP 2 — Fix EmptyState components:
Keep ONLY /src/app/components/EmptyState.tsx
Make sure it accepts these props:
- icon (Lucide icon component)
- title (string)
- subtitle (string)
- actionLabel (optional string)
- onAction (optional function)

Delete SimpleEmptyState.tsx completely.

Update every import that references 
SimpleEmptyState to use EmptyState instead.

Verify the build still works before 
moving to Step 3.

---

STEP 3 — Create utils folder:
Create /src/app/utils/ folder with 
these two files:

formatDate.ts:
export function formatDate(
  date: string | Date,
  format: 'short' | 'long' | 'relative' = 'short'
): string {
  if (!date) return '—'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '—'
  if (format === 'long') {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    })
  }
  if (format === 'relative') {
    const diff = Date.now() - d.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return mins + ' minutes ago'
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return hrs + ' hours ago'
    const days = Math.floor(hrs / 24)
    return days + ' days ago'
  }
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

formatCurrency.ts:
export function formatCurrency(
  amount: number,
  compact: boolean = false
): string {
  if (amount === null || amount === undefined 
    || isNaN(amount)) return '—'
  if (compact && amount >= 1000) {
    return '$' + (amount / 1000).toFixed(1) + 'K'
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount)
}

Find every place in the codebase where 
dates or currency are formatted inline 
and replace with these utility functions.
This will also fix all NaN and 
Invalid Date issues.

---

## PHASE 2 — DO NOT DO YET

Do NOT restructure the folder layout 
from /src/app/* to /src/* right now.
You correctly identified this would 
break 100+ imports.
We will do this in a separate session 
when we have more time.
For now leave all folders exactly 
where they are.

---

## IMPORTANT
- Fix one step at a time
- Verify build after each step
- Do not change any styles or designs
- Do not change any routing or logic
- Only touch the files mentioned above
