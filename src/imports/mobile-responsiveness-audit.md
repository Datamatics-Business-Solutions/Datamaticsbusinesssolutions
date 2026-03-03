Perform a full mobile responsiveness audit across ALL pages of this platform. This is a B2B client portal. Design must render correctly on all modern smartphones and tablets regardless of OS — iOS (Safari), Android (Chrome), and any other modern browser. Do NOT change any existing colors, fonts, glassmorphism styles, animations, or brand identity. Only fix layout, spacing, sizing, and responsiveness issues.
BREAKPOINTS TO AUDIT:


Desktop: 1440px (verify only)


Tablet: 768px (iPad, Android tablets)


Mobile: 390px (iPhone 14/15 Pro, Pixel 8)


Small mobile: 360px (Samsung Galaxy S series — most common Android viewport)


Minimum safe: 320px (must not break or overflow)


TOUCH TARGETS (universal standard):


Every button, link, tab, and interactive element must be minimum 44×44px — required by both Apple HIG and Google Material Design 3


Minimum 8px spacing between adjacent tappable elements


No input font size below 16px — prevents auto-zoom on both iOS Safari and Android Chrome


LAYOUT FIXES FOR MOBILE:


Left sidebar must collapse into a bottom tab bar (max 5 items) on mobile — standard pattern on both iOS and Android


Tables must convert to stacked cards on mobile — no horizontal-scrolling data tables


KPI grid: 4-column → 2×2 on tablet → single column on mobile


No element should cause horizontal scroll at 360px or 320px width


All modals and overlays must be full-screen on mobile, not floating panels


BROWSER-SPECIFIC SAFE AREAS:


iOS Safari: account for bottom address bar — no critical UI within bottom 83px; use env(safe-area-inset-bottom) padding on fixed elements


Android Chrome: account for bottom navigation bar height (~48px) — use env(safe-area-inset-bottom) here as well since Android 15+ supports it


Both: ensure viewport meta tag is width=device-width, initial-scale=1.0 on every page


TYPOGRAPHY SCALING:


Desktop headings (32px) → Mobile (22px)


Body text minimum 16px on all breakpoints


Line height minimum 1.5 for readability on small screens


Avoid system fonts that differ drastically across OS — stick to Inter (already in your design system) as it renders identically on iOS and Android


FORMS & INPUTS:


All form fields full-width (100%) on mobile


Labels above inputs (not inline) on mobile


Submit/CTA buttons full-width on mobile


On Android, ensure type attributes on inputs are correct (email, tel, number) — Android Chrome shows the appropriate keyboard based on input type


GLASSMORPHISM ON MOBILE:


Reduce backdrop-filter: blur() from 20px → 12px on mobile — heavy blur causes GPU lag on mid-range Android devices especially


Ensure glass card text contrast meets 4.5:1 ratio — critical on Android where screen calibration varies widely across manufacturers


Add a solid fallback background color for browsers that do not support backdrop-filter (older Android WebView)


AFTER THE AUDIT, REPORT:


Which pages had issues and what was fixed


Any elements that could not be made responsive without a functionality change (flag for manual review)