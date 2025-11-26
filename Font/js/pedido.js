document.addEventListener("DOMContentLoaded", cargarResumen);

async function cargarResumen() {
    const token = localStorage.getItem("token");
    const btnConfirmar = document.getElementById("btn-confirmar");

    try {
        // Mostrar loading
        const originalText = btnConfirmar.textContent;
        btnConfirmar.innerHTML = '<div class="loading"></div> Cargando...';
        btnConfirmar.disabled = true;

        const res = await fetch("/api/carrito/ver", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Error al cargar el carrito");

        const items = await res.json();
        const div = document.getElementById("resumen");

        if (items.length === 0) {
            div.innerHTML = `
                <div class="empty-state">
                    <h3>🛒 Tu carrito está vacío</h3>
                    <p>Agrega algunos productos antes de confirmar tu pedido</p>
                    <a href="catalogo.html" class="btn btn-primary">Ir al Catálogo</a>
                </div>
            `;
            btnConfirmar.disabled = true;
            btnConfirmar.textContent = "Carrito vacío";
            return;
        }

        let total = 0;
        let html = `
            <div class="resumen-header">
                <h2>📋 Resumen de tu compra</h2>
            </div>
            <div class="items-list">
        `;

        items.forEach(i => {
            const p = i.producto;
            const subtotal = p.precio * i.cantidad;
            total += subtotal;

            html += `
                <div class="item-pedido">
                    <div class="item-info">
                        <div class="item-imagen">
                            ${p.imagenUrl ? 
                                `<img src="${p.imagenUrl}" alt="${p.nombreProducto}">` : 
                                `<div class="placeholder">${p.tipo === 'vinilo' ? '🎵' : '🎧'}</div>`
                            }
                        </div>
                        <div class="item-detalles">
                            <h4>${p.nombreProducto}</h4>
                            <p class="artista">${p.artista}</p>
                            <p class="tipo">${p.tipo === 'vinilo' ? 'Vinilo' : 'MP3 Digital'}</p>
                        </div>
                    </div>
                    <div class="item-precios">
                        <span class="cantidad">${i.cantidad} x $${p.precio}</span>
                        <span class="subtotal">$${subtotal}</span>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        
        html += `
            <div class="resumen-total">
                <div class="total-line">
                    <span>Total:</span>
                    <span class="total-amount">$${total}</span>
                </div>
            </div>
        `;

        div.innerHTML = html;
        
        // Restaurar botón
        btnConfirmar.disabled = false;
        btnConfirmar.textContent = originalText;

    } catch (error) {
        console.error("Error:", error);
        document.getElementById("resumen").innerHTML = `
            <div class="error-state">
                <h3>❌ Error al cargar el pedido</h3>
                <p>${error.message}</p>
                <button onclick="cargarResumen()" class="btn btn-secondary">Reintentar</button>
            </div>
        `;
        btnConfirmar.disabled = true;
        btnConfirmar.textContent = "Error";
    }
}

document.getElementById("btn-confirmar").onclick = async () => {
    const token = localStorage.getItem("token");
    const btnConfirmar = document.getElementById("btn-confirmar");

    try {
        // Mostrar loading
        const originalText = btnConfirmar.textContent;
        btnConfirmar.innerHTML = '<div class="loading"></div> Procesando...';
        btnConfirmar.disabled = true;

        const res = await fetch("/api/pedidos/crear", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Error al crear pedido");
        }

        // Mostrar confirmación
        alert("✅ Pedido creado con éxito");
        window.location.href = `confirmacion.html?id=${data.idPedido}`;

    } catch (error) {
        console.error("Error:", error);
        alert("❌ Error: " + error.message);
        
        // Restaurar botón
        btnConfirmar.disabled = false;
        btnConfirmar.textContent = originalText;
    }
};
