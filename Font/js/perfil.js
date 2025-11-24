// ===============================
// DASHBOARD.JS CORREGIDO
// ===============================

// Verificar token al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    console.log("Token detectado ⇒", token ? token : "No hay token");

    if (!token) {
        console.warn("No hay token, redirigiendo al login...");
        return window.location.href = "login.html";
    }

    cargarPerfil(token);
});

// ===============================
// Cargar datos del perfil
// ===============================
async function cargarPerfil(token) {
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

        // Mostrar datos en el dashboard
        document.getElementById("nombreUsuario").textContent = data.usuario.nombreUsuario;
        document.getElementById("rolUsuario").textContent = data.usuario.rol;

    } catch (error) {
        console.error("Error cargando el perfil:", error);
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }
}

// ===============================
// Cerrar sesión
// ===============================
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});
