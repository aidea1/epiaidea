# Connecting LinkedIn to your website

Everything technical is already in place. This is the part that depends on you.

---

## What's built

**Link previews.** Every page has Open Graph tags with an absolute image URL,
`og:image:secure_url`, and explicit width/height. When you paste a link into a
LinkedIn post, it renders as a large image card with your headshot, the page
title, and the description — instead of a bare blue link.

**Follow + share bar** on all nine pages, above the footer. One button follows
your profile; the other opens LinkedIn's composer pre-filled with that page.

**UTM tracking.** Shared links carry
`?utm_source=linkedin&utm_medium=social&utm_campaign=share`, so once analytics
is connected you can see exactly which posts sent traffic and which pages
converted.

---

## First: clear LinkedIn's cache

LinkedIn caches a link preview permanently the first time it sees a URL. If you
ever shared epiaidea.com before these tags existed, it still has the old
version.

Go to **https://www.linkedin.com/post-inspector/**, paste each URL, click
Inspect. That forces a re-scrape. Do this once per page after you deploy.

---

## The rule that actually matters

**LinkedIn suppresses posts with external links in the body.** The algorithm
wants people to stay on-platform, so a post with a link in the main text reaches
noticeably fewer people.

The workaround everyone who does this well uses:

1. Write the post with no link at all. Deliver the full idea in the post itself.
2. Put the link in the **first comment**, immediately after posting.
3. Add one line at the end of the post: *"Full analysis linked in the comments."*

Alternatively, put the link in your **featured section** and your **profile
website field** — permanent, algorithm-neutral placements.

---

## Your profile as a funnel

Three fields do most of the work:

| Field | Change it to |
|---|---|
| **Website** | `epiaidea.com/services.html` — not the homepage. Send people to the page that converts. |
| **Headline** | Lead with what you do for people, not your title. "Epidemiologist \| Drug safety, digital surveillance & health policy evidence \| PharmD, PhD" |
| **Featured** | Pin three links: the consulting page, the book, and your best recent post. |

The About section should end with an invitation and the email address. People
who read to the bottom of your About section are your warmest possible leads.

---

## What to post

Your advantage is that you can say things practitioners can't get elsewhere. Two
posts a month, consistently, beats a burst and silence.

**Formats that work in this field:**

- *A signal explained.* Take a drug safety story in the news and explain what the
  data does and doesn't show. Links to `services.html`.
- *A method mistake.* "Three reasons a disproportionality result isn't evidence."
  Practitioners share this kind of post. Links to `digital-epidemiology.html`.
- *A policy result.* What happened when a state changed a law, and how you'd
  measure it. Links to `health-law.html`.
- *A passage from the book.* The memoir gives you something almost no academic
  has — narrative. Links to `book.html`.
- *A new paper, translated.* Not the abstract. What it means for someone making
  a decision this week.

**Structure:** first line is a hook that stands alone (LinkedIn truncates after
~200 characters). Then short paragraphs with line breaks. Then a question.
Then, in the comment, the link.

**Avoid:** posting the abstract, posting only the DOI, and posting nothing for
six weeks then five times in a day.

---

## Measuring it

Once analytics is live, watch three things:

1. **Sessions with `utm_source=linkedin`** — is posting working at all?
2. **Which landing page they hit** — tells you which topic attracts buyers
   rather than peers.
3. **Email clicks on `info@epiaidea.com`** — the only number that matters.

If a topic drives traffic but no enquiries, you are reaching academics. If a
quieter topic drives enquiries, post more of that.
