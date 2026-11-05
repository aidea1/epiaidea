# Why the site isn't getting found, and what to do about it

Short version: **the site is not an SEO problem. It is an indexing and authority
problem.** The markup is clean — I checked. What is missing is evidence to
search engines that the site exists and is worth ranking.

Everything in Part 1 is free and takes about an hour of your time. Do that
before anything else. The on-site work I delivered matters, but it compounds
*after* Part 1, not instead of it.

---

## What I actually found

**1. The domain appears to be absent from the index.**

A `site:epiaidea.com` query returned no pages from your domain. A search for
`epiaidea.com Akshaya Bhagavathula` returned nothing about you either — fifteen
results, all about other people named Akshaya.

One caveat worth stating plainly: the search tool I have is not Google, so treat
this as a strong signal rather than proof. **Google Search Console settles it in
two minutes**, and that is step 1 below.

If the site genuinely is not indexed, that single fact explains the entire
problem. No amount of content, design, or keyword work matters while the pages
are not in the index.

**2. Your GitHub profile does not link to the site.**

The sidebar at `github.com/aidea1` links to `ndsu.edu`, Twitter, LinkedIn,
Google Scholar, and the *Annals of Epidemiology* editorial board. Not
`epiaidea.com`. That is a high-authority backlink you already own, sitting
unused. It takes thirty seconds to fix.

**3. Your NDSU page *does* link to the site — but to the `www` version.**

`ndsu.edu` lists `https://www.epiaidea.com/` under Links. That is a genuinely
valuable `.edu` backlink and the best one you have.

But every canonical tag on your site declares the **non-`www`** address
(`https://epiaidea.com/...`). If `www.epiaidea.com` does not 301-redirect to the
apex domain, that `.edu` link's value is split across two addresses that search
engines may treat as separate sites. Worth checking — see step 3.

**4. The technical SEO is already correct.**

Canonical tags, `robots.txt`, the sitemap, Open Graph, and structured data are
all in order and consistent. This is not where the problem is, and I did not
change it.

---

## Part 1 — Off-site. Do this first. One hour, free.

### 1. Google Search Console — today, before anything else

Go to `search.google.com/search-console`, add `epiaidea.com`, verify it (the
DNS TXT record method is the most reliable), then:

- Submit `https://epiaidea.com/sitemap.xml`
- Use **URL Inspection** on the homepage and click **Request Indexing**
- Check the **Pages** report for anything under "Not indexed"

This both fixes the problem and tells you whether it was the problem. Until
Search Console is connected you are guessing, and so am I. Do the same at
`bing.com/webmasters` — it takes five more minutes and feeds Bing, DuckDuckGo
and increasingly AI assistants.

### 2. The backlinks you already own

Each of these is a profile you control, on a domain search engines already
trust. Adding your URL costs minutes and is the single highest-return action
available to you.

| Where | What to change |
|---|---|
| **GitHub** (`github.com/aidea1`) | Set the profile **Website** field to `https://epiaidea.com`. Currently points to ndsu.edu. |
| **Google Scholar** | Add `epiaidea.com` to the **Homepage** field in your profile settings. |
| **ORCID** (`0000-0002-0581-7808`) | Add it under **Websites & Social Links**. ORCID records are crawled heavily. |
| **LinkedIn** | Website field → `epiaidea.com/services.html`, not the homepage. Send people to the page that converts. |
| **ResearchGate / Publons / Web of Science** | Personal website field. |
| **Annals of Epidemiology** editorial bio | If the journal lets you supply a personal URL, supply it. An Elsevier-hosted link carries real weight. |
| **Temple CPHLR** fellowship page | Ask whether your profile can link to the site. |
| **Barnes & Noble author page** | Author bios usually accept a URL. |
| **Your email signature** | Free, and it is how most consulting enquiries will actually find you. |

Do not buy links or use a "SEO service." For an academic consulting site,
profile links plus real citations from people in your field are the only
durable route, and you already have access to most of them.

### 3. Check the `www` redirect

In a browser, open `https://www.epiaidea.com`. Watch the address bar.

- If it lands on `https://epiaidea.com` → correct, nothing to do.
- If it stays on `www.` → ask your host to add a **301 redirect** from
  `www.epiaidea.com` to `epiaidea.com`. Every host has a one-click setting for
  this. That consolidates the NDSU `.edu` link onto the address your canonical
  tags declare.

### 4. Tell LinkedIn to re-read your pages

LinkedIn caches a link preview permanently the first time it sees a URL. Paste
each page URL into `linkedin.com/post-inspector` once after you deploy, so your
posts render as image cards instead of bare blue links.

---

## Part 2 — On-site. Already built, in the files I sent.

### The real content gap

Every page on the site answered the question *"who is Akshaya Bhagavathula?"*
Almost nobody types that. People type:

- *"is disproportionality analysis evidence of causation"*
- *"ROR vs PRR FAERS interpretation"*
- *"cartodb positron api key required"*
- *"folium map blank tiles"*

A site that answers no questions has nothing to rank for, however impressive its
credentials. So I added a place for answers.

**`insights.html`** — a methods-notes section, now in the main navigation, with
two full articles:

1. **`insight-carto-basemap-api-key.html`** — the CARTO basemap failure you hit,
   written up properly. This is the one I would publish first. It is timely,
   almost nobody has written it up, you have genuine first-hand diagnostic
   detail, and the people searching for it are exactly the people you want
   finding your site. Low competition, high relevance.

2. **`insight-disproportionality-not-causation.html`** — why an ROR does not
   license a causal claim. Evergreen search demand, and it demonstrates the
   judgment you are selling on the pharma and drug-safety side far better than a
   credentials list does.

**Both are drafts in your voice. Read them before publishing.** I wrote them
from your expertise and the work in this project, but they go out under your
name and should sound like you. The disproportionality piece in particular makes
methodological claims you may want to sharpen or qualify.

One note a month in this section does more for visibility over a year than any
redesign. Two a month is better. Consistency beats volume.

### Dead-end links removed

All nine GitHub dashboard links are gone from the homepage. The cards keep their
descriptive text — that text is doing real SEO work and shows the range of your
applied work — but they now lead to a consulting CTA instead of out to
dashboards you cannot style or control.

Two GitHub links I deliberately **kept**, because neither is a dashboard:

- `index.html` and `research.html` → `github.com/aidea1/agent-epidemiology`,
  labelled "View on GitHub." A source repository reads as credibility, not as a
  broken dashboard. Delete the two `<a class="impl-link" ...>` lines if you
  disagree.
- `atlas.html` → `github.com/ashemag/human-atlas`. This is the attribution for
  the anatomical meshes. Leave it; it is a licensing obligation.

### Navigation

"Insights" is now in the nav on all 13 pages. To keep it to a single row I
removed the **"Home"** item — the EPIAIDEA wordmark on the left already links to
the homepage, which is the standard convention. If you want it back, add this
line to the `<nav>` block on each page and the nav will wrap to two rows:

```html
<a href="index.html">Home</a>
```

I also tightened nav link padding from `14px` to `9px` horizontally and set the
nav to wrap rather than overflow on narrow screens. **No font sizes were
changed anywhere.**

---

## Part 3 — What to measure

Connect analytics (Plausible and Fathom are privacy-friendly and need no cookie
banner; GA4 works with the banner already on the site). Then watch three
numbers, and nothing else:

1. **Pages indexed** in Search Console. Should climb to 13 and stay there. If it
   does not, nothing else matters yet.
2. **Queries** in Search Console's Performance tab. This tells you what people
   actually search before they land on you — far more useful than guessing.
3. **Clicks on `akshaya.bhagavathula@gmail.com`.** The only number that converts to work.

If a topic drives traffic but no enquiries, you are reaching academics. If a
quieter topic drives enquiries, write more of that.

---

## Realistic expectations

Indexing: days to a few weeks after Search Console submission.
Profile backlinks registering: two to six weeks.
Articles ranking for specific queries: one to three months, and only for
narrow, low-competition terms at first — which is exactly what you want, because
those searchers have a specific problem you can solve.

You will not rank for "epidemiologist." You can realistically own
"disproportionality signal causation" and "cartodb positron api key required"
within a quarter, and those bring the right people.
