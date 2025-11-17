import { Sequelize } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "polisong.db"),
  logging: false,
});

try {
  await sequelize.authenticate();
  console.log("✅ Conectado correctamente a SQLite.");
} catch (error) {
  console.error("❌ Error al conectar a SQLite:", error.message);
}

// 👇 asegúrate de exportar al final
export default sequelize;
