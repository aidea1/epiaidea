/* ============================================================
   EPIAIDEA — live scholarly metrics
   ------------------------------------------------------------
   Updates every metric on every page from ONE source.

   Resolution order:
     1. assets/scholar-metrics.json  (real Google Scholar figures,
        refreshed weekly by GitHub Actions)
     2. OpenAlex API                 (live, free, no key — used only
        to ratchet a number UPWARD if it is higher than the file)
     3. Hard-coded FALLBACK below    (so the page is never blank)

   Why not read Google Scholar directly?
   Scholar publishes no API and blocks cross-origin browser requests.
   Any in-page fetch of scholar.google.com fails silently. The JSON
   file + scheduled job is the only reliable way to keep real Scholar
   numbers current.

   Markup usage:
     <span data-metric="citations"></span>
     <span data-metric="h_index"></span>
     <span data-metric="i10_index"></span>
     <span data-metric="publications"></span>
     <span data-metric="updated"></span>
   Optional: data-format="plus"   → 98,310+
             data-format="short"  → 98K+
             data-prefix="h-index "
   ============================================================ */
(function () {
  'use strict';

  var FALLBACK = {
    citations: 98310,
    h_index: 84,
    i10_index: 218,
    publications: 547,
    last_updated: '2026-08-26'
  };

  var ORCID = '0000-0002-0581-7808';

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
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || target < 100) {
      el.textContent = prefix + format(target, mode);
      return;
    }
    var start = null, DUR = 1100;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / DUR, 1);
      var eased = 1 - Math.pow(1 - p, 3);           // easeOutCubic
      el.textContent = prefix + format(Math.floor(target * eased), mode);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + format(target, mode);
    }
    requestAnimationFrame(step);
  }

  // ---------- paint values into the DOM ----------
  function paint(data) {
    var nodes = document.querySelectorAll('[data-metric]');
    if (!nodes.length) return;

    nodes.forEach(function (el) {
      var key = el.getAttribute('data-metric');
      var mode = el.getAttribute('data-format') || 'comma';
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

      // Animate only when scrolled into view
      if ('IntersectionObserver' in window) {
        var seen = false;
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting && !seen) {
              seen = true;
              countUp(el, val, mode, prefix);
              io.disconnect();
            }
          });
        }, { threshold: 0.25 });
        io.observe(el);
        el.textContent = prefix + format(val, mode); // immediate value if JS observer never fires
      } else {
        el.textContent = prefix + format(val, mode);
      }
    });

    document.dispatchEvent(new CustomEvent('epiaidea:metrics', { detail: data }));
  }

  // ---------- data sources ----------
  function fromFile() {
    return fetch('assets/scholar-metrics.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('no file'); return r.json(); });
  }

  function fromOpenAlex() {
    // Free, CORS-enabled, no API key. Indexes differently from Scholar
    // (generally lower), so it is only ever used to RAISE a value.
    return fetch('https://api.openalex.org/authors/orcid:' + ORCID +
                 '?select=cited_by_count,works_count,summary_stats')
      .then(function (r) { if (!r.ok) throw new Error('openalex'); return r.json(); })
      .then(function (j) {
        var s = j.summary_stats || {};
        return {
          citations: j.cited_by_count,
          publications: j.works_count,
          h_index: s.h_index,
          i10_index: s.i10_index
        };
      });
  }

  function merge(base, extra) {
    var out = {};
    Object.keys(base).forEach(function (k) { out[k] = base[k]; });
    if (!extra) return out;
    // Ratchet: only take the live number if it is genuinely higher.
    ['citations', 'h_index', 'i10_index', 'publications'].forEach(function (k) {
      if (typeof extra[k] === 'number' && extra[k] > (out[k] || 0)) out[k] = extra[k];
    });
    return out;
  }

  // ---------- run ----------
  function init() {
    paint(FALLBACK); // paint instantly so nothing is ever blank

    fromFile()
      .catch(function () { return FALLBACK; })
      .then(function (fileData) {
        var base = merge(FALLBACK, fileData);
        base.last_updated = fileData.last_updated || FALLBACK.last_updated;
        paint(base);

        return fromOpenAlex()
          .then(function (live) {
            var merged = merge(base, live);
            merged.last_updated = base.last_updated;
            if (JSON.stringify(merged) !== JSON.stringify(base)) paint(merged);
          })
          .catch(function () { /* offline or blocked — file values stand */ });
      })
      .catch(function () { /* everything failed — FALLBACK already painted */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
