// Shared header for every page: phone menu and site search (searches run on the home page).
(function () {
  var btn = document.getElementById("h-menu");
  var drawer = document.getElementById("h-drawer");
  if (btn && drawer) btn.addEventListener("click", function () {
    var open = drawer.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  var form = document.getElementById("h-search");
  if (form && !document.getElementById("h-cards")) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = (document.getElementById("h-q") || {}).value || "";
    location.href = "./index.html" + (q.trim() ? "?q=" + encodeURIComponent(q.trim()) : "") + "#shop-h";
  });
})();
