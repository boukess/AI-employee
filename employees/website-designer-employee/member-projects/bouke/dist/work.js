// Draws the Work page from portfolio.json. Only real BOUKE work goes in that file.
// Item shape: { "title": "", "kind": "short|long form|sports photo|product photo",
//   "image": "./images/work/file.jpg", "video": "https://youtube.com/... (optional)", "note": "" }
(function () {
  var root = document.getElementById("work-app");
  if (!root) return;
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
        if (it.image) { var img = el("img"); img.src = it.image; img.alt = it.title || "BOUKE work"; img.loading = "lazy"; img.style.width = "100%"; img.style.borderRadius = "8px"; c.appendChild(img); }
        if (it.kind) c.appendChild(el("p", "eyebrow", it.kind));
        c.appendChild(el("h3", "", it.title || "Untitled"));
        if (it.note) c.appendChild(el("p", "", it.note));
        if (it.video) { var a = el("a", "text-link", "Watch"); a.href = it.video; a.rel = "noopener noreferrer"; a.target = "_blank"; c.appendChild(a); }
        root.appendChild(c);
      });
    });
})();
