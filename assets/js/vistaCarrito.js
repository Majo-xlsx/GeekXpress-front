// Función para cambiar cantidad
function cambiarCantidad(boton, cambio) {
  const cantidadElem = boton.parentElement.querySelector(".num-cantidad");
  let cantidad = parseInt(cantidadElem.textContent);

  cantidad += cambio;
  if (cantidad < 1) return; // no permitir menos de 1

  cantidadElem.textContent = cantidad;

  actualizarSubtotal(boton.closest(".producto"));
  actualizarResumen();
}

// Función para actualizar subtotal de un producto
function actualizarSubtotal(producto) {
  const precioTexto = producto.querySelector(".precio").textContent
    .replace("$", "")
    .replace(/\./g, "") // eliminar puntos de miles
    .trim();

  const precio = parseInt(precioTexto.replace(/\D/g, ""));
  const cantidad = parseInt(producto.querySelector(".num-cantidad").textContent);

  const subtotal = precio * cantidad;
  producto.querySelector(".subtotal").textContent = `$ ${subtotal.toLocaleString("es-CO")}`;
}

// Función para eliminar producto
function eliminarProducto(boton) {
  const producto = boton.closest(".producto");
  producto.remove();
  actualizarResumen();
}

// Función para actualizar resumen de pedido
function actualizarResumen() {
  const productos = document.querySelectorAll(".producto");
  let total = 0;
  let cantidadTotal = 0;

  productos.forEach(producto => {
    const subtotalTexto = producto.querySelector(".subtotal").textContent.replace("$", "").trim();
    const subtotal = parseInt(subtotalTexto.replace(/\D/g, ""));
    total += subtotal;

    cantidadTotal += parseInt(producto.querySelector(".num-cantidad").textContent);
  });

  document.getElementById("subtotal").textContent = `$ ${total.toLocaleString("es-CO")}`;
  document.getElementById("total").textContent = `$ ${total.toLocaleString("es-CO")}`;
  document.getElementById("num-articulos").textContent = cantidadTotal;
}
