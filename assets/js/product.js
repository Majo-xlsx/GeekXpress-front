// assets/js/product.js
document.addEventListener("DOMContentLoaded", () => {
  const productContainer = document.getElementById("productContainer");
  const contadorCarrito = document.getElementById("contadorCarrito");
  const product = JSON.parse(localStorage.getItem("selectedProduct"));
  
  if (product) {
    document.getElementById("product-title").textContent = product.title;
    document.getElementById("product-price").textContent = product.price;
    document.getElementById("product-oldprice").textContent = product.oldprice;
    document.getElementById("product-description").textContent = product.description;
    document.getElementById("product-img").src = product.img;
    document.getElementById("product-rating").textContent = "⭐ " + product.rating;
  } else {
    document.querySelector(".container").innerHTML = "<p>No se encontró el producto</p>";
  }
});

  // ================================
  // FUNCIONES AUXILIARES
  // ================================
  function getCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
  }

  function setCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  function actualizarContador() {
    const carrito = getCarrito();
    let totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    if (contadorCarrito) contadorCarrito.textContent = totalItems;
  }

  function formatearPrecio(valor) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor);
  }

  // ================================
  // CARGA DE PRODUCTO DESDE LOCALSTORAGE
  // ================================
  const producto = JSON.parse(localStorage.getItem("productoSeleccionado"));
  if (!producto) {
    productContainer.innerHTML =
      "<p class='text-center text-muted'>No se encontró el producto seleccionado.</p>";
    return;
  }

  productContainer.innerHTML = `
    <div class="row">
      <div class="col-md-6 text-center">
        <img src="${producto.img}" alt="${producto.title}" class="img-fluid rounded mb-3" id="img-principal">
      </div>
      <div class="col-md-6">
        <h2>${producto.title}</h2>
        <p class="text-danger fw-bold fs-4">${formatearPrecio(producto.price)}</p>
        <p><del class="text-muted">${formatearPrecio(producto.oldPrice)}</del></p>
        <p>${producto.description}</p>

        <div class="d-flex align-items-center mb-3">
          <button class="btn btn-outline-secondary" id="btn-restar">-</button>
          <input type="text" id="cantidad" class="form-control text-center mx-2" value="1" style="width: 60px;" readonly>
          <button class="btn btn-outline-secondary" id="btn-sumar">+</button>
        </div>

        <button class="btn btn-primary" id="btn-agregar-carrito">Añadir al carrito</button>
      </div>
    </div>
  `;

  // ================================
  // MANEJO DE CANTIDAD
  // ================================
  const cantidadInput = document.getElementById("cantidad");
  document.getElementById("btn-restar").addEventListener("click", () => {
    let cantidad = parseInt(cantidadInput.value);
    if (cantidad > 1) cantidadInput.value = cantidad - 1;
  });

  document.getElementById("btn-sumar").addEventListener("click", () => {
    let cantidad = parseInt(cantidadInput.value);
    cantidadInput.value = cantidad + 1;
  });

  // ================================
  // AÑADIR AL CARRITO
  // ================================
  document.getElementById("btn-agregar-carrito").addEventListener("click", () => {
    const cantidad = parseInt(cantidadInput.value);
    let carrito = getCarrito();

    const index = carrito.findIndex((item) => item.id === producto.id);
    if (index >= 0) {
      carrito[index].cantidad += cantidad;
    } else {
      carrito.push({ ...producto, cantidad });
    }

    setCarrito(carrito);
    actualizarContador();
    alert("Producto añadido al carrito ✅");
  });

  // ================================
  // INICIALIZAR
  // ================================
  actualizarContador();
});
