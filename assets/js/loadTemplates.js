// function loadTemplate(id, url, callback) {
//     fetch(url)
//         .then(response => response.text())
//         .then(data => {
//             document.getElementById(id).innerHTML = data;

//             // Si es la navbar, lanzamos un evento global
//             if (id === "navbar") {
//                 document.dispatchEvent(new Event("navbarLoaded"));
//             }

//             // Ejecuta el callback si existe
//             if (typeof callback === "function") {
//                 callback();
//             }
//         })
//         .catch(err => console.error(`Error cargando ${url}:`, err));
// }

// // Cargar plantillas
// loadTemplate("navbar", "../components/navbar.html");
// loadTemplate("footer", "../components/footer.html");

function loadTemplate(id, url, callback) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(id).innerHTML = data;

            // Si es la navbar, lanzamos un evento global
            if (id === "navbar") {
                document.dispatchEvent(new Event("navbarLoaded"));
            }

            // Ejecuta el callback si existe
            if (typeof callback === "function") {
                callback();
            }
        })
        .catch(err => console.error(`Error cargando ${url}:`, err));
}

// Detectar si estamos en GitHub Pages
const repoName = "GeekXpress-front";
const isGitHubPages = window.location.hostname.includes("github.io");

// Definir rutas correctas según entorno
const basePath = isGitHubPages ? `/${repoName}/components/` : "../components/";

// Cargar plantillas
loadTemplate("navbar", `${basePath}navbar.html`);
loadTemplate("footer", `${basePath}footer.html`);

