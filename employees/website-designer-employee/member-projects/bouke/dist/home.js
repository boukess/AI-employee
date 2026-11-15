// Home: starfield with a slow constellation, phone menu, card search, photo row.
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var btn = document.getElementById("h-menu");
  var drawer = document.getElementById("h-drawer");
  if (btn && drawer) btn.addEventListener("click", function () {
    var open = drawer.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  var form = document.getElementById("h-search");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = document.getElementById("h-q").value.trim().toLowerCase();
    var cards = document.querySelectorAll("#h-cards .h-card");
    var shown = 0;
    cards.forEach(function (c) {
      var hit = !q || (c.textContent + " " + (c.dataset.k || "")).toLowerCase().indexOf(q) >= 0;
      c.hidden = !hit; if (hit) shown++;
    });
    var none = document.getElementById("h-none"); if (none) none.hidden = shown > 0;
    document.getElementById("shop-h").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  });

  var q0 = new URLSearchParams(location.search).get("q");
  if (q0 && form) { document.getElementById("h-q").value = q0; form.dispatchEvent(new Event("submit", { cancelable: true })); }

  var row = document.getElementById("h-row");
  if (row) fetch("./portfolio.json", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : { items: [] }; })
    .catch(function () { return { items: [] }; })
    .then(function (d) {
      (d.items || []).forEach(function (it) {
        var a = document.createElement("a"); a.className = "h-tile"; a.href = "./work.html";
        var img = document.createElement("img"); img.src = it.image; img.alt = it.title || ""; img.loading = "lazy";
        var s = document.createElement("strong"); s.textContent = it.title || "";
        a.append(img, s); row.appendChild(a);
      });
    });

  var cv = document.getElementById("h-sky");
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext("2d"), stars = [], lines = [], w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  // ブーケ (the logo's katakana) drawn as constellation strokes, in unit space per glyph (y up).
  var GLYPHS = [
    // ブ: top bar, then the long stroke sweeping down-left, plus the two dakuten ticks
    [[[0.05,0.82],[0.78,0.82],[0.70,0.45],[0.45,0.15],[0.18,0.0]], [[0.84,1.0],[0.90,0.88]], [[0.96,1.0],[1.02,0.88]]],
    // ー: the long vowel bar
    [[[0.05,0.5],[0.9,0.5]]],
    // ケ: short left slash, top bar, then the falling right stroke
    [[[0.38,1.0],[0.05,0.58]], [[0.22,0.76],[0.95,0.76]], [[0.62,0.76],[0.58,0.42],[0.30,0.0]]]
  ];
  function size() {
    var r = cv.getBoundingClientRect(); w = r.width; h = r.height;
    cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = []; var n = Math.round(w * h / 2600);
    for (var i = 0; i < n; i++) stars.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.2 + 0.2, t: Math.random() * 6.28 });
    var gap = 0.28, span = GLYPHS.length + gap * (GLYPHS.length - 1);
    var s = Math.min(w * 0.5 / span, h * 0.26), ox = w / 2 - span * s / 2, oy = h * 0.34 - s / 2;
    lines = [];
    GLYPHS.forEach(function (g, gi) {
      var gx = ox + gi * (1 + gap) * s;
      g.forEach(function (stroke) {
        for (var k = 0; k + 1 < stroke.length; k++) {
          var p = stroke[k], q = stroke[k + 1];
          lines.push([gx + p[0] * s, oy + (1 - p[1]) * s, gx + q[0] * s, oy + (1 - q[1]) * s, k + 2 === stroke.length]);
        }
      });
    });
  }
  var start = performance.now();
  function frame(now) {
    var t = (now - start) / 1000;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < stars.length; i++) {
      var st = stars[i], a = reduce ? 0.8 : 0.45 + 0.4 * Math.sin(t * 1.3 + st.t);
      ctx.fillStyle = "rgba(235,240,255," + a + ")"; ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 6.283); ctx.fill();
    }
    var p = reduce ? 1 : Math.min(1, t / 3.5);
    ctx.strokeStyle = "rgba(240,244,255,0.85)"; ctx.lineWidth = 1.4; ctx.shadowColor = "rgba(190,210,255,0.9)"; ctx.shadowBlur = 8;
    var total = lines.length * p;
    for (var k = 0; k < lines.length && k < total; k++) {
      var L = lines[k], f = Math.min(1, total - k);
      ctx.beginPath(); ctx.moveTo(L[0], L[1]); ctx.lineTo(L[0] + (L[2] - L[0]) * f, L[1] + (L[3] - L[1]) * f); ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(L[0], L[1], 2.2, 0, 6.283); ctx.fill();
      if (L[4] && f >= 1) { ctx.beginPath(); ctx.arc(L[2], L[3], 2.2, 0, 6.283); ctx.fill(); }
    }
    ctx.shadowBlur = 0;
    if (!reduce) requestAnimationFrame(frame);
  }
  size(); window.addEventListener("resize", function () { size(); if (reduce) frame(performance.now()); });
  requestAnimationFrame(frame);
})();
