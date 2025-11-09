import express from "express";
import cors from "cors";
import sequelize from "./db/connection.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Sincronizar la base de datos
sequelize.sync({ force: false }).then(() => {
  console.log("🗃️ Base de datos sincronizada con SQLite.");
});

(async () => {
  try {
    await sequelize.sync({ alter: true }); // crea las tablas si no existen
    console.log("🗄️ Base de datos sincronizada correctamente.");
  } catch (error) {
    console.error("❌ Error al sincronizar la base de datos:", error.message);
  }
})();

// Rutas
app.use("/api/usuarios", usuarioRoutes);

app.get("/", (req, res) => {
  res.send("Servidor activo 🎶");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

app.get("/api/prueba", (req, res) => {
  res.send("Ruta de prueba funcionando correctamente ✅");
});