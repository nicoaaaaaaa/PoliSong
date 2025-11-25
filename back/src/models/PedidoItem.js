// models/PedidoDetalle.js
import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";
import Pedido from "./Pedido.js";
import Producto from "./Producto.js";

const PedidoItem = sequelize.define("PedidoItem", {
  idPedidoItem: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idPedido: {
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
  precioUnitario: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

export default PedidoItem;

