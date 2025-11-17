// REGISTRO
document.getElementById("registroForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target));

    const res = await fetch("/api/usuarios/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    document.getElementById("resultado").textContent = await res.text();
});


// LOGIN
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target));

    const res = await fetch("/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    document.getElementById("resultado").textContent = await res.text();
});


// VER USUARIOS
document.getElementById("verUsuariosBtn").addEventListener("click", async () => {
    const res = await fetch("/api/usuarios");
    document.getElementById("resultado").textContent = await res.text();
});

// Borrar todos los usuarios

document.getElementById("borrarTodosUsuarios").addEventListener("click", async () => {
    const res = await fetch("/api/usuarios/e", {
        method: "DELETE"
    });

    const data = await res.json();
    document.getElementById("resultado").textContent = data.msg;
});

document.getElementById("btnEliminarUsuario").addEventListener("click", async () => {
    const id = document.getElementById("idEliminar").value;

    if (!id) {
        document.getElementById("resultado").textContent = "Debes ingresar un ID.";
        return;
    }

    const res = await fetch(`/api/usuarios/e/${id}`, {
        method: "DELETE"
    });

    const data = await res.json();
    document.getElementById("resultado").textContent = data.msg;
});
