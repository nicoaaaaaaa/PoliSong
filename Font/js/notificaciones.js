console.log("Token guardado:", localStorage.getItem("token"));

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    console.log("Token detectado ⇒", token ? token : "No hay token");

    if (!token) {
        console.warn("No hay token, redirigiendo al login...");
        return window.location.href = "login.html";
    }

    verificar(token);

    cargarNotificaciones();

    document.getElementById("btnNotificaciones").addEventListener("click", async (e) => {
        e.preventDefault();
        console.log("Botón clickeado 🚀");
        await toggleNotificaciones();
    });
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

async function cargarNotificaciones() {
    console.log("🚀 cargarNotificaciones() ejecutada");
    const token = localStorage.getItem("token");
    console.log("Token que se enviará:", token);
    if (!token) return [];

    try {
        const res = await fetch("/api/notificaciones/ver", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Error cargando notificaciones");
        
        const lista = await res.json();
        actualizarBadge(lista);
        return lista;
        
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}

async function toggleNotificaciones() {
    console.log("toggleNotificaciones ejecutado");

    const panel = document.getElementById("panelNotifs");
    console.log("Panel:", panel);

    if (!panel) {
        console.error("⚠️ ERROR: panelNotifs NO existe en el HTML");
        return;
    }

    // Si el panel está oculto, cargar notificaciones antes de mostrar
    if (panel.classList.contains("oculto")) {
        console.log("Panel estaba oculto, cargando notificaciones...");
        await renderNotificaciones();
    }

    panel.classList.toggle("oculto");
    console.log("Panel ahora visible:", !panel.classList.contains("oculto"));
}

function actualizarBadge(lista) {
    const badge = document.getElementById("badgeNotifs");
    if (!badge) {
        console.error("❌ Badge no encontrado");
        return;
    }

    const sinLeer = lista.filter(n => !n.leida).length;
    console.log("Notificaciones sin leer:", sinLeer);

    badge.textContent = sinLeer > 0 ? sinLeer : "";
    badge.style.display = sinLeer > 0 ? "inline" : "none";
}


// ================================
// 3. Pintar listado en el panel
// ================================
async function renderNotificaciones() {
    console.log("🔄 renderNotificaciones() ejecutado");
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const res = await fetch("/api/notificaciones/ver", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error("Error en la respuesta");
        
        const lista = await res.json();
        console.log("Notificaciones para renderizar:", lista);
        actualizarBadge(lista);
        renderListaNotificaciones(lista);
        
    } catch (error) {
        console.error("Error cargando notificaciones:", error);
    }
}

// Función separada para renderizar la lista
function renderListaNotificaciones(lista) {
    const panel = document.getElementById("panelNotifs");
    
    if (!panel) return;

    console.log("=== DEBUG NOTIFICACIONES ===");
    lista.forEach((n, index) => {
        console.log(`Notificación ${index}:`, {
            id: n.idNotificacion,
            tipo: n.tipo,
            refId: n.refId,
            leida: n.leida,
            mensaje: n.mensaje
        });
    });

    panel.innerHTML = "";

    if (lista.length === 0) {
        panel.innerHTML = `<div class="notif-item">No hay notificaciones</div>`;
        return;
    }

    lista.forEach(n => {
        const notifElement = document.createElement("div");
        notifElement.className = `notif-item ${n.leida ? "" : "nueva"}`;
        
        // Convertir refId a número para asegurar
        const refIdNum = parseInt(n.refId);
        const mostrarBotones = !n.leida && n.tipo === "pedido_vendedor";
        
        console.log(`Notificación ${n.idNotificacion}:`, {
            tipo: n.tipo,
            esperado: "pedido_vendedor",
            coincide: n.tipo === "pedido_vendedor",
            leida: n.leida,
            mostrarBotones: mostrarBotones
        });
        
        notifElement.innerHTML = `
            <p>${n.mensaje}</p>
            <small>${new Date(n.createdAt).toLocaleString()}</small>
            ${mostrarBotones ? `
                <div class="notif-actions">
                    <button onclick="aprobarPedido(${refIdNum})">Aceptar</button>
                    <button onclick="rechazarPedido(${refIdNum})">Rechazar</button>
                </div>
            ` : ""}
            ${!n.leida && !mostrarBotones ? `
                <button onclick="marcarLeida(${n.idNotificacion})">Marcar como leída</button>
            ` : ""}
        `;
        
        panel.appendChild(notifElement);
    });
}

// ================================
// 4. Marcar notificación como leída
// ================================
async function marcarLeida(id) {
    console.log("Marcando como leída notificación:", id);
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`/api/notificaciones/marcar/${id}`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
            console.log("Notificación marcada como leída");
            // Recargar notificaciones
            await renderNotificaciones();
        } else {
            console.error("Error marcando notificación como leída");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// ================================
// 5. Abrir notificación y redirigir
// ================================
async function abrirNotificacion(id, tipo, refId) {
    await marcarLeida(id);

    if (tipo === "pedido") {
        window.location.href = `pedido.html?id=${refId}`;
    }

    if (tipo === "venta") {
        window.location.href = `ventas.html`;
    }
}

async function aprobarPedido(id) {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/pedidos/aceptar/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (res.ok) {
        alert("Pedido aprobado");
        renderNotificaciones(); // recargar lista
    }
}

async function rechazarPedido(id) {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/pedidos/rechazar/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (res.ok) {
        alert("Pedido rechazado");
        renderNotificaciones();
    }
}

