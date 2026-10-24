(function () {
  var pages = Array.prototype.slice.call(document.querySelectorAll(".page"));
  var tabs = document.getElementById("tabs");
  pages.forEach(function (page, i) {
    var id = page.getAttribute("data-tab") || ("tab-" + i);
    var label = page.getAttribute("data-label") || id;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = label;
    btn.setAttribute("data-target", id);
    if (i === 0) {
      btn.className = "active";
      page.classList.add("active");
    }
    btn.addEventListener("click", function () {
      pages.forEach(function (p) { p.classList.remove("active"); });
      Array.prototype.forEach.call(tabs.querySelectorAll("button"), function (b) { b.className = ""; });
      page.classList.add("active");
      btn.className = "active";
    });
    tabs.appendChild(btn);
    page.id = id;
  });
})();
