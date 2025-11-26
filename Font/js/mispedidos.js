document.addEventListener("DOMContentLoaded", cargarMisPedidos);

async function cargarMisPedidos() {
    const token = localStorage.getItem("token");
    const contenedor = document.getElementById("lista-pedidos");

    try {
        const res = await fetch("/api/pedidos/mispedidos", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Error al cargar pedidos");

        const pedidos = await res.json();
        renderizarPedidos(pedidos);
        configurarFiltros(pedidos);

    } catch (error) {
        console.error("Error:", error);
        contenedor.innerHTML = `
            <div class="error-state">
                <h3>❌ Error al cargar pedidos</h3>
                <p>${error.message}</p>
                <button onclick="cargarMisPedidos()" class="btn btn-secondary">Reintentar</button>
            </div>
        `;
    }
}

function renderizarPedidos(pedidos, filtro = 'todos') {
    const contenedor = document.getElementById("lista-pedidos");
    
    if (pedidos.length === 0) {
        contenedor.innerHTML = `
            <div class="empty-state">
                <h3>📭 No hay pedidos</h3>
                <p>Aún no has realizado ningún pedido</p>
                <a href="catalogo.html" class="btn btn-primary">Explorar Catálogo</a>
            </div>
        `;
        return;
    }

    const pedidosFiltrados = filtro === 'todos' ? pedidos : pedidos.filter(p => p.estado === filtro);

    let html = '';
    
    pedidosFiltrados.forEach(pedido => {
        const fecha = new Date(pedido.createdAt).toLocaleDateString();
        const estadoClass = `estado-${pedido.estado}`;
        const estadoTexto = {
            'pendiente': '⏳ Pendiente',
            'aprobado': '✅ Aprobado', 
            'rechazado': '❌ Rechazado'
        }[pedido.estado] || pedido.estado;

        // Verificar si hay MP3 en el pedido para mostrar botón de descarga
        const tieneMP3 = pedido.PedidoItems.some(item => item.producto.tipo === "mp3");
        const pedidoAprobado = pedido.estado === "aprobado";

        html += `
            <div class="pedido-card" data-estado="${pedido.estado}">
                <div class="pedido-header">
                    <div class="pedido-info">
                        <h3>Pedido #${pedido.idPedido}</h3>
                        <span class="fecha">${fecha}</span>
                    </div>
                    <div class="pedido-estado">
                        <span class="estado ${estadoClass}">${estadoTexto}</span>
                        <span class="total">$${pedido.total}</span>
                    </div>
                </div>
                
                <div class="pedido-items">
                    ${pedido.PedidoItems.map(item => `
                        <div class="item-pedido-mini">
                            <div class="item-info-mini">
                                <span class="item-nombre">${item.producto.nombreProducto}</span>
                                <span class="item-tipo ${item.producto.tipo}">${item.producto.tipo === 'vinilo' ? '📀 Vinilo' : '🎵 MP3'}</span>
                            </div>
                            <span class="item-cantidad">${item.cantidad} x $${item.precioUnitario}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="pedido-actions">
                    <button onclick="verDetallePedido(${pedido.idPedido})" class="btn btn-secondary">
                        👁️ Ver Detalle
                    </button>
                    ${pedidoAprobado && tieneMP3 ? `
                        <button onclick="descargarMP3Pedido(${pedido.idPedido})" class="btn btn-success">
                            📥 Descargar MP3
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = html;
}

// Función para descargar todos los MP3 de un pedido
async function descargarMP3Pedido(idPedido) {
    const token = localStorage.getItem("token");
    
    try {
        // Obtener el detalle del pedido para saber qué MP3 descargar
        const res = await fetch(`/api/pedidos/${idPedido}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error("Error al obtener detalle del pedido");
        
        const pedido = await res.json();
        
        // Filtrar solo los MP3
        const mp3Items = pedido.PedidoItems.filter(item => item.producto.tipo === "mp3");
        
        if (mp3Items.length === 0) {
            alert("Este pedido no contiene archivos MP3 para descargar");
            return;
        }
        
        // Descargar cada MP3
        for (const item of mp3Items) {
            await descargarMP3Individual(item.producto.idProducto, item.producto.nombreProducto);
        }
        
    } catch (error) {
        console.error("Error:", error);
        alert("Error al descargar archivos: " + error.message);
    }
}

// Función para descargar un MP3 individual
async function descargarMP3Individual(idProducto, nombreProducto) {
    const token = localStorage.getItem("token");
    
    try {
        const res = await fetch(`/api/productos/descargar/${idProducto}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!res.ok) {
            throw new Error("No tienes permiso para descargar este archivo");
        }
        
        // Convertir respuesta a blob y descargar
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${nombreProducto.replace(/[^a-z0-9]/gi, "_")}.mp3`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
    } catch (error) {
        console.error("Error descargando MP3:", error);
        alert(`Error al descargar "${nombreProducto}": ${error.message}`);
    }
}

function configurarFiltros(pedidos) {
    const botonesFiltro = document.querySelectorAll('.btn-filter');
    
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', () => {
            // Remover active de todos
            botonesFiltro.forEach(b => b.classList.remove('active'));
            // Agregar active al clickeado
            boton.classList.add('active');
            
            const filtro = boton.dataset.filter;
            renderizarPedidos(pedidos, filtro);
        });
    });
}

function verDetallePedido(idPedido) {
    window.location.href = `detallepedido.html?id=${idPedido}`;
}