document.getElementById("cambiarRol").addEventListener("click", async () => {
    const res = await fetch("/api/usuarios/cambiar-rol", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const data = await res.json();
    document.getElementById("resultado").textContent = data.msg;
});

document.getElementById("nuevoViniloForm").addEventListener("submit", async e => {
    e.preventDefault();

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || usuario.rol !== "vendedor") {
        alert("No tienes permisos para publicar productos.");
        return;
    }

    const data = {
        idVendedor: usuario.idUsuario,
        nombre: e.target.nombre.value,
        precio: e.target.precio.value,
        stock: e.target.stock.value,
        descripcion: e.target.descripcion.value,
        tipo: "vinilo"
    };

    const res = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const json = await res.json();
    alert(json.msg || json.error);
});
