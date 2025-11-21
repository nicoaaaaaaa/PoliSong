console.log("Token guardado:", localStorage.getItem("token"));

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    console.log("Token detectado ⇒", token ? token : "No hay token");

    if (!token) {
        console.warn("No hay token, redirigiendo al login...");
        return window.location.href = "login.html";
    }

    cargarPerfil(token);
});

document.getElementById("cambiarRol").addEventListener("click", async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/usuarios/cambiarRol", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token 
        }
    });

    const data = await res.json();

    alert(data.msg);

    if (data.token) {
        // Guardamos el token nuevo
        localStorage.setItem("token", data.token);
    }
});

document.getElementById("nuevoViniloForm").addEventListener("submit", async e => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.rol !== "vendedor") {
    alert("No tienes permisos para publicar productos.");
    return;
    }

    const data = {
        idVendedor: payload.idUsuario,
        nombre: e.target.nombre.value,
        precio: e.target.precio.value,
        artista: e.target.artista.value,
        year: e.target.year.value,
        genero: e.target.genero.value,
        stock: e.target.stock.value,
        descripcion: e.target.descripcion.value,
        tipo: "vinilo"
    };

    const res = await fetch("/api/productos/publicarV", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`  
        },
        body: JSON.stringify(data)
    });

    const json = await res.json();
    console.log("📌 RESPUESTA DEL SERVIDOR:", json);
    console.log("📌 STATUS:", res.status);

    alert(JSON.stringify(json, null, 2));

});

document.getElementById("nuevoMp3Form").addEventListener("submit", async e => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.rol !== "vendedor") {
    alert("No tienes permisos para publicar productos.");
    return;
    }

    const data = {
        nombre: e.target.nombre.value,
        precio: e.target.precio.value,
        artista: e.target.artista.value,
        year: e.target.year.value,
        genero: e.target.genero.value,
        archivoUrl: e.target.archivoUrl.value,
        tipo: "mp3"
    };

    const res = await fetch("/api/productos/publicarM", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`  
        },
        body: JSON.stringify(data)
    });

    const json = await res.json();
    console.log("📌 RESPUESTA DEL SERVIDOR:", json);
    console.log("📌 STATUS:", res.status);

    alert(JSON.stringify(json, null, 2));

});