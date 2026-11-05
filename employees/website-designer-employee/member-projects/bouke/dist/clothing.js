(function () {
  // Local preview only. These are labelled example graphics, not live products.
  var SAMPLE = [
    {
      title: "Example field tee",
      price: "$48.00",
      image: "./images/example-sports-tee.svg",
      imageAlt: "Example graphic for a tee. Not a product photo.",
      url: "https://ykpvju-5y.myshopify.com/products/example-field-tee",
      available: true,
      example: true,
    },
    {
      title: "Example sideline cap",
      price: "$32.00",
      image: "./images/example-field-print.svg",
      imageAlt: "Example graphic for a cap. Not a product photo.",
      url: "https://ykpvju-5y.myshopify.com/products/example-sideline-cap",
      available: true,
      example: true,
    },
    {
      title: "Example away hoodie",
      price: "$64.00",
      image: "./images/example-hoodie.svg",
      imageAlt: "Example graphic for a hoodie. Not a product photo.",
      url: "https://ykpvju-5y.myshopify.com/products/example-away-hoodie",
      available: true,
      example: true,
    },
  ];

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function localPreview() {
    var host = location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1" && host !== "[::1]" && host !== "::1") return "";
    return new URLSearchParams(location.search).get("preview") || "";
  }

  function safeHttps(value) {
    if (typeof value !== "string" || !value) return "";
    try {
      var url = new URL(value, location.origin);
      if (url.protocol !== "https:") return "";
      return url.href;
    } catch (err) {
      return "";
    }
  }

  function safeImage(value) {
    if (typeof value !== "string" || !value) return "";
    if (value.indexOf("./images/") === 0) return value;
    return safeHttps(value);
  }

  function renderProducts(products, example) {
    var root = document.getElementById("shop-catalog");
    if (!root) return;
    var cards = [];
    products.forEach(function (product) {
      if (!product || typeof product.title !== "string" || !product.title.trim()) return;
      var href = safeHttps(product.url);
      if (!href) return;
      cards.push({ product: product, href: href });
    });
    if (!cards.length) return;
    root.textContent = "";
    root.dataset.state = "ready";
    if (example) {
      root.appendChild(el("p", "shop-notice", "Example placeholders on this local preview. These are not live products."));
    }
    var grid = el("div", "card-grid clothing-grid");
    cards.forEach(function (entry) {
      var product = entry.product;
      var card = el("article", "card shop-card");
      if (product.example) card.appendChild(el("p", "example-badge", "Example placeholder"));
      var image = safeImage(product.image);
      if (image) {
        var img = el("img");
        img.src = image;
        img.alt = typeof product.imageAlt === "string" && product.imageAlt.trim() ? product.imageAlt.trim() : product.title.trim();
        card.appendChild(img);
      } else {
        var fallback = el("div", "shop-photo-fallback");
        fallback.setAttribute("role", "img");
        fallback.setAttribute("aria-label", product.title.trim());
        card.appendChild(fallback);
      }
      card.appendChild(el("h3", "", product.title.trim()));
      if (typeof product.price === "string" && product.price.trim()) {
        card.appendChild(el("p", "shop-price", product.price.trim()));
      }
      var link = el("a", "btn btn-small", product.available === false ? "View on Shopify" : "Buy on Shopify");
      link.href = entry.href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      card.appendChild(link);
      grid.appendChild(card);
    });
    root.appendChild(grid);
  }

  function boot() {
    var mode = localPreview();
    if (mode === "products") {
      renderProducts(SAMPLE, true);
      return;
    }
    if (mode === "empty") return;
    fetch("/api/shopify-products", { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) throw new Error("catalog");
        return response.json();
      })
      .then(function (body) {
        var products = body && body.products;
        if (body && body.state === "ready" && Array.isArray(products) && products.length) {
          renderProducts(products, false);
        }
      })
      .catch(function () {});
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
