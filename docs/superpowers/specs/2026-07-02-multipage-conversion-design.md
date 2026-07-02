# Convert SPA to Real Multi-Page Site (SEO)

## Problem
The site is a single `index.html` with JS-driven hash routing (`#drain-cleaning`, `#repairs-installations`, etc.) toggling `display:none` on five `<main class="page">` blocks. There is no `sitemap.xml`, `robots.txt`, or per-page routing config. Google generally will not index hash fragments as separate pages, so this site likely only ever ranks one URL (`/`) no matter how good the "Drain Cleaning" or "Repairs" content is.

## Goal
Convert to real, independently-crawlable URLs — one static HTML file per page — while keeping the visual design, copy, and functionality (quote modal, ad popup, mobile nav, phone/text links) unchanged.

## Decisions (confirmed with user)
- **Full page reloads between pages are fine.** No attempt to preserve the current instant-switch SPA feel. Simpler and more robust.
- **Shared markup (header, nav, footer, quote modal, ad modal) is duplicated into each file**, not templated/built. No Node/build tooling exists on this machine; future edits to shared chrome will be applied to all files by hand when requested.
- **Clean URLs, no `.html` extension** in links (`/drain-cleaning`, not `/drain-cleaning.html`). Cloudflare Pages serves `.html` files this way by default with no config changes needed. Filenames on disk still end in `.html`.
- **`/quote` page is removed.** The "Get a Quote" modal (JS overlay, triggered by `data-quote` buttons) is unaffected and keeps working from every page — only the standalone Quote *page* (with its "3 ways to reach us" content) goes away.
- **New `/servicearea` page added**, replacing Quote in the nav. Content: the existing service-area section (coverage map SVG + town chips) moved from the homepage into its own page, with the same `.phero` header treatment used by the other interior pages (Drain Cleaning, Repairs, Meet the Owner). No new copy is being written for this — content is moved as-is. The homepage keeps its own existing service-area section untouched (not removed, not linked as a "see more" — this is intentionally additive, low-risk).
- Out of scope: the orphaned, unrelated `meet-the-owner.html` currently sitting inside `assets/` is left alone entirely — flagged as a separate cleanup item, not touched here.

## Final page list
| URL | File | Notes |
|---|---|---|
| `/` | `index.html` | Homepage. Drops the other 4 `<main>` blocks (they become their own files). Nav becomes real links. Keeps its own service-area section as-is. |
| `/drain-cleaning` | `drain-cleaning.html` | Existing content, own file. |
| `/repairs-installations` | `repairs-installations.html` | Existing content, own file. |
| `/meet-the-owner` | `meet-the-owner.html` *(new, at project root — do not confuse with the existing unrelated file under `assets/`)* | Existing content, own file. |
| `/servicearea` | `servicearea.html` | **New.** Map + chips section moved here, wrapped in a `.phero` header matching other interior pages. |

`/quote` is deleted from the nav; no file created for it.

## Per-page mechanics
- Each file: full `<!DOCTYPE html><html lang="en"><head>...</head><body>...</body></html>` structure (this also happens to fix the missing-doctype issue flagged in the earlier code review, since we're writing these files fresh).
- Unique `<title>` and `<meta name="description">` per page (real SEO improvement — currently only one shared description exists across all "pages").
- Nav links become real `<a href="/drain-cleaning">` etc. Current-page link gets `.active` via a plain static class in that page's copy of the nav — no JS hash-matching needed anymore.
- `Plumber` JSON-LD schema (added earlier) duplicated onto every page, not just home.
- Shared JS (quote modal open/close/submit, ad popup, mobile menu toggle, phone/text tracking icon injection, footer year) duplicated per page. The page-routing logic (`pages` array, `go()` function, `location.hash` handling) is deleted entirely — no longer needed since each file is its own page.
- `sitemap.xml` and `robots.txt` added at project root listing the 5 real URLs.

## What does NOT change
- Visual design, copy, images, CSS — all carried over verbatim from the current single-file version.
- Quote modal behavior, Web3Forms submission, mailto fallback, ad popup timing — carried over verbatim.
- Homepage content and layout — unchanged except nav links and removal of the other pages' `<main>` blocks.

## Risks / things to double check during implementation
- Every `data-nav="X"` click handler and footer link currently does `go('X')` via JS — these all need to become real `href` links now, including inside footer's `.flist` and the owner section's "Learn More About the Origin Story" button.
- The mobile sticky bar and any other page-agnostic UI must be duplicated correctly into every file, not just nav/footer.
- Cloudflare Pages clean-URL serving needs to be verified live after push (should work by default, but confirm no `_redirects` override is needed).
- Because each page now full-reloads, double check no JS assumes it's still running inside the old multi-page shell (e.g. anything referencing `document.getElementById('home')` etc. from the old `pages` array logic must be removed, not just orphaned).

## Verification
- Local: open each new file directly, confirm it renders correctly, nav links point to the right places, quote modal opens/closes/submits, mobile menu works.
- After push: verify clean URLs resolve on the live Cloudflare Pages deployment, submit `sitemap.xml` in Google Search Console if the user has access.
