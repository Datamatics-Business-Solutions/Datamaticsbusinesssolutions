# Theme Implementation Guide

## Overview
This document explains how to apply the new Datamatics-branded theme (red/white gradient for light mode, red/black gradient for dark mode) to all pages in the portal.

## Quick Start

### 1. Background Gradient
Add this at the root of your page component:

```tsx
import { useTheme } from '../context/ThemeContext';

export default function YourPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const backgroundStyle = isDark
    ? { background: 'linear-gradient(135deg, #0A0A0A 0%, #1A0508 25%, #2D0A0E 50%, #1A0508 75%, #0A0A0A 100%)', minHeight: '100vh' }
    : { background: 'linear-gradient(135deg, #FFFFFF 0%, #FFE5E7 25%, #FFCCD0 50%, #FFE5E7 75%, #FFFFFF 100%)', minHeight: '100vh' };

  return (
    <div style={backgroundStyle}>
      <GlassNavigation />
      {/* Your content */}
    </div>
  );
}
```

### 2. Card Styling
For card components, use this style:

```tsx
const cardStyle = isDark
  ? { background: 'rgba(30, 10, 12, 0.9)', borderColor: 'rgba(186, 32, 39, 0.3)', backdropFilter: 'blur(10px)' }
  : { background: 'rgba(255, 255, 255, 0.95)', borderColor: 'rgba(186, 32, 39, 0.15)', backdropFilter: 'blur(10px)' };

// Apply to elements:
<div className="rounded-2xl p-6 border shadow-lg" style={cardStyle}>
  {/* Card content */}
</div>
```

### 3. Text Colors
Use these text color classes:

```tsx
// Primary text (main headings, important content)
className={isDark ? 'text-white' : 'text-[#1E1E1E]'}

// Secondary text (descriptions, labels)
className={isDark ? 'text-[#E0E0E0]' : 'text-[#4A4A4A]'}

// Tertiary text (subtle information)
className={isDark ? 'text-[#B0B0B0]' : 'text-[#757575]'}

// Muted text (placeholders, disabled states)
className={isDark ? 'text-[#808080]' : 'text-[#9E9E9E]'}
```

### 4. Button Styling
Use these button classes:

```tsx
// Primary Red Button (main actions)
className="px-4 py-2 bg-[#BA2027] hover:bg-[#A01C22] text-white rounded-lg border border-[#BA2027] transition-all"

// Secondary Button (alternative actions)
className={`px-4 py-2 rounded-lg border transition-all ${
  isDark 
    ? 'bg-[#BA2027]/20 hover:bg-[#BA2027]/30 text-[#FF6B6B] border-[#BA2027]/40'
    : 'bg-[#BA2027]/10 hover:bg-[#BA2027]/20 text-[#BA2027] border-[#BA2027]/30'
}`}

// Ghost Button (subtle actions)
className={`px-4 py-2 rounded-lg border transition-all ${
  isDark 
    ? 'bg-transparent hover:bg-[#BA2027]/15 text-[#FF6B6B] border-[#BA2027]/30'
    : 'bg-transparent hover:bg-[#BA2027]/5 text-[#BA2027] border-[#BA2027]/20'
}`}
```

### 5. Input Fields
Style input fields consistently:

```tsx
const inputStyle = isDark
  ? { background: 'rgba(30, 10, 12, 0.6)', borderColor: 'rgba(186, 32, 39, 0.3)', color: '#FFFFFF' }
  : { background: 'rgba(255, 255, 255, 0.9)', borderColor: 'rgba(186, 32, 39, 0.2)', color: '#1E1E1E' };

<input
  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#BA2027]"
  style={inputStyle}
  placeholder="Your placeholder"
/>
```

### 6. Status Badges
Use these badge styles:

```tsx
// Success
className={isDark 
  ? 'bg-[#4CAF50]/15 text-[#81C784] border border-[#4CAF50]/30'
  : 'bg-[#E8F5E9] text-[#2E7D32] border border-[#81C784]'
}

// Warning
className={isDark 
  ? 'bg-[#FF9800]/15 text-[#FFB74D] border border-[#FF9800]/30'
  : 'bg-[#FFF3E0] text-[#E65100] border border-[#FFB74D]'
}

// Error
className={isDark 
  ? 'bg-[#F44336]/15 text-[#E57373] border border-[#F44336]/30'
  : 'bg-[#FFEBEE] text-[#C62828] border border-[#E57373]'
}

// Info
className={isDark 
  ? 'bg-[#2196F3]/15 text-[#64B5F6] border border-[#2196F3]/30'
  : 'bg-[#E3F2FD] text-[#1565C0] border border-[#64B5F6]'
}
```

## Using Pre-built Components

Instead of manually styling each element, you can use the pre-built themed components:

```tsx
import { Card, Button, Text, Input, Badge, Select } from '../components/ThemedComponents';

// Card component
<Card hover onClick={() => {}}>
  <Content />
</Card>

// Button component
<Button variant="primary" size="md" onClick={() => {}}>
  Click Me
</Button>

// Text component
<Text variant="primary" as="h1">Heading</Text>
<Text variant="secondary">Description</Text>

// Input component
<Input 
  label="Email" 
  placeholder="Enter your email"
  error="Invalid email"
/>

// Badge component
<Badge variant="success">Active</Badge>

// Select component
<Select 
  label="Status"
  options={[
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' }
  ]}
/>
```

## Color Palette Reference

### Brand Colors
- **Primary Red**: `#BA2027`
- **Secondary Gray**: `#5A555D`
- **Accent Red**: `#D32F2F`

### Light Theme
- **Background**: White to pink gradient
- **Card Background**: `rgba(255, 255, 255, 0.95)`
- **Primary Text**: `#1E1E1E`
- **Secondary Text**: `#4A4A4A`

### Dark Theme
- **Background**: Black to dark red gradient
- **Card Background**: `rgba(30, 10, 12, 0.9)`
- **Primary Text**: `#FFFFFF`
- **Secondary Text**: `#E0E0E0`

## Migration Checklist

For each page, follow this checklist:

- [ ] Replace background with red gradient (see #1)
- [ ] Update all card backgrounds to use new cardStyle (see #2)
- [ ] Update all text colors to match theme (see #3)
- [ ] Update all buttons to use red styling (see #4)
- [ ] Update all input fields (see #5)
- [ ] Update all status badges (see #6)
- [ ] Test both light and dark modes
- [ ] Verify text is readable on all backgrounds
- [ ] Check mobile responsiveness

## Pages to Update

1. ✅ **GlassNavigation** - Updated with new red theme
2. ✅ **ReportsPage** - Updated with red gradient background
3. ⏳ **LeadsPage** - Needs update
4. ⏳ **Dashboard** - Needs update
5. ⏳ **CampaignDetailGlass** - Needs update
6. ⏳ **InvoicesGlass** - Needs update
7. ⏳ **Account** - Needs update
8. ⏳ **InternalDashboard** - Needs update
9. ⏳ **InternalCampaignList** - Needs update
10. ⏳ **InternalCampaignDetail** - Needs update

## Examples

### Before (Old Cyan Theme):
```tsx
<div className="min-h-screen bg-gradient-to-br from-[#D0E7ED] via-[#E8F4F7] to-[#D0E7ED]">
  <div className="bg-white border border-[#1E293B]/10">
    <button className="bg-[#0891B2] text-white">Click</button>
  </div>
</div>
```

### After (New Red Theme):
```tsx
<div style={{
  background: 'linear-gradient(135deg, #FFFFFF 0%, #FFE5E7 25%, #FFCCD0 50%, #FFE5E7 75%, #FFFFFF 100%)',
  minHeight: '100vh'
}}>
  <div style={{
    background: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(186, 32, 39, 0.15)',
    backdropFilter: 'blur(10px)'
  }} className="border rounded-2xl">
    <button className="bg-[#BA2027] hover:bg-[#A01C22] text-white px-4 py-2 rounded-lg">
      Click
    </button>
  </div>
</div>
```

## Tips

1. **Use inline styles for gradients**: Tailwind can't handle complex gradients, so use inline `style` prop
2. **Maintain accessibility**: Ensure text contrast ratios meet WCAG standards
3. **Test both modes**: Always check light AND dark mode after changes
4. **Keep borders subtle**: Use `rgba(186, 32, 39, 0.15)` for light, `rgba(186, 32, 39, 0.3)` for dark
5. **Button hierarchy**: Primary (solid red) > Secondary (transparent red) > Ghost (minimal red)

## Need Help?

Refer to:
- `/src/app/config/theme.ts` - Complete theme configuration
- `/src/app/components/ThemedComponents.tsx` - Reusable components
- `/src/app/components/PageLayout.tsx` - Page wrapper with background
- `/src/app/pages/ReportsPage.tsx` - Fully updated example page
