import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";
//import Producto from "./Producto.js";
//import Usuario from "./Usuario.js";

const Carrito = sequelize.define("Carrito", {
  idCarrito: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idProducto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  tipoProducto: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "vinilo"
  },
  precioUnitario: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 0
  }
});

/*Carrito.belongsTo(Usuario, { foreignKey: "idUsuario" });
Carrito.belongsTo(Producto, {
  foreignKey: "idProducto",
  as: "producto"
});*/

export default Carrito;
