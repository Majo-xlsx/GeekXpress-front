document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const resetButton = document.getElementById('resetButton');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');

    imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '200px';
                img.style.height = 'auto';
                imagePreview.innerHTML = ''; 
                imagePreview.appendChild(img);
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.innerHTML = '';
        }
    });

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
        
        successMessage.style.display = 'block';
        productForm.reset();
        imagePreview.innerHTML = ''; 
    });

    resetButton.addEventListener('click', () => {
        productForm.reset();
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        imagePreview.innerHTML = ''; 
    });

    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    function saveProductToLocalStorage(product) {
        const productsJson = localStorage.getItem('products');
        const products = productsJson ? JSON.parse(productsJson) : [];

        products.push(product);

        localStorage.setItem('products', JSON.stringify(products));
    }
});