// src/models/Usuario.js
import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Usuario = sequelize.define("Usuario", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  correo: { type: DataTypes.STRING, allowNull: false, unique: true },
  contraseña: { type: DataTypes.STRING, allowNull: false },
  rol: {
    type: DataTypes.ENUM("comprador", "vendedor"),
    allowNull: false,
    defaultValue: "comprador"
  }
});

export default Usuario;
