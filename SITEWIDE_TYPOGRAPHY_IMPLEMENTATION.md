# Site-Wide Typography & Grid Implementation

## ✅ What Has Been Completed

### 1. **Theme.css Updated** (Global Typography System)

All pages now automatically inherit Inter font with the following sizing:

```css
body {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 400;
  letter-spacing: -0.01em;
}

/* Headings */
h1 { font-size: 20px; font-weight: 600; }  /* Main page titles */
h2 { font-size: 16px; font-weight: 600; }  /* Section headers */
h3 { font-size: 14px; font-weight: 600; }  /* Card titles */
h4 { font-size: 12px; font-weight: 600; }  /* Small headers */
h5 { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; } /* Labels */

/* Form Elements */
label { font-size: 14px; font-weight: 500; }
button { font-size: 15px; font-weight: 500; }
input, textarea, select { font-size: 15px; font-weight: 400; }

/* Text */
p { font-size: 15px; font-weight: 400; line-height: 1.6; }
.text-sm { font-size: 14px; }
.text-xs { font-size: 12px; }
```

### 2. **Sidebar Updated** ✅
- Inter font applied
- Proper spacing (12px padding, 24px icons)
- Collapsible sections
- Count badges
- Quick action buttons
- Subtle active states

---

## 📐 Grid System Guidelines

### **Responsive Grid Patterns**

Use these consistent grid patterns across all pages:

#### **Stats/Metrics Grid (KPI Cards)**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
  {/* Stat cards */}
</div>
```

#### **Content Cards (2-Column)**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Content cards */}
</div>
```

#### **Campaign/Client Cards (3-Column)**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  {/* Campaign or client cards */}
</div>
```

#### **Full-Width with Sidebar (Asymmetric)**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">{/* Main content */}</div>
  <div className="lg:col-span-1">{/* Sidebar */}</div>
</div>
```

#### **Data Table Container**
```tsx
<div className="overflow-hidden rounded-xl border border-[#EEECEC]">
  <div className="overflow-x-auto">
    <table className="w-full">
      {/* Table content */}
    </table>
  </div>
</div>
```

---

## 🎨 Typography Usage by Component Type

### **Page Headers**
```tsx
<div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
  <div>
    <h1 className="mb-2">Page Title</h1>  {/* 20px, weight 600 */}
    <p className="text-sm text-[#6B7280]">Subtitle or description</p>  {/* 14px */}
  </div>
  <button className="btn-primary">Action Button</button>  {/* 15px, weight 500 */}
</div>
```

### **Section Headers**
```tsx
<h2 className="mb-4">Section Title</h2>  {/* 16px, weight 600 */}
```

### **Card Headers**
```tsx
<div className="flex items-center justify-between mb-4">
  <h3>Card Title</h3>  {/* 14px, weight 600 */}
  <button className="text-sm">Action</button>
</div>
```

### **Labels/Badges**
```tsx
<h5 className="text-[#9CA3AF] mb-3">SECTION LABEL</h5>  {/* 10px, uppercase, weight 600 */}

<span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
  Badge Text  {/* 12px */}
</span>
```

### **Body Text**
```tsx
<p className="text-[#6B7280]">Regular paragraph text</p>  {/* 15px, weight 400 */}
<p className="text-sm text-[#9CA3AF]">Secondary text</p>  {/* 14px */}
<p className="text-xs text-[#9CA3AF]">Tertiary text</p>  {/* 12px */}
```

### **Tables**
```tsx
<thead>
  <tr>
    <th className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
      Column Header  {/* 12px, uppercase */}
    </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td className="text-sm text-[#1F2937]">Cell Content</td>  {/* 14px */}
  </tr>
</tbody>
```

---

## 🎯 Consistent Spacing System

### **Container Padding**
```tsx
{/* Page wrapper */}
<div className="max-w-[1400px] mx-auto px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">

{/* Section spacing */}
<div className="space-y-6 md:space-y-8">
  {/* Sections */}
</div>
```

### **Card Padding**
```tsx
{/* Standard card */}
<div className="bg-white rounded-xl border border-[#EEECEC] p-4 md:p-6">

{/* Dense card (metrics) */}
<div className="bg-white rounded-xl border border-[#EEECEC] p-4">

{/* Large card */}
<div className="bg-white rounded-xl border border-[#EEECEC] p-6 md:p-8">
```

### **Gap Spacing**
- `gap-2` (8px): Tight spacing (badges, icons with text)
- `gap-3` (12px): Form elements
- `gap-4` (16px): Standard grid gap
- `gap-6` (24px): Wide grid gap (desktop)
- `gap-8` (32px): Section separation

---

## 🎨 Color Palette (Consistent Usage)

### **Text Colors**
```tsx
text-[#1F2937]  // Primary text (dark)
text-[#374151]  // Secondary text
text-[#6B7280]  // Muted text
text-[#9CA3AF]  // Very muted (labels)
```

### **Background Colors**
```tsx
bg-[#FFFFFF]     // White (cards)
bg-[#F8F7F7]     // Light gray (sidebar, backgrounds)
bg-[#F5F5F5]     // Hover state
bg-[#EEECEC]     // Borders
```

### **Brand Colors**
```tsx
bg-[#BA2027]     // Primary red
bg-[#A01C22]     // Darker red (hover)
text-[#BA2027]   // Brand text
```

### **Status Colors**
```tsx
{/* Success */}
bg-green-100 text-green-800
bg-[#0F9D58] text-white

{/* Warning */}
bg-yellow-100 text-yellow-800
bg-[#F4B400] text-white

{/* Error */}
bg-red-100 text-red-800
bg-[#DB4437] text-white

{/* Info */}
bg-blue-100 text-blue-800
bg-[#4285F4] text-white
```

---

## 📋 Page-by-Page Status

### ✅ **Fully Updated**
1. `/src/styles/theme.css` - Global typography system
2. `/src/app/components/LeftSidebar.tsx` - Inter font, proper spacing, collapsible sections

### 🔄 **Needs Grid Layout Review** (Auto-inherits typography)
The following pages automatically receive Inter font and proper text sizing from theme.css, but may need grid layout optimization:

**High Priority:**
1. `Dashboard.tsx` - Client dashboard (already has good grids)
2. `LeadUploadDashboard.tsx` - Operations upload page
3. `InternalDashboard.tsx` - Ops manager dashboard
4. `ManagerDashboardPage.tsx` - Campaign manager dashboard
5. `OpsOverviewPage.tsx` - Ops overview

**Medium Priority:**
6. `CampaignList.tsx` - Campaign listing
7. `InternalCampaignList.tsx` - Internal campaign list
8. `CampaignDetail.tsx` - Campaign details
9. `InternalCampaignDetail.tsx` - Internal campaign details
10. `LeadsPage.tsx` - Leads listing
11. `ReportsPage.tsx` - Reports
12. `InternalReports.tsx` - Internal reports

**Low Priority (Forms/Simple Pages):**
13. `Account.tsx` - Account settings
14. `TeamManagementPage.tsx` - Team management
15. `Invoices.tsx` - Invoice listing
16. `Documents.tsx` - Document listing
17. `Support.tsx` - Support page
18. `Payment.tsx` - Payment page
19. `Login.tsx` - Login page (keep minimal)
20. `HomePage.tsx` - Landing page
21. `CampaignDetailGlass.tsx` - Special campaign view
22. `ErrorBoundary.tsx` - Error page

---

## 🛠️ Implementation Strategy

### **Typography (DONE ✅)**
All pages automatically inherit the new Inter font system via `/src/styles/theme.css`. No per-page changes needed!

### **Grid Layouts (Selective)**
For pages with multiple cards or data displays:

1. **Use responsive grids:**
   ```tsx
   grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6
   ```

2. **Consistent gaps:**
   - Mobile: `gap-4` (16px)
   - Desktop: `gap-6` (24px)

3. **Max-width containers:**
   ```tsx
   max-w-[1400px] mx-auto
   ```

4. **Responsive padding:**
   ```tsx
   px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8
   ```

---

## ✨ Typography Best Practices

### **DO:**
- ✅ Use `h1` for page titles
- ✅ Use `h2` for section headers
- ✅ Use `h3` for card titles
- ✅ Use `h4` for small headers
- ✅ Use `h5` for uppercase labels
- ✅ Use `text-sm` for secondary text
- ✅ Use `text-xs` for tertiary text
- ✅ Use consistent letter-spacing (already in theme)

### **DON'T:**
- ❌ Don't add custom font-family (Inter is global)
- ❌ Don't use arbitrary font sizes (use h1-h5, text-sm, text-xs)
- ❌ Don't mix font weights arbitrarily (use theme defaults)
- ❌ Don't use inline font styles unless absolutely necessary

---

## 📊 Visual Consistency Checklist

For each page, ensure:

- [ ] Uses `max-w-[1400px] mx-auto` for content container
- [ ] Uses responsive padding: `px-4 md:px-6 lg:px-8`
- [ ] Uses responsive gaps: `gap-4 md:gap-6`
- [ ] Uses proper heading hierarchy (h1 → h2 → h3)
- [ ] Uses consistent text colors (#1F2937, #6B7280, #9CA3AF)
- [ ] Uses consistent border color (#EEECEC)
- [ ] Uses consistent card styling (rounded-xl, border, padding)
- [ ] Uses consistent button styles (btn-primary, btn-outline)
- [ ] Tables have proper header styling (text-xs, uppercase, tracking-wide)
- [ ] Empty states use consistent messaging
- [ ] Loading states use consistent animations
- [ ] Mobile responsive (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)

---

## 🎯 Next Steps

### **Immediate (Typography):**
✅ **COMPLETE** - All pages inherit Inter font automatically via theme.css

### **Progressive (Grid Optimization):**
When you update a specific page:
1. Wrap content in `max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8`
2. Use responsive grids for card layouts
3. Use consistent gaps (gap-4 md:gap-6)
4. Ensure proper heading hierarchy
5. Use color palette consistently

### **Optional (Component Updates):**
- Update individual components to use new heading sizes
- Ensure buttons use 15px font-size
- Ensure forms use 14px labels
- Ensure tables use 12px uppercase headers

---

## 💡 Quick Reference

```tsx
{/* Page structure */}
<AppLayout>
  <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1>Page Title</h1>
        <p className="text-sm text-[#6B7280] mt-2">Description</p>
      </div>
      <button className="btn-primary">Action</button>
    </div>

    {/* Metrics Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      <div className="bg-white rounded-xl border border-[#EEECEC] p-4">
        <h5 className="text-[#9CA3AF] mb-2">METRIC LABEL</h5>
        <div className="text-2xl font-semibold text-[#1F2937]">1,234</div>
        <p className="text-sm text-[#6B7280] mt-1">+12% from last month</p>
      </div>
    </div>

    {/* Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cards */}
    </div>
  </div>
</AppLayout>
```

---

## 🎉 Summary

**Typography is DONE site-wide!** All pages now use Inter font with the correct sizing automatically.

**Grid layouts** can be progressively improved page-by-page using the responsive grid patterns above. The most important pages (dashboards, campaign pages, lead upload) should be prioritized for grid optimization.

The key is **consistency**: same gaps, same padding, same colors, same heading hierarchy across all pages.
