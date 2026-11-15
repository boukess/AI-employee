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
  // A "B" drawn as a constellation, in unit space.
  var B = [[0,0],[0,1],[0,1],[0.55,1],[0.55,1],[0.75,0.88],[0.75,0.88],[0.75,0.64],[0.75,0.64],[0.55,0.52],[0.55,0.52],[0,0.52],[0.55,0.52],[0.8,0.4],[0.8,0.4],[0.8,0.13],[0.8,0.13],[0.58,0],[0.58,0],[0,0]];
  function size() {
    var r = cv.getBoundingClientRect(); w = r.width; h = r.height;
    cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = []; var n = Math.round(w * h / 2600);
    for (var i = 0; i < n; i++) stars.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.2 + 0.2, t: Math.random() * 6.28 });
    var s = Math.min(w, h) * 0.42, ox = w / 2 - s * 0.4, oy = h * 0.42 - s / 2;
    lines = [];
    for (var j = 0; j < B.length; j += 2) lines.push([ox + B[j][0] * s, oy + (1 - B[j][1]) * s, ox + B[j + 1][0] * s, oy + (1 - B[j + 1][1]) * s]);
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
    }
    ctx.shadowBlur = 0;
    if (!reduce) requestAnimationFrame(frame);
  }
  size(); window.addEventListener("resize", function () { size(); if (reduce) frame(performance.now()); });
  requestAnimationFrame(frame);
})();
