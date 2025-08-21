document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.querySelector("#tablaProductos tbody");
  const busquedaInput = document.getElementById("busquedaProducto");

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

  busquedaInput.addEventListener("keyup", function () {
    let filtro = this.value.toLowerCase();
    let filas = document.querySelectorAll("#tablaProductos tbody tr");

    filas.forEach(fila => {
      let textoFila = fila.innerText.toLowerCase();
      fila.style.display = textoFila.includes(filtro) ? "" : "none";
    });
  });

  tablaBody.addEventListener("click", function (e) {
    const target = e.target.closest("button");
    if (!target) return;

    const index = target.getAttribute('data-index');
    const productos = JSON.parse(localStorage.getItem('products')) || [];

    if (target.classList.contains("editar-btn")) {
      const productoAEditar = productos[index];
      alert(`Editar producto: ${productoAEditar.nombre}`);
    }

    if (target.classList.contains("ver-btn")) {
      const productoAEditar = productos[index];
      alert(`Ver detalles de: ${productoAEditar.nombre}`);
    }

    if (target.classList.contains("eliminar-btn")) {
      if (confirm("¿Seguro que deseas eliminar este producto?")) {
        productos.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(productos));
        renderizarTablaProductos();
      }
    }
  });

  document.getElementById("formNuevoProducto").addEventListener("submit", function (e) {
    e.preventDefault();

    const productos = JSON.parse(localStorage.getItem("products")) || [];

    const nuevoProducto = {
      nombre: document.getElementById("nombreProducto").value,
      sku: document.getElementById("skuProducto").value,
      descripcion: document.getElementById("descripcionProducto").value,
      precio: parseFloat(document.getElementById("precioProducto").value),
      precioOriginal: parseFloat(document.getElementById("precioOriginalProducto").value) || null,
      stock: parseInt(document.getElementById("stockProducto").value),
      categoria: document.getElementById("categoriaProducto").value,
      estado: document.getElementById("estadoProducto").value,
      imagen: "https://via.placeholder.com/100" // Aquí puedes luego agregar un input de imagen
    };

    productos.push(nuevoProducto);
    localStorage.setItem("products", JSON.stringify(productos));

    const modal = bootstrap.Modal.getInstance(document.getElementById("nuevoProductoModal"));
    modal.hide();

    
    renderizarTablaProductos();

    this.reset();
  });

  renderizarTablaProductos();
});
