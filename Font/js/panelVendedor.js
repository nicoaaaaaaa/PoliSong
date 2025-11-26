console.log("Token guardado:", localStorage.getItem("token"));

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    console.log("Token detectado ⇒", token ? token : "No hay token");

    if (!token) {
        console.warn("No hay token, redirigiendo al login...");
        return window.location.href = "login.html";
    }

    verificar(token);
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

document.getElementById("tipoPublicacion").addEventListener("change", (e) => {
    const tipo = e.target.value;

    document.getElementById("formVinilo").style.display = tipo === "vinilo" ? "block" : "none";
    document.getElementById("formMp3").style.display = tipo === "mp3" ? "block" : "none";
    document.getElementById("formAlbum").style.display = tipo === "album" ? "block" : "none";
});


document.getElementById("nuevoViniloForm").addEventListener("submit", async e => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.rol !== "vendedor") {
    alert("No tienes permisos para publicar productos.");
    return;
    }

    const formData = new FormData();
    formData.append("idVendedor", payload.idUsuario);
    formData.append("nombreProducto", e.target.nombreProducto.value);
    formData.append("precio", e.target.precio.value);
    formData.append("artista", e.target.artista.value);
    formData.append("year", e.target.year.value);
    formData.append("genero", e.target.genero.value);
    formData.append("stock", e.target.stock.value);
    formData.append("descripcion", e.target.descripcion.value);
    formData.append("tipo", "vinilo");

    const imagenFile = e.target.imagenVinilo?.files[0];
    if (imagenFile) {
        formData.append("imagen", imagenFile);
    }

    const btn = document.getElementById("publicarVinilo");
    const originalText = btn.textContent;
    btn.textContent = "Publicando...";
    btn.disabled = true;

    try {
        const res = await fetch("/api/productos/publicarV", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${token}`  
            },
            body: formData
        });

        const json = await res.json();
        console.log("📌 RESPUESTA DEL SERVIDOR:", json);
        console.log("📌 STATUS:", res.status);

        alert(JSON.stringify(json, null, 2));

    } catch (error) {
        console.error("Error:", error);
        alert("❌ Error de conexión");
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
});

document.getElementById("nuevoMp3Form").addEventListener("submit", async e => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.rol !== "vendedor") {
    alert("No tienes permisos para publicar productos.");
    return;
    }

    const formData = new FormData();
    formData.append("nombreProducto", e.target.nombreProducto.value);
    formData.append("precio", e.target.precio.value);
    formData.append("artista", e.target.artista.value);
    formData.append("year", e.target.year.value);
    formData.append("genero", e.target.genero.value);
    formData.append("tipo", "mp3");

    formData.append("archivo", e.target.archivoUrl.files[0]);



    const res = await fetch("/api/productos/publicarM", {
        method: "POST",
        headers: { 
            "Authorization": `Bearer ${token}`  
        },
        body: formData
    });

    const json = await res.json();
    console.log("📌 RESPUESTA DEL SERVIDOR:", json);
    console.log("📌 STATUS:", res.status);

    alert(JSON.stringify(json, null, 2));

});

document.getElementById("generarTracks").addEventListener("click", (e) => {
    e.preventDefault();

    const contenedor = document.getElementById("contenedorTracks");
    const cantidad = document.getElementById("cantidadTracks").value;

    if (cantidad < 1 || cantidad > 30) {
        alert("La cantidad debe ser entre 1 y 30 canciones");
        return;
    }

    contenedor.innerHTML = "";

    for (let i = 0; i < cantidad; i++) {
        contenedor.innerHTML += `
            <div class="cancion-item" style="border: 1px solid #ccc; padding: 10px; margin: 10px 0;">
                <h4>Canción ${i + 1}</h4>
                <input type="text" class="track-nombre" placeholder="Nombre" required>
                <input type="number" class="track-year" placeholder="Año" required>
                <input type="text" class="track-genero" placeholder="Género">
                <input type="number" class="track-precio" placeholder="Precio" required step="0.01" min="0">
                <input type="file" class="archivo-cancion" accept=".mp3" required>
                <small>Archivo: .mp3</small>
            </div>
        `;
    }
});


document.getElementById("nuevoAlbum").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const token = localStorage.getItem("token");

    // Datos del álbum
    formData.append("nombreAlbum", document.getElementById("albumNombre").value);
    formData.append("artistaAlbum", document.getElementById("albumArtista").value);
    formData.append("yearAlbum", document.getElementById("albumYear").value);
    formData.append("generoAlbum", document.getElementById("albumGenero").value);

    const imagenAlbum = document.getElementById("imagenAlbum")?.files[0];
    if (imagenAlbum) {
        formData.append("imagenAlbum", imagenAlbum);
    }

    // Procesar canciones
    const canciones = [];
    const itemsCancion = document.querySelectorAll(".cancion-item");

    // Validar que hay canciones
    if (itemsCancion.length === 0) {
        alert("Primero genera los espacios para las canciones");
        return;
    }

    let hayErrores = false;

    itemsCancion.forEach((item, index) => {
        const nombre = item.querySelector(".track-nombre").value;
        const year = item.querySelector(".track-year").value;
        const genero = item.querySelector(".track-genero").value;
        const precio = item.querySelector(".track-precio").value;
        const archivo = item.querySelector(".archivo-cancion").files[0]; // CORREGIDO: archivo-cancion

        // Validaciones básicas
        if (!nombre || !precio || !archivo) {
            alert(`Faltan datos en la canción ${index + 1}`);
            hayErrores = true;
            return;
        }

        canciones.push({ 
            nombre, 
            year: year || document.getElementById("albumYear").value,
            genero: genero || document.getElementById("albumGenero").value,
            precio 
        });

        formData.append(`cancion${index}`, archivo);
    });

    if (hayErrores) return;

    formData.append("canciones", JSON.stringify(canciones));

    try {
        const res = await fetch("/api/albumes/crear", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${token}`  
            },
            body: formData
        });

        const data = await res.json();
        console.log("RESPUESTA DEL SERVIDOR:", data);

        if (!res.ok) {
            alert("Error: " + (data.error || "Error desconocido"));
            return;
        }

        alert("Álbum publicado correctamente");
        // Limpiar formulario
        document.getElementById("nuevoAlbum").reset();
        document.getElementById("contenedorTracks").innerHTML = "";
        
    } catch (e) {
        console.error("Error al enviar:", e);
        alert("Error de conexión al intentar publicar el álbum");
    }
});
