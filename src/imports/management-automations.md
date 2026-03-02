Here is the complete updated management document with Tally added:

***

# The Three Core Automations

## 1. 🏢 Salesforce — Auto-Create Opportunities

**What it is:** Every time a new campaign is created on the platform, a corresponding Opportunity is automatically created in Salesforce — no manual entry ever.

**What it does:**
- Eliminates manual Salesforce data entry completely
- Campaign name, client, value, dates, and targets all populate automatically
- The team sees every new campaign in Salesforce the moment it's approved
- Full two-way sync — updates on the platform reflect in Salesforce and vice versa

**What is needed:**
| Item | Detail |
|---|---|
| Supabase back-end | To store campaigns and fire automated triggers |
| Salesforce API credentials | From Salesforce admin |
| Integration middleware | Make.com (~$9/mo) or Zapier (~$20/mo) |
| Build time | ~1 day |

***

## 2. ✍️ DocuSign — Auto-Generate & Send Job Cards for Signature

**What it is:** The moment a campaign is approved, a Job Card PDF is automatically generated from the campaign data and sent via DocuSign to all required signatories — client, account manager, and ops.

**What it does:**
- Eliminates manual job card creation entirely
- Automatically emails every stakeholder with their DocuSign signing link
- Sends reminders to anyone who hasn't signed
- Platform shows real-time status — *"Awaiting Client Signature"*, *"Fully Executed"*
- Completed signed PDF stored and visible on the platform
- Full legal audit trail with timestamps on every signature

**What is needed:**
| Item | Detail |
|---|---|
| Supabase back-end | Database and automated triggers |
| DocuSign account | From ~$25/month |
| DocuSign API access | From DocuSign developer portal |
| PDF generation | Automated from campaign data |
| Build time | ~2-3 days |

***

## 3. 📤 Convertr — Auto-Deliver Leads to Client's Platform

**What it is:** When leads are ready for delivery, the platform automatically sends them directly into each client's Convertr campaign — no spreadsheets, no manual uploads, no email attachments.

**What it does:**
- Delivers leads directly into the client's lead management system in real time
- Convertr validates and dedupes each lead instantly upon receipt
- Accepted/rejected status feeds back into the platform automatically
- Rejection reasons visible on the dashboard — full visibility on which leads failed and why
- Campaign delivery counters update live as leads are accepted
- Once in Convertr, leads flow automatically into the client's CRM, marketing automation platform, or any of Convertr's 45+ integrations

**What is needed:**
| Item | Detail |
|---|---|
| Supabase back-end | To store leads and client configurations |
| Convertr API key | Each client shares their own key per campaign |
| Campaign ID | Provided by client per campaign |
| Build time | ~1-2 days |

***

## 4. 🧾 Tally — Invoice & Payment Sync

**What it is:** Every invoice generated on the platform automatically syncs to TallyPrime — and when payment is received, Tally updates too. The back-office team never has to manually enter an invoice again.

**What it does:**

| Platform Action | What Happens in Tally |
|---|---|
| Invoice generated | Sales voucher created automatically in Tally |
| Invoice sent to client | Tally records the outstanding receivable |
| Partial payment received | Tally updates with partial receipt entry |
| Full payment received | Tally marks ledger as settled |
| Invoice cancelled | Tally credit note created automatically |
| New client added | Tally ledger created for that client |

**Important note:** TallyPrime typically runs on a local machine or server. The Tally instance needs to be running and connected for the sync to work — this is a one-time configuration by the Tally admin. Alternatively, **TallyPrime on Cloud** removes this constraint entirely.

**What is needed:**
| Item | Detail |
|---|---|
| TallyPrime | Existing installation (back office already has this) |
| Tally API access enabled | One-time configuration by Tally admin |
| Integration middleware | TallyConnector or api2books |
| Supabase back-end | To store and trigger invoice/payment data |
| Build time | ~2-3 days |

***

## Combined Impact Summary

| # | Automation | Time Saved | Manual Process Eliminated |
|---|---|---|---|
| 1 | **Salesforce** | ~30 min/campaign | Manual CRM data entry |
| 2 | **DocuSign** | ~2 hrs/campaign | Job card creation & signature chasing |
| 3 | **Convertr** | ~1-3 hrs/delivery | Spreadsheet prep & manual lead upload |
| 4 | **Tally** | ~1-2 hrs/invoice | Manual accounting entry & payment tracking |

**Total estimated build time for all four automations: approximately 2-3 weeks of back-end development.**

**The platform effectively becomes the central nervous system of the entire operation — campaigns, signatures, lead delivery, and accounting all connected and automated in one place.** 🚀