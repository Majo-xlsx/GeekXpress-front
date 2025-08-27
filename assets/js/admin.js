document.addEventListener('DOMContentLoaded', () => {
  // Productos
  const tablaProductosBody = document.querySelector("#tablaProductos tbody");
  const productForm = document.getElementById('formNuevoProducto');
  const imageInput = document.getElementById('imagenesProducto');
  const imagePreview = document.createElement('div'); 
  imageInput.parentNode.appendChild(imagePreview); 

  let editIndex = null; 

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
          <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
          <span>${producto.nombre}</span>
        </td>
        <td>${producto.sku || 'N/A'}</td>
        <td>$${producto.precio.toFixed(2)}</td>
        <td>${producto.stock}</td>
        <td>${producto.estado}</td>
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

  imageInput.addEventListener('change', function() {
    const files = this.files;
    imagePreview.innerHTML = '';
    if (files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file); 
      const img = document.createElement('img');
      img.src = url;
      img.style.maxWidth = '200px';
      img.style.height = 'auto';
      img.style.marginRight = '10px';
      imagePreview.appendChild(img);

      imageInput.dataset.imageUrl = url;
    }
  });

  productForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const productos = JSON.parse(localStorage.getItem("products")) || [];
    const sku = document.getElementById("skuProducto").value.trim();
    if (!sku) {
      alert("Debes ingresar un SKU para el producto.");
      return;
    }

    const productoData = {
      nombre: document.getElementById("nombreProducto").value || 'Sin nombre',
      sku: sku,
      descripcion: document.getElementById("descripcionProducto").value || '',
      precio: parseFloat(document.getElementById("precioProducto").value) || 0,
      stock: parseInt(document.getElementById("stockProducto").value) || 0,
      categoria: document.getElementById("categoriaProducto").value || '',
      estado: document.getElementById("estadoProducto").value || 'Activo',
      imagen: imageInput.dataset.imageUrl || 'https://via.placeholder.com/100'
    };

    if (editIndex !== null) {
      productos[editIndex] = productoData; 
      alert(`Producto "${productoData.nombre}" actualizado correctamente!`);
    } else {
      const existente = productos.find(p => p.sku === sku);
      if (existente) {
        alert(`Ya existe un producto con el SKU "${sku}".`);
        return;
      }
      productos.push(productoData); 
      alert(`Producto "${productoData.nombre}" cargado correctamente!`);
    }

    localStorage.setItem("products", JSON.stringify(productos));

    const modal = bootstrap.Modal.getInstance(document.getElementById("nuevoProductoModal"));
    modal.hide();

    productForm.reset();
    imagePreview.innerHTML = '';
    delete imageInput.dataset.imageUrl;
    editIndex = null;

    renderizarTablaProductos(); 
  });

  tablaProductosBody.addEventListener("click", function(e) {
    const target = e.target.closest("button");
    if (!target) return;

    const index = target.dataset.index;
    const productos = JSON.parse(localStorage.getItem("products")) || [];

    if (target.classList.contains("eliminar-btn")) {
      if (confirm(`¿Eliminar el producto "${productos[index].nombre}"?`)) {
        productos.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(productos));
        renderizarTablaProductos();
      }
    }

    if (target.classList.contains("editar-btn")) {
      editIndex = index;
      const producto = productos[index];

      document.getElementById("nombreProducto").value = producto.nombre;
      document.getElementById("skuProducto").value = producto.sku;
      document.getElementById("descripcionProducto").value = producto.descripcion;
      document.getElementById("precioProducto").value = producto.precio;
      document.getElementById("stockProducto").value = producto.stock;
      document.getElementById("categoriaProducto").value = producto.categoria;
      document.getElementById("estadoProducto").value = producto.estado;

      if (producto.imagen) {
        imagePreview.innerHTML = `<img src="${producto.imagen}" style="max-width:200px; height:auto; margin-right:10px;">`;
        imageInput.dataset.imageUrl = producto.imagen;
      } else {
        imagePreview.innerHTML = '';
        delete imageInput.dataset.imageUrl;
      }

      new bootstrap.Modal(document.getElementById("nuevoProductoModal")).show();
    }

    if (target.classList.contains("ver-btn")) {
      alert(`Ver detalles de: ${productos[index].nombre}`);
    }
  });

  renderizarTablaProductos();

  // Usuarios 
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
