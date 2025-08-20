
document.getElementById("busquedaProducto").addEventListener("keyup", function () {
  let filtro = this.value.toLowerCase();
  let filas = document.querySelectorAll("#tablaProductos tbody tr");

  filas.forEach(fila => {
    let textoFila = fila.innerText.toLowerCase();
    fila.style.display = textoFila.includes(filtro) ? "" : "none";
  });
});


document.getElementById("nuevoProductoBtn").addEventListener("click", function () {
  alert("Abrir formulario para agregar un nuevo producto 🚀");
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
    }
  }
});
