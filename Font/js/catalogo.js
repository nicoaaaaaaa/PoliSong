document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    console.log("Token detectado ⇒", token ? token : "No hay token");

    if (!token) {
        console.warn("No hay token, redirigiendo al login...");
        return window.location.href = "login.html";
    }

    verificar(token);
    cargarCatalogo();
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
    // 1. Cargar productos (vinilos y mp3)
    const resProd = await fetch("/api/productos/ver");
    const productos = await resProd.json();

    // 2. Cargar álbumes
    const resAlb = await fetch("/api/albumes/ver");
    const albumes = await resAlb.json();

    renderVinilos(productos.filter(p => p.tipo === "vinilo"));
    renderCanciones(productos.filter(p => p.tipo === "mp3"));
    renderAlbumes(albumes);
}

function renderVinilos(vinilos) {
    const cont = document.getElementById("vinilos");

    vinilos.forEach(v => {
        cont.innerHTML += `
        <div class="item">
            <h3>${v.nombreProducto}</h3>
            <p>Artista: ${v.artista}</p>
            <p>Precio: $${v.precio}</p>
            <p>Stock: ${v.stock}</p>
            <button onclick="verProducto(${v.idProducto})">Ver</button>
            <button onclick="agregarCarrito(${v.idProducto})">Agregar al carrito</button>
        </div>`;
    });
}

function renderCanciones(canciones) {
    const cont = document.getElementById("canciones");

    canciones.forEach(c => {
        cont.innerHTML += `
        <div class="item">
            <h3>${c.nombreProducto}</h3>
            <p>Artista: ${c.artista}</p>
            <p>Precio: $${c.precio}</p>

            ${c.archivoUrl ? `
                <audio controls>
                    <source src="${c.archivoUrl}" type="audio/mpeg">
                </audio>
            ` : ""}

            <button onclick="verProducto(${c.idProducto})">Ver</button>
            <button onclick="agregarCarrito(${c.idProducto})">Agregar al carrito</button>
        </div>`;
    });
}

function renderAlbumes(albumes) {
    const cont = document.getElementById("albumes");

    albumes.forEach(a => {
        const canciones = a.Productos.filter(p => p.tipo === "mp3").length;
        const vinilo = a.Productos.some(p => p.tipo === "vinilo");

        cont.innerHTML += `
        <div class="item">
            <h3>${a.nombreAlbum}</h3>
            <p>Artista: ${a.artistaAlbum}</p>
            <p>Año: ${a.yearAlbum}</p>
            <p>Género: ${a.generoAlbum}</p>

            <p>${canciones} canciones</p>
            <p>${vinilo ? "Vinilo disponible" : "Sin vinilo"}</p>

            <button onclick="verAlbum(${a.idAlbum})">Ver álbum</button>
        </div>`;
    });
}

// Navegación
function verProducto(id) {
    window.location.href = `producto.html?id=${id}`;
}

function verAlbum(id) {
    window.location.href = `album.html?id=${id}`;
}

function agregarCarrito(idProducto) {
    const token = localStorage.getItem("token");
    if (!token) return window.location.href = "login.html";

    fetch("/api/carrito/agregar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ idProducto })
    }).then(res => {
        if (res.ok) alert("Producto agregado al carrito");
        else alert("Error al agregar");
    });
}
