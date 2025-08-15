document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('nameForm').value.trim();
        const email = document.getElementById('emailForm').value.trim();
        const phone = document.getElementById('phoneForm').value.trim();
        const category = document.getElementById('categoryForm').value.trim();
        const subject = document.getElementById('subjectForm').value.trim();
        const message = document.getElementById('messageForm').value.trim();

        if (!name || !email || !phone || !category || !subject || !message) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos.'
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Correo inválido',
                text: 'Ingresa un correo electrónico válido.'
            });
            return;
        }

        const phoneRegex = /^[0-9]{7,15}$/;
        if (!phoneRegex.test(phone)) {
            Swal.fire({
                icon: 'error',
                title: 'Teléfono inválido',
                text: 'Ingresa solo números, mínimo 7 y máximo 15 dígitos.'
            });
            return;
        }

        emailjs.send("service_zakrrtu", "template_004az0q", {
            name: name,
            email: email,
            phone: phone,
            category: category,
            subject: subject,
            message: message
        })
        .then(function () {
            Swal.fire({
                icon: 'success',
                title: 'Mensaje enviado',
                text: 'Tu mensaje fue enviado correctamente. ¡Gracias por escribirnos!'
            });
            form.reset();
        })
        .catch(function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al enviar',
                text: 'Ocurrió un problema: ' + error.text
            });
        });
    });
});