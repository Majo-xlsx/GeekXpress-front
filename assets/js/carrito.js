document.addEventListener("DOMContentLoaded", initCarrito);
document.addEventListener("navbarLoaded", initCarrito);

function initCarrito() {
    const botonVaciar = document.getElementById('vaciar-carrito');
    const listaCarrito = document.getElementById('lista-carrito');
    const iconoCarrito = document.getElementById('icono-carrito') || document.querySelector('.d-none.d-lg-flex') || document.querySelector('.bi-cart-fill')?.closest('a,button,.nav-link,div') || document.querySelector('.contador-carrito')?.closest('a,button,.nav-link,div');
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
    // ANIMACIÓN AL CARRITO
    // --------------------
    function animarAlCarrito(origen, imagen) {
        if (!origen || !iconoCarrito) return;

        const rectBoton = origen.getBoundingClientRect();
        const rectCarrito = iconoCarrito.getBoundingClientRect();

        const startW = Math.max(32, Math.min(rectBoton.width, 80));
        const startH = Math.max(32, Math.min(rectBoton.height, 80));

        const centerBotonX = rectBoton.left + rectBoton.width / 2;
        const centerBotonY = rectBoton.top + rectBoton.height / 2;
        const centerCarritoX = rectCarrito.left + rectCarrito.width / 2;
        const centerCarritoY = rectCarrito.top + rectCarrito.height / 2;

        const animacionContainer = document.createElement('div');
        animacionContainer.classList.add('fly-img');
        animacionContainer.style.width = startW + 'px';
        animacionContainer.style.height = startH + 'px';
        animacionContainer.style.position = 'fixed';
        animacionContainer.style.left = (centerBotonX - startW / 2) + 'px';
        animacionContainer.style.top = (centerBotonY - startH / 2) + 'px';
        animacionContainer.style.pointerEvents = 'none';
        if (imagen) {
            animacionContainer.style.backgroundImage = `url(${imagen})`;
            animacionContainer.style.backgroundSize = 'cover';
            animacionContainer.style.backgroundPosition = 'center';
            animacionContainer.style.backgroundRepeat = 'no-repeat';
        } else {
            animacionContainer.style.backgroundColor = 'rgba(0,0,0,0.06)';
        }

        document.body.appendChild(animacionContainer);

        // forzar reflow
        animacionContainer.offsetWidth;

        const deltaX = centerCarritoX - centerBotonX;
        const deltaY = centerCarritoY - centerBotonY;

        requestAnimationFrame(() => {
            animacionContainer.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.2)`;
        });

        const limpiar = () => {
            if (animacionContainer && animacionContainer.parentNode) animacionContainer.parentNode.removeChild(animacionContainer);
        };
        animacionContainer.addEventListener('transitionend', limpiar, { once: true });
        setTimeout(limpiar, 1600);
    }

    // --------------------
    // ACTUALIZAR CARRITO
    // --------------------
function actualizarCarrito() {
    const carrito = getCarrito();
    setCarrito(carrito);

    // Actualizar numerito en navbar
    const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    // Selecciona todos los contadores por clase y actualiza su texto
    const contadores = document.querySelectorAll(".contador-carrito");
    contadores.forEach(contador => {
        contador.textContent = totalCantidad;
    });

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
                        /*
                        Swal.fire({
                            position: "bottom-end",
                            icon: "info",
                            title: "Eliminaste el producto",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        */
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
        // Clonar botón para eliminar cualquier listener previo
        const nuevoBoton = boton.cloneNode(true);
        boton.replaceWith(nuevoBoton);

        nuevoBoton.addEventListener('click', () => {
            const card = nuevoBoton.closest('.card');
            const nombre = card.querySelector('.card-title').textContent;

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

            /*
            Swal.fire({
                position: "center-center",
                icon: "success",
                title: `${nombre} agregado al carrito`,
                showConfirmButton: false,
                timer: 1500
            });
            */

            setCarrito(carrito);
            actualizarCarrito();
            animarAlCarrito(nuevoBoton, imagen);
        });
    });

    if (botonVaciar) {

        botonVaciar.addEventListener('click', () => {

        /*
        Swal.fire({
            title: "Desocupar carrito?",
            text: "Vas a eliminar todos los productos del carrito!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Desocupar"
            }).then((result) => {
            if (result.isConfirmed) {
                    setCarrito([]);
                    actualizarCarrito();
                    Swal.fire({
                        title: "Productos eliminados",
                        // text: "Your file has been deleted.",
                        icon: "success"
                    });
                }
            });
        */
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