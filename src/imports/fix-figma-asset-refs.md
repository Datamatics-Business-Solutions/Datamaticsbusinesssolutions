The Vercel deployment is failing with this error:

"Rollup failed to resolve import 
figma:asset/b24b9bef2212c68559759883c7aca917e374398b.png 
from src/app/pages/Login.tsx"

This is caused by a Figma internal asset 
reference that was embedded in the code. 
It only works inside Figma preview but 
breaks on any real deployment.

Fix it using the following steps:

---

## STEP 1 — Find and remove all figma:asset references

Search the ENTIRE codebase for any import or 
reference that starts with "figma:asset/"

This includes:
- import statements at the top of any file
- src= attributes
- url() references in CSS
- background-image references
- Any string containing "figma:asset/"

Remove or replace every single one you find.
Do not leave a single figma:asset reference 
anywhere in the codebase.

---

## STEP 2 — Replace the Login page logo

The figma:asset reference in Login.tsx is 
the Datamatics logo image.

Replace it with an inline SVG or text-based 
logo component instead. Do not use an image 
file at all.

Use this exact logo treatment:

<div style={{
  display: 'flex',
  alignItems: 'center', 
  gap: '8px'
}}>
  <div style={{
    width: '32px',
    height: '32px',
    background: '#BA2027',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '16px',
    fontFamily: 'Inter, sans-serif'
  }}>D</div>
  <div>
    <div style={{
      fontWeight: '700',
      fontSize: '14px',
      color: '#1A1A1A',
      letterSpacing: '-0.02em',
      lineHeight: '1.1'
    }}>Datamatics</div>
    <div style={{
      fontWeight: '400',
      fontSize: '10px',
      color: '#9CA3AF',
      letterSpacing: '0.04em'
    }}>Business Solutions</div>
  </div>
</div>

---

## STEP 3 — Replace same logo in Sidebar

The sidebar also likely has a figma:asset 
reference for the logo in its expanded state.

Apply the same inline logo component to the 
sidebar header. 

When sidebar is expanded (240px):
Show the full logo (icon + text as above)

When sidebar is collapsed (64px):
Show only the red square with "D":
<div style={{
  width: '32px',
  height: '32px',
  background: '#BA2027',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: '700',
  fontSize: '16px'
}}>D</div>

---

## STEP 4 — Check for any other asset issues

After fixing the logo, scan for:
- Any other import using "figma:" protocol
- Any broken image src pointing to a 
  non-existent local file
- Any hardcoded localhost URL
- Any import referencing a file that 
  does not exist in the /public or /src/assets 
  directory

Fix or remove all of them.

---

## STEP 5 — Verify the build

After making all fixes, confirm the project 
builds successfully by ensuring:
- No figma: protocol references remain
- No unresolved imports remain
- All image references point to either:
  a) Files that actually exist in /public
  b) Files that actually exist in /src/assets
  c) Inline SVG or CSS-based graphics
  d) External URLs starting with https://

Do not change any functionality, routing, 
styling, or page content. Only fix the 
broken asset references.
