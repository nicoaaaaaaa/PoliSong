const idAlbum = new URLSearchParams(window.location.search).get("id");

document.addEventListener("DOMContentLoaded", () => {
    cargarAlbum();
});

async function cargarAlbum() {
    const res = await fetch(`/api/albumes/ver/${idAlbum}`);
    const album = await res.json();

    console.log("Respuesta del backend:", album);

    const cont = document.getElementById("contenedor-album");

    let html = `
        <div class="album-header">
            ${album.imagenUrl ? `
                <img src="${album.imagenUrl}" alt="${album.nombreAlbum}" class="album-cover">
            ` : `
                <div class="album-cover placeholder">Sin imagen</div>
            `}
            <div class="album-info">
                <h1>${album.nombreAlbum}</h1>
                <p><strong>Artista:</strong> ${album.artistaAlbum}</p>
                <p><strong>Año:</strong> ${album.yearAlbum}</p>
                <p><strong>Género:</strong> ${album.generoAlbum}</p>
            </div>
        </div>
        <h2>Pistas</h2>
    `;

    html += `<ul class="track-list">`;
    album.Productos
        .filter(p => p.tipo === "mp3")
        .sort((a,b) => a.trackNumber - b.trackNumber)
        .forEach(track => {
            html += `
                <li class="track-item">
                    <span class="track-number">${track.trackNumber}.</span>
                    <span class="track-name">${track.nombreProducto}</span>
                    <audio controls class="track-audio">
                        <source src="${track.archivoUrl}" type="audio/mpeg">
                    </audio>
                </li>
            `;
        });
    html += `</ul>`;

    // Vinilo asociado
    const vinilo = album.Productos.find(p => p.tipo === "vinilo");

    if (vinilo) {
        html += `
            <div class="vinilo-section">
                <h2>Vinilo Disponible</h2>
                ${vinilo.imagenUrl ? `
                    <img src="${vinilo.imagenUrl}" alt="${vinilo.nombreProducto}" class="vinilo-image">
                ` : ''}
                <p><strong>Precio:</strong> $${vinilo.precio}</p>
                <p><strong>Stock:</strong> ${vinilo.stock}</p>
                <button onclick="agregarAlCarrito(${vinilo.idProducto})" class="btn-primary">Añadir vinilo al carrito</button>
            </div>
        `;
    }

    cont.innerHTML = html;
}

async function agregarAlCarrito(idProducto) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Debes iniciar sesión para agregar productos al carrito");
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch("/api/carrito/agregar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ idProducto, cantidad: 1 })
        });

        if (res.ok) {
            alert("✅ Vinilo agregado al carrito");
        } else {
            const error = await res.json();
            alert("❌ Error: " + (error.msg || "No se pudo agregar al carrito"));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Error de conexión");
    }
}
