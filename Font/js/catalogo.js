document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    console.log("Token detectado ⇒", token ? token : "No hay token");

    if (!token) {
        console.warn("No hay token, redirigiendo al login...");
        return window.location.href = "login.html";
    }

    verificar(token);
});

async function verificar(token) {
    try {
        const res = await fetch("/api/usuarios/protegido", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        console.log("Estado de la respuesta:", res.status);

        if (res.status === 401) {
            console.error("Token inválido o expirado. Cerrando sesión...");
            localStorage.removeItem("token");
            return window.location.href = "login.html";
        }

        const data = await res.json();
        console.log("Sesión validada por el servidor:", data);

    } catch (error) {
        console.error("Error cargando el perfil:", error);
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }
}

async function cargarCatalogo() {
    const res = await fetch("/api/productos/ver");
    const productos = await res.json();

    const contenedor = document.getElementById("catalogo");
    contenedor.innerHTML = "";

    productos.forEach(p => {
        contenedor.innerHTML += renderProducto(p);
    });
}

function renderProducto(p) {
    let html = `
    <div class="producto">
        <h2>${p.nombreProducto}</h2>
        <p>Artista: ${p.artista || "N/A"}</p>
        <p>Género: ${p.genero || "N/A"}</p>
        <p>Precio: $${p.precio}</p>
    `;

    // Si es mp3, mostrará un reproductor
    if (p.tipo === "mp3" && p.archivoUrl) {
        html += `
            <audio controls>
                <source src="${p.archivoUrl}" type="audio/mpeg">
                Tu navegador no soporta reproducir audio.
            </audio>
        `;
    }

    html += `</div>`;

    return html;
}

console.log("Token guardado:", localStorage.getItem("token"));

cargarCatalogo();
