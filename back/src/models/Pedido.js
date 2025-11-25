import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";
import Usuario from "./Usuario.js";

const Pedido = sequelize.define("Pedido", {

  idPedido: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  idVendedor: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  estado: {
    type: DataTypes.ENUM("pendiente", "aprobado", "rechazado"),
    defaultValue: "pendiente"
  },

  total: {
    type: DataTypes.FLOAT,
    allowNull: false
  }

});

Pedido.belongsTo(Usuario, { foreignKey: "idUsuario", as: "Comprador" });
Pedido.belongsTo(Usuario, { foreignKey: "idVendedor", as: "Vendedor" });

export default Pedido;
