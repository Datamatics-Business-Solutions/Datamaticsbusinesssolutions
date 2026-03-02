# General Guidelines

* Never use figma:asset imports for images or files under any circumstances.
* All images must use external URLs (e.g. Unsplash, or a placeholder like https://placehold.co).
* Do not import any local or Figma-hosted assets into code.
* If an image asset cannot be replaced with a URL, remove the image entirely and use text or an icon instead.
* Never reference local file paths for images, fonts, or any media.

# Code Quality

* Keep code clean and readable — refactor as you go.
* Avoid inline styles unless absolutely necessary. Use Tailwind classes instead.
* Keep files small — move reusable components and helper functions into their own files.
* Use flexbox and grid for layouts. Only use absolute positioning when truly necessary.
* Never hardcode colors outside of the existing Tailwind config or design tokens.

# Design System Guidelines

* Primary brand color is #BA2027. Use this consistently for buttons, highlights, and accents.
* Always use dark mode and light mode compatible classes.
* Font sizes should be consistent — use the existing scale, do not introduce new arbitrary sizes.
* Buttons should always have hover and active states.
* Forms must always have focus states using the brand color.

# Platform-Specific Rules

* This is a B2B client portal — keep the UI professional, clean, and data-focused.
* Do not add decorative elements that slow down the page or distract from content.
* All data tables must be sortable and have clear column headers.
* Empty states must always show a helpful message, not a blank screen.
* All currency values should be formatted with $ and commas (e.g. $12,500).
* Dates should always display in the format: "Jan 15, 2026".
