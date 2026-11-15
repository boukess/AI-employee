// Draws the Work page from portfolio.json. Only real BOUKE work goes in that file.
// Item shape: { "title": "", "kind": "short|long form|sports photo|product photo",
//   "image": "./images/work/file.jpg", "video": "https://youtube.com/... (optional)", "note": "",
//   "width": 1200, "height": 1600 (the photo's pixel size, optional, holds its space while it loads) }
(function () {
  var root = document.getElementById("work-app");
  if (!root) return;
  // Photo motion. Each photo develops into view once it is loaded and on screen, then
  // leans toward the pointer on hover. Nothing here changes layout or adds a control.
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var watch = null, batch = 0, batchTimer = 0;
  function show(card) {
    if (card._shown || !card._seen || !card._ready) return;
    card._shown = true;
    if (watch) watch.unobserve(card);
    // Photos that arrive together come in one after another, not all at once.
    card.style.setProperty("--work-delay", (batch++ * 90) + "ms");
    clearTimeout(batchTimer);
    batchTimer = setTimeout(function () { batch = 0; }, 120);
    card.classList.add("is-in");
    // Hover motion waits until the entrance has finished, so the two never fight.
    setTimeout(function () { card.classList.add("is-set"); }, 2000 + (batch - 1) * 90);
  }
  if (!calm && "IntersectionObserver" in window) {
    watch = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target._seen = e.isIntersecting; show(e.target); });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  }
  function animate(card, frame, img) {
    if (!watch) return;
    card.classList.add("work-card");
    function ready() { card._ready = true; show(card); }
    img.addEventListener("load", ready);
    img.addEventListener("error", ready);
    watch.observe(card);
    frame.addEventListener("pointermove", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      var r = frame.getBoundingClientRect();
      frame.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
      frame.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
    });
  }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; }
  fetch("./portfolio.json", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : { items: [] }; })
    .catch(function () { return { items: [] }; })
    .then(function (data) {
      var items = (data && data.items) || [];
      root.textContent = "";
      if (!items.length) {
        var c = el("article", "card");
        c.appendChild(el("h3", "", "New work is on the way"));
        c.appendChild(el("p", "muted", "Edits and photos are added here as they are finished. Packages are open now."));
        root.appendChild(c);
        return;
      }
      items.forEach(function (it) {
        var c = el("article", "card");
        if (it.image) {
          var frame = el("div", "work-photo");
          var img = el("img"); img.alt = it.title || "BOUKE work"; img.loading = "lazy";
          if (it.width && it.height) { img.width = it.width; img.height = it.height; }
          frame.appendChild(img); c.appendChild(frame);
          animate(c, frame, img);
          img.src = it.image;
        }
        if (it.kind) c.appendChild(el("p", "eyebrow", it.kind));
        c.appendChild(el("h3", "", it.title || "Untitled"));
        if (it.note) c.appendChild(el("p", "", it.note));
        if (it.video) { var a = el("a", "text-link", "Watch"); a.href = it.video; a.rel = "noopener noreferrer"; a.target = "_blank"; c.appendChild(a); }
        root.appendChild(c);
      });
    });
})();
