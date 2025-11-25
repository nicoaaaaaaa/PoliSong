const id = new URLSearchParams(window.location.search).get("id");

document.addEventListener("DOMContentLoaded", () => {
    cargarProducto();
});

async function cargarProducto() {
    const res = await fetch(`/api/productos/ver/${id}`);
    const p = await res.json();

    const cont = document.getElementById("contenedor-producto");

    let html = `
        <h1>${p.nombreProducto}</h1>
        <p>Artista: ${p.artista}</p>
        <p>Género: ${p.genero}</p>
        <p>Año: ${p.year}</p>
        <p>Precio: $${p.precio}</p>
    `;

    if (p.tipo === "mp3") {
        html += `
            <audio controls>
                <source src="${p.archivoUrl}" type="audio/mpeg">
            </audio>
        `;
    }

    if (p.tipo === "vinilo") {
        html += `
            <p>Stock disponible: ${p.stock}</p>
        `;
    }

    html += `
        <button onclick="agregarAlCarrito(${p.idProducto})">Añadir al carrito</button>
        <button onclick="comprarAhora(${p.idProducto})">Comprar ahora</button>
    `;

    cont.innerHTML = html;
}

async function agregarAlCarrito(idProducto) {
    const token = localStorage.getItem("token");

    await fetch("/api/carrito/agregar", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ idProducto, cantidad: 1 })
    });

    alert("Producto agregado al carrito");
}

function comprarAhora(idProducto) {
    window.location.href = `pedido.html?id=${idProducto}`;
}
