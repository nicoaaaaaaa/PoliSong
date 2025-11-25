document.addEventListener("DOMContentLoaded", cargarCarrito);

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

async function cargarCarrito() {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/carrito/ver", {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const items = await res.json();

    console.log(items);

    const div = document.getElementById("lista-carrito");
    div.innerHTML = "";

    let total = 0;

    items.forEach(item => {
        const p = item.producto;
        total += p.precio * item.cantidad;

        div.innerHTML += `
            <div class="item">
                <h3>${p.nombreProducto}</h3>
                <p>${p.artista}</p>
                <p>$${p.precio} x ${item.cantidad}</p>
                <button onclick="eliminar(${item.idCarrito})">Eliminar</button>
            </div>
        `;
    });

    div.innerHTML += `<h2>Total: $${total}</h2>`;
}

async function eliminar(idCarrito) {
    const token = localStorage.getItem("token");

    await fetch(`/api/carrito/eliminar/${idCarrito}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });

    cargarCarrito();
}

document.getElementById("btn-comprar").onclick = () => {
    window.location.href = "pedido.html";
};
