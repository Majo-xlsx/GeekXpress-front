document.addEventListener('DOMContentLoaded', () => {
//Productos
  const tablaProductosBody = document.querySelector("#tablaProductos tbody");
  const busquedaProductoInput = document.getElementById("busquedaProducto");

  function renderizarTablaProductos() {
    const productos = JSON.parse(localStorage.getItem('products')) || [];
    tablaProductosBody.innerHTML = '';

    if (productos.length === 0) {
      const noDataRow = document.createElement('tr');
      noDataRow.innerHTML = `<td colspan="7" class="text-center">No hay productos para mostrar.</td>`;
      tablaProductosBody.appendChild(noDataRow);
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
      tablaProductosBody.appendChild(fila);
    });
  }

  busquedaProductoInput.addEventListener("keyup", function () {
    let filtro = this.value.toLowerCase();
    let filas = document.querySelectorAll("#tablaProductos tbody tr");

    filas.forEach(fila => {
      let textoFila = fila.innerText.toLowerCase();
      fila.style.display = textoFila.includes(filtro) ? "" : "none";
    });
  });

  tablaProductosBody.addEventListener("click", function (e) {
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
      imagen: "https://via.placeholder.com/100"
    };

    productos.push(nuevoProducto);
    localStorage.setItem("products", JSON.stringify(productos));

    const modal = bootstrap.Modal.getInstance(document.getElementById("nuevoProductoModal"));
    modal.hide();

    renderizarTablaProductos();
    this.reset();
  });

  renderizarTablaProductos();


//Usuarios
  const tablaUsuariosBody = document.querySelector("#tablaUsuarios tbody");
  const busquedaUsuarioInput = document.getElementById("busquedaUsuario");
  const formNuevoUsuario = document.getElementById("formNuevoUsuario");

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [
    { usuario: "Carlos Pérez", tipoDoc: "CC", documento: "12345678", estado: "Activo", compras: 5 },
    { usuario: "María Gómez", tipoDoc: "CE", documento: "87654321", estado: "Inactivo", compras: 2 }
  ];

  function guardarUsuarios() {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }

  function renderizarUsuarios(filtro = "") {
    tablaUsuariosBody.innerHTML = "";

    if (usuarios.length === 0) {
      const noDataRow = document.createElement('tr');
      noDataRow.innerHTML = `<td colspan="6" class="text-center">No hay usuarios para mostrar.</td>`;
      tablaUsuariosBody.appendChild(noDataRow);
      return;
    }

    usuarios
      .filter(u => 
        u.usuario.toLowerCase().includes(filtro.toLowerCase()) ||
        u.documento.includes(filtro)
      )
      .forEach((u, index) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
          <td>${u.usuario}</td>
          <td>${u.tipoDoc}</td>
          <td>${u.documento}</td>
          <td><span class="badge ${u.estado === "Activo" ? "bg-success" : "bg-danger"}">${u.estado}</span></td>
          <td>${u.compras}</td>
          <td>
            <button class="btn btn-sm btn-warning editar-usuario" data-index="${index}">✏️</button>
            <button class="btn btn-sm btn-danger eliminar-usuario" data-index="${index}">🗑️</button>
          </td>
        `;
        tablaUsuariosBody.appendChild(fila);
      });
  }

  busquedaUsuarioInput.addEventListener("keyup", function () {
    renderizarUsuarios(this.value);
  });

  formNuevoUsuario.addEventListener("submit", e => {
    e.preventDefault();

    const nuevoUsuario = {
      usuario: document.getElementById("nombreUsuario").value,
      tipoDoc: document.getElementById("tipoDocumento").value,
      documento: document.getElementById("documentoUsuario").value,
      estado: document.getElementById("estadoUsuario").value,
      compras: parseInt(document.getElementById("comprasUsuario").value) || 0
    };

    usuarios.push(nuevoUsuario);
    guardarUsuarios();
    renderizarUsuarios();

    formNuevoUsuario.reset();
    bootstrap.Modal.getInstance(document.getElementById("nuevoUsuarioModal")).hide();
  });

  tablaUsuariosBody.addEventListener("click", e => {
    const target = e.target.closest("button");
    if (!target) return;

    const index = target.dataset.index;

    if (target.classList.contains("eliminar-usuario")) {
      if (confirm("¿Seguro que deseas eliminar este usuario?")) {
        usuarios.splice(index, 1);
        guardarUsuarios();
        renderizarUsuarios();
      }
    }

    if (target.classList.contains("editar-usuario")) {
      alert("Función de editar usuario en construcción 🚧");
    }
  });

  renderizarUsuarios();
});
