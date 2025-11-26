import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./db/connection.js";
import { verificarIntegridad } from "./controllers/debugController.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";
import albumRoutes from "./routes/albumRoutes.js";
import carritoRoutes from "./routes/carritoRoutes.js"
import pedidoRoutes from "./routes/pedidoRoutes.js"
import notificacionRoutes from "./routes/notificacionRoutes.js"
import "./models/Associations.js"
import path from "path";
import { fileURLToPath } from 'url';
import autenticado from "./middleware/autenticado.js";
import { obtenerNotificaciones } from "./controllers/notificacionController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

dotenv.config();
const app = express();
app.use(cors());


// En index.js, después de app.use(cors());
/*app.use((req, res, next) => {
  console.log('=== INICIO REQUEST ===');
  console.log('URL:', req.url);
  console.log('Method:', req.method);
  console.log('Content-Type:', req.get('Content-Type'));
  console.log('Content-Length:', req.get('Content-Length'));
  console.log('=== FIN REQUEST ===');
  next();
});*/

//app.use(express.json());

app.use(express.static(path.join(__dirname, "../../Font")));

// Sincronizar la base de datos
// En tu index.js o donde sincronizas
sequelize.sync({ force: false })
  .then(() => {
    console.log("🗃️  Base de datos sincronizada correctamente");
  })
  .catch(error => {
    console.error("❌ ERROR DE SINCRONIZACIÓN:", error.name);
    console.error("📝 Mensaje:", error.message);
    console.error("🔍 Detalles:", error.errors ? error.errors.map(e => ({
      campo: e.path,
      valor: e.value,
      tipo: e.type,
      mensaje: e.message
    })) : 'No hay detalles adicionales');
    
    // Para errores de validación específicos
    if (error.name === 'SequelizeValidationError') {
      error.errors.forEach(err => {
        console.log(`🚨 Error en campo "${err.path}": ${err.message}`);
        console.log(`   Valor: ${err.value}`);
        console.log(`   Tipo: ${err.type}`);
      });
    }
  });

(async () => {
  try {
    await sequelize.sync(); // crea las tablas si no existen
    console.log("🗄️ Base de datos sincronizada correctamente.");
  } catch (error) {
    console.error("Error al sincronizar la base de datos:", error.message);
  }
})();

// Rutas

app.get("/", (req, res) => {
  res.send("Servidor activo 🎶");
});

/*app.get('/estado-db', verificarIntegridad);

app.use("/api/usuarios", usuarioRoutes);

app.use("/api/productos", productoRoutes);

app.use("/api/albumes",albumRoutes);

app.use("/api/carrito", carritoRoutes);

app.use("/api/pedidos", pedidoRoutes);

app.use("/api/notificaciones", notificacionRoutes);

app.use('/uploads/images', express.static(path.join(__dirname, 'uploads', 'images')));

app.use('/uploads/mp3', express.static(path.join(__dirname, 'uploads', 'mp3')));*/

app.use("/api/usuarios", express.json(), usuarioRoutes);
app.use("/api/carrito", express.json(), carritoRoutes);
app.use("/api/pedidos", express.json(), pedidoRoutes);
app.use("/api/notificaciones", express.json(), notificacionRoutes);

app.use("/api/productos", productoRoutes);
app.use("/api/albumes", albumRoutes);

app.use('/uploads/images', express.static(path.join(projectRoot, 'uploads', 'images')));
app.use('/uploads/mp3', express.static(path.join(projectRoot, 'uploads', 'mp3')));
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.get("/api/prueba", (req, res) => {
  res.send("Ruta de prueba funcionando correctamente ✅");
});

