document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productContainer = document.getElementById('productContainer');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const resetButton = document.getElementById('resetButton');

    loadProductsFromLocalStorage();

    productForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        const formData = new FormData(productForm);

        const requiredFields = ['productName', 'productDescription', 'productCategory', 'productPrice', 'productImages'];
        let allFieldsFilled = true;
        for (const field of requiredFields) {
            if (!formData.get(field)) {
                allFieldsFilled = false;
                break;
            }
        }

        if (!allFieldsFilled) {
            errorMessage.style.display = 'block';
            return;
        }

        const productData = {
            nombre: formData.get('productName'),
            descripcion: formData.get('productDescription'),
            categoria: formData.get('productCategory'),
            precio: parseFloat(formData.get('productPrice'))
        };
        const imageFile = formData.get('productImages');

        const imageDataBase64 = await convertToBase64(imageFile);
        productData.imagen = imageDataBase64;
        
        saveProductToLocalStorage(productData);
        createProductCard(productData);
        
        successMessage.style.display = 'block';
        productForm.reset();
    });

    resetButton.addEventListener('click', () => {
        productForm.reset();
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
    });

    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    function loadProductsFromLocalStorage() {
        const productsJson = localStorage.getItem('products');
        if (productsJson) {
            const products = JSON.parse(productsJson);
            products.forEach(product => {
                createProductCard(product);
            });
        }
    }

    function saveProductToLocalStorage(product) {
        const productsJson = localStorage.getItem('products');
        const products = productsJson ? JSON.parse(productsJson) : [];

        products.push(product);

        localStorage.setItem('products', JSON.stringify(products));
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