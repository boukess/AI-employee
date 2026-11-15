// Shared header for every page: the menu (three lines), the cart badge and site search.
(function () {
  var btn = document.getElementById("h-menu");
  var drawer = document.getElementById("h-drawer");
  function setOpen(open) {
    if (!btn || !drawer) return;
    drawer.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (btn && drawer) {
    btn.addEventListener("click", function (e) { e.stopPropagation(); setOpen(drawer.hidden); });
    drawer.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("click", function (e) { if (!drawer.hidden && !drawer.contains(e.target) && e.target !== btn) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !drawer.hidden) { setOpen(false); btn.focus(); } });
  }
  window.boukeMenu = { close: function () { setOpen(false); } };

  function cartCount() {
    var n = 0;
    try { JSON.parse(localStorage.getItem("bouke-cart-v1") || "[]").forEach(function (l) { if (l && Number.isInteger(l.quantity)) n += l.quantity; }); } catch (e) { n = 0; }
    var b = document.getElementById("h-cart-n");
    if (b) { b.textContent = n > 99 ? "99+" : String(n); b.hidden = n < 1; }
  }
  cartCount();
  window.addEventListener("storage", cartCount);
  window.boukeCartRefresh = cartCount;

  var form = document.getElementById("h-search");
  if (form && !document.getElementById("h-cards")) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = (document.getElementById("h-q") || {}).value || "";
    location.href = "./index.html" + (q.trim() ? "?q=" + encodeURIComponent(q.trim()) : "") + "#shop-h";
  });
})();
