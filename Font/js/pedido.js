document.addEventListener("DOMContentLoaded", cargarResumen);

async function cargarResumen() {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/carrito/ver", {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const items = await res.json();

    const div = document.getElementById("resumen");

    let total = 0;
    div.innerHTML = "";

    items.forEach(i => {
        const p = i.producto;
        total += p.precio * i.cantidad;

        div.innerHTML += `
            <p>${p.nombreProducto} — ${i.cantidad} x $${p.precio}</p>
        `;
    });

    div.innerHTML += `<h2>Total: $${total}</h2>`;
}

document.getElementById("btn-confirmar").onclick = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/pedidos/crear", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();

    if (!res.ok) {
        alert("Error al crear pedido");
        return;
    }

    const idPedido = data.idPedido;

    alert("Pedido creado con éxito");

    window.location.href = `confirmacion.html?id=${idPedido}`;
};
