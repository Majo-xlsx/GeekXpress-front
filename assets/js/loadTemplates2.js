// // Detectar si estamos en GitHub Pages
// const repoName = "GeekXpress-front";
// const isGitHubPages = window.location.hostname.includes("github.io");
// const basePath = isGitHubPages ? `/${repoName}/` : "./";

// // Función para cargar templates dinámicamente
// function loadTemplate(id, url, callback) {
//   fetch(url)
//     .then(response => {
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//       return response.text();
//     })
//     .then(data => {
//       document.getElementById(id).innerHTML = data;
//       if (id === "navbar") document.dispatchEvent(new Event("navbarLoaded"));
//       if (typeof callback === "function") callback();
//     })
//     .catch(err => console.error(`Error cargando ${url}:`, err));
// }

// // Cargar navbar y footer
// loadTemplate("navbar", basePath + "components/navbar.html");
// loadTemplate("footer", basePath + "components/footer.html");

// // Cargar scripts locales dinámicamente
// const scripts = ["assets/js/carrito.js", "assets/js/nav.js"];
// scripts.forEach(file => {
//   const script = document.createElement("script");
//   script.src = basePath + file;
//   document.body.appendChild(script);
// });


// Determinar basePath según entorno
const repoName = "GeekXpress-front";
const isGitHubPages = window.location.hostname.includes("github.io");
const basePath = isGitHubPages ? `/${repoName}/` : "./";

// Función para cargar templates
function loadTemplate(id, url, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;

            // Ajustar todos los enlaces del template
            document.querySelectorAll(`#${id} [data-link]`).forEach(link => {
                link.href = basePath + link.getAttribute('data-link');
            });

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

