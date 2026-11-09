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
