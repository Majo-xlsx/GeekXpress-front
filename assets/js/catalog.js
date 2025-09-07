document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('productContainer');
    const contadorCarrito = document.getElementById("contadorCarrito");
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");

// ejemplo simple si en cada card el icono tiene clase .ver-detalle y atributos data-...
document.querySelectorAll(".ver-detalle").forEach(icon => {
  icon.addEventListener("click", () => {
    const product = {
      id: icon.dataset.id || Date.now(),
      title: icon.dataset.title,
      brand: icon.dataset.brand,
      category: icon.dataset.category,
      price: icon.dataset.price,
      oldprice: icon.dataset.oldprice,
      rating: icon.dataset.rating,
      description: icon.dataset.description,
      features: icon.dataset.features ? JSON.parse(icon.dataset.features) : [],
      stock: icon.dataset.stock ? Number(icon.dataset.stock) : 0,
      images: icon.dataset.images ? JSON.parse(icon.dataset.images) : (icon.dataset.img ? [icon.dataset.img] : [])
    };
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "product.html";
  });
});


    // ================================
    // PRODUCTOS ESTÁTICOS
    // ================================
    const productos = [
        { id: 1, titulo: "One Piece | Caja 24 Sobres OP-05 Awakening of the New Era", categoria: "cartas", precioOferta: 1215000, precioOriginal: null, rating: 4.8, reviews: 124, img: "../assets/img/imgProducts/TCG_ONEPIECE_1.png", etiquetas: ["NUEVO", "CARTAS TCG"] },
        { id: 2, titulo: "Pokemon Juego de cartas Mega Brave Booster Box (japonés)", categoria: "cartas", precioOferta: 542000, precioOriginal: 596200, rating: 4.3, reviews: 24, img: "../assets/img/imgProducts/TCG_POKEMON_1.png", etiquetas: ["NUEVO", "-10%", "CARTAS TCG"] },
        { id: 3, titulo: "Magic The Gathering Innistrad Remastered Collector Boosters1", categoria: "cartas", precioOferta: 1649350, precioOriginal: 2144155, rating: 4.5, reviews: 194, img: "../assets/img/imgProducts/TCG_MAGIC_01.png", etiquetas: ["NUEVO", "-30%", "CARTAS TCG"] },
        { id: 4, titulo: "Manga Naruto N.01 Special Edition", categoria: "anime", precioOferta: 49500, precioOriginal: 54450, rating: 4.7, reviews: 44, img: "../assets/img/imgProducts/MANGA_NARUTO_N.01.png", etiquetas: ["NUEVO", "-10%", "MANGA"] },
        { id: 5, titulo: "Manga Full Metal Alchemist N.01 Special Edition", categoria: "anime", precioOferta: 60000, precioOriginal: 120000, rating: 4.2, reviews: 264, img: "../assets/img/imgProducts/MANGA_FMA_N.01.JPG", etiquetas: ["NUEVO", "-50%", "MANGA"] },
        { id: 6, titulo: "Manga Jojo's Bizarre N.01 Special Edition", categoria: "anime", precioOferta: 76000, precioOriginal: null, rating: 4.9, reviews: 550, img: "../assets/img/imgProducts/MANGA_JOJOS_N.01.jpg", etiquetas: ["NUEVO", "MANGA"] },
        { id: 7, titulo: "Comic Thor N.01", categoria: "cómics", precioOferta: 69900, precioOriginal: 87350, rating: 4.7, reviews: 94, img: "../assets/img/imgProducts/Comic_Thor N.01.png", etiquetas: ["NUEVO", "-25%", "COMICS"] },
        { id: 8, titulo: "Comic Batman Absolute N.01", categoria: "cómics", precioOferta: 105000, precioOriginal: 115500, rating: 4.4, reviews: 10, img: "../assets/img/imgProducts/COMIC_BATMAN_N.01.jpg", etiquetas: ["NUEVO", "-10%", "COMICS"] },
        { id: 9, titulo: "All Star Superman Edition Deluxe N.01", categoria: "cómics", precioOferta: 188000, precioOriginal: 225600, rating: 4.8, reviews: 15, img: "../assets/img/imgProducts/COMIC_SUPERMAN_N.01.jpg", etiquetas: ["NUEVO", "-20%", "COMICS"] },
        { id: 10, titulo: "Funko POP Plus Tanjiro Kamado Dancing Flash 2041 Demon Slayer", categoria: "accesorios", precioOferta: 69900, precioOriginal: 80385, rating: 4.5, reviews: 194, img: "../assets/img/imgProducts/FIGURAS_KNY_01.png", etiquetas: ["NUEVO", "-10%", "FIGURAS"] },
        { id: 11, titulo: "¡Funko Pop! Animación Dragonball Z - Goku Súper Sayajin", categoria: "accesorios", precioOferta: 69900, precioOriginal: 139800, rating: 4.9, reviews: 15, img: "../assets/img/imgProducts/FIGURAS_DB_N.01.png", etiquetas: ["NUEVO", "-50%", "FIGURAS"] },
        { id: 12, titulo: "Funko Pop Luffy Gear Five One Piece", categoria: "accesorios", precioOferta: 89900, precioOriginal: 125860, rating: 4.9, reviews: 15, img: "../assets/img/imgProducts/FIGURAS_ONEPIECE_G5_01.png", etiquetas: ["NUEVO", "-40%", "FIGURAS"] }
    ];

    // ================================
    // FUNCIONES DE CARRITO
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
        if (contadorCarrito) contadorCarrito.textContent = totalItems;
    }

    function formatearPrecio(valor) {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);
    }

    // ================================
    // RENDER DE PRODUCTOS
    // ================================
    function createProductCard(prod) {
        const cardCol = document.createElement('div');
        cardCol.classList.add('col-12', 'col-sm-6', 'col-md-4', 'mb-4');

        cardCol.innerHTML = `
            <div class="card product-card" data-id="${prod.id}" data-categoria="${prod.categoria.toLowerCase()}">
                <div class="card-img-container">
                    <img src="${prod.img || prod.imagen}" class="card-img-top" alt="${prod.titulo || prod.nombre}">
                    ${(prod.etiquetas || []).map(et => `<span class="badge bg-light text-dark">${et}</span>`).join('')}
                    <div class="iconos-acciones">
                        <i class="bi bi-heart-fill"></i>
                        <i class="bi bi-eye-fill"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h4 class="card-title">${prod.titulo || prod.nombre}</h4>
                    <p class="precio">
                        <span class="precio-oferta">${formatearPrecio(prod.precioOferta || prod.precio)}</span>
                        ${prod.precioOriginal ? `<span class="precio-original">${formatearPrecio(prod.precioOriginal)}</span>` : ""}
                    </p>
                    <button class="btn btn-agregar-carrito w-100">
                        <i class="bi bi-cart me-2"></i> Agregar al Carrito
                    </button>
                </div>
            </div>
        `;
        return cardCol;
    }

    function renderProducts(products) {
        productContainer.innerHTML = "";
        products.forEach(prod => {
            const card = createProductCard(prod);
            productContainer.appendChild(card);
        });
    }

    function getAllProductsForRender() {
        const localProducts = JSON.parse(localStorage.getItem('products')) || [];
        return [...productos, ...localProducts];
    }

    renderProducts(getAllProductsForRender());

    // ================================
    // FILTRO Y BÚSQUEDA
    // ================================
    function applyFilters() {
        const searchText = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value.toLowerCase();

        const allForRender = getAllProductsForRender();
        const filtered = allForRender.filter(p => {
            const name = p.titulo || p.nombre;
            const category = p.categoria || p.category;
            const matchesSearch = name.toLowerCase().includes(searchText);
            const matchesCategory = !selectedCategory || category.toLowerCase() === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        renderProducts(filtered);
    }

    searchInput.addEventListener("input", applyFilters);
    categoryFilter.addEventListener("change", applyFilters);

    // ================================
    // EVENTOS DEL CARRITO
    // ================================
    window.addEventListener("storage", actualizarContador);
    actualizarContador();
});