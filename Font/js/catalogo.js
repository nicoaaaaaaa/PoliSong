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
    cont.innerHTML = ""; // Limpiar antes de renderizar

    vinilos.forEach(v => {
        const productCard = document.createElement("div");
        productCard.style.border = "1px solid #ddd";
        productCard.style.borderRadius = "8px";
        productCard.style.padding = "16px";
        productCard.style.margin = "10px";
        productCard.style.background = "white";
        productCard.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        productCard.style.maxWidth = "300px";
        productCard.style.display = "inline-block";
        
        console.log("IMAGEN:", v.imagenUrl);

        productCard.innerHTML = `
            ${v.imagenUrl ? `
                <img src="${v.imagenUrl}"
     alt="${v.nombreProducto}"
     class="product-image"
     onerror="
        console.error('No se pudo cargar:', this.src);
        this.onerror=null;
        this.src='https://via.placeholder.com/200x200?text=Sin+Imagen';
     ">


            ` : `
                <div class="product-image placeholder">🎵</div>
            `}
            <div class="product-info">
                <h3>${v.nombreProducto}</h3>
                <p><strong>Artista:</strong> ${v.artista}</p>
                <p><strong>Precio:</strong> $${v.precio}</p>
                ${v.stock ? `<p><strong>Stock:</strong> ${v.stock}</p>` : ''}

                ${v.archivoUrl ? `
                    <audio controls class="small-audio">
                        <source src="${v.archivoUrl}" type="audio/mpeg">
                    </audio>
                ` : ""}

                <div class="product-actions">
                    <button onclick="verProducto(${v.idProducto})" class="btn-small">Ver</button>
                    <button onclick="agregarCarrito(${v.idProducto})" class="btn-small btn-primary">Agregar al carrito</button>
                </div>
            </div>
        `;
        
        cont.appendChild(productCard);
    });
}

function renderCanciones(canciones) {
    const cont = document.getElementById("canciones");
    cont.innerHTML = "";

    canciones.forEach(c => {
        cont.innerHTML += `
            <div class="product-info">
                <h3>${c.nombreProducto}</h3>
                <p><strong>Artista:</strong> ${c.artista}</p>
                <p><strong>Precio:</strong> $${c.precio}</p>

                <div class="product-actions">
                    <button onclick="verProducto(${c.idProducto})" class="btn-small">Ver</button>
                    <button onclick="agregarCarrito(${c.idProducto})" class="btn-small btn-primary">Agregar al carrito</button>
                </div>
            </div>
        </div>`;
    });
}


function renderAlbumes(albumes) {
    const cont = document.getElementById("albumes");
    cont.innerHTML = "";

    albumes.forEach(a => {
        const canciones = a.Productos.filter(p => p.tipo === "mp3").length;
        const vinilo = a.Productos.some(p => p.tipo === "vinilo");

        cont.innerHTML += `
        <div class="item product-card">
            ${a.imagenUrl ? `
                <img src="${a.imagenUrl}" alt="${a.nombreAlbum}" class="product-image">
            ` : `
                <div class="product-image placeholder">💿</div>
            `}
            <div class="product-info">
                <h3>${a.nombreAlbum}</h3>
                <p><strong>Artista:</strong> ${a.artistaAlbum}</p>
                <p><strong>Año:</strong> ${a.yearAlbum}</p>
                <p><strong>Género:</strong> ${a.generoAlbum}</p>
                <p><strong>Contenido:</strong> ${canciones} canciones ${vinilo ? '+ vinilo' : ''}</p>
                <div class="product-actions">
                    <button onclick="verAlbum(${a.idAlbum})" class="btn-small btn-primary">Ver álbum</button>
                </div>
            </div>
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
