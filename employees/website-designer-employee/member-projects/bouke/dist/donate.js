// Donate page: sends only an amount and a monthly flag. The server validates both
// and Stripe hosts the payment page.
(function () {
  var form = document.getElementById("donate-form");
  if (!form) return;
  var input = document.getElementById("donate-amount");
  var monthly = document.getElementById("donate-monthly");
  var submit = document.getElementById("donate-submit");
  var status = document.getElementById("donate-status");
  var params = new URLSearchParams(location.search);
  if (params.get("thanks")) document.getElementById("donate-thanks").hidden = false;
  if (params.get("canceled")) document.getElementById("donate-canceled").hidden = false;

  function setStatus(text) { status.textContent = text || ""; }

  Array.prototype.forEach.call(document.querySelectorAll("[data-amount]"), function (b) {
    b.addEventListener("click", function () { input.value = b.getAttribute("data-amount"); input.focus(); });
  });

  fetch("/api/create-donation-session")
    .then(function (r) { return r.json(); })
    .then(function (info) {
      if (!info.checkoutAvailable) { submit.disabled = true; setStatus(info.message); }
      else if (info.testMode) setStatus("Test mode: no real charge is made.");
    })
    .catch(function () {});

  // PayPal: a link to PayPal's hosted donate page. No keys live on this site.
  // Set "paypalBusiness" in donate-config.json to the PayPal account email or
  // merchant ID; the button stays hidden until it is set.
  var paypal = document.getElementById("donate-paypal");
  if (paypal) {
    fetch("./donate-config.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : {}; })
      .catch(function () { return {}; })
      .then(function (cfg) {
        var business = cfg && typeof cfg.paypalBusiness === "string" ? cfg.paypalBusiness.trim() : "";
        if (!business) return;
        paypal.style.display = "";
        paypal.addEventListener("click", function () {
          var dollars = Number(input.value);
          if (!isFinite(dollars) || dollars < 1 || dollars > 10000) { setStatus("Enter an amount from $1 to $10,000."); return; }
          var q = new URLSearchParams({
            business: business,
            amount: dollars.toFixed(2),
            currency_code: "USD",
            item_name: "Donation to BOUKE (not tax deductible)",
            no_recurring: monthly.checked ? "0" : "1"
          });
          window.location.href = "https://www.paypal.com/donate?" + q.toString();
        });
      });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var dollars = Number(input.value);
    if (!isFinite(dollars) || dollars < 1 || dollars > 10000) { setStatus("Enter an amount from $1 to $10,000."); return; }
    var cents = Math.round(dollars * 100);
    submit.disabled = true;
    setStatus("Opening Stripe checkout...");
    fetch("/api/create-donation-session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ amountCents: cents, monthly: monthly.checked })
    })
      .then(function (r) { return r.json().then(function (body) { return { ok: r.ok, body: body }; }); })
      .then(function (res) {
        var url = res.body && res.body.url;
        if (res.ok && typeof url === "string" && url.indexOf("https://checkout.stripe.com/") === 0) { window.location.href = url; return; }
        submit.disabled = false;
        setStatus((res.body && res.body.error) || "Checkout could not start. Try again in a moment.");
      })
      .catch(function () { submit.disabled = false; setStatus("Checkout could not start. Try again in a moment."); });
  });
})();
