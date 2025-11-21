document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    console.log("Token detectado ⇒", token ? token : "No hay token");

    if (!token) {
        console.warn("No hay token, redirigiendo al login...");
        return window.location.href = "login.html";
    }

    cargarPerfil(token);
});

async function cargarCatalogo() {
    const res = await fetch("/api/productos/ver");
    const productos = await res.json();

    const div = document.getElementById("catalogo");
    div.innerHTML = "";

    productos.forEach(p => {
        const item = document.createElement("div");
        item.innerHTML = `<h3>${p.nombre}</h3><p>${p.artista}</p><p>$${p.precio}</p>`;
        div.appendChild(item);
    });
}

console.log("Token guardado:", localStorage.getItem("token"));

cargarCatalogo();
