/* ============================================================
   EPIAIDEA — live scholarly metrics  (v2)
   ------------------------------------------------------------
   One number, updated in one place, reflected on every page.

   Resolution order (first success wins, then ratcheted upward):
     1. REMOTE  — metrics.json in a GitHub repo, served over
                  raw.githubusercontent.com. Updated twice weekly by
                  a GitHub Action that scrapes Google Scholar.
                  This is the source that makes the site update
                  itself NO MATTER WHERE epiaidea.com is hosted.
     2. LOCAL   — /assets/scholar-metrics.json, deployed with the site.
                  Used when REMOTE is unreachable, and as the seed on
                  a first visit.
     3. CACHE   — the last good values, kept in localStorage.
     4. FALLBACK— hard-coded below, so a figure is never blank.

   Ratchet rule: a source may only RAISE a value, never lower it.
   Citation counts do not go down; a lower number means a failed
   scrape or a partially-indexed source, not a real decline.

   Why not read Google Scholar from the page?
   Scholar publishes no API, disallows crawling in robots.txt, and
   sends no CORS header, so any in-page fetch fails silently. A
   scheduled server-side job writing to a JSON file is the only
   reliable route. That job is .github/workflows/scholar-metrics.yml.

   Markup:
     <span data-metric="citations"    data-format="plus"></span>
     <span data-metric="h_index"      data-prefix="h-index "></span>
     <span data-metric="i10_index"></span>
     <span data-metric="publications"></span>
     <span data-metric="updated"></span>
   Formats: data-format="plus" → 100,000+ · "short" → 100K+
   ============================================================ */
(function () {
  'use strict';

  /* ---- EDIT THIS ONE LINE if you rename the metrics repo ---- */
  var REMOTE = 'https://raw.githubusercontent.com/aidea1/scholar-metrics/main/metrics.json';
  /* ----------------------------------------------------------- */

  var LOCAL    = '/assets/scholar-metrics.json';
  var LOCAL_REL= 'assets/scholar-metrics.json';   // if the site is served from a subpath
  var CACHE_KEY = 'epiaidea_metrics_v2';
  var KEYS = ['citations', 'h_index', 'i10_index', 'publications'];

  var FALLBACK = {
    citations: 100000,
    h_index: 84,
    i10_index: 218,
    publications: 547,
    last_updated: '2026-11-05'
  };

  // ---------- formatting ----------
  function comma(n) { return n.toLocaleString('en-US'); }

  function short(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M+';
    if (n >= 1000) return Math.floor(n / 1000) + 'K+';
    return String(n);
  }

  function format(value, mode) {
    if (mode === 'short') return short(value);
    if (mode === 'plus') return comma(value) + '+';
    return comma(value);
  }

  // ---------- animated count-up ----------
  function countUp(el, target, mode, prefix) {
    var reduced = window.matchMedia &&
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || target < 100) {
      el.textContent = prefix + format(target, mode);
      return;
    }
    var start = null, DUR = 1100;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / DUR, 1);
      var eased = 1 - Math.pow(1 - p, 3);            // easeOutCubic
      el.textContent = prefix + format(Math.floor(target * eased), mode);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + format(target, mode);
    }
    requestAnimationFrame(step);
  }

  // ---------- paint values into the DOM ----------
  var animated = [];   // elements already counted up, so a later repaint is silent

  function paint(data) {
    var nodes = document.querySelectorAll('[data-metric]');
    if (!nodes.length) return;

    Array.prototype.forEach.call(nodes, function (el) {
      var key    = el.getAttribute('data-metric');
      var mode   = el.getAttribute('data-format') || 'comma';
      var prefix = el.getAttribute('data-prefix') || '';

      if (key === 'updated') {
        var d = data.last_updated || FALLBACK.last_updated;
        try {
          el.textContent = new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          });
        } catch (e) { el.textContent = d; }
        return;
      }

      var val = data[key];
      if (typeof val !== 'number' || !isFinite(val)) return;

      // Already animated once? Just swap the text in, no second animation.
      if (animated.indexOf(el) !== -1) {
        el.textContent = prefix + format(val, mode);
        return;
      }

      el.textContent = prefix + format(val, mode);   // correct value is in the DOM immediately

      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            io.disconnect();
            if (animated.indexOf(el) !== -1) return;
            animated.push(el);
            countUp(el, val, mode, prefix);
          });
        }, { threshold: 0.25 });
        io.observe(el);
      }
    });

    try {
      document.dispatchEvent(new CustomEvent('epiaidea:metrics', { detail: data }));
    } catch (e) { /* older browsers */ }
  }

  // ---------- ratchet ----------
  function merge(base, extra) {
    var out = {};
    Object.keys(base).forEach(function (k) { out[k] = base[k]; });
    if (!extra) return out;
    KEYS.forEach(function (k) {
      var v = extra[k];
      if (typeof v === 'number' && isFinite(v) && v > (out[k] || 0)) out[k] = v;
    });
    // Keep the most recent date we have seen.
    if (extra.last_updated && (!out.last_updated || extra.last_updated > out.last_updated)) {
      out.last_updated = extra.last_updated;
    }
    return out;
  }

  // ---------- cache ----------
  // Upper bounds purely as a corruption guard. The ratchet means a bad high
  // value would otherwise persist in one visitor's browser indefinitely.
  var CEILING = { citations: 5000000, h_index: 300, i10_index: 5000, publications: 5000 };

  function sane(data) {
    if (!data || typeof data !== 'object') return null;
    var out = {}, any = false;
    KEYS.forEach(function (k) {
      var v = data[k];
      if (typeof v === 'number' && isFinite(v) && v > 0 && v <= CEILING[k]) {
        out[k] = v; any = true;
      }
    });
    if (data.last_updated) out.last_updated = data.last_updated;
    return any ? out : null;
  }

  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      return raw ? sane(JSON.parse(raw)) : null;
    } catch (e) { return null; }
  }

  function writeCache(data) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch (e) { /* private mode */ }
  }

  // ---------- fetch helpers ----------
  function getJSON(url, opts) {
    return fetch(url, opts || {}).then(function (r) {
      if (!r.ok) throw new Error(url + ' → ' + r.status);
      return r.json();
    });
  }

  function fromRemote() {
    // Cache-bust per hour: fresh enough to matter, cheap enough for the CDN.
    var bust = Math.floor(Date.now() / 3600000);
    return getJSON(REMOTE + '?v=' + bust, { cache: 'no-cache', mode: 'cors' });
  }

  function fromLocal() {
    return getJSON(LOCAL, { cache: 'no-cache' })
      .catch(function () { return getJSON(LOCAL_REL, { cache: 'no-cache' }); });
  }

  // ---------- run ----------
  function init() {
    // Best value we can show with zero network: cache, else fallback.
    var current = merge(FALLBACK, readCache());
    paint(current);

    // Local file and remote file in parallel; whichever is higher wins.
    var settled = 0;
    function done(data) {
      settled++;
      if (data) {
        var next = merge(current, data);
        if (JSON.stringify(next) !== JSON.stringify(current)) {
          current = next;
          paint(current);
        }
      }
      if (settled === 2) writeCache(current);
    }

    fromLocal().then(function (d) { done(sane(d) && Object.assign(sane(d), { last_updated: d.last_updated })); },
              function () { done(null); });
    fromRemote().then(function (d) { done(sane(d) && Object.assign(sane(d), { last_updated: d.last_updated })); },
               function () { done(null); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
