// src/models/Usuario.js
import { DataTypes } from "sequelize";
//import Carrito from "./Carrito.js";
import sequelize from "../db/connection.js";

const Usuario = sequelize.define("Usuario", {
  idUsuario: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombreUsuario: { type: DataTypes.STRING, allowNull: false },
  correo: { type: DataTypes.STRING, allowNull: false, unique: true },
  contraseña: { type: DataTypes.STRING, allowNull: false },
  rol: {
    type: DataTypes.ENUM("comprador", "vendedor"),
    allowNull: false,
    defaultValue: "comprador"
  }
});

/*Usuario.hasMany(Carrito, { foreignKey: "idUsuario" });*/

export default Usuario;
