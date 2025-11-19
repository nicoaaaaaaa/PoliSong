document.getElementById("loginForm").addEventListener("submit", async e => {
    e.preventDefault();

    const data = {
        correo: e.target.correo.value,
        contraseña: e.target.contraseña.value
    };

    const res = await fetch("/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const json = await res.json();
    alert(json.msg || json.error);

    // guardar usuario logueado
    if (json.usuario) {
        localStorage.setItem("usuario", JSON.stringify(json.usuario));
        window.location.href = "catalogo.html";
    }
});
