let carrito = JSON.parse(localStorage.getItem('carrito')) || []

const botonVaciar = document.getElementById('vaciar-carrito')
const contador = document.getElementById('contador')
const listaCarrito = document.getElementById('lista-carrito')
const iconoCarrito = document.getElementById('icono-carrito')

function actualizarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito))

    let total = 0
    for (let i = 0; i < carrito.length; i++) {
        total = total + carrito[i].cantidad
    }

    if (contador) {
      contador.textContent = total
    }
    
    if (listaCarrito) {
      listaCarrito.innerHTML = ''
      for (let i = 0; i < carrito.length; i++) {
          let producto = carrito[i]
          let totalProducto = producto.precio * producto.cantidad

          let item = document.createElement('li')
          item.textContent = producto.cantidad + ' x ' + producto.nombre + ' - $' + totalProducto.toLocaleString()

          let botonEliminar = document.createElement('button')
          botonEliminar.textContent = ' X'
          botonEliminar.addEventListener('click', function () {
              if (producto.cantidad > 1) {
                  producto.cantidad = producto.cantidad - 1
              } else {
                  carrito.splice(i, 1)
              }
              actualizarCarrito()
          })

          item.appendChild(botonEliminar)
          listaCarrito.appendChild(item)
      }
    }
}

function asignarEventosCarrito() {
  const botonesAgregar = document.querySelectorAll('.btn-agregar-carrito')
  
  for (let i = 0; i < botonesAgregar.length; i++) {
    botonesAgregar[i].addEventListener('click', function () {
        const boton = this
        const id = boton.getAttribute('data-id')
        const nombre = boton.getAttribute('data-nombre')
        const precio = parseFloat(boton.getAttribute('data-precio'))
        
        const card = boton.closest('.card');
        const imagen = card.querySelector('.card-img-top').src;

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