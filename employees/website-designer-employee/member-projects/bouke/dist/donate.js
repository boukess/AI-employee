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

  // PayPal. With "paypalClientId" set in donate-config.json (the public Client
  // ID of a live PayPal REST app), the full PayPal checkout renders: PayPal,
  // Pay Later, PayPal Credit, Venmo and card, each shown only when PayPal says
  // the buyer is eligible. Without it, "paypalBusiness" (merchant ID) falls back
  // to a link to PayPal's hosted donate page. No PayPal secret lives on this site.
  var paypal = document.getElementById("donate-paypal");
  var paypalBox = document.getElementById("paypal-buttons");
  function readAmount() {
    var dollars = Number(input.value);
    if (!isFinite(dollars) || dollars < 1 || dollars > 10000) return null;
    return dollars.toFixed(2);
  }
  function donateLink(business) {
    if (!paypal) return;
    paypal.style.display = "";
    paypal.addEventListener("click", function () {
      var amount = readAmount();
      if (!amount) { setStatus("Enter an amount from $1 to $10,000."); return; }
      var q = new URLSearchParams({
        business: business, amount: amount, currency_code: "USD",
        item_name: "Donation to BOUKE (not tax deductible)",
        no_recurring: monthly.checked ? "0" : "1"
      });
      window.location.href = "https://www.paypal.com/donate?" + q.toString();
    });
  }
  function smartButtons(clientId, business) {
    var sdk = document.createElement("script");
    sdk.src = "https://www.paypal.com/sdk/js?" + new URLSearchParams({
      "client-id": clientId, currency: "USD", intent: "capture",
      components: "buttons,messages", "enable-funding": "paylater,credit,venmo"
    }).toString();
    sdk.onerror = function () { if (business) donateLink(business); };
    sdk.onload = function () {
      if (!window.paypal || !window.paypal.Buttons) { if (business) donateLink(business); return; }
      window.paypal.Buttons({
        style: { layout: "vertical", shape: "pill", label: "donate" },
        onClick: function (data, actions) {
          if (monthly.checked) { setStatus("Monthly giving runs on Stripe. Untick monthly to give once with PayPal."); return actions.reject(); }
          if (!readAmount()) { setStatus("Enter an amount from $1 to $10,000."); return actions.reject(); }
          return actions.resolve();
        },
        createOrder: function (data, actions) {
          return actions.order.create({
            purchase_units: [{
              amount: { currency_code: "USD", value: readAmount() },
              description: "Donation to BOUKE (not tax deductible)"
            }],
            application_context: { shipping_preference: "NO_SHIPPING", brand_name: "BOUKE" }
          });
        },
        onApprove: function (data, actions) {
          return actions.order.capture().then(function () {
            window.location.href = "./donate.html?thanks=1";
          });
        },
        onError: function () { setStatus("PayPal could not finish. No payment was taken. Try again or use Stripe."); }
      }).render(paypalBox);
    };
    document.head.appendChild(sdk);
  }
  fetch("./donate-config.json", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : {}; })
    .catch(function () { return {}; })
    .then(function (cfg) {
      var clientId = cfg && typeof cfg.paypalClientId === "string" ? cfg.paypalClientId.trim() : "";
      var business = cfg && typeof cfg.paypalBusiness === "string" ? cfg.paypalBusiness.trim() : "";
      if (clientId && paypalBox) smartButtons(clientId, business);
      else if (business) donateLink(business);
    });

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
