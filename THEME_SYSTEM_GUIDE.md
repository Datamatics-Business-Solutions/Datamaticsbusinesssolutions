# 🎨 Centralized BPM Theme System Guide

## Overview

This project uses a **centralized theme system** where **ALL colors, fonts, and styles are defined in ONE file**: `/src/styles/theme.css`

**✅ Change theme.css → All pages update automatically**  
**❌ Never hardcode colors in individual components**

---

## 🎯 How to Use the Theme System with Tailwind v4

Since this project uses **Tailwind CSS v4**, we use **CSS variables with Tailwind's arbitrary value syntax**.

### The Correct Way to Use Theme Colors

```tsx
// ❌ DON'T DO THIS (Hardcoded)
<div className="text-[#1E1E1E] bg-[#FFFFFF]">

// ✅ DO THIS (Uses theme system)
<div className="text-[var(--color-text-primary)] bg-[var(--color-bg-card)]">
```

### Or Use Tailwind's Built-in Theme Tokens

```tsx
// These map to our CSS variables automatically
<div className="text-foreground bg-card">
<button className="bg-primary text-primary-foreground">
```

---

## 📚 Available CSS Variables

### Brand Colors
```css
--color-brand-red          /* #BA2027 (light) / #E63946 (dark) */
--color-brand-red-dark     /* Darker shade */
--color-brand-red-light    /* Lighter shade */
--color-brand-gray         /* #5A555D / #78757D */
```

### Background Colors
```css
--color-bg-primary         /* Page background gradient */
--color-bg-secondary       /* Secondary background */
--color-bg-card            /* Card background */
--color-bg-card-hover      /* Card hover state */
```

### Text Colors
```css
--color-text-primary       /* Main text */
--color-text-secondary     /* Secondary text */
--color-text-muted         /* Muted text */
--color-text-disabled      /* Disabled text */
```

### Accent Colors
```css
--color-accent-primary     /* Main brand color */
--color-accent-secondary   /* Secondary accent */
--color-accent-tertiary    /* Tertiary accent (teal) */
--color-accent-hover       /* Hover state color */
```

### Status Colors
```css
--color-success            /* #0F9D58 */
--color-success-light      /* Lighter green */
--color-warning            /* #F4B400 */
--color-warning-light      /* Lighter yellow */
--color-error              /* #EA4335 */
--color-error-light        /* Lighter red */
--color-info               /* #4285F4 */
--color-info-light         /* Lighter blue */
```

### Chart Colors
```css
--color-chart-1            /* Red */
--color-chart-2            /* Gray */
--color-chart-3            /* Teal */
--color-chart-4            /* Green */
--color-chart-5            /* Yellow */
--color-chart-6            /* Purple */
```

### Borders and Shadows
```css
--color-border             /* Light border */
--color-border-strong      /* Stronger border */
--color-shadow             /* Box shadow color */
```

### Glass Effect
```css
--glass-bg                 /* Glass background */
--glass-border             /* Glass border */
--glass-shadow             /* Glass shadow */
```

---

## 🔧 How to Change Theme Colors

### Example: Change the brand red to blue

**Edit `/src/styles/theme.css`:**

```css
:root {
  --color-brand-red: #0066FF; /* Changed from #BA2027 to blue */
  --color-accent-primary: #0066FF; /* Update accent too */
  --primary: #0066FF; /* Update Tailwind token */
  /* ... rest of variables ... */
}

[data-theme="dark"] {
  --color-brand-red: #3399FF; /* Lighter blue for dark mode */
  --color-accent-primary: #3399FF;
  --primary: #3399FF;
  /* ... rest of variables ... */
}
```

**Result:** ALL pages, buttons, icons, and components using the brand color will update automatically! ✨

---

## 📖 Component Examples

### Example 1: Page Background with Gradient
```tsx
<div style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
  {/* Page content */}
</div>
```

### Example 2: Card with Glass Effect
```tsx
<div 
  className="rounded-2xl p-6 border transition-all hover:shadow-2xl"
  style={{
    background: 'var(--glass-bg)',
    borderColor: 'var(--glass-border)',
    backdropFilter: 'blur(12px)',
    boxShadow: 'var(--glass-shadow)'
  }}
>
  Card content
</div>
```

### Example 3: Text Colors
```tsx
<h1 className="text-[var(--color-text-primary)] text-3xl mb-2">
  Dashboard Title
</h1>
<p className="text-[var(--color-text-secondary)] mb-4">
  Subtitle text
</p>
<span className="text-[var(--color-text-muted)] text-sm">
  Muted text
</span>
```

### Example 4: Status Badges
```tsx
{/* Success Badge */}
<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border"
      style={{
        background: 'rgba(15, 157, 88, 0.1)',
        color: 'var(--color-success)',
        borderColor: 'rgba(15, 157, 88, 0.2)'
      }}>
  Completed
</span>

{/* Warning Badge */}
<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border"
      style={{
        background: 'rgba(244, 180, 0, 0.1)',
        color: 'var(--color-warning)',
        borderColor: 'rgba(244, 180, 0, 0.2)'
      }}>
  Pending
</span>

{/* Error Badge */}
<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border"
      style={{
        background: 'rgba(234, 67, 53, 0.1)',
        color: 'var(--color-error)',
        borderColor: 'rgba(234, 67, 53, 0.2)'
      }}>
  Overdue
</span>
```

### Example 5: Buttons
```tsx
{/* Primary Button */}
<button 
  className="px-5 py-2.5 rounded-lg font-medium text-white transition-all hover:shadow-lg"
  style={{
    background: `linear-gradient(135deg, var(--color-brand-red) 0%, var(--color-brand-red-dark) 100%)`,
    boxShadow: '0 2px 8px rgba(186, 32, 39, 0.2)'
  }}
>
  Primary Action
</button>

{/* Secondary Button */}
<button 
  className="px-5 py-2.5 rounded-lg font-medium transition-all"
  style={{
    background: 'transparent',
    color: 'var(--color-text-secondary)',
    border: '1.5px solid var(--color-border-strong)'
  }}
>
  Secondary Action
</button>
```

### Example 6: Icon Container
```tsx
<div 
  className="w-12 h-12 rounded-xl flex items-center justify-center"
  style={{ background: 'rgba(186, 32, 39, 0.1)' }}
>
  <Target className="w-6 h-6" style={{ color: 'var(--color-accent-primary)' }} />
</div>
```

### Example 7: Input Field
```tsx
<input
  type="text"
  className="w-full px-4 py-2.5 rounded-lg transition-all focus:outline-none"
  style={{
    background: 'var(--color-input-background)',
    border: '1.5px solid var(--color-border)',
    color: 'var(--color-text-primary)'
  }}
  placeholder="Search..."
/>
```

---

## 🎯 Common Patterns to Copy

### Pattern 1: Professional Card Style
```tsx
const cardStyle = {
  background: 'var(--glass-bg)',
  borderColor: 'var(--glass-border)',
  backdropFilter: 'blur(12px)',
  boxShadow: 'var(--glass-shadow)'
};

<div className="rounded-2xl p-6 border transition-all hover:shadow-2xl" style={cardStyle}>
  {/* Content */}
</div>
```

### Pattern 2: KPI Card
```tsx
<div className="rounded-2xl p-6 border transition-all hover:shadow-2xl" style={cardStyle}>
  <div className="flex items-start justify-between mb-4">
    <div>
      <div className="text-sm mb-2 font-medium" style={{ color: 'var(--color-text-muted)' }}>
        Total Revenue
      </div>
      <div className="text-4xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
        $24,500
      </div>
    </div>
    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
         style={{ background: 'rgba(186, 32, 39, 0.1)' }}>
      <DollarSign className="w-6 h-6" style={{ color: 'var(--color-accent-primary)' }} />
    </div>
  </div>
  <div className="text-sm font-medium" style={{ color: 'var(--color-success)' }}>
    +12% from last month
  </div>
</div>
```

### Pattern 3: Using with Theme Context
```tsx
import { useTheme } from '../context/ThemeContext';

export default function MyComponent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const backgroundStyle = {
    background: 'var(--color-bg-primary)',
    minHeight: '100vh'
  };
  
  const cardStyle = {
    background: 'var(--glass-bg)',
    borderColor: 'var(--glass-border)',
    backdropFilter: 'blur(12px)',
    boxShadow: 'var(--glass-shadow)'
  };

  return (
    <div style={backgroundStyle}>
      <div className="max-w-[1440px] mx-auto px-8 py-12">
        <h1 className="text-3xl mb-8" style={{ color: 'var(--color-text-primary)' }}>
          My Page
        </h1>
        
        <div className="rounded-2xl p-6 border" style={cardStyle}>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Content here
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎯 Benefits of This System

✅ **Single Source of Truth** - Change colors once in theme.css  
✅ **Automatic Dark Mode** - CSS variables handle light/dark switching  
✅ **Type Safety** - TypeScript ensures correct usage  
✅ **Consistency** - All components use the same design tokens  
✅ **Maintainability** - Easy to update theme across entire app  
✅ **Performance** - CSS variables are highly performant  

---

## 🚫 What NOT to Do

### ❌ Don't Hardcode Colors
```tsx
// BAD
<div className="text-[#1E1E1E] bg-[#FFFFFF]">

// GOOD
<div className="text-[var(--color-text-primary)]" style={{ background: 'var(--color-bg-card)' }}>
```

### ❌ Don't Duplicate Color Definitions
```tsx
// BAD - Creating color objects in components
const colors = {
  brandRed: '#BA2027',
  textPrimary: '#1E1E1E'
};

// GOOD - Use CSS variables
style={{ color: 'var(--color-brand-red)' }}
```

### ❌ Don't Mix Hardcoded and Theme Colors
```tsx
// BAD - Inconsistent approach
<div className="text-[#1E1E1E]" style={{ color: 'var(--color-brand-red)' }}>

// GOOD - Consistent use of variables
<div style={{ color: 'var(--color-text-primary)' }}>
```

---

## 🎨 Customization Workflow

### Step 1: Identify What to Change
- Brand colors?
- Text colors?
- Background gradients?
- Status colors?

### Step 2: Edit theme.css
Open `/src/styles/theme.css` and update the CSS variables in:
- `:root` (light mode)
- `[data-theme="dark"]` (dark mode)

### Step 3: Test
Changes apply immediately - no component updates needed!

---

## 📊 Chart Colors

For data visualization (Recharts), use the chart color variables:

```tsx
import { useTheme } from '../context/ThemeContext';

function MyChart() {
  // Get CSS variables dynamically
  const getChartColors = () => {
    const style = getComputedStyle(document.documentElement);
    return [
      style.getPropertyValue('--color-chart-1').trim(),
      style.getPropertyValue('--color-chart-2').trim(),
      style.getPropertyValue('--color-chart-3').trim(),
      style.getPropertyValue('--color-chart-4').trim(),
      style.getPropertyValue('--color-chart-5').trim(),
    ];
  };

  const COLORS = getChartColors();

  return (
    <PieChart>
      <Pie data={data} fill={COLORS[0]} />
    </PieChart>
  );
}
```

---

## 🔄 Dark Mode Support

The theme system automatically handles dark mode through CSS variables. The `ThemeContext` toggles the `data-theme="dark"` attribute on the root element, which switches all CSS variables.

**No component changes needed for dark mode!** ✨

---

## 📝 Quick Reference Cheat Sheet

```tsx
// Background
background: 'var(--color-bg-primary)'      // Page gradient
background: 'var(--glass-bg)'              // Card background

// Text
color: 'var(--color-text-primary)'         // Main text
color: 'var(--color-text-secondary)'       // Secondary text
color: 'var(--color-text-muted)'           // Muted text

// Brand
color: 'var(--color-brand-red)'            // Brand red
color: 'var(--color-brand-gray)'           // Brand gray
color: 'var(--color-accent-primary)'       // Primary accent

// Status
color: 'var(--color-success)'              // Green
color: 'var(--color-warning)'              // Yellow
color: 'var(--color-error)'                // Red
color: 'var(--color-info)'                 // Blue

// Borders
borderColor: 'var(--color-border)'         // Light border
borderColor: 'var(--color-border-strong)'  // Strong border
borderColor: 'var(--glass-border)'         // Glass border

// Shadows
boxShadow: 'var(--glass-shadow)'           // Glass shadow
```

---

## 📝 Summary

**ONE FILE controls everything:** `/src/styles/theme.css`

- Want to change brand color? → Edit `--color-brand-red` in both `:root` and `[data-theme="dark"]`
- Want to change text color? → Edit `--color-text-primary`
- Want to change gradients? → Edit `--color-bg-primary`
- Want to change status colors? → Edit `--color-success/warning/error`

**All pages update automatically!** 🎉

Use CSS variables with inline styles or Tailwind's arbitrary value syntax: `style={{ color: 'var(--color-brand-red)' }}`

No more manual component updates. No more searching for hardcoded colors. Just edit theme.css and watch the magic happen! ✨
