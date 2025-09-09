// Nombre del repositorio (para GitHub Pages)
const repoName = "GeekXpress-front";
const isGitHubPages = window.location.hostname.includes("github.io");

// Calcula el prefijo de rutas según la ubicación del HTML
function getPathPrefix() {
    if (isGitHubPages) return `/${repoName}/`;

    // Calcula la profundidad de la página local (index.html = 0, pages/catalog.html = 1)
    const depth = window.location.pathname.split("/").length - 2;
    return "../".repeat(depth);
}

// Cargar un template (navbar, footer, etc.)
function loadTemplate(id, url, callback) {
    const fullUrl = getPathPrefix() + url; // Ajusta la ruta del fetch según la ubicación de la página
    fetch(fullUrl)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.text();
        })
        .then(data => {
            const container = document.getElementById(id);
            if (!container) throw new Error(`No se encontró el contenedor con id="${id}"`);
            container.innerHTML = data;

            const pathPrefix = getPathPrefix();

            // Ajusta todos los enlaces internos con data-link
            document.querySelectorAll(`#${id} [data-link]`).forEach(link => {
                const target = link.getAttribute('data-link');
                link.href = pathPrefix + target;
            });

            // Evento para saber cuando la navbar terminó de cargarse
            if (id === "navbar") {
                document.dispatchEvent(new Event("navbarLoaded"));
            }

            if (typeof callback === "function") callback();
        })
        .catch(err => console.error(`Error cargando ${url}:`, err));
}

// Cargar navbar y footer
loadTemplate("navbar", "components/navbar2.html");
loadTemplate("footer", "components/footer.html");
