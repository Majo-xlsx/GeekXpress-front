// product.js (corregido y robusto)
document.addEventListener("DOMContentLoaded", () => {
  const PLACEHOLDER = "https://via.placeholder.com/600x600?text=Sin+imagen";
  const $ = (id) => document.getElementById(id);

  const fmt = (n) => {
    const num = Number(n) || 0;
    try {
      return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(num);
    } catch {
      return "$" + num;
    }
  };

  const safeParseJSON = (raw, fallback = null) => {
    try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
  };

  // Cargar producto
  const raw = localStorage.getItem("selectedProduct");
  const product = safeParseJSON(raw, null);

  if (!product) {
    console.warn("No se encontró producto en localStorage (selectedProduct).");
    return;
  }

  // Normalizar imagenes
  if (!product.imagenes || !Array.isArray(product.imagenes) || product.imagenes.length === 0) {
    // Si no hay array, crearlo a partir de imagen principal o placeholder
    product.imagenes = product.imagen ? [product.imagen] : [PLACEHOLDER];
  } else {
    // Asegurarse de que la imagen principal esté en product.imagen
    product.imagen = product.imagen || product.imagenes[0] || PLACEHOLDER;
  }

  // Helpers DOM
  const maybeSetText = (id, text) => {
    const el = $(id);
    if (el) el.textContent = text;
  };
  const maybeSetHTML = (id, html) => {
    const el = $(id);
    if (el) el.innerHTML = html;
  };

  // Render básico
  maybeSetText("product-title", product.nombre || "Producto");
  maybeSetText("product-category", product.categoria || "");
  maybeSetText("product-sku", product.sku ? `SKU: ${product.sku}` : "");
  maybeSetText("product-price", fmt(product.precio));
  maybeSetText("product-description", product.descripcion || "");
  maybeSetText("breadcrumb-title", product.nombre || "Producto");

  // Estado (badge)
  const estadoEl = $("product-estado");
  if (estadoEl) {
    estadoEl.textContent = product.estado || "";
    estadoEl.className = (product.estado === "Activo") ? "badge bg-success mb-2" : "badge bg-secondary mb-2";
  }

  // Stock
  const stockEl = $("product-stock");
  const stockNum = Number(product.stock) || 0;
  if (stockEl) {
    if (stockNum > 0) {
      stockEl.innerHTML = `<i class="bi bi-check-circle-fill text-success me-2"></i> En stock (${stockNum})`;
    }
  }

  // Galería
  const mainImg = $("product-img");
  const thumbsContainer = $("product-thumbnails");
  if (mainImg) {
    mainImg.src = product.imagenes[0] || PLACEHOLDER;
    mainImg.alt = product.nombre || "Imagen de producto";
  }
  if (thumbsContainer) {
    thumbsContainer.innerHTML = "";
    product.imagenes.forEach((src, idx) => {
      const img = document.createElement("img");
      img.src = src || PLACEHOLDER;
      img.alt = `${product.nombre} vista ${idx + 1}`;
      img.className = "thumb";
      if (idx === 0) img.classList.add("selected");
      img.addEventListener("click", () => {
        if (mainImg) mainImg.src = src || PLACEHOLDER;
        thumbsContainer.querySelectorAll(".thumb").forEach(t => t.classList.remove("selected"));
        img.classList.add("selected");
      });
      thumbsContainer.appendChild(img);
    });
  }

  // Cantidad
  let qty = 1;
  const qtyInput = $("quantity");
  const btnInc = $("increase-btn");
  const btnDec = $("decrease-btn");
  if (qtyInput) qtyInput.value = qty;
  if (btnInc) btnInc.addEventListener("click", () => {
    if (stockNum && qty >= stockNum) return;
    qty++;
    if (qtyInput) qtyInput.value = qty;
  });
  if (btnDec) btnDec.addEventListener("click", () => {
    if (qty > 1) qty--;
    if (qtyInput) qtyInput.value = qty;
  });
  if (qtyInput) {
    qtyInput.addEventListener("input", () => {
      let v = parseInt(qtyInput.value, 10) || 1;
      if (v < 1) v = 1;
      if (stockNum && v > stockNum) v = stockNum;
      qty = v;
      qtyInput.value = qty;
    });
  }

  // ---------- AGREGAR AL CARRITO ----------
  const addBtn = $("add-to-cart-btn") || $("btn-agregar-carrito") || document.querySelector(".btn-cart") || null;
  if (!addBtn) {
    console.warn("Botón para agregar al carrito no encontrado (esperado id 'add-to-cart-btn').");
    return;
  }

  addBtn.addEventListener("click", () => {
    try {
      const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
      if (!usuarioLogueado) {
        Swal.fire({
          icon: "warning",
          title: "Debes iniciar sesión",
          text: "Por favor inicia sesión para agregar productos al carrito.",
          showConfirmButton: true
        }).then((result) => {
          if(result.isConfirmed){
              window.location.href = "pages/login.html";
          }
        });
        return;
      }

      const carrito = safeParseJSON(localStorage.getItem("carrito"), []);
      const item = {
        id: product.id,
        nombre: product.nombre,
        precio: Number(product.precio) || 0,
        cantidad: qty,
        imagen: product.imagenes[0] || product.imagen || PLACEHOLDER
      };

      const existente = carrito.find(p => p.id === item.id);
      if (existente) {
        existente.cantidad = (existente.cantidad || 0) + item.cantidad;
      } else {
        carrito.push(item);
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));

      // Actualizar contador carrito
      const totalCantidad = carrito.reduce((acc, it) => acc + (it.cantidad || 0), 0);
      document.querySelectorAll(".contador-carrito").forEach(el => el.textContent = totalCantidad);

      // Evento custom
      window.dispatchEvent(new CustomEvent("carritoActualizado", { detail: { carrito } }));

      // Toast
      const toast = document.createElement("div");
      toast.textContent = `✅ Se agregaron ${item.cantidad} x ${item.nombre} al carrito.`;
      Object.assign(toast.style, {
        position: "fixed",
        right: "20px",
        bottom: "24px",
        background: "rgba(0,0,0,0.75)",
        color: "white",
        padding: "10px 14px",
        borderRadius: "8px",
        zIndex: 9999
      });
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2200);

    } catch (err) {
      console.error("Error al agregar al carrito:", err);
      alert("Ocurrió un error al agregar el producto. Revisa la consola.");
    }
  });
});
