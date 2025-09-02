document.addEventListener("DOMContentLoaded", initCarrito);
document.addEventListener("navbarLoaded", initCarrito);

function initCarrito() {
    const botonVaciar = document.getElementById('vaciar-carrito');
    const listaCarrito = document.getElementById('lista-carrito');
    const iconoCarrito = document.getElementById('icono-carrito');
    const totalElemento = document.getElementById('total');
    const productContainer = document.getElementById('productContainer');
    const btnPago = document.getElementById('btn-pago');

    // --------------------
    // HELPERS LOCALSTORAGE
    // --------------------
    function getCarrito() {
        return JSON.parse(localStorage.getItem("carrito")) || [];
    }

    function setCarrito(carrito) {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    // --------------------
    // ACTUALIZAR CARRITO
    // --------------------
    function actualizarCarrito() {
        const carrito = getCarrito();
        setCarrito(carrito);

        // Actualizar numerito en navbar
        const contador = document.getElementById("contador");
        const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        if (contador) contador.textContent = totalCantidad;

        // Actualizar lista detallada
        if (listaCarrito) {
            listaCarrito.innerHTML = '';
            let totalPrecio = 0;

            carrito.forEach((producto) => {
                const totalProducto = producto.precio * producto.cantidad;
                totalPrecio += totalProducto;

                const item = document.createElement('li');
                item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                item.innerHTML = `
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="width: auto; max-height: 60px;">
                    <span>${producto.nombre} - $${totalProducto.toLocaleString('es-CO')}</span>
                    <div>
                        <button class="btn btn-sm btn-secondary me-1" data-id="${producto.id}" data-accion="disminuir">-</button>
                        <span class="mx-1">${producto.cantidad}</span>
                        <button class="btn btn-sm btn-success me-1" data-id="${producto.id}" data-accion="aumentar">+</button>
                        <button class="btn btn-sm btn-danger" data-id="${producto.id}" data-accion="eliminar">X</button>
                    </div>
                `;
                listaCarrito.appendChild(item);
            });

            // Total al final de la lista
            if (totalPrecio > 0) {
                const totalItem = document.createElement('li');
                totalItem.classList.add('list-group-item', 'fw-bold', 'text-end');
                totalItem.textContent = `Total: $${totalPrecio.toLocaleString('es-CO')}`;
                listaCarrito.appendChild(totalItem);
            }

            // Total en <strong id="total">
            if (totalElemento) {
                totalElemento.textContent = `$${totalPrecio.toLocaleString('es-CO')}`;
            }

            // Eventos dinámicos
            listaCarrito.querySelectorAll('button').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    const accion = btn.getAttribute('data-accion');
                    const carrito = getCarrito();
                    const index = carrito.findIndex(p => p.id === id);

                    if (index !== -1) {
                        if (accion === 'aumentar') {
                            carrito[index].cantidad++;
                        } else if (accion === 'disminuir') {
                            carrito[index].cantidad--;
                            if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
                        } else if (accion === 'eliminar') {
                            carrito.splice(index, 1);
                        }
                        setCarrito(carrito);
                        actualizarCarrito();
                    }
                });
            });
        }
    }

    // --------------------
    // AGREGAR PRODUCTOS (desde catálogo)
    // --------------------
    function asignarEventosCarrito() {
        const botonesAgregar = document.querySelectorAll('.btn-agregar-carrito');

        botonesAgregar.forEach(boton => {
            boton.addEventListener('click', () => {
                const card = boton.closest('.card');
                const nombre = card.querySelector('.card-title').textContent;

                // Fix precios
                let precioTexto = card.querySelector('.precio-oferta').textContent;
                precioTexto = precioTexto.replace(/[$.']/g, '').trim();
                const precio = parseInt(precioTexto, 10);

                const imagen = card.querySelector('.card-img-top')?.src || "";
                const id = card.getAttribute('data-id') || nombre;

                const carrito = getCarrito();
                const existente = carrito.find(p => p.id === id);

                if (existente) {
                    existente.cantidad++;
                } else {
                    carrito.push({ id, nombre, precio, cantidad: 1, imagen });
                }

                setCarrito(carrito);
                actualizarCarrito();

                // Animación al carrito
                if (iconoCarrito) {
                    let rectBoton = boton.getBoundingClientRect();
                    let rectCarrito = iconoCarrito.getBoundingClientRect();

                    let animacionContainer = document.createElement('div');
                    animacionContainer.classList.add('fly-img');
                    animacionContainer.style.left = rectBoton.left + 'px';
                    animacionContainer.style.top = rectBoton.top + 'px';

                    let img = document.createElement('img');
                    img.src = imagen;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';

                    animacionContainer.appendChild(img);
                    document.body.appendChild(animacionContainer);

                    let deltaX = rectCarrito.left - rectBoton.left;
                    let deltaY = rectCarrito.top - rectBoton.top;

                    requestAnimationFrame(() => {
                        animacionContainer.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.2)`;
                    });

                    setTimeout(() => animacionContainer.remove(), 1600);
                }
            });
        });

        if (botonVaciar) {
            botonVaciar.addEventListener('click', () => {
                setCarrito([]);
                actualizarCarrito();
            });
        }
    }

    // --------------------
    // BOTÓN DE PAGO
    // --------------------
    if (btnPago) {
        btnPago.addEventListener('click', () => {
            const carrito = getCarrito();
            if (carrito.length === 0) {
                alert("Tu carrito está vacío.");
            } else {
                alert(`✅ Procediendo al pago con ${carrito.length} productos.`);
                // window.location.href = "checkout.html";
            }
        });
    }

    // --------------------
    // INICIO
    // --------------------
    actualizarCarrito();
    asignarEventosCarrito();
    window.addEventListener("storage", actualizarCarrito);
}
