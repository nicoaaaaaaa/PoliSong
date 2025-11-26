import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";
import Usuario from "./Usuario.js";

const Notificacion = sequelize.define("Notificacion", {
  idNotificacion: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: "idUsuario"
    }
  },
  mensaje: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
        type: DataTypes.STRING(50),
        allowNull: true // ← Si está como false, cámbialo a true temporalmente
    },
  leida: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  refId: {
    type: DataTypes.INTEGER,
    allowNull: true, // ID del pedido relacionado
  },
}, {
  tableName: "notificaciones"
});

Usuario.hasMany(Notificacion, { foreignKey: "idUsuario" });
Notificacion.belongsTo(Usuario, { foreignKey: "idUsuario" });

export default Notificacion;
