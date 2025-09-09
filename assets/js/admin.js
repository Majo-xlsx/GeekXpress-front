// admin3.js (Cloudinary integrado)
// Reemplaza estas constantes con tus datos de Cloudinary

const CLOUDINARY_CLOUD_NAME = 'dz4qsmco8'; // <- cambia esto
const CLOUDINARY_UPLOAD_PRESET = 'geekxpress'; // <- cambia esto (unsigned preset)
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Elementos DOM ----------
  const tablaProductosBody = document.querySelector('#tablaProductos tbody');
  const busquedaProductoInput = document.getElementById('busquedaProducto');
  const productForm = document.getElementById('formNuevoProducto');
  const imageInput = document.getElementById('imagenesProducto');
  const modalProductoEl = document.getElementById('nuevoProductoModal');
  const abrirModalBtn = document.getElementById('nuevoProductoBtn');

  // Contenedor de preview
  let imagePreview = null;
  if (imageInput) {
    imagePreview = imageInput.parentNode.querySelector('.image-preview-container');
    if (!imagePreview) {
      imagePreview = document.createElement('div');
      imagePreview.className = 'image-preview-container mt-2 d-flex flex-wrap gap-2';
      imageInput.parentNode.appendChild(imagePreview);
    }
  }

  // ---------- Estado ----------
  let editProductIndex = null; // índice del producto a editar en localStorage
  let selectedFiles = []; // File[] elegidos en el input para subir

  // ---------- Helpers ----------
  function getProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
  }
  function setProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
  }

  function generarIdUnico() {
    return 'prod-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }

  function safeText(v) {
    return (v === undefined || v === null) ? '' : v;
  }
  async function uploadToCloudinary(file) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok || !data.secure_url) {
      console.error('Error Cloudinary:', data);
      throw new Error(data.error?.message || 'Fallo al subir a Cloudinary');
    }
    return { url: data.secure_url, public_id: data.public_id };
  }

  // ---------- Formatear moneda COP ----------
  function formatearCOP(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0, // sin decimales
    maximumFractionDigits: 0
  }).format(valor);
}

  // ---------- Render tabla ----------
  function renderizarTablaProductos(filtro = '') {
    if (!tablaProductosBody) return;
    const productos = getProducts();
    tablaProductosBody.innerHTML = '';

    const q = filtro.trim().toLowerCase();
    const filtrados = productos.filter(p => {
      if (!q) return true;
      return (
        safeText(p.nombre).toLowerCase().includes(q) ||
        safeText(p.sku).toLowerCase().includes(q) ||
        safeText(p.categoria).toLowerCase().includes(q)
      );
    });

    if (filtrados.length === 0) {
      const noRow = document.createElement('tr');
      noRow.innerHTML = `<td colspan="9" class="text-center">No hay productos para mostrar.</td>`;
      tablaProductosBody.appendChild(noRow);
      return;
    }

    filtrados.forEach(producto => {
      // obtener índice real por SKU (asumiendo SKU único)
      const all = getProducts();
      const realIndex = all.findIndex(p => p.sku === producto.sku);

      const fila = document.createElement('tr');
      const primeraImagen = Array.isArray(producto.imagenes) ? producto.imagenes[0] : producto.imagen;
      fila.innerHTML = `
        <td>
          <img src="${primeraImagen || 'https://via.placeholder.com/60'}"
          alt="${producto.nombre}" class="producto-img"
          style="width:60px;height:60px;object-fit:cover;border-radius:6px;">
        </td>
        <td>${producto.nombre}</td>
        <td>${producto.descripcion ? String(producto.descripcion).substring(0,40) + '...' : 'Sin descripción'}</td>
        <td>${producto.sku || ''}</td>
        <td><span class="badge bg-info">${producto.categoria || 'Sin categoría'}</span></td>
        <td>${ formatearCOP(producto.precio)}</td>
        <td>${producto.stock ?? 0}</td>
        <td><span class="badge ${producto.estado === 'Activo' ? 'bg-success' : 'bg-danger'}">${producto.estado || 'Inactivo'}</span></td>
        <td>
          <button class="btn btn-sm btn-warning editar-btn" data-index="${realIndex}" title="Editar">✏️</button>
          <button class="btn btn-sm btn-info ver-btn" data-index="${realIndex}" title="Ver">👁</button>
          <button class="btn btn-sm btn-danger eliminar-btn" data-index="${realIndex}" title="Eliminar">🗑️</button>
        </td>
      `;
      tablaProductosBody.appendChild(fila);
    });
  }

  // ---------- Limpiar formulario ----------
  function limpiarFormularioProducto() {
    if (productForm) productForm.reset();
    if (imagePreview) imagePreview.innerHTML = '';
    selectedFiles = [];
    editProductIndex = null;
    if (imageInput) imageInput.value = '';
  }



// Ejemplo
console.log(formatearCOP(1500));     // $ 1.500
console.log(formatearCOP(2500000));  // $ 2.500.000


  // ---------- Preview & selección ----------
  if (imageInput) {
    imageInput.addEventListener('change', function () {
      const files = Array.from(this.files || []);
      if (!imagePreview) return;
      imagePreview.innerHTML = '';
      selectedFiles = [];

      if (files.length === 0) return;

      files.forEach((file, idx) => {
        selectedFiles.push(file);
        const displayUrl = URL.createObjectURL(file); // solo para preview

        const container = document.createElement('div');
        container.className = 'image-preview-item position-relative';
        container.style.width = '100px';
        container.style.height = '100px';

        const img = document.createElement('img');
        img.src = displayUrl;
        img.alt = file.name;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '6px';
        img.addEventListener('load', () => { try { URL.revokeObjectURL(displayUrl); } catch (_) {} });

        if (idx === 0) {
          const badge = document.createElement('span');
          badge.className = 'image-preview-badge badge bg-primary position-absolute';
          badge.style.top = '6px';
          badge.style.left = '6px';
          badge.textContent = 'Principal';
          container.appendChild(badge);
        }

        container.appendChild(img);
        imagePreview.appendChild(container);
      });
    });
  }

  // ---------- Submit producto (crear / editar) ----------
  if (productForm) {
    productForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const sku = (document.getElementById('skuProducto')?.value || '').trim();
      if (!sku) { alert('El SKU es obligatorio.'); return; }

      // const id = document.getElementById('nombreProducto')?.value || '';
      const nombre = document.getElementById('nombreProducto')?.value || 'Sin nombre';
      const descripcion = document.getElementById('descripcionProducto')?.value || '';
      const precio = parseFloat(document.getElementById('precioProducto')?.value) || 0;
      const stock = parseInt(document.getElementById('stockProducto')?.value) || 0;
      const categoria = document.getElementById('categoriaProducto')?.value || '';
      const estado = document.getElementById('estadoProducto')?.value || 'Activo';

      const productos = getProducts();
      const isEditing = editProductIndex !== null && productos[editProductIndex];
      const imagenesExistentes = isEditing ? (productos[editProductIndex].imagenes || []) : [];

      // Subir nuevas imágenes seleccionadas (si hay)
      let nuevasUrls = [];
      if (selectedFiles.length > 0) {
        try {
          const resultados = await Promise.all(selectedFiles.map(f => uploadToCloudinary(f)));
          nuevasUrls = resultados.map(r => r.url);
        } catch (err) {
          console.error('Error subiendo imágenes a Cloudinary:', err);
          alert('Ocurrió un error subiendo una o más imágenes. Revisa la consola para más detalles.');
        }
      }

      // Resolver imágenes finales
      const imagenesFinales = nuevasUrls.length > 0
        ? nuevasUrls
        : (imagenesExistentes.length > 0 ? imagenesExistentes : ['https://via.placeholder.com/100']);

      const productoData = {
        id: isEditing ? productos[editProductIndex].id : generarIdUnico(),        
        nombre,
        sku,
        descripcion,
        precio,
        stock,
        categoria,
        estado,
        imagenes: imagenesFinales,
        imagen: imagenesFinales[0]
      };

      // Guardar en localStorage
      if (isEditing) {
        productos[editProductIndex] = productoData;
        alert(`Producto "${productoData.nombre}" actualizado correctamente!`);
      } else {
        if (productos.some(p => p.sku === sku)) {
          alert(`Ya existe un producto con el SKU "${sku}".`);
          return;
        }
        productos.push(productoData);
        alert(`Producto "${productoData.nombre}" creado correctamente!`);
      }

      setProducts(productos);

      // Cerrar modal y limpiar
      if (modalProductoEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalProductoEl) || new bootstrap.Modal(modalProductoEl);
        modalInstance.hide();
        setTimeout(() => { abrirModalBtn?.focus(); }, 50);
      }

      limpiarFormularioProducto();
      renderizarTablaProductos(busquedaProductoInput?.value || '');
    });
  }

  // ---------- Modal hidden: limpiar + foco ----------
  if (modalProductoEl) {
    modalProductoEl.addEventListener('hidden.bs.modal', () => {
      limpiarFormularioProducto();
      if (abrirModalBtn) abrirModalBtn.focus();
    });
  }

  // ---------- Acciones en la tabla (delegación) ----------
  if (tablaProductosBody) {
    tablaProductosBody.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const index = parseInt(btn.dataset.index);
      const productos = getProducts();
      if (isNaN(index) || !productos[index]) return;

      if (btn.classList.contains('eliminar-btn')) {
        if (confirm(`¿Eliminar el producto "${productos[index].nombre}"?`)) {
          productos.splice(index, 1);
          setProducts(productos);
          renderizarTablaProductos(busquedaProductoInput?.value || '');
        }
        return;
      }

      if (btn.classList.contains('editar-btn')) {
        // preparar edición
        editProductIndex = index;
        const producto = productos[index];

        (document.getElementById('nombreProducto') || {}).value = producto.nombre || '';
        (document.getElementById('skuProducto') || {}).value = producto.sku || '';
        (document.getElementById('descripcionProducto') || {}).value = producto.descripcion || '';
        (document.getElementById('precioProducto') || {}).value = producto.precio ?? 0;
        (document.getElementById('stockProducto') || {}).value = producto.stock ?? 0;
        (document.getElementById('categoriaProducto') || {}).value = producto.categoria || '';
        (document.getElementById('estadoProducto') || {}).value = producto.estado || 'Activo';

        // Mostrar imágenes existentes en preview (solo visual)
        if (imagePreview) imagePreview.innerHTML = '';
        selectedFiles = []; // no hay nuevos archivos aún
        const imgs = Array.isArray(producto.imagenes) ? producto.imagenes : (producto.imagen ? [producto.imagen] : []);
        imgs.forEach((p, idx) => {
          const container = document.createElement('div');
          container.className = 'image-preview-item position-relative';
          container.style.width = '100px';
          container.style.height = '100px';

          const img = document.createElement('img');
          img.src = p;
          img.alt = `${producto.nombre} ${idx + 1}`;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
          img.style.borderRadius = '6px';

          if (idx === 0) {
            const badge = document.createElement('span');
            badge.className = 'image-preview-badge badge bg-primary position-absolute';
            badge.style.top = '6px';
            badge.style.left = '6px';
            badge.textContent = 'Principal';
            container.appendChild(badge);
          }

          container.appendChild(img);
          imagePreview.appendChild(container);
        });

        if (modalProductoEl) new bootstrap.Modal(modalProductoEl).show();
        return;
      }

      if (btn.classList.contains('ver-btn')) {
  const producto = productos[index];

  // Generar las imágenes
  let imagenesHTML = '';
  if (producto.imagenes && producto.imagenes.length > 0) {
    imagenesHTML = producto.imagenes.map(img =>
      `<img src="${img}" alt="${producto.nombre}" class="img-thumbnail me-2 mb-2" style="max-width:150px;">`
    ).join('');
  } else {
    imagenesHTML = `<p class="text-muted">Sin imágenes</p>`;
  }

  // Contenido del modal
  const modalContent = `
    <p><strong>Nombre:</strong> ${producto.nombre}</p>
    <p><strong>SKU:</strong> ${producto.sku}</p>
    <p><strong>Categoría:</strong> ${producto.categoria || 'Sin categoría'}</p>
    <p><strong>Precio:</strong> ${formatearCOP(producto.precio)}</p>
    <p><strong>Stock:</strong> ${producto.stock ?? 0}</p>
    <p><strong>Estado:</strong> ${producto.estado || 'Inactivo'}</p>
    <p><strong>Descripción:</strong> ${producto.descripcion || 'Sin descripción'}</p>
    <div class="d-flex flex-wrap">${imagenesHTML}</div>
  `;

  // Insertar el contenido en el body del modal
  document.getElementById('detalleProductoBody').innerHTML = modalContent;

  // Abrir el modal con Bootstrap
  const modal = new bootstrap.Modal(document.getElementById('detalleProductoModal'));
  modal.show();
}


    });
  }

  // ---------- Búsqueda productos ----------
  if (busquedaProductoInput) {
    busquedaProductoInput.addEventListener('keyup', function () {
      renderizarTablaProductos(this.value);
    });
  }

  // ========== USUARIOS ==========
  const tablaUsuariosBody = document.querySelector('#tablaUsuarios tbody');
  const busquedaUsuarioInput = document.getElementById('busquedaUsuario');
  const formNuevoUsuario = document.getElementById('formNuevoUsuario');
  let editUserIndex = null;
  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [
    { usuario: 'Carlos Pérez', email: 'carlos@example.com', tipoDoc: 'CC', documento: '12345678', telefono: '3001234567', fechaNacimiento: '1985-03-15', genero: 'masculino', direccion: 'Calle 123 #45-67', ciudad: 'Bogotá', rol: 'cliente', estado: 'Activo', fechaRegistro: '2024-01-15', notas: 'Cliente frecuente' },
    { usuario: 'María Gómez', email: 'maria@example.com', tipoDoc: 'CE', documento: '87654321', telefono: '3109876543', fechaNacimiento: '1990-07-22', genero: 'femenino', direccion: 'Carrera 50 #20-30', ciudad: 'Medellín', rol: 'cliente', estado: 'Inactivo', fechaRegistro: '2024-02-20', notas: '' }
  ];

  function guardarUsuarios() { localStorage.setItem('usuarios', JSON.stringify(usuarios)); }
  function limpiarFormularioUsuario() {
    if (!formNuevoUsuario) return;
    formNuevoUsuario.reset();
    editUserIndex = null;
    const fechaReg = document.getElementById('fechaRegistro');
    if (fechaReg) fechaReg.value = new Date().toISOString().split('T')[0];
  }

  function renderizarUsuarios(filtro = '') {
    if (!tablaUsuariosBody) return;
    tablaUsuariosBody.innerHTML = '';
    const q = filtro.trim().toLowerCase();
    const filtrados = usuarios.filter(u => {
      if (!q) return true;
      return (
        (u.usuario || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.documento || '').toLowerCase().includes(q)
      );
    });

    if (filtrados.length === 0) {
      const no = document.createElement('tr');
      no.innerHTML = `<td colspan="8" class="text-center">No hay usuarios para mostrar.</td>`;
      tablaUsuariosBody.appendChild(no);
      return;
    }

    filtrados.forEach(u => {
      const realIndex = usuarios.findIndex(x => x.email === u.email && x.documento === u.documento);
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td class="producto-nombre">${u.usuario}</td>
        <td>${u.email}</td>
        <td><div class="fw-semibold">${u.tipoDoc}</div><small class="text-muted">${u.documento}</small></td>
        <td>${u.telefono || ''}</td>
        <td>${u.ciudad || ''}</td>
        <td><span class="badge bg-info text-capitalize">${u.rol}</span></td>
        <td><span class="badge ${u.estado === 'Activo' ? 'bg-success' : u.estado === 'Suspendido' ? 'bg-warning' : 'bg-danger'}">${u.estado}</span></td>
        <td>
          <button class="btn btn-sm btn-warning editar-usuario" data-index="${realIndex}" title="Editar">✏️</button>
          <button class="btn btn-sm btn-info ver-usuario" data-index="${realIndex}" title="Ver">👁</button>
          <button class="btn btn-sm btn-danger eliminar-usuario" data-index="${realIndex}" title="Eliminar">🗑️</button>
        </td>
      `;
      tablaUsuariosBody.appendChild(fila);
    });
  }

  if (busquedaUsuarioInput) {
    busquedaUsuarioInput.addEventListener('keyup', function () {
      renderizarUsuarios(this.value);
    });
  }

  const nuevoUsuarioBtn = document.getElementById('nuevoUsuarioBtn');
  if (nuevoUsuarioBtn) {
    nuevoUsuarioBtn.addEventListener('click', limpiarFormularioUsuario);
  }

  if (formNuevoUsuario) {
    formNuevoUsuario.addEventListener('submit', e => {
      e.preventDefault();
      const nuevoUsuario = {
        usuario: document.getElementById('nombreUsuario')?.value || '',
        email: document.getElementById('emailUsuario')?.value || '',
        tipoDoc: document.getElementById('tipoDocumento')?.value || '',
        documento: document.getElementById('documentoUsuario')?.value || '',
        telefono: document.getElementById('telefonoUsuario')?.value || '',
        fechaNacimiento: document.getElementById('fechaNacimiento')?.value || '',
        genero: document.getElementById('generoUsuario')?.value || '',
        direccion: document.getElementById('direccionUsuario')?.value || '',
        ciudad: document.getElementById('ciudadUsuario')?.value || '',
        rol: document.getElementById('rolUsuario')?.value || 'cliente',
        estado: document.getElementById('estadoUsuario')?.value || 'Activo',
        fechaRegistro: document.getElementById('fechaRegistro')?.value || new Date().toISOString().split('T')[0],
        notas: document.getElementById('notasUsuario')?.value || ''
      };

      if (editUserIndex !== null) {
        usuarios[editUserIndex] = nuevoUsuario;
        alert(`Usuario "${nuevoUsuario.usuario}" actualizado exitosamente.`);
      } else {
        if (usuarios.some(u => u.email === nuevoUsuario.email)) { alert('Ya existe un usuario con ese email.'); return; }
        if (usuarios.some(u => u.documento === nuevoUsuario.documento && u.tipoDoc === nuevoUsuario.tipoDoc)) { alert('Ya existe un usuario con ese tipo y número de documento.'); return; }
        usuarios.push(nuevoUsuario);
        alert(`Usuario "${nuevoUsuario.usuario}" creado exitosamente.`);
      }

      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      renderizarUsuarios(busquedaUsuarioInput?.value || '');
      limpiarFormularioUsuario();
      const modalEl = document.getElementById('nuevoUsuarioModal');
      if (modalEl) {
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.hide();
      }
    });
  }

  if (tablaUsuariosBody) {
    tablaUsuariosBody.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const index = parseInt(btn.dataset.index);
      if (isNaN(index) || !usuarios[index]) return;

      if (btn.classList.contains('eliminar-usuario')) {
        if (confirm(`¿Seguro que deseas eliminar al usuario "${usuarios[index].usuario}"?`)) {
          usuarios.splice(index, 1);
          guardarUsuarios();
          renderizarUsuarios(busquedaUsuarioInput?.value || '');
        }
        return;
      }

      if (btn.classList.contains('ver-usuario')) {
        const u = usuarios[index];
        let info = `Información del Usuario:\n\n`;
        info += `Nombre: ${u.usuario}\nEmail: ${u.email}\nDocumento: ${u.tipoDoc} ${u.documento}\nTeléfono: ${u.telefono || 'No registrado'}\nCiudad: ${u.ciudad || 'No registrada'}\nRol: ${u.rol}\nEstado: ${u.estado}\nFecha registro: ${u.fechaRegistro}\n`;
        if (u.notas) info += `Notas: ${u.notas}\n`;
        alert(info);
        return;
      }

      if (btn.classList.contains('editar-usuario')) {
        editUserIndex = index;
        const u = usuarios[index];
        (document.getElementById('nombreUsuario') || {}).value = u.usuario || '';
        (document.getElementById('emailUsuario') || {}).value = u.email || '';
        (document.getElementById('tipoDocumento') || {}).value = u.tipoDoc || '';
        (document.getElementById('documentoUsuario') || {}).value = u.documento || '';
        (document.getElementById('telefonoUsuario') || {}).value = u.telefono || '';
        (document.getElementById('fechaNacimiento') || {}).value = u.fechaNacimiento || '';
        (document.getElementById('generoUsuario') || {}).value = u.genero || '';
        (document.getElementById('direccionUsuario') || {}).value = u.direccion || '';
        (document.getElementById('ciudadUsuario') || {}).value = u.ciudad || '';
        (document.getElementById('rolUsuario') || {}).value = u.rol || 'cliente';
        (document.getElementById('estadoUsuario') || {}).value = u.estado || 'Activo';
        (document.getElementById('fechaRegistro') || {}).value = u.fechaRegistro || new Date().toISOString().split('T')[0];
        (document.getElementById('notasUsuario') || {}).value = u.notas || '';
        const modalEl = document.getElementById('nuevoUsuarioModal');
        if (modalEl) new bootstrap.Modal(modalEl).show();
      }
    });
  }

  // ---------- Inicializar ----------
  renderizarTablaProductos();
  renderizarUsuarios();
});
