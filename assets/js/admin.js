document.addEventListener('DOMContentLoaded', () => {
  
  // Productos
  const tablaProductosBody = document.querySelector("#tablaProductos tbody");
  const busquedaProductoInput = document.getElementById("busquedaProducto");
  const productForm = document.getElementById('formNuevoProducto');
  const imageInput = document.getElementById('imagenesProducto');
  const imagePreview = document.createElement('div');
  imagePreview.className = 'image-preview-container mt-2';
  imageInput.parentNode.appendChild(imagePreview);
  
  let editProductIndex = null;
  let selectedImages = [];

  function renderizarTablaProductos(filtro = "") {
    const productos = JSON.parse(localStorage.getItem('products')) || [];
    tablaProductosBody.innerHTML = '';
    
    if (productos.length === 0) {
      const noDataRow = document.createElement('tr');
      noDataRow.innerHTML = `<td colspan="8" class="text-center">No hay productos para mostrar.</td>`;
      tablaProductosBody.appendChild(noDataRow);
      return;
    }

    productos
      .filter(producto => 
        producto.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        producto.sku.toLowerCase().includes(filtro.toLowerCase()) ||
        (producto.categoria && producto.categoria.toLowerCase().includes(filtro.toLowerCase()))
      )
      .forEach((producto, index) => {
        const fila = document.createElement('tr');
        const primeraImagen = Array.isArray(producto.imagenes) ? producto.imagenes[0] : producto.imagen;
        
        fila.innerHTML = `
          <td>
            <img src="${primeraImagen || 'https://via.placeholder.com/60'}" 
                 alt="${producto.nombre}" 
                 class="producto-img">
          </td>
          <td>${producto.nombre}</td> <!-- SOLO nombre -->
          <td>${producto.descripcion ? producto.descripcion.substring(0, 40) + '...' : 'Sin descripción'}</td> <!-- SOLO descripción -->
          <td>${producto.sku || 'N/A'}</td>
          <td><span class="badge bg-info">${producto.categoria || 'Sin categoría'}</span></td>
          <td>${producto.precio.toFixed(2)}</td>
          <td>${producto.stock}</td>
          <td><span class="badge ${producto.estado === 'Activo' ? 'bg-success' : 'bg-danger'}">${producto.estado}</span></td>
          <td>
            <button class="btn btn-sm btn-warning editar-btn" data-index="${productos.indexOf(producto)}" title="Editar">✏️</button>
            <button class="btn btn-sm btn-info ver-btn" data-index="${productos.indexOf(producto)}" title="Ver">👁</button>
            <button class="btn btn-sm btn-danger eliminar-btn" data-index="${productos.indexOf(producto)}" title="Eliminar">🗑️</button>
          </td>
        `;
        tablaProductosBody.appendChild(fila);
      });
  }

  // Búsqueda de productos
  busquedaProductoInput.addEventListener("keyup", function () {
    renderizarTablaProductos(this.value);
  });

  function limpiarFormularioProducto() {
    productForm.reset();
    imagePreview.innerHTML = '';
    selectedImages = [];
    editProductIndex = null;
    imageInput.value = '';
    delete imageInput.dataset.imageUrl;
  }

  // visualizacion varias imagenes
  imageInput.addEventListener('change', function() {
    const files = this.files;
    imagePreview.innerHTML = '';
    selectedImages = [];
    
    if (files.length > 0) {
      Array.from(files).forEach((file, index) => {
        const url = URL.createObjectURL(file);
        selectedImages.push(url);
        
        const imgContainer = document.createElement('div');
        imgContainer.className = 'image-preview-item';
        
        const img = document.createElement('img');
        img.src = url;
        
        if (index === 0) {
          const badge = document.createElement('span');
          badge.className = 'image-preview-badge';
          badge.textContent = 'Principal';
          imgContainer.appendChild(badge);
        }
        
        imgContainer.appendChild(img);
        imagePreview.appendChild(imgContainer);
      });
    }
  });

  // Submit del formulario de productos
  productForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const productos = JSON.parse(localStorage.getItem("products")) || [];
    const sku = document.getElementById("skuProducto").value.trim();
    
    if (!sku) {
      alert("El SKU es obligatorio para el producto.");
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
      imagenes: selectedImages.length > 0 ? selectedImages : ['https://via.placeholder.com/100'],
      imagen: selectedImages.length > 0 ? selectedImages[0] : 'https://via.placeholder.com/100'
    };

    if (editProductIndex !== null) {
      productos[editProductIndex] = productoData;
      alert(`Producto "${productoData.nombre}" actualizado correctamente!`);
    } else {
      const existente = productos.find(p => p.sku === sku);
      if (existente) {
        alert(`Ya existe un producto con el SKU "${sku}".`);
        return;
      }
      productos.push(productoData);
      alert(`Producto "${productoData.nombre}" creado correctamente!`);
    }

    localStorage.setItem("products", JSON.stringify(productos));
    const modal = bootstrap.Modal.getInstance(document.getElementById("nuevoProductoModal"));
    modal.hide();
    limpiarFormularioProducto();
    renderizarTablaProductos(); 
  });

  // Limpia formulario al cerrar modal
  document.getElementById("nuevoProductoModal").addEventListener('hidden.bs.modal', function () {
    limpiarFormularioProducto();
  });

  // acciones de la tabla de productos
  tablaProductosBody.addEventListener("click", function(e) {
    const target = e.target.closest("button");
    if (!target) return;

    const index = parseInt(target.dataset.index);
    const productos = JSON.parse(localStorage.getItem("products")) || [];

    if (target.classList.contains("eliminar-btn")) {
      if (confirm(`¿Eliminar el producto "${productos[index].nombre}"?`)) {
        productos.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(productos));
        renderizarTablaProductos();
      }
    }

    if (target.classList.contains("editar-btn")) {
      editProductIndex = index;
      const producto = productos[index];
      
      // Llenar formulario
      document.getElementById("nombreProducto").value = producto.nombre;
      document.getElementById("skuProducto").value = producto.sku;
      document.getElementById("descripcionProducto").value = producto.descripcion || '';
      document.getElementById("precioProducto").value = producto.precio;
      document.getElementById("stockProducto").value = producto.stock;
      document.getElementById("categoriaProducto").value = producto.categoria || '';
      document.getElementById("estadoProducto").value = producto.estado;

      // Mostrar imágenes existentes
      imagePreview.innerHTML = '';
      selectedImages = [];
      
      if (producto.imagenes && Array.isArray(producto.imagenes)) {
        selectedImages = [...producto.imagenes];
        producto.imagenes.forEach((imgUrl, imgIndex) => {
          const imgContainer = document.createElement('div');
          imgContainer.className = 'image-preview-item';
          
          const img = document.createElement('img');
          img.src = imgUrl;
          
          if (imgIndex === 0) {
            const badge = document.createElement('span');
            badge.className = 'image-preview-badge';
            badge.textContent = 'Principal';
            imgContainer.appendChild(badge);
          }
          
          imgContainer.appendChild(img);
          imagePreview.appendChild(imgContainer);
        });
      }

      new bootstrap.Modal(document.getElementById("nuevoProductoModal")).show();
    }

    if (target.classList.contains("ver-btn")) {
      const producto = productos[index];
      let info = `Información del Producto:\n\n`;
      info += `Nombre: ${producto.nombre}\n`;
      info += `SKU: ${producto.sku}\n`;
      info += `Categoría: ${producto.categoria || 'Sin categoría'}\n`;
      info += `Precio: $${producto.precio}\n`;
      info += `Stock: ${producto.stock}\n`;
      info += `Estado: ${producto.estado}\n`;
      info += `Descripción: ${producto.descripcion || 'Sin descripción'}\n`;
      if (producto.imagenes && producto.imagenes.length > 1) {
        info += `Imágenes: ${producto.imagenes.length}\n`;
      }
      alert(info);
    }
  });

  // USUARIOS
  const tablaUsuariosBody = document.querySelector("#tablaUsuarios tbody");
  const busquedaUsuarioInput = document.getElementById("busquedaUsuario");
  const formNuevoUsuario = document.getElementById("formNuevoUsuario");
  let editUserIndex = null;
  
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [
    {
      usuario: "Carlos Pérez",
      email: "carlos@example.com",
      tipoDoc: "CC",
      documento: "12345678",
      telefono: "3001234567",
      fechaNacimiento: "1985-03-15",
      genero: "masculino",
      direccion: "Calle 123 #45-67",
      ciudad: "Bogotá",
      rol: "cliente",
      estado: "Activo",
      fechaRegistro: "2024-01-15",
      notas: "Cliente frecuente"
    },
    {
      usuario: "María Gómez",
      email: "maria@example.com",
      tipoDoc: "CE",
      documento: "87654321",
      telefono: "3109876543",
      fechaNacimiento: "1990-07-22",
      genero: "femenino",
      direccion: "Carrera 50 #20-30",
      ciudad: "Medellín",
      rol: "cliente",
      estado: "Inactivo",
      fechaRegistro: "2024-02-20",
      notas: ""
    }
  ];

  function guardarUsuarios() {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }

  function limpiarFormularioUsuario() {
    formNuevoUsuario.reset();
    editUserIndex = null;
    document.getElementById("fechaRegistro").value = new Date().toISOString().split('T')[0];
  }

  function renderizarUsuarios(filtro = "") {
    tablaUsuariosBody.innerHTML = "";
    
    if (usuarios.length === 0) {
      const noDataRow = document.createElement('tr');
      noDataRow.innerHTML = `<td colspan="8" class="text-center">No hay usuarios para mostrar.</td>`;
      tablaUsuariosBody.appendChild(noDataRow);
      return;
    }

    usuarios
      .filter(u => 
        u.usuario.toLowerCase().includes(filtro.toLowerCase()) ||
        u.email.toLowerCase().includes(filtro.toLowerCase()) ||
        u.documento.includes(filtro)
      )
      .forEach((u, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td class="producto-nombre">${u.usuario}</td>
          <td>${u.email}</td>
          <td>
            <div class="fw-semibold">${u.tipoDoc}</div>
            <small class="text-muted">${u.documento}</small>
          </td>
          <td>${u.telefono || 'N/A'}</td>
          <td>${u.ciudad || 'N/A'}</td>
          <td><span class="badge bg-info text-capitalize">${u.rol}</span></td>
          <td><span class="badge ${u.estado === "Activo" ? "bg-success" : u.estado === "Suspendido" ? "bg-warning" : "bg-danger"}">${u.estado}</span></td>
          <td>
            <button class="btn btn-sm btn-warning editar-usuario" data-index="${usuarios.indexOf(u)}" title="Editar">✏️</button>
            <button class="btn btn-sm btn-info ver-usuario" data-index="${usuarios.indexOf(u)}" title="Ver">👁</button>
            <button class="btn btn-sm btn-danger eliminar-usuario" data-index="${usuarios.indexOf(u)}" title="Eliminar">🗑️</button>
          </td>
        `;
        tablaUsuariosBody.appendChild(fila);
      });
  }

  // Búsqueda de usuarios
  busquedaUsuarioInput.addEventListener("keyup", function () {
    renderizarUsuarios(this.value);
  });

  // Establecer fecha actual cuando se abre el modal
  document.getElementById("nuevoUsuarioBtn").addEventListener("click", function() {
    limpiarFormularioUsuario();
  });

  // Submit del formulario de usuarios
  formNuevoUsuario.addEventListener("submit", e => {
    e.preventDefault();
    
    const nuevoUsuario = {
      usuario: document.getElementById("nombreUsuario").value,
      email: document.getElementById("emailUsuario").value,
      tipoDoc: document.getElementById("tipoDocumento").value,
      documento: document.getElementById("documentoUsuario").value,
      telefono: document.getElementById("telefonoUsuario").value || '',
      fechaNacimiento: document.getElementById("fechaNacimiento").value || '',
      genero: document.getElementById("generoUsuario").value || '',
      direccion: document.getElementById("direccionUsuario").value || '',
      ciudad: document.getElementById("ciudadUsuario").value || '',
      rol: document.getElementById("rolUsuario").value,
      estado: document.getElementById("estadoUsuario").value,
      fechaRegistro: document.getElementById("fechaRegistro").value,
      notas: document.getElementById("notasUsuario").value || ''
    };

    if (editUserIndex !== null) {
      usuarios[editUserIndex] = nuevoUsuario;
      alert(`Usuario "${nuevoUsuario.usuario}" actualizado exitosamente.`);
    } else {
      // Verificar si el email ya existe
      const emailExiste = usuarios.find(u => u.email === nuevoUsuario.email);
      if (emailExiste) {
        alert("Ya existe un usuario con ese email.");
        return;
      }

      // Verificar si el documento ya existe
      const docExiste = usuarios.find(u => u.documento === nuevoUsuario.documento && u.tipoDoc === nuevoUsuario.tipoDoc);
      if (docExiste) {
        alert("Ya existe un usuario con ese tipo y número de documento.");
        return;
      }

      usuarios.push(nuevoUsuario);
      alert(`Usuario "${nuevoUsuario.usuario}" creado exitosamente.`);
    }

    guardarUsuarios();
    renderizarUsuarios();
    limpiarFormularioUsuario();
    bootstrap.Modal.getInstance(document.getElementById("nuevoUsuarioModal")).hide();
  });

  // limpia formulario de usuario al cerrar modal
  document.getElementById("nuevoUsuarioModal").addEventListener('hidden.bs.modal', function () {
    limpiarFormularioUsuario();
  });

  // acciones de la tabla de usuarios
  tablaUsuariosBody.addEventListener("click", e => {
    const target = e.target.closest("button");
    if (!target) return;

    const index = parseInt(target.dataset.index);

    if (target.classList.contains("eliminar-usuario")) {
      if (confirm(`¿Seguro que deseas eliminar al usuario "${usuarios[index].usuario}"?`)) {
        usuarios.splice(index, 1);
        guardarUsuarios();
        renderizarUsuarios();
      }
    }

    if (target.classList.contains("ver-usuario")) {
      const usuario = usuarios[index];
      let info = `Información del Usuario:\n\n`;
      info += `Nombre: ${usuario.usuario}\n`;
      info += `Email: ${usuario.email}\n`;
      info += `Documento: ${usuario.tipoDoc} ${usuario.documento}\n`;
      info += `Teléfono: ${usuario.telefono || 'No registrado'}\n`;
      info += `Fecha de nacimiento: ${usuario.fechaNacimiento || 'No registrada'}\n`;
      info += `Género: ${usuario.genero || 'No especificado'}\n`;
      info += `Dirección: ${usuario.direccion || 'No registrada'}\n`;
      info += `Ciudad: ${usuario.ciudad || 'No registrada'}\n`;
      info += `Rol: ${usuario.rol}\n`;
      info += `Estado: ${usuario.estado}\n`;
      info += `Fecha de registro: ${usuario.fechaRegistro}\n`;
      if (usuario.notas) info += `Notas: ${usuario.notas}\n`;
      
      alert(info);
    }

    if (target.classList.contains("editar-usuario")) {
      editUserIndex = index;
      const usuario = usuarios[index];
      
      // Llenar formulario
      document.getElementById("nombreUsuario").value = usuario.usuario;
      document.getElementById("emailUsuario").value = usuario.email;
      document.getElementById("tipoDocumento").value = usuario.tipoDoc;
      document.getElementById("documentoUsuario").value = usuario.documento;
      document.getElementById("telefonoUsuario").value = usuario.telefono || '';
      document.getElementById("fechaNacimiento").value = usuario.fechaNacimiento || '';
      document.getElementById("generoUsuario").value = usuario.genero || '';
      document.getElementById("direccionUsuario").value = usuario.direccion || '';
      document.getElementById("ciudadUsuario").value = usuario.ciudad || '';
      document.getElementById("rolUsuario").value = usuario.rol;
      document.getElementById("estadoUsuario").value = usuario.estado;
      document.getElementById("fechaRegistro").value = usuario.fechaRegistro;
      document.getElementById("notasUsuario").value = usuario.notas || '';

      new bootstrap.Modal(document.getElementById("nuevoUsuarioModal")).show();
    }
  });

  renderizarTablaProductos();
  renderizarUsuarios();
});
