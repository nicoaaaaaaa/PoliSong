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

    try {
        const res = await fetch("/api/carrito/ver", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Error al cargar el carrito");

        const items = await res.json();
        console.log("Items del carrito:", items);

        const div = document.getElementById("lista-carrito");
        div.innerHTML = "";

        if (items.length === 0) {
            div.innerHTML = `
                <div class="carrito-vacio">
                    <h2>🛒 Tu carrito está vacío</h2>
                    <p>¡Descubre música increíble en nuestro catálogo!</p>
                    <a href="catalogo.html" class="btn btn-primary">Explorar Catálogo</a>
                </div>
            `;
            return;
        }

        let total = 0;

        items.forEach(item => {
            const p = item.producto;
            const subtotal = p.precio * item.cantidad;
            total += subtotal;

            div.innerHTML += `
                <div class="item">
                    <div class="item-info">
                        <h3>${p.nombreProducto}</h3>
                        <p>🎤 ${p.artista}</p>
                        <p class="precio-total">$${subtotal.toFixed(2)}</p>
                    </div>
                    <div class="item-actions">
                        <div class="cantidad-control">
                            <span>${item.cantidad} x $${p.precio}</span>
                        </div>
                        <button onclick="eliminar(${item.idCarrito})">
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
            `;
        });

        div.innerHTML += `
            <div class="total-container">
                <h2>Total: $${total.toFixed(2)}</h2>
                <p class="envio-info">✅ Envío gratuito incluido</p>
            </div>
        `;

    } catch (error) {
        console.error("Error:", error);
        document.getElementById("lista-carrito").innerHTML = `
            <div class="error-carrito">
                <h2>❌ Error al cargar el carrito</h2>
                <p>Intenta recargar la página</p>
            </div>
        `;
    }
}

document.getElementById("btn-comprar").onclick = () => {
    window.location.href = "pedido.html";
};

async function eliminar(idCarrito) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
        return;
    }

    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`/api/carrito/eliminar/${idCarrito}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
            // Efecto visual de eliminación
            const item = document.querySelector(`[onclick="eliminar(${idCarrito})"]`).closest('.item');
            item.style.opacity = '0';
            item.style.transform = 'translateX(-100px)';
            
            setTimeout(() => {
                cargarCarrito();
            }, 300);
        } else {
            alert('Error al eliminar el producto');
        }
    } catch (error) {
        console.error("Error:", error);
        alert('Error de conexión');
    }
}
