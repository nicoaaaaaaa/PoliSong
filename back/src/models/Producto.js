// src/models/Producto.js
import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";
import Usuario from "./Usuario.js";

const Producto = sequelize.define("Producto", {
  idProducto: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.STRING },
  precio: { type: DataTypes.FLOAT, allowNull: false },

  tipo: {
    type: DataTypes.ENUM("vinilo", "mp3"),
    allowNull: false,
  },

  // 🟦 Campos para vinilo
  artista: { type: DataTypes.STRING },
  año: { type: DataTypes.INTEGER },
  genero: { type: DataTypes.STRING },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },

  // 🟧 Campos para mp3
  archivoUrl: { type: DataTypes.STRING },
});

// Relación: vendedor → productos
Usuario.hasMany(Producto, { foreignKey: "vendedorId" });
Producto.belongsTo(Usuario, { foreignKey: "vendedorId" });

export default Producto;
