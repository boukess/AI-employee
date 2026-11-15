// Pay rent: sends only the amount and a unit or name. The server validates both
// and Stripe hosts the payment page.
(function () {
  var form = document.getElementById("rent-form");
  if (!form) return;
  var amount = document.getElementById("rent-amount");
  var ref = document.getElementById("rent-ref");
  var submit = document.getElementById("rent-submit");
  var status = document.getElementById("rent-status");
  var params = new URLSearchParams(location.search);
  if (params.get("paid")) document.getElementById("rent-paid").hidden = false;
  if (params.get("canceled")) document.getElementById("rent-canceled").hidden = false;
  function say(t) { status.textContent = t || ""; }

  fetch("/api/create-rent-session")
    .then(function (r) { return r.json(); })
    .then(function (info) {
      if (!info.checkoutAvailable) { submit.disabled = true; say(info.message); }
      else if (info.testMode) say("Test mode: no real charge is made.");
    })
    .catch(function () {});

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var dollars = Number(amount.value);
    if (!isFinite(dollars) || dollars < 1 || dollars > 20000) { say("Enter an amount from $1 to $20,000."); amount.focus(); return; }
    if (ref.value.trim().length < 2) { say("Enter your unit or name so the payment can be matched."); ref.focus(); return; }
    submit.disabled = true;
    say("Opening Stripe checkout...");
    fetch("/api/create-rent-session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ amountCents: Math.round(dollars * 100), reference: ref.value.trim() })
    })
      .then(function (r) { return r.json().then(function (b) { return { ok: r.ok, b: b }; }); })
      .then(function (res) {
        var url = res.b && res.b.url;
        if (res.ok && typeof url === "string" && url.indexOf("https://checkout.stripe.com/") === 0) { window.location.href = url; return; }
        submit.disabled = false; say((res.b && res.b.error) || "Checkout could not start. Try again in a moment.");
      })
      .catch(function () { submit.disabled = false; say("Checkout could not start. Try again in a moment."); });
  });
})();
