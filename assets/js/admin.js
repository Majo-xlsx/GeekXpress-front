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

<<<<<<< HEAD
document.getElementById("busquedaProducto").addEventListener("keyup", function () {
  let filtro = this.value.toLowerCase();
  let filas = document.querySelectorAll("#tablaProductos tbody tr");

  filas.forEach(fila => {
    let textoFila = fila.innerText.toLowerCase();
    fila.style.display = textoFila.includes(filtro) ? "" : "none";
  });
});


document.getElementById("nuevoProductoBtn").addEventListener("click", function () {
  window.location.href = "/pages/productsForm.html";

  // alert("Abrir formulario para agregar un nuevo producto 🚀");
});


document.querySelector("#tablaProductos").addEventListener("click", function(e){
  if(e.target.closest(".btn-warning")){
    alert("Editar producto seleccionado ✏️");
  }
  if(e.target.closest(".btn-info")){
    alert("Ver detalles del producto 👁");
  }
  if(e.target.closest(".btn-danger")){
    if(confirm("¿Seguro que deseas eliminar este producto? 🗑")){
      e.target.closest("tr").remove();
=======
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
                <td>N/A</td> <td>$${producto.precio.toFixed(2)}</td>
                <td><span class="badge bg-primary">N/A</span></td> <td><span class="badge bg-success">Activo</span></td>
                <td>N/A</td> <td>
                    <button class="btn btn-sm btn-warning editar-btn" data-index="${index}">✏️</button>
                    <button class="btn btn-sm btn-info ver-btn" data-index="${index}">👁</button>
                    <button class="btn btn-sm btn-danger eliminar-btn" data-index="${index}">🗑️</button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });
>>>>>>> 15d92acea65a1fa1c0cab74943b082ba4585baf4
    }

    busquedaInput.addEventListener("keyup", function () {
        let filtro = this.value.toLowerCase();
        let filas = document.querySelectorAll("#tablaProductos tbody tr");

        filas.forEach(fila => {
            let textoFila = fila.innerText.toLowerCase();
            fila.style.display = textoFila.includes(filtro) ? "" : "none";
        });
    });

    tablaBody.addEventListener("click", function(e){
        const target = e.target.closest("button");
        if (!target) return;

        const index = target.getAttribute('data-index');
        const productos = JSON.parse(localStorage.getItem('products')) || [];

        if (target.classList.contains("editar-btn")){
            const productoAEditar = productos[index];
            alert(`Editar producto: ${productoAEditar.nombre}`);
        }
        
        if (target.classList.contains("ver-btn")){
            const productoAEditar = productos[index];
            alert(`Ver detalles de: ${productoAEditar.nombre}`);
        }
        
        if (target.classList.contains("eliminar-btn")){
            if(confirm("¿Seguro que deseas eliminar este producto?")){
                productos.splice(index, 1);
                localStorage.setItem('products', JSON.stringify(productos));
                renderizarTablaProductos(); 
            }
        }
    });

    document.getElementById("nuevoProductoBtn").addEventListener("click", function () {

      window.location.href = '../pages/productsForm.html'; 
    });

    renderizarTablaProductos();
});