Here is the updated prompt with all three improvements — paste this directly into Figma Make:

***

> Make the following three improvements to the existing DatamaticsBPM Client Portal. These are targeted, additive changes only. Do NOT modify any other pages, components, styling, colors, fonts, or functionality.
>
> ---
>
> **IMPROVEMENT 1 — REAL-TIME LEAD COUNTER ON CAMPAIGN CARDS**
>
> On the Campaign List page, each campaign card currently shows a static lead count. Update this as follows:
>
> - The delivered lead count number should visually animate/pulse every time it updates — use a subtle count-up animation (same spring physics style already used for KPI animations on the dashboard)
> - Add a small 🟢 animated dot next to the counter when the campaign is actively running — this signals to the client that the number is live
> - The counter display format should be: **"1,243 of 2,000 leads delivered"** with the fraction in a lighter weight font below or beside the bold delivered number
> - Add a thin linear progress bar directly below the counter showing percentage delivered — use the existing primary red color at reduced opacity for the fill, light gray for the track
> - If a campaign is paused or completed, the dot should be 🔴 or ⚫ respectively and the animation should stop
> - On mobile, the counter and progress bar must stack cleanly within the card at 390px and 360px widths
>
> ---
>
> **IMPROVEMENT 2 — CLIENT NOTIFICATION PREFERENCES**
>
> The notification preferences UI already exists. Complete the trigger logic so notifications are actually sent at the right moments. Implement the following:
>
> - **In-app notification bell** (top navigation bar, already exists): trigger a notification entry for the following events:
>   - Campaign goes Live
>   - 25% of leads delivered
>   - 50% of leads delivered
>   - 75% of leads delivered
>   - 100% of leads delivered (campaign complete)
>   - Invoice generated (front-end trigger only — no backend required)
>
> - Each notification entry should contain:
>   - Campaign name
>   - Event description (e.g. "Your campaign 'Q1 Finance Leads' has reached 50% delivery")
>   - Timestamp
>   - A "View Campaign" link that navigates directly to that campaign's detail page
>
> - **Email notifications** (front-end simulation only — no actual email sending required since this is a mock platform):
>   - In the Notification Preferences settings, allow the client to toggle ON/OFF email alerts for each of the above milestone events
>   - Show a confirmation toast when a preference is saved: "Notification preferences updated"
>
> - Unread notification count badge on the bell icon — shows the number of unread notifications, clears when the bell is opened
>
> - On mobile: notification panel should open as a full-screen overlay rather than a dropdown
>
> ---
>
> **IMPROVEMENT 3 — CAMPAIGN CLONING**
>
> Add a "Clone Campaign" button to every existing campaign card and the campaign detail page:
>
> - On the **Campaign List page**: add a "Clone" option inside the existing action menu (three-dot menu or equivalent) on each campaign card — use the existing menu component, do not add a standalone button to the card face
> - On the **Campaign Detail page**: add a "Clone this Campaign" secondary/outline button in the page header actions row, alongside any existing action buttons
>
> - When Clone is clicked:
>   - Open a confirmation modal: **"Clone this campaign?"** with body text: *"This will create a new draft campaign pre-filled with the same details, targets, and delivery settings. You can edit before submitting."*
>   - Two buttons in the modal: "Cancel" (secondary) and "Clone & Edit" (primary red)
>   - On confirming, navigate the client directly to the Campaign Submission page with all fields pre-populated from the source campaign
>   - The cloned campaign name should auto-populate as: **"[Original Campaign Name] — Copy"**
>   - The cloned campaign status must default to **Draft** — never copy the original's Live/Active/Completed status
>
> - On mobile: the confirmation modal should be full-screen
>
> ---
>
> **DESIGN RULES FOR ALL THREE:**
> - Match all existing glassmorphism card styles exactly
> - Use existing button, badge, toast, and modal components already in the design system
> - All new text follows existing font hierarchy (Inter, existing size scale)
> - No new colors introduced — use only existing palette variables
> - All three features must be fully responsive at 1440px, 768px, 390px, and 360px
>
> ---
>
> **AFTER BUILDING, CONFIRM:**
> - Which files were modified and what specifically changed in each
> - That no existing pages, routes, or components outside these three features were touched
> - That the lead counter animation respects the existing KPI animation style already in the platform
> - That cloned campaigns always default to Draft status and never inherit Active/Live/Completed status from the source

***

After this pass is done, the remaining high-value items from the audit are **lead quality breakdown** (Accepted/Rejected/Pending split on cards) and the **Tally-facing invoice front-end** — both are clean, self-contained additions whenever you're ready. 🚀