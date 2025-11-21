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

    console.log("Token guardado:", localStorage.getItem("token"));

    document.getElementById("resultado").textContent = await res.text();
});


// VER USUARIOS

document.getElementById("mostrarUsuarios").addEventListener("click", async () => {
    const res = await fetch("/api/usuarios"); // Ajustar ruta si es diferente
    const usuarios = await res.json();

    console.log("Usuarios recibidos:", usuarios);

    const tbody = document.querySelector("#tablaUsuarios tbody");
    tbody.innerHTML = ""; // limpiar tabla antes de agregar nuevos datos

    usuarios.forEach(usuario => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${usuario.idUsuario}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.correo}</td>
            <td>${usuario.rol}</td>
        `;

        tbody.appendChild(fila);
    });
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
    const id = document.getElementById("idEliminarU").value;

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

// VER Productos

document.getElementById("mostrarProductos").addEventListener("click", async () => {
    const res = await fetch("/api/productos/ver"); // Ajustar ruta si es diferente
    const productos = await res.json();

    console.log("Productos recibidos:", productos);

    const tbody = document.querySelector("#tablaProductos tbody");
    tbody.innerHTML = ""; // limpiar tabla antes de agregar nuevos datos

    productos.forEach(productos => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${productos.idProducto}</td>
            <td>${productos.nombre}</td>
            <td>${productos.artista}</td>
            <td>${productos.idVendedor}</td>
        `;

        tbody.appendChild(fila);
    });
});

// Borrar todos los productos

document.getElementById("borrarTodosProductos").addEventListener("click", async () => {
    const res = await fetch("/api/productos/e", {
        method: "DELETE"
    });

    const data = await res.json();
    document.getElementById("resultado").textContent = data.msg;
});

document.getElementById("btnEliminarProducto").addEventListener("click", async () => {
    const id = document.getElementById("idEliminarP").value;

    if (!id) {
        document.getElementById("resultado").textContent = "Debes ingresar un ID.";
        return;
    }

    const res = await fetch(`/api/productos/e/${id}`, {
        method: "DELETE"
    });

    const data = await res.json();
    document.getElementById("resultado").textContent = data.msg;
});
