# EPIAIDEA — Website

Complete site: 10 pages, assets, SEO files, security headers, and the
automated Google Scholar metrics system.

---

## Files

```
index.html          Homepage — hero, book banner, stats, implementations
about.html          Background and methodology
services.html       Consulting & analytics  ← revenue page
health-law.html     Health law / legal epidemiology vertical
digital-epidemiology.html   Digital epi / infodemiology vertical
research.html       Research portfolio, live PubMed feed, citation chart
book.html           THE DENOMINATOR — book landing page
media.html          Press coverage and press kit
contact.html        Contact, collaboration areas, FAQ

assets/
  headshot.jpg              600×600 profile photo
  headshot_sm.jpg           200×200 thumbnail
  epiaidea_logo.png/.svg    Logo (title image)
  metrics.js                Site-wide metric updater
  scholar-metrics.json      ← THE ONLY FILE YOU EDIT FOR NUMBERS

LINKEDIN-PLAYBOOK.md  How to drive traffic from LinkedIn
sitemap.xml         Submit to Google Search Console
robots.txt          Search engine directives
_headers            Server security headers (Netlify / Cloudflare Pages)

.github/workflows/
  scholar-metrics.yml       Weekly automatic Scholar refresh
```

---

## Deploying

Upload the whole folder to your host, keeping the structure intact.
`assets/` must stay a subfolder next to the HTML files.

**Netlify or Cloudflare Pages** — drag the folder in. `_headers` works
automatically and applies HSTS, X-Frame-Options and Permissions-Policy.

**Apache** — `_headers` won't work. Add this to `.htaccess` instead:

```apache
Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains"
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
```

**Nginx** — add each as `add_header ... always;` inside your server block.

---

## Updating your citation numbers

Edit **`assets/scholar-metrics.json`** only. Every page reads from it —
homepage stats, research impact cards, consulting credential bar,
contact sidebar, and the book page all update together.

```json
{
  "citations": 100000,
  "h_index": 84,
  "i10_index": 218,
  "publications": 547
}
```

### Making it automatic

Put this folder in a GitHub repository. `.github/workflows/scholar-metrics.yml`
runs **twice a week** (Monday and Thursday, 06:00 UTC) and on demand from the
repo's **Actions** tab. Each run:

1. Reads your Scholar profile (3 retries, since Google rate-limits).
2. Writes `assets/scholar-metrics.json`.
3. Rewrites the numbers in every `.html` title/meta tag and the
   `assets/metrics.js` fallback, then commits.

Step 3 matters: JavaScript updates what **visitors** see, but Google reads the
raw HTML, so page titles and meta descriptions have to be rewritten in the file
or your search snippets go stale.

**Safety guards.** A value that is zero, missing, or more than 10% below the
current figure is rejected — a partial scrape looks like a huge drop, and this
stops it wiping your numbers. If every source fails, nothing changes.

**If Google blocks it.** Scraping from GitHub's IPs fails sometimes. Get a
SerpAPI key, add it as a repo secret named `SERPAPI_KEY`
(Settings → Secrets and variables → Actions), and the workflow falls back to it
automatically. No other change needed.

> Google Scholar publishes no API and blocks cross-origin browser requests, so
> the numbers cannot be read live from the page. This scheduled job is the only
> reliable route.

OpenAlex is also queried live in the browser as a secondary source, but it can
only *raise* a number, never lower it — it indexes far less than Scholar.

### Changing the numbers by hand

Edit `assets/scholar-metrics.json` and commit. Every page follows.

## Before you go live

- [ ] Download the book cover from Barnes & Noble and save it as
      `assets/book-cover.jpg`, then replace the two `cdn.shopify.com`
      URLs in `index.html` and `book.html`. Right now it is hot-linked
      and will break if B&N changes it.
- [ ] Add consulting prices to `services.html` — the biggest remaining
      conversion gap.
- [ ] Add a booking link (Cal.com or Calendly) to the consulting CTAs.
- [ ] Submit `sitemap.xml` in Google Search Console.
- [ ] Run every URL through https://www.linkedin.com/post-inspector/ once,
      to clear LinkedIn's cached link previews.
- [ ] Set your LinkedIn profile website field to `epiaidea.com/services.html`.
- [ ] Paste an analytics snippet into the marked placeholder in the cookie
      banner script. It only runs after consent. Plausible is cookieless
      and would let you drop the banner entirely.
- [ ] Enable 2FA on your domain registrar and hosting, and turn on
      registrar domain lock. This matters more than anything on the page.

---

## Notes

Consulting is positioned independently — no university is named anywhere on
the site, which avoids implying institutional endorsement of private work.

The research page seeds five real publications immediately, then replaces
them with the live PubMed feed when it loads. Chart.js is guarded, so a CDN
failure degrades one panel instead of blanking the page.
