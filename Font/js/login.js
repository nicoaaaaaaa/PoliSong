const token = localStorage.getItem("token");

if (token) {
    window.location.href = "dashboard.html";
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const correo = document.getElementById("correo").value;
    const contraseña = document.getElementById("contraseña").value;

    const res = await fetch("/api/usuarios/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ correo, contraseña })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.msg || "Error al iniciar sesión");
        return;
    }

    // Guardar token en localStorage
    localStorage.setItem("token", data.token);

    // Redirigir al dashboard
    window.location.href = "/dashboard.html";
});
