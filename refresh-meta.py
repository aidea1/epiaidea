#!/usr/bin/env python3
"""
refresh-meta.py — rewrite the citation figures baked into each page's <head>.

Why this exists
---------------
`assets/metrics.js` keeps the *visible* numbers current by fetching them at
page load. It cannot touch `<title>`, `<meta name="description">`,
`og:description`, `twitter:description` or the JSON-LD blocks, because Google
and LinkedIn read those straight out of the raw HTML before any JavaScript
runs. Those have to be edited in the files.

So: run this once whenever you redeploy the site. It pulls the current figures
from the metrics repo and rewrites every `<head>` mention in place.

Usage
-----
    python refresh-meta.py            # fetch live figures, rewrite files
    python refresh-meta.py --dry-run  # show what would change, touch nothing
    python refresh-meta.py --h 86 --citations 104000 --i10 224 --pubs 551

No third-party packages needed. If the network is unavailable it falls back to
assets/scholar-metrics.json, and you can always pass the numbers by hand.
"""
import argparse
import json
import pathlib
import re
import sys
import urllib.request

REMOTE = "https://raw.githubusercontent.com/aidea1/scholar-metrics/main/metrics.json"
LOCAL = pathlib.Path("assets/scholar-metrics.json")
HERE = pathlib.Path(__file__).resolve().parent


def fetch():
    try:
        with urllib.request.urlopen(REMOTE, timeout=15) as r:
            print(f"Figures from {REMOTE}")
            return json.load(r)
    except Exception as e:                                  # noqa: BLE001
        print(f"Could not reach the metrics repo ({e}).", file=sys.stderr)
    try:
        data = json.loads((HERE / LOCAL).read_text(encoding="utf-8"))
        print(f"Falling back to {LOCAL}")
        return data
    except Exception as e:                                  # noqa: BLE001
        sys.exit(f"No figures available: {e}")


def rewrite(text, m):
    """Replace every <head> spelling of the four figures."""
    cit = f"{m['citations']:,}"
    subs = [
        # h-index 84  /  h-index: 84
        (r"(h-index[:\s]+)\d+(?:,\d{3})*",            lambda x: x.group(1) + str(m["h_index"])),
        # 100,000+ citations
        (r"\d+(?:,\d{3})*\+?(\s+citations)",          lambda x: cit + "+" + x.group(1)),
        # i-10 index 218  /  i10 index 218  /  i10-index 218
        (r"(i-?10[-\s]index[:\s]+)\d+(?:,\d{3})*",    lambda x: x.group(1) + str(m["i10_index"])),
        # 547 publications / 547 publication
        (r"\d+(?:,\d{3})*(\s+publications?)",         lambda x: f"{m['publications']:,}" + x.group(1)),
    ]
    n = 0
    for pat, repl in subs:
        text, k = re.subn(pat, repl, text, flags=re.IGNORECASE)
        n += k
    return text, n


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--h", type=int)
    ap.add_argument("--citations", type=int)
    ap.add_argument("--i10", type=int)
    ap.add_argument("--pubs", type=int)
    a = ap.parse_args()

    if all(v is not None for v in (a.h, a.citations, a.i10, a.pubs)):
        m = {"h_index": a.h, "citations": a.citations,
             "i10_index": a.i10, "publications": a.pubs}
        print("Using figures passed on the command line.")
    else:
        m = fetch()

    print(f"  citations {m['citations']:,} · h-index {m['h_index']} · "
          f"i10 {m['i10_index']} · publications {m['publications']}\n")

    total_files = 0
    for p in sorted(HERE.glob("*.html")):
        src = p.read_text(encoding="utf-8")
        # Only the <head> — never rewrite body prose, which metrics.js owns.
        split = src.find("</head>")
        if split == -1:
            continue
        head, body = src[:split], src[split:]
        new_head, n = rewrite(head, m)
        if new_head == head:
            continue
        print(f"  {'[dry-run] ' if a.dry_run else ''}{p.name}: {n} figure(s) updated")
        total_files += 1
        if not a.dry_run:
            p.write_text(new_head + body, encoding="utf-8")

    # Keep the deployed seed file in step too.
    seed = HERE / LOCAL
    if seed.exists() and not a.dry_run:
        d = json.loads(seed.read_text(encoding="utf-8"))
        d.update({k: m[k] for k in ("citations", "h_index", "i10_index", "publications")})
        if m.get("last_updated"):
            d["last_updated"] = m["last_updated"]
        seed.write_text(json.dumps(d, indent=2) + "\n", encoding="utf-8")
        print(f"  {LOCAL}: reseeded")

    print(f"\n{total_files} page(s) {'would be ' if a.dry_run else ''}updated.")
    if total_files and not a.dry_run:
        print("Re-upload the changed .html files.")


if __name__ == "__main__":
    main()
