document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.querySelector("#tablaProductos tbody");
  const busquedaInput = document.getElementById("busquedaProducto");
  const form = document.getElementById("formNuevoProducto");
  const modalElement = document.getElementById("nuevoProductoModal");
  const modalTitle = document.getElementById("nuevoProductoLabel");
  const btnGuardar = form.querySelector("button[type='submit']");

  let editIndex = null; // 👉 null = nuevo, número = edición

  function renderizarTablaProductos() {
    const productos = JSON.parse(localStorage.getItem('products')) || [];
    tablaBody.innerHTML = '';

    if (productos.length === 0) {
      const noDataRow = document.createElement('tr');
      noDataRow.innerHTML = `<td colspan="7" class="text-center">No hay productos para mostrar.</td>`;
      tablaBody.appendChild(noDataRow);
      return;
    }

    productos.forEach((producto, index) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td class="producto-cell">
          <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: 50px; object-fit: cover;">
          <div class="producto-info">
            <strong>${producto.nombre}</strong>
            <small>${producto.categoria}</small>
          </div>
        </td>
        <td>${producto.sku || 'N/A'}</td> 
        <td>$${producto.precio.toFixed(2)}</td>
        <td><span class="badge bg-primary">${producto.stock}</span></td> 
        <td><span class="badge ${producto.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}">${producto.estado}</span></td>
        <td>N/A</td> 
        <td>
          <button class="btn btn-sm btn-warning editar-btn" data-index="${index}">✏️</button>
          <button class="btn btn-sm btn-info ver-btn" data-index="${index}">👁</button>
          <button class="btn btn-sm btn-danger eliminar-btn" data-index="${index}">🗑️</button>
        </td>
      `;
      tablaBody.appendChild(fila);
    });
  }

  // Buscar productos
  busquedaInput.addEventListener("keyup", function () {
    let filtro = this.value.toLowerCase();
    let filas = document.querySelectorAll("#tablaProductos tbody tr");

    filas.forEach(fila => {
      let textoFila = fila.innerText.toLowerCase();
      fila.style.display = textoFila.includes(filtro) ? "" : "none";
    });
  });

  // Acciones en tabla
  tablaBody.addEventListener("click", function (e) {
    const target = e.target.closest("button");
    if (!target) return;

    const index = target.getAttribute('data-index');
    const productos = JSON.parse(localStorage.getItem('products')) || [];

    if (target.classList.contains("editar-btn")) {
      const producto = productos[index];
      editIndex = index;

      // Poblar formulario con los datos
      document.getElementById("nombreProducto").value = producto.nombre;
      document.getElementById("skuProducto").value = producto.sku;
      document.getElementById("descripcionProducto").value = producto.descripcion;
      document.getElementById("precioProducto").value = producto.precio;
      document.getElementById("precioOriginalProducto").value = producto.precioOriginal || '';
      document.getElementById("stockProducto").value = producto.stock;
      document.getElementById("categoriaProducto").value = producto.categoria;
      document.getElementById("estadoProducto").value = producto.estado;

      modalTitle.textContent = "Editar Producto";
      btnGuardar.textContent = "Guardar Cambios";

      new bootstrap.Modal(modalElement).show();
    }

    if (target.classList.contains("eliminar-btn")) {
      if (confirm("¿Seguro que deseas eliminar este producto?")) {
        productos.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(productos));
        renderizarTablaProductos();
      }
    }
  });

  // Resetear modal cuando es "Nuevo producto"
  document.getElementById("nuevoProductoBtn").addEventListener("click", () => {
    editIndex = null; // 👉 Modo nuevo
    form.reset();
    modalTitle.textContent = "Nuevo Producto";
    btnGuardar.textContent = "Guardar";
  });

  // Guardar producto
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const productos = JSON.parse(localStorage.getItem("products")) || [];

    const producto = {
      nombre: document.getElementById("nombreProducto").value,
      sku: document.getElementById("skuProducto").value,
      descripcion: document.getElementById("descripcionProducto").value,
      precio: parseFloat(document.getElementById("precioProducto").value),
      precioOriginal: parseFloat(document.getElementById("precioOriginalProducto").value) || null,
      stock: parseInt(document.getElementById("stockProducto").value),
      categoria: document.getElementById("categoriaProducto").value,
      estado: document.getElementById("estadoProducto").value,
      imagen: "https://via.placeholder.com/100"
    };

    if (editIndex !== null) {
      // 👉 Editar producto existente
      productos[editIndex] = producto;
    } else {
      // 👉 Nuevo producto
      productos.push(producto);
    }

    localStorage.setItem("products", JSON.stringify(productos));

    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

    renderizarTablaProductos();
    form.reset();
    editIndex = null;
  });

  renderizarTablaProductos();
});
