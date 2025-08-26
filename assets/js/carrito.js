let carrito = JSON.parse(localStorage.getItem('carrito')) || []

const botonVaciar = document.getElementById('vaciar-carrito')
const contador = document.getElementById('contador')
const listaCarrito = document.getElementById('lista-carrito')
const iconoCarrito = document.getElementById('icono-carrito')

function actualizarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));

    let totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    if (contador) contador.textContent = totalCantidad;

    if (listaCarrito) {
        listaCarrito.innerHTML = '';

        let totalPrecio = 0;

        carrito.forEach((producto) => {
            let totalProducto = producto.precio * producto.cantidad;
            totalPrecio += totalProducto;

            let item = document.createElement('li');
            item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

            item.innerHTML = `
                <span>${producto.nombre} - $${totalProducto.toLocaleString()}</span>
                <div>
                    <button class="btn btn-sm btn-secondary me-1" data-id="${producto.id}" data-accion="disminuir">-</button>
                    <span class="mx-1">${producto.cantidad}</span>
                    <button class="btn btn-sm btn-success me-1" data-id="${producto.id}" data-accion="aumentar">+</button>
                    <button class="btn btn-sm btn-danger" data-id="${producto.id}" data-accion="eliminar">X</button>
                </div>
            `;

            listaCarrito.appendChild(item);
        });

        if (totalPrecio > 0) {
            let totalItem = document.createElement('li');
            totalItem.classList.add('list-group-item', 'fw-bold', 'text-end');
            totalItem.textContent = `Total: $${totalPrecio.toLocaleString()}`;
            listaCarrito.appendChild(totalItem);
        }

        // Eventos a botones
        listaCarrito.querySelectorAll('button').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const accion = btn.getAttribute('data-accion');
                const index = carrito.findIndex(p => p.id === id);

                if (index !== -1) {
                    if (accion === 'aumentar') {
                        carrito[index].cantidad += 1;
                    } else if (accion === 'disminuir') {
                        carrito[index].cantidad -= 1;
                        if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
                    } else if (accion === 'eliminar') {
                        carrito.splice(index, 1);
                    }
                    actualizarCarrito();
                }
            });
        });
    }
}

function asignarEventosCarrito() {
  const botonesAgregar = document.querySelectorAll('.btn-agregar-carrito')
  
  for (let i = 0; i < botonesAgregar.length; i++) {
    botonesAgregar[i].addEventListener('click', function () {
        const boton = this
        const card = boton.closest('.card')

        const nombre = card.querySelector('.card-title').textContent
        const precio = parseFloat(
            card.querySelector('.precio-oferta').textContent.replace('$','')
        )
        const imagen = card.querySelector('.card-img-top').src

        const id = card.getAttribute('data-id')

        if (iconoCarrito) {
            let rectBoton = boton.getBoundingClientRect()
            let rectCarrito = iconoCarrito.getBoundingClientRect()

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

            setTimeout(function () {
                animacionContainer.remove();
            }, 1600);
        }

        let existe = false
        for (let j = 0; j < carrito.length; j++) {
            if (carrito[j].id === id) {
                carrito[j].cantidad = carrito[j].cantidad + 1
                existe = true
                break;
            }
        }

        if (!existe) {
            carrito.push({
                id: id,
                nombre: nombre,
                precio: precio,
                cantidad: 1,
                imagen: imagen
            })
        }

        actualizarCarrito()
    })
  }

  if (botonVaciar) {
    botonVaciar.addEventListener('click', function () {
        carrito = []
        actualizarCarrito()
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarCarrito();
    asignarEventosCarrito();
});