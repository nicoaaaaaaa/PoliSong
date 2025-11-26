// src/models/Producto.js
import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";
import Usuario from "./Usuario.js";
import Album from "./Album.js";
//import Carrito from "./Carrito.js";

const Producto = sequelize.define("Producto", {
  idProducto: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  idVendedor: { type: DataTypes.STRING },
  idAlbum: {
  type: DataTypes.INTEGER,
  references: {
    model: Album,
    key: "idAlbum"
  }
},
  nombreProducto: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.STRING },
  precio: { type: DataTypes.FLOAT, allowNull: false },

  tipo: {
    type: DataTypes.ENUM("vinilo", "mp3"),
    allowNull: false,
  },
  artista: { type: DataTypes.STRING, allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: false},
  genero: { type: DataTypes.STRING, allowNull: false },
  // 🟦 Campos para vinilo
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  imagenUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // 🟧 Campos para mp3
  archivoUrl: { type: DataTypes.STRING },
  trackNumber: {type: DataTypes.INTEGER,allowNull: true,}
});

// Relación vendedor → productos
Usuario.hasMany(Producto, { foreignKey: "idVendedor" });
Producto.belongsTo(Usuario, { foreignKey: "idVendedor" });

// Relación álbum → vinilos/mp3
Album.hasMany(Producto, { foreignKey: "idAlbum" });
Producto.belongsTo(Album, { foreignKey: "idAlbum" });

/*Producto.hasMany(Carrito, {
  foreignKey: "idProducto",
  as: "carritos"
});*/

export default Producto;
