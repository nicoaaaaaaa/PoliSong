document.getElementById("registroForm").addEventListener("submit", async e => {
    e.preventDefault();

    const data = {
        nombre: e.target.nombre.value,
        correo: e.target.correo.value,
        contraseña: e.target.contraseña.value
    };

    const res = await fetch("/api/usuarios/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const json = await res.json();
    alert(json.msg || json.error);
});
