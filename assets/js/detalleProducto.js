// detalleProducto.js
document.addEventListener("click", (e) => {
  // Evitar clics en botones de carrito o similares
  if (e.target.closest(".btn-agregar-carrito, .product-btn")) return;

  // Buscar tarjeta de producto
  const card = e.target.closest(".product-card, .product-card-inner, .product-card-no");
  if (!card) return;

  const productId = card.dataset.id;
  let product = null;

  // Si hay ID, buscar el producto completo en products
  if (productId) {
    const rawProducts = localStorage.getItem("products");
    const allProducts = rawProducts ? JSON.parse(rawProducts) : [];
    const prodFromStorage = allProducts.find(p => p.id === productId);

    if (prodFromStorage) {
      product = {
        ...prodFromStorage, // copiar todos los campos
        imagen: prodFromStorage.imagen || (prodFromStorage.imagenes && prodFromStorage.imagenes[0]) || ""
      };
    }
  }

  // Si no se encontró en products, intentar reconstruir desde el DOM
  if (!product) {
    const inner = card.classList.contains("product-card-inner") ? card : card.querySelector(".product-card-inner") || card;

    const nombre = inner.querySelector(".product-title, .card-title")?.textContent?.trim() || "Producto";
    const precioTexto = inner.querySelector(".price-offer, .precio-oferta")?.textContent || "0";
    const precio = parseInt(precioTexto.replace(/[$.,]/g, ""), 10) || 0;
    const imagen = inner.querySelector(".product-image, .card-img-top")?.src || "";
    const descripcion = inner.querySelector(".product-desc, .card-text")?.textContent?.trim() || "";

    const generatedId = nombre.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") + "-" + Date.now();

    product = {
      id: card.dataset.id || generatedId,
      nombre,
      precio,
      imagen,
      descripcion,
      imagenes: [imagen] // fallback
    };

    if (!card.dataset.id) card.dataset.id = product.id;
  }

  // Guardar en localStorage
  localStorage.setItem("selectedProduct", JSON.stringify(product));
  console.log("selectedProduct guardado:", product);

  // Redirigir al detalle del producto
  const target = location.pathname.includes("/pages/") ? "product.html" : "pages/product.html";
  window.location.href = target;
});
