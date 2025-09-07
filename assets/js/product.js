// product.js
document.addEventListener("DOMContentLoaded", () => {
  // Leer producto seleccionado desde localStorage
  let raw = localStorage.getItem("selectedProduct");
  let product;
  try {
    product = raw ? JSON.parse(raw) : null;
  } catch (e) {
    product = null;
  }

  // Placeholder y fallback (si no hay selectedProduct)
  const PLACEHOLDER = "https://via.placeholder.com/600x600?text=Sin+imagen";
  const fallback = {
    title: "Figura Goku Super Saiyan",
    brand: "Bandai",
    category: "Anime",
    rating: "4.8 (156 reseñas)",
    price: 89900,
    oldprice: 119900,
    description: "Figura de acción de Goku en su transformación Super Saiyan. PVC, pintado a mano.",
    features: [
      "Altura: 15 cm",
      "Material: PVC de alta calidad",
      "Articulaciones móviles",
      "Efectos de energía incluidos",
      "Base incluida",
      "Edición limitada"
    ],
    stock: 8,
    images: [
      "../assets/img/imgProducts/FIGURA_GOKU_01.png",
      "../assets/img/imgProducts/FIGURA_GOKU_02.png",
      "../assets/img/imgProducts/FIGURA_GOKU_03.png"
    ]
  };

  if (!product) product = fallback;

  // Si product tiene solo `img` en vez de `images`, convertirlo a array
  if (!product.images || product.images.length === 0) {
    if (product.img) product.images = [product.img];
    else product.images = [PLACEHOLDER];
  }

  // Helpers
  const fmt = (n) => {
    const num = Number(n) || 0;
    try {
      return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(num);
    } catch (e) {
      return "$" + num;
    }
  };

  const $ = (id) => document.getElementById(id);

  // Elementos DOM
  const mainImg = $("product-img");
  const thumbsContainer = $("product-thumbnails");
  const titleEl = $("product-title");
  const brandEl = $("product-brand");
  const catEl = $("product-category");
  const ratingEl = $("product-rating");
  const priceEl = $("product-price");
  const oldPriceEl = $("product-oldprice");
  const discountEl = $("product-discount");
  const descEl = $("product-description");
  const featuresEl = $("product-features");
  const stockEl = $("product-stock");
  const qtyInput = $("quantity");
  const btnInc = $("increase-btn");
  const btnDec = $("decrease-btn");
  const addToCartBtn = $("add-to-cart-btn");

  // Llenar datos
  titleEl.textContent = product.title || "Producto";
  brandEl.textContent = product.brand || "";
  catEl.textContent = product.category || "";
  ratingEl.textContent = product.rating || "";
  priceEl.textContent = fmt(product.price);
  oldPriceEl.textContent = product.oldprice ? fmt(product.oldprice) : "";
  descEl.textContent = product.description || "";

  // descuento
  const priceNum = Number(product.price) || 0;
  const oldNum = Number(product.oldprice) || 0;
  if (oldNum && oldNum > priceNum) {
    const percent = Math.round(((oldNum - priceNum) / oldNum) * 100);
    discountEl.style.display = "inline-block";
    discountEl.textContent = `Ahorras ${fmt(oldNum - priceNum)} (${percent}% OFF)`;
  } else {
    discountEl.style.display = "none";
  }

  // features
  featuresEl.innerHTML = "";
  if (Array.isArray(product.features)) {
    product.features.forEach(f => {
      const li = document.createElement("li");
      li.innerHTML = `<i class="bi bi-dot me-2 text-info"></i> ${f}`;
      featuresEl.appendChild(li);
    });
  }

  // stock
  const stockNum = Number(product.stock) || 0;
  if (stockNum > 0) {
    stockEl.innerHTML = `<i class="bi bi-check-circle-fill text-success me-2"></i> En stock (${stockNum})`;
  } else {
    stockEl.innerHTML = `<i class="bi bi-x-circle-fill text-danger me-2"></i> Agotado`;
  }

  // galería (thumbnails) y main image
  mainImg.src = product.images[0] || PLACEHOLDER;
  thumbsContainer.innerHTML = "";
  product.images.forEach((src, idx) => {
    const img = document.createElement("img");
    img.src = src || PLACEHOLDER;
    img.className = "thumb";
    if (idx === 0) img.classList.add("selected");
    img.addEventListener("click", () => {
      mainImg.src = src || PLACEHOLDER;
      // marcar seleccionado
      thumbsContainer.querySelectorAll(".thumb").forEach(t => t.classList.remove("selected"));
      img.classList.add("selected");
    });
    thumbsContainer.appendChild(img);
  });

  // cantidad: lógica +/-
  let qty = 1;
  qtyInput.value = qty;

  btnInc.addEventListener("click", () => {
    if (stockNum && qty >= stockNum) return; // no subir si llega al stock
    qty++;
    qtyInput.value = qty;
  });

  btnDec.addEventListener("click", () => {
    if (qty > 1) qty--;
    qtyInput.value = qty;
  });

  // permitir editar input manualmente
  qtyInput.addEventListener("input", () => {
    let v = parseInt(qtyInput.value) || 1;
    if (v < 1) v = 1;
    if (stockNum && v > stockNum) v = stockNum;
    qty = v;
    qtyInput.value = qty;
  });

  // agregar al carrito (guarda en localStorage 'cart')
  addToCartBtn.addEventListener("click", () => {
    if (stockNum === 0) {
      alert("Lo sentimos, el producto está agotado.");
      return;
    }

    const cartRaw = localStorage.getItem("cart");
    const cart = cartRaw ? JSON.parse(cartRaw) : [];

    // item minimal info
    const item = {
      id: product.id || Date.now(),
      title: product.title,
      price: priceNum,
      qty: qty,
      img: product.images[0] || PLACEHOLDER
    };

    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Se agregaron ${qty} x ${product.title} al carrito.`);
  });

});
