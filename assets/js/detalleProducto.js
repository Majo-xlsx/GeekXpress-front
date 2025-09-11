document.addEventListener("click", (e) => {
  // Evitar clics en botones de carrito
  if (e.target.closest(".btn-agregar-carrito, .product-btn")) {
    return;
  }

  // Buscar tarjeta de producto
  const card = e.target.closest(".product-card, .product-card-inner");
  const cardv2 = e.target.closest(".product-card-no");
  if (!card) return;
  if (cardv2) return;

  const inner = card.classList.contains("product-card-inner") ? card : card.querySelector(".product-card-inner") || card;

  let product = null;

  // Si tiene data-id, buscar en productos (catálogo)
  if (card.dataset && card.dataset.id) {
    const id = card.dataset.id;
    if (typeof getAllProductsForRender === "function") {
      const allProducts = getAllProductsForRender();
      product = allProducts.find(p => p.id == id) || null;
    }
  }

  // Si no encontró producto (index), construir desde el DOM
  if (!product) {
    const nombre = inner.querySelector(".product-title, .card-title")?.textContent?.trim() || "Producto";
    const precioTexto = inner.querySelector(".price-offer, .precio-oferta")?.textContent || "0";
    const precio = parseInt(precioTexto.replace(/[$.,]/g, ""), 10) || 0;
    const imagen = inner.querySelector(".product-image, .card-img-top")?.src || "";
    const descripcion = inner.querySelector(".product-desc, .card-text")?.textContent?.trim() || "";

    const generatedId = nombre.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") + "-" + Date.now();

    product = { id: card.dataset.id || generatedId, nombre, precio, imagen, descripcion };

    if (!card.dataset.id) card.dataset.id = product.id;
  }

  localStorage.setItem("selectedProduct", JSON.stringify(product));
  console.log("selectedProduct guardado:", product);

  // Ruta correcta según ubicación actual
  const target = location.pathname.includes("/pages/") ? "product.html" : "pages/product.html";
  window.location.href = target;
});
