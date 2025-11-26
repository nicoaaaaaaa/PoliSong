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
                <div class="album-actions">
                    <button onclick="comprarAlbumCompleto(${album.idAlbum})" class="btn btn-primary">
                        🛒 Comprar Álbum Completo
                    </button>
                </div>
            </div>
        </div>
        <h2>🎵 Pistas</h2>
    `;

    html += `<ul class="track-list">`;
    album.Productos
        .filter(p => p.tipo === "mp3")
        .sort((a,b) => a.trackNumber - b.trackNumber)
        .forEach(track => {
            html += `
                <li class="track-item">
                    <div class="track-info">
                        <span class="track-number">${track.trackNumber}.</span>
                        <span class="track-name">${track.nombreProducto}</span>
                        <span class="track-price">$${track.precio}</span>
                    </div>
                    <div class="track-controls">
                        <audio controls class="track-audio">
                            <source src="${track.archivoUrl}" type="audio/mpeg">
                        </audio>
                        <div class="track-actions">
                            <button onclick="agregarCancionAlCarrito(${track.idProducto})" class="btn-track">
                                🛒 Carrito
                            </button>
                            <button onclick="comprarCancionIndividual(${track.idProducto})" class="btn-track btn-primary">
                                💳 Comprar
                            </button>
                        </div>
                    </div>
                </li>
            `;
        });
    html += `</ul>`;

    // Vinilo asociado
    const vinilo = album.Productos.find(p => p.tipo === "vinilo");

    if (vinilo) {
        html += `
            <div class="vinilo-section">
                <h2>📀 Vinilo Disponible</h2>
                ${vinilo.imagenUrl ? `
                    <img src="${vinilo.imagenUrl}" alt="${vinilo.nombreProducto}" class="vinilo-image">
                ` : ''}
                <p><strong>Precio:</strong> $${vinilo.precio}</p>
                <p><strong>Stock:</strong> ${vinilo.stock}</p>
                <div class="vinilo-actions">
                    <button onclick="agregarAlCarrito(${vinilo.idProducto})" class="btn btn-secondary">
                        🛒 Añadir al carrito
                    </button>
                    <button onclick="comprarAhora(${vinilo.idProducto})" class="btn btn-primary">
                        💳 Comprar ahora
                    </button>
                </div>
            </div>
        `;
    }

    cont.innerHTML = html;
}

async function agregarCancionAlCarrito(idProducto) {
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
            alert("✅ Canción agregada al carrito");
        } else {
            const error = await res.json();
            alert("❌ Error: " + (error.msg || error.error || "No se pudo agregar al carrito"));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Error de conexión");
    }
}

async function comprarCancionIndividual(idProducto) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Debes iniciar sesión para comprar");
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch("/api/pedidos/crearindividual", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ idProducto, cantidad: 1 })
        });

        const data = await res.json();

        if (res.ok) {
            alert("✅ Canción comprada exitosamente");
            window.location.href = `confirmacion.html?id=${data.idPedido}`;
        } else {
            alert("❌ Error: " + (data.error || "No se pudo completar la compra"));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Error de conexión");
    }
}

async function comprarAlbumCompleto(idAlbum) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Debes iniciar sesión para comprar");
        window.location.href = "login.html";
        return;
    }

    try {
        // Obtener todas las canciones del álbum
        const resAlbum = await fetch(`/api/albumes/ver/${idAlbum}`);
        const album = await resAlbum.json();
        
        const canciones = album.Productos.filter(p => p.tipo === "mp3");
        
        if (canciones.length === 0) {
            alert("No hay canciones en este álbum");
            return;
        }

        // Agregar cada canción al carrito
        for (const cancion of canciones) {
            const res = await fetch("/api/carrito/agregar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ idProducto: cancion.idProducto, cantidad: 1 })
            });

            if (!res.ok) {
                throw new Error("Error al agregar canción al carrito");
            }
        }

        alert(`✅ ${canciones.length} canciones agregadas al carrito`);
        window.location.href = "pedido.html";

    } catch (error) {
        console.error("Error:", error);
        alert("❌ Error al comprar el álbum completo: " + error.message);
    }
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

async function comprarAhora(idProducto) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Debes iniciar sesión para comprar");
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch("/api/pedidos/crearIndividual", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ idProducto, cantidad: 1 })
        });

        const data = await res.json();

        if (res.ok) {
            alert("✅ Vinilo comprado exitosamente");
            window.location.href = `confirmacion.html?id=${data.idPedido}`;
        } else {
            alert("❌ Error: " + (data.error || "No se pudo completar la compra"));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Error de conexión");
    }
}
