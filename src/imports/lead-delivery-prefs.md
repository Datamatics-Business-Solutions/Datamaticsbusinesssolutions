Here is the updated prompt — paste this directly into Figma Make:

***

> Add a **Lead Delivery Preferences** section directly inside the existing **Campaign Submission page** (the page where clients fill in and submit a new campaign). This is NOT a standalone page — it must be embedded as a new section within that existing form flow, appearing after the campaign details have been filled in and before the final submit button.
>
> **DO NOT create a new page or new route. DO NOT move or restructure any existing sections on this page. DO NOT change any colors, fonts, glassmorphism styling, or existing functionality. This is purely additive — insert the new section into the existing page only.**
>
> ---
>
> **WHERE TO INSERT IT:**
> On the Campaign Submission page, place the new **"Lead Delivery Preferences"** section:
> - After the campaign scope/targeting details section
> - Before the final "Submit Campaign" button
> - Use the same section card/glass card style already used on this page for visual consistency
>
> ---
>
> **SECTION HEADING:**
> Title: **"How would you like to receive your leads?"**
> Subtitle: *"Choose your preferred delivery method for this campaign. You can update this at any time."*
> Status badge (right-aligned on desktop, below title on mobile): 🔴 Not configured / 🟢 Connected
>
> ---
>
> **DELIVERY METHOD DROPDOWN:**
> Label: "Lead Delivery Method"
> Placeholder: "Select a delivery method..."
> Options:
> - 📧 Email (CSV attachment)
> - 📊 Google Sheets
> - 🔗 Custom Webhook
> - ☁️ Salesforce CRM
> - 🟠 HubSpot CRM
> - 🟣 Pipedrive CRM
> - ⚡ Convertr
> - 📦 LeadByte
> - 🗂️ FTP / SFTP
>
> ---
>
> **DYNAMIC CONFIGURATION PANEL:**
> Below the dropdown, show a configuration panel that changes based on the selection. Animate the panel with a smooth fade-in on selection change.
>
> **If Email selected:**
> - Input: Recipient email address(es)
> - Dropdown: Delivery frequency — Real-time / Daily digest / Weekly summary
> - Dropdown: File format — CSV / Excel (.xlsx)
>
> **If Google Sheets selected:**
> - Input: Google Sheet URL
> - Info banner: "Click Connect to authorise access via Google"
> - Button: "Connect Google Account" (primary)
>
> **If Custom Webhook selected:**
> - Input: Webhook endpoint URL (placeholder: https://your-endpoint.com/leads)
> - Dropdown: Method — POST / PUT
> - Input: Auth header (optional — placeholder: Bearer token or API key)
> - Button: "Send Test Ping" (secondary/outline style)
>
> **If Salesforce CRM selected:**
> - Input: Salesforce Instance URL
> - Input: Client ID
> - Input: Client Secret (masked, with show/hide eye icon)
> - Button: "Connect Salesforce" (primary)
>
> **If HubSpot CRM selected:**
> - Button: "Connect HubSpot via OAuth" (primary)
> - Info banner: "You will be redirected to HubSpot to authorise the connection"
>
> **If Pipedrive selected:**
> - Input: Pipedrive API Key (masked, with show/hide eye icon)
> - Input: Pipeline ID (optional)
> - Button: "Save & Connect" (primary)
>
> **If Convertr selected:**
> - Input: Convertr HTTP POST endpoint URL
> - Input: Auth token (optional, masked)
> - Button: "Send Test Lead" (secondary/outline style)
>
> **If LeadByte selected:**
> - Input: LeadByte Postback URL
> - Input: Campaign token (optional)
> - Button: "Send Test Lead" (secondary/outline style)
>
> **If FTP / SFTP selected:**
> - Input: Host / Server address
> - Input: Username
> - Input: Password (masked, with show/hide eye icon)
> - Input: Destination folder path
> - Dropdown: Delivery frequency — Daily / Weekly
>
> ---
>
> **DESIGN RULES:**
> - Section card must match the exact glass card style of every other section on this page
> - All inputs: full width within the card, 16px font minimum
> - Masked fields: show/hide toggle with eye icon
> - "Send Test" and OAuth buttons: secondary/outline button style
> - "Connect" and "Save" buttons: existing primary red button style
> - Info banners: soft blue tint with ℹ️ icon, same style as any existing info/helper text on the page
> - Mobile: all inputs, dropdowns, and buttons stack full width
> - Desktop/tablet: two-column input layout where fields are paired (e.g. Client ID + Client Secret side by side)
>
> ---
>
> **VALIDATION RULES:**
> - This section is required before the campaign can be submitted
> - If no delivery method is selected, show an inline error on the dropdown: "Please select a lead delivery method to continue"
> - The final "Submit Campaign" button should remain inactive (greyed out) until this section is completed
>
> ---
>
> **AFTER BUILDING, CONFIRM:**
> - The section appears embedded within the Campaign Submission page, not as a new page or route
> - All existing sections above and below it are intact and unchanged
> - The Submit button validation correctly requires this section to be filled

***

This way, delivery preference is captured **at the point of campaign creation** — no separate settings page needed, and no risk of a campaign being submitted without a delivery method configured. 🎯