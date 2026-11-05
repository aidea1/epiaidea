# START HERE — EPIAIDEA website package

Upload the contents of this folder to your web host, **keeping the folder
structure exactly as it is**. Do not rename files — the navigation, sitemap and
internal links depend on these exact names.

**If you only read one other file, read `VISIBILITY.md`.** It explains why the
site is not being found and what to do about it. The hour of work described in
its Part 1 matters more than everything else in this package combined.

---

## What changed in this version

### Latest round

- **Audiobook** announced on `book.html` (new `#audiobook` section with a sample
  player) and flagged on the homepage book banner. **One thing to do:** the
  "Get the audiobook" button currently opens an email. Replace its `href` with
  your real listing once it is live — there is a comment in `book.html` marking
  the exact spot.
- **The audio sample** is `assets/audio/the-denominator-sample.mp3`. Swap in a
  different clip any time by replacing that file, keeping the name.
- **Citation chart fixed.** It was hardcoded at 98,310. The historical points
  are still fixed, but the final point is now the current year and reads the
  live figure, so it cannot go stale again.
- **Email changed everywhere** to `akshaya.bhagavathula@gmail.com` (18 places).
- **Cookie banner** is now just *Accept cookies* / *Reject cookies*.
- **Copyright notice** added to every page footer.
- **Genre corrected.** The site described the book as a memoir in eleven places.
  It is now described as a debut novel / medical thriller inspired by true
  events, including in the structured data Google reads.

### Previous round

1. **All nine GitHub dashboard links removed** from the homepage. The cards keep
   their text and now lead to a consulting call-to-action instead.
2. **Citation figures now update themselves** — see "Your numbers" below.
3. **New Insights section** with two articles, added to the navigation. This is
   the part that gives search engines something to rank.
4. **"Home" removed from the nav** so eleven items still fit on one row; the
   EPIAIDEA wordmark still links to the homepage. Revert instructions are in
   `VISIBILITY.md`.

No font sizes were changed.

---

## 1. Web pages — 13 files, upload to the site root

| # | File | What it is |
|---|------|-----------|
| 1 | `index.html` | **Homepage** |
| 2 | `about.html` | Background, methodology, headshot |
| 3 | `services.html` | **Consulting and analytics — your revenue page** |
| 4 | `health-law.html` | Health law / legal epidemiology |
| 5 | `digital-epidemiology.html` | Digital epi / infodemiology |
| 6 | `atlas.html` | GLP-1 Organ Atlas — interactive 3D FAERS visualisation (1.5 MB) |
| 7 | `research.html` | Research portfolio, live PubMed feed, citation chart |
| 8 | `insights.html` | **NEW** — methods notes hub |
| 9 | `insight-carto-basemap-api-key.html` | **NEW** — article (draft, read before publishing) |
| 10 | `insight-disproportionality-not-causation.html` | **NEW** — article (draft, read before publishing) |
| 11 | `book.html` | THE DENOMINATOR |
| 12 | `media.html` | Press coverage and press kit |
| 13 | `contact.html` | Contact, collaboration areas, FAQ |

All thirteen share one navigation, one security policy and one footer.

## 2. `assets/` — keep as a subfolder next to the HTML files

Including `assets/audio/`, which must come with it.

| # | File | What it is |
|---|------|-----------|
| 14 | `assets/metrics.js` | Keeps every citation figure on the site current |
| 15 | `assets/scholar-metrics.json` | Local seed values (a floor, not the live source) |
| 16 | `assets/headshot.jpg` | Profile photo, 600×600 |
| 17 | `assets/headshot_sm.jpg` | Profile thumbnail, 200×200 |
| 18 | `assets/epiaidea_logo.png` | Logo, raster |
| 19 | `assets/epiaidea_logo.svg` | Logo, vector |
| 20 | `assets/audio/the-denominator-sample.mp3` | Audiobook sample played on `book.html` |

## 3. Search engine and server files — site root

| # | File | What it is |
|---|------|-----------|
| 21 | `sitemap.xml` | Submit in Google Search Console. Now lists all 13 pages |
| 22 | `robots.txt` | Crawler directives |
| 23 | `_headers` | Security headers. Netlify and Cloudflare Pages read this automatically; Apache/Nginx users see `README.md` |

## 4. For you — read, do not upload

| # | File | What it is |
|---|------|-----------|
| 24 | `VISIBILITY.md` | **Read this one.** Why the site isn't being found, and the fix |
| 25 | `README.md` | Deployment steps and pre-launch checklist |
| 26 | `LINKEDIN-PLAYBOOK.md` | Driving traffic from LinkedIn |
| 27 | `refresh-meta.py` | Updates the citation figures inside each page's `<head>` |

Uploading these does no harm, but they serve no purpose on the server.

---

## Your numbers — how they stay current

There are two places a citation figure appears, and they update differently.

**Visible figures on the page** — the big numbers in the stats strip, the
research page panels, and so on. These update **by themselves**, on every page
load, with no action from you. `assets/metrics.js` fetches the live figures
from a small GitHub repository and paints them in.

To switch that on, follow the five-minute setup in the separate
**`metrics-repo/`** folder's `README.md`. Until you do, the site shows the seed
values in `assets/scholar-metrics.json`, which is why that file is still here.

A figure can only ever go **up**. A failed scrape or a partially-indexed source
cannot pull your displayed numbers down — that rule is enforced in both the
browser and the scraper.

**Figures inside `<head>`** — the page titles, meta descriptions and structured
data that Google and LinkedIn read. JavaScript cannot update these, because
crawlers read the raw HTML before any script runs. Run this in the site folder
whenever you redeploy:

```bash
python refresh-meta.py            # fetches live figures, rewrites the files
python refresh-meta.py --dry-run  # preview, changes nothing
```

Or pass them by hand if you prefer:

```bash
python refresh-meta.py --h 86 --citations 104500 --i10 224 --pubs 551
```

Then re-upload whichever `.html` files it reports as changed.

---

## Quickest path to live

1. Upload items 1–23 to your host, structure intact.
2. **Set up Google Search Console and request indexing** — `VISIBILITY.md`,
   step 1. Nothing else works until this does.
3. Add `epiaidea.com` to your GitHub, Google Scholar and ORCID profiles —
   `VISIBILITY.md`, step 2. Twenty minutes, highest return available.
4. Check that `www.epiaidea.com` redirects to `epiaidea.com` —
   `VISIBILITY.md`, step 3.
5. Set up `metrics-repo/` so the numbers maintain themselves.
6. Run each page URL through <https://www.linkedin.com/post-inspector/> once.
