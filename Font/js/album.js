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
        <h1>${album.nombreAlbum}</h1>
        <p>Artista: ${album.artistaAlbum}</p>
        <p>Año: ${album.yearAlbum}</p>
        <p>Género: ${album.generoAlbum}</p>
        <h2>Pistas</h2>
    `;

    html += `<ul>`;
    album.Productos
        .filter(p => p.tipo === "mp3")
        .sort((a,b) => a.trackNumber - b.trackNumber)
        .forEach(track => {
            html += `
                <li>
                    ${track.trackNumber}. ${track.nombreProducto}
                    <audio controls>
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
            <h2>Vinilo</h2>
            <p>Precio: $${vinilo.precio}</p>
            <button onclick="agregarAlCarrito(${vinilo.idProducto})">Añadir vinilo al carrito</button>
        `;
    }

    cont.innerHTML = html;
}

async function agregarAlCarrito(idProducto) {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/carrito/agregar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ idProducto, cantidad: 1 })
    });

    const data = await res.json();
    console.log("Respuesta del carrito:", data);

    alert("Vinilo agregado al carrito");
}

