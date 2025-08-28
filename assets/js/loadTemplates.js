function loadTemplate(id, url, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;

            // Ejecuta el callback si existe
            if (typeof callback === "function") {
                callback();
            }
        })
        .catch(err => console.error(`Error cargando ${url}:`, err));
}

// Cargar plantillas
loadTemplate("navbar", "../components/navbar.html");
loadTemplate("footer", "../components/footer.html");

