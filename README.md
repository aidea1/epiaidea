# scholar-metrics

One JSON file holding Akshaya Bhagavathula's current Google Scholar figures,
refreshed automatically twice a week. `epiaidea.com` reads it at page load, so
the citation count and h-index on the website update themselves without the
site being redeployed.

```
https://raw.githubusercontent.com/aidea1/scholar-metrics/main/metrics.json
```

## Why this repo exists separately from the site

Google Scholar publishes no API, disallows crawling in `robots.txt`, and sends
no CORS header. A browser cannot read it — any in-page `fetch()` of
`scholar.google.com` fails silently. The only reliable route is a scheduled
job running on a server, writing the numbers somewhere the browser *can* read.

`raw.githubusercontent.com` sends `Access-Control-Allow-Origin: *`, so the
website can read this file from any host — GitHub Pages, Netlify, Cloudflare,
cPanel, anywhere. That is the whole point of keeping it here rather than in the
site folder: **the numbers update even if the website is never redeployed.**

## Setup — once, about five minutes

1. Create a new **public** repo under the `aidea1` account named
   `scholar-metrics`. Public matters: `raw.githubusercontent.com` will not serve
   a private repo to a browser.
2. Upload the contents of this folder (`metrics.json`, `scripts/`,
   `.github/workflows/`) and commit.
3. Open the **Actions** tab, select *Refresh Google Scholar metrics*, and click
   **Run workflow**. This both proves it works and writes today's real figures.
4. Open the raw URL above in a browser. If you see JSON, the website is done —
   nothing to change on `epiaidea.com`.

If step 3 reports that Scholar blocked the scrape, re-run it; GitHub's IP
ranges get rate-limited intermittently. If it keeps failing, add a
[SerpAPI](https://serpapi.com) key under **Settings → Secrets and variables →
Actions** as `SERPAPI_KEY`; the script uses it automatically as a fallback.

## What the website does with it

`assets/metrics.js` fetches this file, the site's own
`assets/scholar-metrics.json`, and the last values it cached in the browser,
then displays **whichever is highest**. Two consequences worth knowing:

- A figure is never blank and never flickers, even offline.
- A number can only go up. A failed scrape that returns `0`, or a source that
  has only partially indexed the profile, cannot pull the displayed figure down.

The scraper applies the same rule server-side: a value more than 10% below
what is already on file is rejected as a bad scrape rather than committed.

## Updating the figures by hand

Editing `metrics.json` in the GitHub web editor and committing is enough. The
website picks it up within the hour (`metrics.js` cache-busts hourly).

## What this does *not* update

The citation figures inside `<title>`, `<meta name="description">` and the
JSON-LD blocks in each page's `<head>`. Those are read by Google and LinkedIn
from the raw HTML before any JavaScript runs, so they have to be rewritten in
the files themselves. Run `refresh-meta.py` in the site folder when you
redeploy — see the site's `START-HERE.md`.
