Here is the prompt — paste this directly into Figma Make:

***

> Perform a **read-only audit** of the entire DatamaticsBPM Client Portal. Do NOT make any changes, do NOT modify any files, do NOT add or remove anything. This is a discovery and analysis task only.
>
> Review every existing page and component across the platform and check for the presence of the following features. For each one, tell me:
> - ✅ **Already built** — it exists and is functional
> - ⚠️ **Partially built** — the UI exists but logic or functionality is incomplete
> - ❌ **Not built** — does not exist anywhere in the platform
>
> ---
>
> **CLIENT-FACING FEATURES — CHECK FOR:**
> 1. Real-time lead counter on campaign cards (live delivered lead count)
> 2. Lead quality breakdown — Accepted / Rejected / Pending split per campaign
> 3. Delivery pacing indicator — progress bar showing leads delivered vs total target with estimated completion date
> 4. Self-serve lead rejection — client can flag a lead as rejected with a reason dropdown
> 5. Invoice auto-generation tied to delivered lead count
> 6. Campaign cloning — "Clone this Campaign" button
> 7. Client notification preferences — delivery milestone alerts via email or in-app
> 8. Lead delivery method selection (webhook, CRM, email CSV, etc.) on campaign submission
>
> ---
>
> **OPS-FACING FEATURES — CHECK FOR:**
> 9. Ops master dashboard — table of ALL campaigns across ALL clients with status, delivery count, and pacing
> 10. Lead upload interface — CSV drag-and-drop uploader with column mapping
> 11. Rejection queue — ops view of all client-rejected leads with reasons
> 12. Campaign health alerts — automatic flags for campaigns behind delivery pace
> 13. Client communication log / notes thread per campaign
> 14. Delivery confirmation receipts — log of every lead push with timestamp, count, and success/fail status
>
> ---
>
> **SHARED FEATURES — CHECK FOR:**
> 15. Shared campaign timeline / milestone tracker visible to both client and ops
> 16. Lead preview table — sanitised sample of delivered leads visible in-portal
> 17. Dispute resolution workflow — structured rejection dispute flow between client and ops
> 18. SOW / contract storage — signed agreement accessible inside the campaign record
> 19. Lead velocity graph — line chart showing leads delivered per day over campaign lifetime
>
> ---
>
> **AFTER THE AUDIT, PROVIDE:**
>
> A structured report in this format:
>
> **SECTION 1 — WHAT IS ALREADY BUILT**
> List every feature marked ✅ with a one-line description of where it lives in the platform (which page/component)
>
> **SECTION 2 — WHAT IS PARTIALLY BUILT**
> List every feature marked ⚠️, describe what exists, and what specifically is missing to complete it
>
> **SECTION 3 — WHAT IS NOT YET BUILT**
> List every feature marked ❌ and for each one provide:
> - A plain-English description of what it would involve to build
> - An estimated complexity: Low / Medium / High
> - Whether it can be added without touching existing pages (additive) or would require modifying existing pages (invasive)
>
> **SECTION 4 — RECOMMENDED PRIORITY ORDER**
> Based on what is missing, suggest a priority order for implementation — highest client/ops value first, lowest complexity first where value is equal
>
> ---
>
> **IMPORTANT RULES:**
> - Do NOT implement anything
> - Do NOT modify any file
> - Do NOT make any suggestions outside of the 19 features listed above
> - Only audit, analyse, and report
> - I will give explicit approval before any implementation begins

***

Once Figma returns the audit report, share it here and I'll help you interpret the results and decide what to greenlight first. 🎯