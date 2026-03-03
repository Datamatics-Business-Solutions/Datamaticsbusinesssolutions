Here is the full prompt — copy and paste this directly into Figma Make:

***

> My Vercel deployment failed with the following build error. Please fix it without changing anything else in the file.
>
> **File with error:** `src/app/pages/Invoices.tsx`
> **Line:** 291
>
> **Full error from Vercel build log:**
> ```
> [vite:esbuild] Transform failed with 1 error:
> /vercel/path0/src/app/pages/Invoices.tsx:291:16: ERROR: Expected "}" but found ")"
>
> 289|                      );
> 290|                    })
> 291|                  )}
>    |                  ^
> 292|                </tbody>
> 293|              </table>
> ```
>
> **What the error means:**
> There is a bracket mismatch in the `.map()` function that renders invoice rows inside the `<tbody>` of the invoices table. The arrow function is using a block body `=> {` but the closing brackets are mismatched, causing the JSX compiler to fail.
>
> **How to fix it:**
> Find the `.map()` call rendering rows inside `<tbody>` near line 291 in `Invoices.tsx`. Ensure the bracket structure follows one of these two valid patterns:
>
> Pattern 1 — block body with return:
> ```tsx
> {invoices.map((invoice) => {
>   return (
>     <tr key={invoice.id}>...</tr>
>   );
> })}
> ```
>
> Pattern 2 — implicit return:
> ```tsx
> {invoices.map((invoice) => (
>   <tr key={invoice.id}>...</tr>
> ))}
> ```
>
> **Instructions:**
> - Fix ONLY the bracket mismatch at this location
> - Do NOT change any logic, data, calculations, styling, colors, fonts, or any other part of this file or any other file
> - Do NOT refactor or rewrite any other section
> - After fixing, confirm what exact change was made so I can verify before pushing to GitHub

***

Once Figma confirms the fix, do a quick check that only those brackets were touched, then push to GitHub — Vercel will automatically trigger a new build and it should go green. 🚀