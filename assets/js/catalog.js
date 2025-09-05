document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('productContainer');
    const contadorCarrito = document.getElementById("contadorCarrito");
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");

    let allProducts = []; // Guardamos todos los productos cargados

    // ================================
    // FUNCIONES AUXILIARES
    // ================================
    function getCarrito() {
        return JSON.parse(localStorage.getItem("carrito")) || [];
    }

    function setCarrito(carrito) {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    function actualizarContador() {
        const carrito = getCarrito();
        let totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contadorCarrito.textContent = totalItems;
    }

    function formatearPrecio(valor) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(valor);
    }

    // ================================
    // CREACIÓN DE CARDS DE PRODUCTOS
    // ================================
    function createProductCard(data) {
        const cardCol = document.createElement('div');
        cardCol.classList.add('col-12', 'col-sm-6', 'col-md-4', 'mb-4');

        cardCol.innerHTML = `
            <div class="card product-card" data-id="${data.id}" data-categoria="${data.categoria.toLowerCase()}">
                <div class="card-img-container">
                    <img src="${data.imagen}" class="card-img-top" alt="${data.nombre}" style="max-width: 100%; height: auto;">
                    <span class="badge bg-success badge-nuevo">NUEVO</span>
                    <span class="badge bg-danger badge-descuento">-25%</span>
                    <span class="badge bg-light badge-categoria">${data.categoria}</span>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${data.nombre}</h5>
                    <p class="card-text">${data.descripcion}</p>
                    <p class="precio">
                        <span class="precio-oferta">${formatearPrecio(data.precio)}</span>
                        <span class="precio-original">${formatearPrecio(data.precio * 1.25)}</span>
                    </p>
                    <button class="btn btn-agregar-carrito w-100">
                        <i class="bi bi-cart me-2"></i> Agregar al Carrito
                    </button>
                </div>
            </div>
        `;
        return cardCol;
    }

    // ================================
    // CARGA DE PRODUCTOS
    // ================================
    function loadProductsFromLocalStorage() {
        const productsJson = localStorage.getItem('products');
        if (productsJson) {
            allProducts = JSON.parse(productsJson);
            renderProducts(allProducts);
        }
    }

    function renderProducts(products) {
        productContainer.innerHTML = "";
        products.forEach(product => {
            const card = createProductCard(product);
            productContainer.appendChild(card);
        });
    }

    // ================================
    // FILTRO Y BÚSQUEDA
    // ================================
    function applyFilters() {
        const searchText = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value.toLowerCase();

        const filtered = allProducts.filter(p => {
            const matchesSearch = p.nombre.toLowerCase().includes(searchText);
            const matchesCategory = !selectedCategory || p.categoria.toLowerCase() === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        renderProducts(filtered);
    }

    searchInput.addEventListener("input", applyFilters);
    categoryFilter.addEventListener("change", applyFilters);

    // ================================
    // EVENTOS
    // ================================
    window.addEventListener("storage", actualizarContador);

    // Inicializar
    loadProductsFromLocalStorage();
    actualizarContador();
});