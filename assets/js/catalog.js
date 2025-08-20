document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('productContainer');

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

    function createProductCard(data) {
        const card = document.createElement('div');
        card.classList.add('product-card');
        
        card.innerHTML = `
            <img src="${data.imagen}" alt="${data.nombre}" class="product-image">
            <div class="product-details">
                <h3>${data.nombre}</h3>
                <p>${data.descripcion}</p>
                <p>Precio: $${data.precio.toFixed(2)}</p>
                <span>Categoría: ${data.categoria}</span>
            </div>
        `;
        
        productContainer.appendChild(card);
    }
});