The current design has major visual problems 
that need to be completely fixed. Do a full 
design pass on every page. Here are the 
exact issues and how to fix each one.

---

## PROBLEM 1: NaN VALUES

Fix all NaN values on Documents and Support 
pages. The KPI cards are showing NaN because 
the data calculation is broken.

For Documents page, hardcode these values:
- Total Docs: 5
- Active: 4
- Pending: 1  
- Favorites: 2

For Support page, hardcode these values:
- Total Tickets: 3
- Active: 1
- Resolved: 1
- High Priority: 1

---

## PROBLEM 2: COLOR DISCIPLINE

The app uses ONE primary color: #BA2027 red.
Every other color is only used for semantic 
meaning (status only). Apply this strictly:

ONLY USE COLORS FOR THESE SPECIFIC PURPOSES:
- #BA2027 red → active nav item, primary 
  buttons, primary accent only
- #059669 green → "Active" or "Paid" status 
  badges ONLY
- #D97706 amber → "Pending" or "Paused" 
  status badges ONLY
- #DC2626 red → "Overdue" or "High Priority" 
  status badges ONLY
- #6B7280 gray → "Completed" status badge ONLY
- #2563EB blue → informational badges ONLY

REMOVE all colored circle icons on KPI cards.
Replace every colored icon circle 
(the green circle with checkmark, orange 
circle with clock, etc) with a simple 
light gray icon. Icon color: #9CA3AF.
Icon background: none.

The KPI cards should look clean and minimal:
just the number, label, and a small gray icon.
No colored circles. No colored backgrounds 
on the icon.

---

## PROBLEM 3: KPI CARD CONSISTENCY

Every single KPI card across every page 
must look identical. Apply this exact style:

- Background: white #FFFFFF
- Border: 1px solid #F0EEEE
- Border radius: 16px
- Padding: 24px
- Box shadow: 0 2px 8px rgba(0,0,0,0.06)
- No hover color change on the card itself

CONTENT LAYOUT inside every KPI card:
Top row: small gray icon (20px) on the right
Main number: 
  - font-size: 32px
  - font-weight: 700
  - color: #1A1A1A
  - letter-spacing: -0.03em
Label below number:
  - font-size: 11px
  - font-weight: 600
  - color: #9CA3AF
  - text-transform: uppercase
  - letter-spacing: 0.06em
Optional sublabel (small context text):
  - font-size: 12px
  - color: #6B7280

This exact layout must be used on Dashboard, 
Reports, Documents, Support, and Invoices. 
Zero variation between pages.

---

## PROBLEM 4: CHARTS — STRICT RULES

Apply these chart rules across the entire app:

CHARTS THAT MUST STAY (they show trends):
- Lead Performance Trend (line chart) ✅
- Monthly Revenue Trend (bar chart) ✅
- Campaign progress bars on Dashboard ✅

CHARTS THAT MUST BE REMOVED:
- Campaign Status Distribution PIE CHART ❌
  Replace with 3 simple KPI badges showing:
  Active: 3 | Paused: 2 | Completed: 1
  as clean inline stat pills, not a chart

- Any other pie or donut chart ❌
  Pie charts are hard to read and add no value
  Replace with simple labeled stat rows

- The "%" badge circles on progress bars ❌
  Remove the red circle % badges entirely
  Just show the percentage as plain text 
  to the right of the bar

CHART STYLING — fix all charts to match:

Line chart (Lead Performance Trend):
- Line color: #BA2027
- Line width: 2px
- Fill under line: rgba(186,32,39,0.06)
- No dots on the line
- Grid lines: #F5F5F5 very subtle
- Axis labels: #9CA3AF, 11px
- Chart background: white, no border

Bar chart (Monthly Revenue):
- Bar color: #BA2027 with 85% opacity
- Bar border radius: 6px on top corners
- Hover: #BA2027 full opacity
- Gap between bars: 30%
- NO legend label "■ revenue" below the chart
- Grid lines: #F5F5F5 subtle horizontal only
- Axis labels: #9CA3AF, 11px

Progress bars (Lead Demographics):
- Bar background: #F3F4F6
- Bar fill: #BA2027
- Bar height: 6px
- Border radius: 999px
- Remove the red % circle badges completely
- Show percentage as plain text: 
  font-size 13px, color #374151, 
  font-weight 600, aligned right

---

## PROBLEM 5: REPORTS PAGE LAYOUT

The Reports page is too busy. Simplify it:

TOP KPI ROW — keep only 4 cards:
1. Total Leads (fix NaN → use 1,265)
2. Acceptance Rate: 93%
3. Active Campaigns: 3
4. Revenue YTD: $198.3K

Remove: Completed (1), Growth (+168%) cards
These are redundant on this page.

CHART SECTION — two charts side by side:
Left (60% width): Lead Performance Trend 
  line chart (Jan–Jun)
Right (40% width): Remove the pie chart, 
  replace with a clean Campaign Status 
  summary card showing:
  Title: "Campaign Status"
  3 rows, each with:
  - Colored dot + status name + count + bar
  Active      ●  3  ████████░░  50%
  Paused      ●  2  ██████░░░░  33%  
  Completed   ●  1  ███░░░░░░░  17%
  Dot colors: green, amber, gray

BELOW CHARTS:
Keep Lead Demographics section but fix 
the progress bars as described above.
Remove the % badge circles.

---

## PROBLEM 6: ACCOUNT PAGE

The Account page is almost empty. 
Add content to all the tabs so they don't 
look broken:

My Profile tab — already has name/email/phone,
also add:
- Job Title field
- Company field (read-only, shows "Acme Corp")
- Profile photo placeholder with initials "SM"
  and an "Upload Photo" button below it

Company Info tab — add:
- Company Name: Acme Corp
- Industry: Technology
- Company Size: 501-1000 employees
- Website: www.acmecorp.com
- Address fields

Security tab — add:
- Change Password section (current, new, confirm)
- Two-factor authentication toggle (off by default)
- Active Sessions section showing 1 mock session

Notifications tab — add:
- Toggle switches for:
  New lead delivered
  Campaign milestone reached
  Invoice generated
  Invoice overdue
  Weekly performance report
  All toggles on by default

---

## OVERALL RULES — enforce on every page

1. White cards only — no colored card backgrounds
2. One primary color — #BA2027 for accents only
3. Status colors only for badges, nowhere else
4. Clean gray icons on KPI cards, no colored circles
5. All numbers use: 32px, 700 weight, -0.03em tracking
6. All labels use: 11px, uppercase, #9CA3AF
7. Charts use #BA2027 only, no multi-color charts
8. No pie charts anywhere in the app
9. Remove all "NaN" and "Invalid Date" values
10. Fix all dates to show real mock dates

Do not change routing, navigation, 
sidebar behavior, or any functionality.
Only fix the visual design and data issues.
