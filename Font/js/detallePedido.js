const idPedido = new URLSearchParams(window.location.search).get("id");

document.addEventListener("DOMContentLoaded", cargarDetallePedido);

async function cargarDetallePedido() {
    const token = localStorage.getItem("token");
    const contenedor = document.getElementById("detalle-pedido");

    if (!idPedido) {
        contenedor.innerHTML = `
            <div class="error-state">
                <h3>❌ Pedido no especificado</h3>
                <p>No se proporcionó un ID de pedido válido</p>
                <a href="mis-pedidos.html" class="btn btn-primary">Volver a Mis Pedidos</a>
            </div>
        `;
        return;
    }

    try {
        const res = await fetch(`/api/pedidos/${idPedido}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            if (res.status === 404) {
                throw new Error("Pedido no encontrado");
            } else {
                throw new Error("Error al cargar el pedido");
            }
        }

        const pedido = await res.json();
        renderizarDetallePedido(pedido);

    } catch (error) {
        console.error("Error:", error);
        contenedor.innerHTML = `
            <div class="error-state">
                <h3>❌ Error al cargar el pedido</h3>
                <p>${error.message}</p>
                <a href="mis-pedidos.html" class="btn btn-primary">Volver a Mis Pedidos</a>
            </div>
        `;
    }
}

function renderizarDetallePedido(pedido) {
    const contenedor = document.getElementById("detalle-pedido");
    const fecha = new Date(pedido.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const estadoClass = `estado-${pedido.estado}`;
    const estadoTexto = {
        'pendiente': '⏳ Pendiente de aprobación',
        'aprobado': '✅ Aprobado', 
        'rechazado': '❌ Rechazado'
    }[pedido.estado] || pedido.estado;

    // Separar productos por tipo
    const vinilos = pedido.PedidoItems.filter(item => item.producto.tipo === "vinilo");
    const mp3s = pedido.PedidoItems.filter(item => item.producto.tipo === "mp3");

    let html = `
        <div class="detalle-pedido-card">
            <div class="detalle-header">
                <div class="pedido-info-detalle">
                    <h2>Pedido #${pedido.idPedido}</h2>
                    <p class="fecha-detalle">Realizado el ${fecha}</p>
                </div>
                <div class="estado-detalle">
                    <span class="estado ${estadoClass}">${estadoTexto}</span>
                    <div class="total-detalle">$${pedido.total}</div>
                </div>
            </div>

        <div class="detalle-content">
    `;

    // Mostrar información del vendedor si existe
    if (pedido.Vendedor) {
        html += `
            <div class="vendedor-info-detalle">
                <h3>👤 Información del Vendedor</h3>
                <p><strong>Nombre:</strong> ${pedido.Vendedor.nombreUsuario}</p>
                ${pedido.Vendedor.email ? `<p><strong>Email:</strong> ${pedido.Vendedor.email}</p>` : ''}
            </div>
        `;
    }

    // Sección de Vinilos (productos físicos)
    if (vinilos.length > 0) {
        html += `
            <div class="seccion-productos">
                <h3>📀 Vinilos</h3>
                <div class="productos-lista">
                    ${vinilos.map(item => `
                        <div class="producto-detalle">
                            <div class="producto-imagen">
                                ${item.producto.imagenUrl ? 
                                    `<img src="${item.producto.imagenUrl}" alt="${item.producto.nombreProducto}">` : 
                                    `<div class="placeholder">🎵</div>`
                                }
                            </div>
                            <div class="producto-info-detalle">
                                <h4>${item.producto.nombreProducto}</h4>
                                <p class="artista">${item.producto.artista}</p>
                                <p class="detalles">${item.cantidad} x $${item.precioUnitario}</p>
                                <p class="subtipo">Producto físico - Envío pendiente</p>
                            </div>
                            <div class="producto-subtotal">
                                $${item.cantidad * item.precioUnitario}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Sección de MP3 (descargas digitales)
    if (mp3s.length > 0) {
        const puedeDescargar = pedido.estado === "aprobado";
        
        html += `
            <div class="seccion-productos">
                <h3>🎵 Canciones Digitales (MP3)</h3>
                <div class="productos-lista">
                    ${mp3s.map(item => `
                        <div class="producto-detalle digital">
                            <div class="producto-imagen">
                                <div class="placeholder">🎧</div>
                            </div>
                            <div class="producto-info-detalle">
                                <h4>${item.producto.nombreProducto}</h4>
                                <p class="artista">${item.producto.artista}</p>
                                <p class="detalles">${item.cantidad} x $${item.precioUnitario}</p>
                                ${puedeDescargar ? `
                                    <button onclick="descargarMP3Individual(${item.producto.idProducto}, '${item.producto.nombreProducto}')" 
                                            class="btn btn-success btn-sm">
                                        📥 Descargar
                                    </button>
                                ` : `
                                    <p class="subtipo">Disponible después de la aprobación</p>
                                `}
                            </div>
                            <div class="producto-subtotal">
                                $${item.cantidad * item.precioUnitario}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    html += `
            </div>

            <div class="detalle-actions">
                ${pedido.estado === "aprobado" && mp3s.length > 0 ? `
                    <button onclick="descargarMP3Pedido(${pedido.idPedido})" class="btn btn-primary">
                        📥 Descargar Todos los MP3
                    </button>
                ` : ''}
                <a href="mispedidos.html" class="btn btn-secondary">Volver a Mis Pedidos</a>
            </div>
        </div>
    `;

    contenedor.innerHTML = html;
}