# iOS-Inspired Light Mode Redesign Checklist

## ✅ COMPLETED

### Core Components
- [x] **PageLayout.tsx** - Background #F2F4F7
- [x] **GlassNavigation.tsx** - Frosted glass navbar (rgba(242,244,247,0.85), blur(20px))
- [x] **StatusBadge.tsx** - Tinted pill badges with new colors
- [x] **ThemedComponents.tsx** - Card & Button components with iOS styling
- [x] **Dashboard.tsx** - Full iOS redesign
- [x] **Login.tsx** - Background and styling updated

## 🔄 REMAINING PAGES

### High Priority (User-Facing)
- [ ] **Invoices.tsx** - Update card containers, headings (font-weight: 600), secondary text (#6B7280)
- [ ] **LeadsPage.tsx** - Update card containers, table styling
- [ ] **Documents.tsx** - Update card containers
- [ ] **Support.tsx** - Update card containers
- [ ] **ReportsPage.tsx** - Update card containers, KPI cards
- [ ] **Account.tsx** - Update card containers

### Medium Priority (Campaign Pages)
- [ ] **CampaignList.tsx** - Update filters card and table container
- [ ] **CampaignDetail.tsx** - Update all section cards
- [ ] **CampaignDetailGlass.tsx** - Verify glassmorphism is maintained

### Low Priority (Internal Pages)
- [ ] **InternalDashboard.tsx** - Update if exists
- [ ] **InternalCampaignList.tsx** - Update filters and table
- [ ] **InternalCampaignDetail.tsx** - Update all section cards
- [ ] **InternalReports.tsx** - Update KPI cards and charts

## 📐 DESIGN SPECIFICATIONS

### Card Styling (Light Mode Only)
```css
background: #FFFFFF;
border: 1px solid rgba(0, 0, 0, 0.06);
border-radius: 16px;
box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04);
padding: 20px; /* increased from various values */
```

### Button Styling (Primary, Light Mode Only)
```css
background: linear-gradient(135deg, #C0392B 0%, #E74C3C 100%);
border-radius: 10px;
box-shadow: 0 2px 8px rgba(192, 57, 43, 0.3);
```

### Typography Changes (Light Mode Only)
- Headings: `font-weight: 600` (was 700)
- Secondary text: `color: #6B7280` (was various grays)
- Table rows: `line-height: 1.6`

### Spacing Changes
- Table row height: `56px` minimum (py-4 increased to accommodate)
- Card padding: `20px` (p-5 or custom)
- Section gaps: `24px` (gap-6)

## 🎯 PATTERN TO FIND & REPLACE

### Find:
```tsx
className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
```

### Replace with (Light Mode Check):
```tsx
className={`rounded-2xl border p-5 ${
  isDark 
    ? 'bg-[existing-dark-color] border-white/[0.08]' 
    : 'bg-white border-[rgba(0,0,0,0.06)]'
}`}
style={!isDark ? {
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04)'
} : undefined}
```

### Heading Font Weight:
```tsx
// Find:
className="text-lg font-semibold text-gray-900"

// Replace with:
className={`text-lg ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}
style={{ fontWeight: 600 }}
```

### Secondary Text Color:
```tsx
// Find:
text-gray-600, text-gray-500

// Replace with (light mode):
${isDark ? 'text-[#8B9CB0]' : 'text-[#6B7280]'}
```

## ⚠️ IMPORTANT NOTES

1. **DO NOT change dark mode** - All changes apply to light mode only
2. **Status badges already updated** - Use StatusBadge component
3. **Buttons in ThemedComponents** - Primary buttons have gradient
4. **Background set at PageLayout** - Individual pages don't need bg changes if using PageLayout
5. **Keep glassmorphism effects** - For CampaignDetailGlass and similar components

## 🚀 IMPLEMENTATION PRIORITY

1. Fix Invoices, Leads, Documents, Support (most used pages)
2. Fix Campaign pages
3. Fix Internal pages
4. Final QA pass for consistency
