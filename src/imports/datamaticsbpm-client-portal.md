Design a web app dashboard called “DatamaticsBPM Client Portal”.
The app has two main user types:
1. Client user – agencies/aggregators who give us campaigns
2. Internal user – Datamatics operations team
Use a clean, modern B2B style (light background, purple/blue accent, simple icons, clear tables).
Create the following key pages:

1. Client – Campaign List page
Top navigation:
* Logo (DatamaticsBPM) on the left
* Tabs: “Campaigns”, “Invoices”, “Account” on the right
Main content:
* Page title: “Your Campaigns”
* Filters row:
    * Search box (by campaign name)
    * Dropdowns: Status (All / Not started / In progress / Paused / Completed), Date range
* Table of campaigns with columns:
    * Campaign Name
    * Service Type (Leads / Content Syndication / BANT / Appointments)
    * Status (with colored pill)
    * Start Date
    * End Date
    * Delivered vs Target (e.g., 320 / 500) with small progress bar
    * Last Updated
    * “View details” button
Show a sample of 5–6 campaigns with different statuses.

2. Client – Campaign Detail page
Header:
* Breadcrumb: “Campaigns > [Campaign name]”
* Campaign name, client company name, and status pill
* Key metrics bar with 4 cards:
    * Target leads
    * Delivered leads
    * Accepted leads
    * End date
Main area:
* Left side:
    * Large progress bar “Accepted leads vs target”
    * Section “Campaign details” with 2‑column info grid:
        * Service type, Geo, Industry, Revenue range, Employee size, Job titles, Pricing model
* Right side:
    * “Actions” card with buttons:
        * Request pause
        * Request resume
        * Contact support
    * “Documents” card with:
        * Job card (view/download)
        * Latest lead file (download when completed)
Bottom:
* “Activity & Updates” section with a simple vertical timeline (RFP received, Job card signed, Campaign started, First batch delivered, Completed).

3. Internal – Campaign Detail (Ops view)
Very similar layout to Client detail, but with extra controls.
Additional elements:
* Editable fields for daily numbers:
    * Inputs for: Leads sourced, Leads validated, Leads rejected, BANT qualified, Appointments set
* A small table “Daily progress” with dates and numbers
* Status dropdown (Not started / In progress / Paused / Completed)
* Button: “Generate job card” (primary)
* Button: “Mark campaign completed”

4. Job Card Preview (Modal or Page)
A centered panel that looks like a document:
* Header: “Job Card – [Campaign name]”
* Sections:
    * Client details (name, address, contact)
    * Scope of work (bullet list)
    * Target volume & pricing
    * Geo / filters
    * Terms & conditions (short placeholder text)
* At the bottom:
    * Two signature blocks: “Client” and “DatamaticsBPM”
    * Primary button: “Send for e‑signature”
Style it like a clean PDF preview.