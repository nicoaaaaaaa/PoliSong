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
            <div class="album-section">
                <h2>💿 ${p.tipo === "mp3" ? "Parte del Álbum" : "Álbum Disponible"}: ${p.Album.nombreAlbum}</h2>
                <div class="album-info">
                    ${p.Album.imagenUrl ? `
                        <img src="${p.Album.imagenUrl}" alt="${p.Album.nombreAlbum}" class="album-image">
                    ` : ''}
                    <div class="album-details">
                        <p><strong>Artista:</strong> ${p.Album.artistaAlbum}</p>
                        <p><strong>Año:</strong> ${p.Album.yearAlbum}</p>
                        <p><strong>Género:</strong> ${p.Album.generoAlbum}</p>
                        
                        ${p.tipo === "vinilo" ? `
                            <p><strong>Este vinilo forma parte del álbum</strong></p>
                        ` : `
                            <p><strong>Esta canción forma parte del álbum</strong></p>
                        `}
                        
                        <button onclick="verAlbum(${p.Album.idAlbum})" class="btn btn-primary">
                            Ver álbum completo
                        </button>
                    </div>
                </div>
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

window.verAlbum = function(idAlbum) {
    window.location.href = `album.html?id=${idAlbum}`;
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
            const error = await res.json();
            alert("❌ Error: " + (error.error || error.msg || "No se pudo agregar al carrito"));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Error de conexión");
    }
}

async function comprarAhora(idProducto) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Debes iniciar sesión para comprar");
        window.location.href = "login.html";
        return;
    }

    try {
        console.log("Creando pedido individual para producto:", idProducto);
        
        const res = await fetch("/api/pedidos/crearIndividual", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ idProducto, cantidad: 1 })
        });

        const data = await res.json();
        console.log("Respuesta del servidor:", data);

        if (res.ok) {
            const idPedido = data.idPedido;
            alert("✅ Pedido creado con éxito");
            window.location.href = `confirmacion.html?id=${idPedido}`;
        } else {
            alert("❌ Error al crear pedido: " + (data.error || "Error desconocido"));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Error de conexión: " + error.message);
    }
}