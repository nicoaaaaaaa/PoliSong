import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Album = sequelize.define("Album", {
  idAlbum: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombreAlbum: { type: DataTypes.STRING, allowNull: false },
  artistaAlbum: { type: DataTypes.STRING, allowNull: false },
  yearAlbum: { type: DataTypes.INTEGER, allowNull: false },
  generoAlbum: { type: DataTypes.STRING, allowNull: false }
});

export default Album;

