// Employee area. The login is checked by /api/employee-login on the server;
// this page never sees or stores the password. Budget and test store items
// are saved in this browser only.
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var money = function (n) { return (n < 0 ? "-$" : "$") + (Math.round(Math.abs(n) * 100) / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("bouke_" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("bouke_" + k, JSON.stringify(v)); } catch (e) {} }
  };
  var income = 0;

  var btn = $("h-menu"), drawer = $("h-drawer");
  if (btn && drawer) btn.addEventListener("click", function () {
    var open = drawer.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  var search = $("h-search");
  if (search) search.addEventListener("submit", function (e) { e.preventDefault(); location.href = "./index.html"; });

  function showLogin() { $("e-app").hidden = true; $("e-login").hidden = false; $("e-user").focus(); }
  function showApp() { $("e-login").hidden = true; $("e-app").hidden = false; renderBudget(); renderTests(); }

  function cell(tr, text, cls) { var td = document.createElement("td"); if (cls) td.className = cls; if (text instanceof Node) td.appendChild(text); else td.textContent = text; tr.appendChild(td); return td; }
  function pill(text, ok) { var s = document.createElement("span"); s.className = "e-pill " + (ok ? "ok" : "warn"); s.textContent = text; return s; }

  function loadFinance() {
    $("fin-asof").textContent = "Loading";
    return fetch("/api/employee-finance", { credentials: "same-origin", cache: "no-store" })
      .then(function (r) {
        if (r.status === 401) { showLogin(); return null; }
        return r.json();
      })
      .then(function (d) {
        if (!d) return;
        showApp();
        var s = d.stripe || {}, p = d.paypal || {}, q = d.quickbooks || {};
        income = (s.connected ? s.total : 0) + (p.connected ? p.total : 0);
        $("fin-asof").textContent = "Updated " + new Date(d.asOf).toLocaleString();
        $("f-total").textContent = money(income);
        $("f-pack").textContent = s.connected ? money(s.packages) : "—";
        $("f-don").textContent = s.connected ? money(s.donations) : "—";
        $("f-pp").textContent = p.connected ? money(p.total) : "—";
        var src = $("f-src"); src.replaceChildren();
        [["Stripe", s], ["PayPal", p], ["QuickBooks", q]].forEach(function (x) {
          var tr = document.createElement("tr");
          cell(tr, x[0]); cell(tr, pill(x[1].connected ? "Connected" : "Not connected", x[1].connected));
          cell(tr, x[1].connected && typeof x[1].total === "number" ? money(x[1].total) : "—", "n");
          cell(tr, x[1].connected ? (x[1].payments || 0) + " payments" : (x[1].note || ""));
          src.appendChild(tr);
        });
        var rec = [].concat(s.recent || [], p.recent || []).sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 12);
        var body = $("f-recent"); body.replaceChildren();
        if (!rec.length) { var tr = document.createElement("tr"); cell(tr, "No payments in the last 30 days yet."); body.appendChild(tr); }
        rec.forEach(function (r) { var tr = document.createElement("tr"); cell(tr, r.date); cell(tr, r.kind); cell(tr, money(r.amount), "n"); body.appendChild(tr); });
        renderBudget();
      })
      .catch(function () { $("fin-asof").textContent = "Could not load the numbers. Try Refresh."; });
  }

  $("e-login").addEventListener("submit", function (e) {
    e.preventDefault();
    var go = $("e-go"); go.disabled = true; $("e-err").textContent = "";
    fetch("/api/employee-login", {
      method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: $("e-user").value, password: $("e-pass").value })
    }).then(function (r) { return r.json().then(function (b) { return { ok: r.ok, b: b }; }); })
      .then(function (res) {
        go.disabled = false; $("e-pass").value = "";
        if (!res.ok) { $("e-err").textContent = (res.b && res.b.error) || "Could not sign in."; return; }
        loadFinance();
      })
      .catch(function () { go.disabled = false; $("e-err").textContent = "Could not reach the server. Try again."; });
  });
  $("e-out").addEventListener("click", function () {
    fetch("/api/employee-login", { method: "DELETE", credentials: "same-origin" }).finally(showLogin);
  });
  $("e-refresh").addEventListener("click", loadFinance);

  // Budget: rent plus items to buy, against 30 day income.
  function renderBudget() {
    var rent = Number(store.get("rent", 0)) || 0;
    var items = store.get("buy", []);
    if (document.activeElement !== $("b-rent")) $("b-rent").value = rent ? rent : "";
    var list = $("b-list"); list.replaceChildren();
    var spend = rent;
    items.forEach(function (it, i) {
      spend += Number(it.cost) || 0;
      var tr = document.createElement("tr");
      cell(tr, it.name); cell(tr, money(Number(it.cost) || 0), "n");
      var del = document.createElement("button"); del.className = "e-del"; del.type = "button"; del.textContent = "Remove"; del.setAttribute("aria-label", "Remove " + it.name);
      del.addEventListener("click", function () { items.splice(i, 1); store.set("buy", items); renderBudget(); });
      cell(tr, del);
      list.appendChild(tr);
    });
    var left = income - spend;
    $("b-sum").textContent = "Rent " + money(rent) + " plus items " + money(spend - rent) + " = " + money(spend) + ". Income last 30 days " + money(income) + ".";
    $("f-left").textContent = money(left);
    $("f-left").style.color = left < 0 ? "var(--h-bad)" : "var(--h-ok)";
    $("b-bar").style.width = (income > 0 ? Math.min(100, spend / income * 100) : (spend > 0 ? 100 : 0)) + "%";
  }
  $("b-rent").addEventListener("input", function () { store.set("rent", Number($("b-rent").value) || 0); renderBudget(); });
  $("b-add").addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("b-name").value.trim(), cost = Number($("b-cost").value);
    if (!name || !isFinite(cost) || cost < 0) return;
    var items = store.get("buy", []); items.push({ name: name, cost: cost }); store.set("buy", items);
    $("b-name").value = ""; $("b-cost").value = ""; renderBudget();
  });

  // Test store: candidate products with margin.
  function renderTests() {
    var items = store.get("tests", []);
    var list = $("t-list"); list.replaceChildren();
    if (!items.length) { var tr0 = document.createElement("tr"); cell(tr0, "No test items yet. Add one above."); list.appendChild(tr0); }
    items.forEach(function (it, i) {
      var m = it.price > 0 ? (it.price - it.cost) / it.price * 100 : 0;
      var tr = document.createElement("tr");
      cell(tr, it.name); cell(tr, money(it.cost), "n"); cell(tr, money(it.price), "n"); cell(tr, Math.round(m) + "%", "n");
      cell(tr, pill(m >= 35 ? "Ready to list" : "Raise price", m >= 35));
      var del = document.createElement("button"); del.className = "e-del"; del.type = "button"; del.textContent = "Remove"; del.setAttribute("aria-label", "Remove " + it.name);
      del.addEventListener("click", function () { items.splice(i, 1); store.set("tests", items); renderTests(); });
      cell(tr, del);
      list.appendChild(tr);
    });
  }
  $("t-add").addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("t-name").value.trim(), cost = Number($("t-cost").value), price = Number($("t-price").value);
    if (!name || !isFinite(cost) || !isFinite(price) || price <= 0) return;
    var items = store.get("tests", []); items.push({ name: name, cost: cost, price: price }); store.set("tests", items);
    $("t-name").value = ""; $("t-cost").value = ""; $("t-price").value = ""; renderTests();
  });

  loadFinance();
})();
