# LocalBusiness Schema + Image Compression

## Goal
Two independent, low-risk technical improvements to `index.html`:
1. Add structured data (JSON-LD) so search engines understand this is a local plumbing business.
2. Shrink oversized image assets that are loaded on every page view, improving load time.

Neither changes visible design or copy.

## 1. LocalBusiness schema
Add a `<script type="application/ld+json">` block using `@type: "Plumber"` (a recognized subtype of `LocalBusiness` in schema.org, well-supported by Google).

Fields:
- `name`: "Crystal Flow Repair & Drain Cleaning"
- `telephone`: "+14842583749"
- `email`: "crystalflowdrains@gmail.com"
- `url`: "https://www.crystalclearflow.com"
- `image`: logo asset URL
- `areaServed`: reuse the existing `towns` array already defined in the page's JS (Womelsdorf, Robesonia, Myerstown, etc.)
- `openingHoursSpecification`: 7am-6pm daily, matching the existing "We Call Back ASAP · 7am–6pm" hero badge
- No `address` field — service-area-only business, no public address confirmed.

## 2. Image compression
Tooling: PowerShell + `System.Drawing` (no Node.js or ImageMagick available on this machine).

**Downsize only, same filename/format, zero HTML changes:**
- 6 service icon PNGs (drain/faucet/leak/pipe/shower/toilet cleaning icons) — currently 650-1035px, displayed at 36-66px max. Resize to ~240px max dimension.
- `logo1-trim.png` — currently 394px tall, displayed at max 132px tall. Resize to ~450px tall.
- `crystal_flow_logo_true_transparent_cropped.png`, `owner_portrait_transparent.png`, `shield_teardrop_cropped_true_transparent.png` — these need transparency and serve larger uses (OG image, favicon, portrait at up to ~460-600px display). Modest resize to ~1000px max dimension, kept as PNG.

**Convert PNG → JPEG (quality 85), rename file, update HTML references:**
- `Drain-cleaning-full.png`, `background333.png`, `backgrounds3.png`, `hero-image3.png`, `meet-the-owner2.png` — all photographic content with no transparency requirement, currently 1.6-2.3MB each as lossless PNG. JPEG at quality 85 should shrink each by roughly 70-90% with no visible quality loss at web display size.

## Out of scope
- Images not referenced anywhere in `index.html` or `meet-the-owner.html` (dead/orphaned assets) — not touched.
- The missing `<!DOCTYPE html>`/`<head>`/`<body>` structural fix and ARIA accessibility gaps from the earlier code review — separate piece of work, not bundled here.

## Verification
- Re-check file sizes after compression.
- Visually diff hero, service cards, and meet-the-owner page in a browser preview (or via user's live-site check, since this environment can't load the live CDN images) to confirm no visible degradation.
- `git diff --stat` to confirm only the intended files changed.
