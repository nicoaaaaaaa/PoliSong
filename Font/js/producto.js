const id = new URLSearchParams(window.location.search).get("id");

document.addEventListener("DOMContentLoaded", () => {
    cargarProducto();
});

async function cargarProducto() {
    const res = await fetch(`/api/productos/ver/${id}`);
    const p = await res.json();

    const cont = document.getElementById("contenedor-producto");


    let html = `
        <div class="producto-header">
            ${p.imagenUrl ? `
                <img src="${p.imagenUrl}" alt="${p.nombreProducto}" class="producto-image">
            ` : `
                <div class="producto-image placeholder">
                    ${p.tipo === 'vinilo' ? '🎵' : '🎧'}
                </div>
            `}
            <div class="producto-info">
                <h1>${p.nombreProducto}</h1>
                <p><strong>Artista:</strong> ${p.artista}</p>
                <p><strong>Género:</strong> ${p.genero}</p>
                <p><strong>Año:</strong> ${p.year}</p>
                <p><strong>Precio:</strong> $${p.precio}</p>
                
                ${p.tipo === "vinilo" ? `
                    <p><strong>Stock disponible:</strong> ${p.stock}</p>
                ` : ''}
            </div>
        </div>
    `;

    if (p.Album) {
        html += `
            <div class="vinilo-section" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2>💿 Parte del Álbum: ${p.Album.nombreAlbum}</h2>
                ${p.Album.imagenUrl ? `
                    <img src="${p.Album.imagenUrl}" alt="${p.Album.nombreAlbum}" class="vinilo-image" style="width: 200px; height: 200px; object-fit: cover; border-radius: 8px; margin: 10px 0;">
                ` : ''}
                <p><strong>Artista del álbum:</strong> ${p.Album.artistaAlbum}</p>
                <p><strong>Año del álbum:</strong> ${p.Album.yearAlbum}</p>
                <p><strong>Género del álbum:</strong> ${p.Album.generoAlbum}</p>
                <button onclick="verAlbum(${p.Album.idAlbum})" class="btn-primary">Ver álbum completo</button>
            </div>
        `;
    }

    if (p.tipo === "mp3") {
        html += `
            <div class="audio-player">
                <h3>Escuchar preview:</h3>
                <audio controls class="full-width-audio">
                    <source src="${p.archivoUrl}" type="audio/mpeg">
                    Tu navegador no soporta el elemento de audio.
                </audio>
            </div>
        `;
    }

    html += `
        <div class="producto-actions">
            <button onclick="agregarAlCarrito(${p.idProducto})" class="btn-secondary">Añadir al carrito</button>
            <button onclick="comprarAhora(${p.idProducto})" class="btn-primary">Comprar ahora</button>
        </div>
    `;

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
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ idProducto, cantidad: 1 })
        });

        if (res.ok) {
            alert("✅ Producto agregado al carrito");
        } else {
            alert("❌ Error al agregar producto al carrito");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Error de conexión");
    }
}
function comprarAhora(idProducto) {
    window.location.href = `pedido.html?id=${idProducto}`;
}
