async function cargarCatalogo() {
    const res = await fetch("/api/productos");
    const productos = await res.json();

    const div = document.getElementById("catalogo");
    div.innerHTML = "";

    productos.forEach(p => {
        const item = document.createElement("div");
        item.innerHTML = `<h3>${p.nombre}</h3><p>$${p.precio}</p>`;
        div.appendChild(item);
    });
}

console.log("Token guardado:", localStorage.getItem("token"));

cargarCatalogo();
