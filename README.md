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
then runs every Monday at 06:00 UTC, reads your Scholar profile, and commits
the new numbers. Trigger it manually any time from the repo's **Actions** tab.

Safety guards: the job refuses values that are zero or more than 10% below
the current figure, so a blocked or partial scrape cannot wipe your numbers.
If it fails, nothing changes.

> Google Scholar has no API and blocks browser requests, so metrics cannot be
> read live from the page. This scheduled job is the reliable route. If Google
> starts blocking GitHub's IPs, switch to SerpAPI's Scholar Author endpoint —
> about ten lines in the workflow.

OpenAlex is also queried live from the browser as a secondary source, but it
can only *raise* a number, never lower it — it indexes far less than Scholar.

---

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
