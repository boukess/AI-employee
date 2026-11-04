(function () {
  var CART_KEY = "bouke-cart-v1";
  var catalog = null;
  var checkoutAvailable = false;
  var statusMessage = "Checkout is not available yet. The store is coming soon.";
  var chosenVariants = {};

  function money(cents, currency) {
    var amount = (Number(cents) / 100).toFixed(2);
    if (currency === "usd") return "$" + amount;
    return amount + " " + String(currency || "");
  }

  function readCart() {
    try {
      var parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (line) {
        return line && typeof line.id === "string" && Number.isInteger(line.quantity);
      });
    } catch (err) {
      return [];
    }
  }

  function writeCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    render();
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function productById(id) {
    var products = (catalog && catalog.products) || [];
    for (var i = 0; i < products.length; i++) if (products[i].id === id) return products[i];
    return null;
  }

  function variantById(product, variantId) {
    var variants = product.variants || [];
    for (var i = 0; i < variants.length; i++) if (variants[i].id === variantId) return variants[i];
    return null;
  }

  function unitPrice(product, variantId) {
    var variant = variantById(product, variantId);
    if (variant && Number.isInteger(variant.priceCents)) return variant.priceCents;
    return product.priceCents;
  }

  function priceLabel(product, cents) {
    var text = money(cents, catalog.currency);
    if (product.billing === "monthly") return text + " a month";
    if (product.unitLabel) return text + " per " + product.unitLabel;
    return text + " one time";
  }

  function noteFor(product) {
    if (product.billing === "monthly") return "Monthly subscription. It renews every month until you cancel. Stripe shows the payment methods that support subscriptions.";
    if (product.example) return "Example placeholder. Nothing is delivered.";
    if (product.unitLabel) return "Set the quantity in the cart to the number of " + product.unitLabel + "s. Card, Affirm, or Klarna may be offered at checkout.";
    return "One payment. Card, Affirm, or Klarna may be offered at checkout.";
  }

  function capFor(id) {
    var product = productById(id);
    if (product && Number.isInteger(product.maxQuantity)) return product.maxQuantity;
    return catalog.maxQuantity || 10;
  }

  function selectedId() {
    return decodeURIComponent((location.hash || "").replace(/^#/, ""));
  }

  function addItem(id, variantId, quantity) {
    var cart = readCart();
    var cap = capFor(id);
    var found = null;
    cart.forEach(function (line) {
      if (line.id === id && (line.variantId || "") === (variantId || "")) found = line;
    });
    var next = Math.min(cap, (found ? found.quantity : 0) + quantity);
    if (found) found.quantity = next;
    else cart.push({ id: id, variantId: variantId || "", quantity: next });
    writeCart(cart);
  }

  function setQty(id, variantId, quantity) {
    var cart = readCart();
    var cap = capFor(id);
    var next = [];
    cart.forEach(function (line) {
      if (line.id === id && (line.variantId || "") === (variantId || "")) {
        if (quantity >= 1) next.push({ id: id, variantId: variantId || "", quantity: Math.min(cap, quantity) });
      } else {
        next.push(line);
      }
    });
    writeCart(next);
  }

  function renderGrid(root) {
    var grid = el("div", "card-grid shop-grid");
    (catalog.products || []).forEach(function (product) {
      var card = el("article", "card shop-card");
      if (product.images && product.images[0]) {
        var img = el("img");
        img.src = product.images[0];
        img.alt = product.example ? "Example graphic for " + product.name + ". Not a product photo." : "";
        card.appendChild(img);
      }
      if (product.example) card.appendChild(el("p", "example-badge", "Example placeholder"));
      if (product.lane) card.appendChild(el("p", "lane-index", product.lane));
      card.appendChild(el("h3", "", product.name));
      card.appendChild(el("p", "shop-price", priceLabel(product, product.priceCents)));
      card.appendChild(el("p", "", product.description));
      card.appendChild(el("p", "muted", noteFor(product)));
      var button = el("button", "btn btn-small", (product.variants || []).length ? "Choose options" : "Add to cart");
      button.type = "button";
      button.addEventListener("click", function () {
        if ((product.variants || []).length) {
          location.hash = encodeURIComponent(product.id);
          return;
        }
        addItem(product.id, "", 1);
      });
      card.appendChild(button);
      grid.appendChild(card);
    });
    root.appendChild(grid);
  }

  function renderDetail(root, product) {
    var panel = el("article", "card shop-detail");
    var back = el("button", "btn btn-ghost btn-small", "Back to all packages");
    back.type = "button";
    back.addEventListener("click", function () {
      location.hash = "";
    });
    panel.appendChild(back);
    if (product.images && product.images[0]) {
      var img = el("img");
      img.src = product.images[0];
      img.alt = product.example ? "Example graphic for " + product.name + ". Not a product photo." : "";
      panel.appendChild(img);
    }
    if (product.example) panel.appendChild(el("p", "example-badge", "Example placeholder"));
    if (product.lane) panel.appendChild(el("p", "lane-index", product.lane));
    panel.appendChild(el("h2", "", product.name));
    panel.appendChild(el("p", "shop-price", priceLabel(product, product.priceCents)));
    panel.appendChild(el("p", "", product.description));
    var variantId = chosenVariants[product.id] || "";
    if (variantId) {
      panel.querySelector(".shop-price").textContent = priceLabel(product, unitPrice(product, variantId));
    }
    if ((product.variants || []).length) {
      var label = el("label", "shop-option");
      label.appendChild(el("span", "", "Option"));
      var select = el("select");
      select.name = "variant";
      var placeholder = el("option", "", "Choose");
      placeholder.value = "";
      select.appendChild(placeholder);
      product.variants.forEach(function (variant) {
        var option = el("option", "", variant.label);
        option.value = variant.id;
        select.appendChild(option);
      });
      if (variantId) select.value = variantId;
      select.addEventListener("change", function () {
        variantId = select.value;
        chosenVariants[product.id] = variantId;
        var price = unitPrice(product, variantId);
        panel.querySelector(".shop-price").textContent = priceLabel(product, price);
      });
      label.appendChild(select);
      panel.appendChild(label);
    }
    var actions = el("div", "form-actions");
    var add = el("button", "btn", "Add to cart");
    add.type = "button";
    add.addEventListener("click", function () {
      if ((product.variants || []).length && !variantId) {
        setStatus("Choose an option before adding this to the cart.");
        return;
      }
      addItem(product.id, variantId, 1);
      setStatus("Added to cart. The cart total is a preview. Stripe charges the price set on the server.");
    });
    actions.appendChild(add);
    panel.appendChild(actions);
    panel.appendChild(el("p", "muted", noteFor(product)));
    root.appendChild(panel);
  }

  function renderCart(root) {
    var panel = el("aside", "cart-panel");
    panel.id = "cart";
    panel.appendChild(el("h2", "", "Cart"));
    var cart = readCart().filter(function (line) { return productById(line.id); });
    if (!cart.length) {
      panel.appendChild(el("p", "muted", "Your cart is empty."));
    }
    var subtotal = 0;
    var monthlyTotal = 0;
    cart.forEach(function (line, index) {
      var product = productById(line.id);
      var variant = variantById(product, line.variantId);
      var price = unitPrice(product, line.variantId);
      if (product.billing === "monthly") monthlyTotal += price * line.quantity;
      else subtotal += price * line.quantity;
      var row = el("div", "cart-line");
      var title = product.name + (variant ? " (" + variant.label + ")" : "");
      row.appendChild(el("p", "cart-line-name", title));
      row.appendChild(el("p", "muted", priceLabel(product, price)));
      var qty = el("div", "qty");
      var minus = el("button", "", "-");
      minus.type = "button";
      minus.setAttribute("aria-label", "Decrease quantity of " + title);
      minus.addEventListener("click", function () { setQty(line.id, line.variantId, line.quantity - 1); });
      var count = el("span", "", String(line.quantity));
      count.setAttribute("aria-live", "polite");
      var plus = el("button", "", "+");
      plus.type = "button";
      plus.setAttribute("aria-label", "Increase quantity of " + title);
      plus.addEventListener("click", function () { setQty(line.id, line.variantId, line.quantity + 1); });
      qty.appendChild(minus);
      qty.appendChild(count);
      qty.appendChild(plus);
      row.appendChild(qty);
      var remove = el("button", "text-link cart-remove", "Remove");
      remove.type = "button";
      remove.addEventListener("click", function () { setQty(line.id, line.variantId, 0); });
      row.appendChild(remove);
      panel.appendChild(row);
    });
    if (cart.length) {
      if (subtotal) panel.appendChild(el("p", "shop-subtotal", "One time preview " + money(subtotal, catalog.currency)));
      if (monthlyTotal) panel.appendChild(el("p", "shop-subtotal", "Monthly preview " + money(monthlyTotal, catalog.currency) + " a month"));
      if (monthlyTotal) panel.appendChild(el("p", "muted", "A cart with a monthly package checks out as a card subscription. One time items in the same cart are added to the first invoice."));
      panel.appendChild(el("p", "muted", "Stripe recalculates this from the server price list before you pay."));
    }
    var button = el("button", "btn", checkoutAvailable ? "Continue to Stripe" : "Checkout coming soon");
    button.type = "button";
    button.disabled = !checkoutAvailable || cart.length === 0;
    button.addEventListener("click", function () { startCheckout(button); });
    panel.appendChild(button);
    var status = el("p", "form-status");
    status.id = "shop-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.textContent = statusMessage;
    panel.appendChild(status);
    root.appendChild(panel);
  }

  function setStatus(text) {
    statusMessage = text;
    var node = document.getElementById("shop-status");
    if (node) node.textContent = text;
  }

  function render() {
    var main = document.getElementById("shop-app");
    if (!main) return;
    main.textContent = "";
    if (!catalog) {
      main.appendChild(el("p", "shop-notice", "The shop list could not be loaded."));
      return;
    }
    var layout = el("div", "shop-layout");
    var stage = el("div");
    var current = productById(selectedId());
    if (current) renderDetail(stage, current);
    else renderGrid(stage);
    layout.appendChild(stage);
    renderCart(layout);
    main.appendChild(layout);
    var count = document.getElementById("cart-count");
    if (count) {
      var total = readCart().reduce(function (sum, line) {
        return productById(line.id) ? sum + line.quantity : sum;
      }, 0);
      count.textContent = total ? "Cart (" + total + ")" : "Cart";
    }
  }

  function startCheckout(button) {
    var cart = readCart().filter(function (line) { return productById(line.id); }).map(function (line) {
      return { id: line.id, variantId: line.variantId || "", quantity: line.quantity };
    });
    button.disabled = true;
    setStatus("Opening Stripe. Payment details stay on Stripe's page.");
    fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ items: cart }),
    }).then(function (response) {
      return response.json().then(function (body) {
        return { ok: response.ok, body: body };
      });
    }).then(function (result) {
      var url = result.body && result.body.url;
      if (result.ok && typeof url === "string" && url.indexOf("https://checkout.stripe.com/") === 0) {
        window.location.href = url;
        return;
      }
      button.disabled = !checkoutAvailable;
      setStatus((result.body && result.body.error) || "Checkout could not start. Try again in a moment.");
    }).catch(function () {
      button.disabled = !checkoutAvailable;
      setStatus("Checkout could not start. Try again in a moment.");
    });
  }

  function boot() {
    window.addEventListener("hashchange", render);
    fetch("./products.json", { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) throw new Error("catalog");
        return response.json();
      })
      .then(function (data) {
        catalog = data;
        render();
      })
      .catch(function () {
        catalog = null;
        render();
      });
    fetch("/api/create-checkout-session")
      .then(function (response) { return response.json(); })
      .then(function (body) {
        checkoutAvailable = Boolean(body && body.checkoutAvailable);
        if (body && body.message) statusMessage = body.message;
        render();
      })
      .catch(function () {
        checkoutAvailable = false;
        render();
      });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
