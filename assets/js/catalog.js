document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('productContainer');
    const contadorCarrito = document.getElementById("contadorCarrito");

    
    function actualizarContador() {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        let totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contadorCarrito.textContent = totalItems;
    }

    // Cargar productos guardados
    loadProductsFromLocalStorage();

    function loadProductsFromLocalStorage() {
        const productsJson = localStorage.getItem('products');
        if (productsJson) {
            const products = JSON.parse(productsJson);
            products.forEach(product => {
                createProductCard(product);
            });
        }
    }

    // Función para agregar productos al carrito
    function addProduct(sku, nombre, precio, imagen) {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        let existente = carrito.find(item => item.sku === sku);
        if (existente) {
            existente.cantidad++;
        } else {
            carrito.push({ sku, nombre, precio, imagen, cantidad: 1 });
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarContador(); // 👈 aquí actualizamos inmediatamente
    }

    // Crear cards de productos
    function createProductCard(data) {
        const cardCol = document.createElement('div');
        cardCol.classList.add('col-12', 'col-sm-6', 'col-md-4', 'mb-4');

        cardCol.innerHTML = `
            <div class="card product-card" data-id="${data.sku}">
                <div class="card-img-container">
                    <img src="${data.imagen}" class="card-img-top" alt="${data.nombre}" style="max-width: 100%; height: auto;">
                    <span class="badge bg-success badge-nuevo">NUEVO</span>
                    <span class="badge bg-danger badge-descuento">-25%</span>
                    <span class="badge bg-light badge-categoria">${data.categoria}</span>
                    <div class="iconos-acciones">
                        <i class="bi bi-heart-fill"></i>
                        <i class="bi bi-eye-fill"></i>
                    </div>
                </div>
                <div class="card-body">
                    <div class="rating">
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star text-warning"></i>
                        <span class="rating-number">4.8 (124)</span>
                    </div>
                    <h5 class="card-title">${data.nombre}</h5>
                    <p class="card-text">${data.descripcion}</p>
                    <p class="precio">
                        <span class="precio-oferta">$${data.precio.toFixed(2)}</span>
                        <span class="precio-original">$${(data.precio * 1.25).toFixed(2)}</span>
                    </p>
                    <button class="btn btn-agregar-carrito w-100">
                        <i class="bi bi-cart me-2"></i> Agregar al Carrito
                    </button>
                </div>
            </div>
        `;
        
        productContainer.appendChild(cardCol);

        const btnAgregar = cardCol.querySelector('.btn-agregar-carrito');
        btnAgregar.addEventListener('click', () => {
            addProduct(data.sku, data.nombre, data.precio, data.imagen);
        });
    }

    // Escucha cambios en localStorage desde otras pestañas
    window.addEventListener("storage", actualizarContador);

    // Actualiza al cargar la página
    actualizarContador();
});
