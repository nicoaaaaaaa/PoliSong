// controllers/debugController.js
import Album from "../models/Album.js";
import Producto from "../models/Producto.js";
import sequelize from "../db/connection.js";
import { Op } from "sequelize";

export const verificarIntegridad = async (req, res) => {
  try {
    console.log('🔍 Verificando integridad de datos...');

    // Productos con IdAlbum pero sin álbum existente
    const productosHuerfanos = await sequelize.query(`
      SELECT p."idProducto", p."nombreProducto", p."IdAlbum"
      FROM "Productos" p
      LEFT JOIN "Albums" a ON p."IdAlbum" = a."idAlbum"
      WHERE p."IdAlbum" IS NOT NULL AND a."idAlbum" IS NULL
    `, { type: sequelize.QueryTypes.SELECT });

    // Álbumes sin productos
    const albumesVacios = await sequelize.query(`
      SELECT a."idAlbum", a."nombreAlbum"
      FROM "Albums" a
      LEFT JOIN "Productos" p ON a."idAlbum" = p."IdAlbum"
      WHERE p."idProducto" IS NULL
    `, { type: sequelize.QueryTypes.SELECT });

    // Estadísticas generales
    const totalAlbumes = await Album.count();
    const totalProductos = await Producto.count();
    const productosConAlbum = await Producto.count({ 
      where: { IdAlbum: { [Op.ne]: null } } 
    });

    const resultado = {
      totalAlbumes,
      totalProductos,
      productosConAlbum,
      productosSinAlbum: totalProductos - productosConAlbum,
      productosHuerfanos: productosHuerfanos.length,
      albumesVacios: albumesVacios.length,
      detalles: {
        productosHuerfanos,
        albumesVacios
      }
    };

    console.log('📊 Resultado verificación:', resultado);
    res.json(resultado);

  } catch (error) {
    console.error('❌ Error en verificación:', error);
    res.status(500).json({ error: error.message });
  }
};

export const repararBaseDatos = async (req, res) => {
  try {
    console.log('🔧 Iniciando reparación de base de datos...');

    // Reparar productos huerfanos (IdAlbum que no existe)
    const [resultado] = await sequelize.query(`
      UPDATE "Productos" 
      SET "IdAlbum" = NULL 
      WHERE "IdAlbum" IS NOT NULL 
      AND "IdAlbum" NOT IN (SELECT "idAlbum" FROM "Albums")
    `);

    console.log(`✅ Reparación completada: ${resultado} productos reparados`);
    res.json({ 
      mensaje: `Base de datos reparada: ${resultado} productos huerfanos corregidos`,
      productosReparados: resultado 
    });

  } catch (error) {
    console.error('❌ Error reparando BD:', error);
    res.status(500).json({ error: error.message });
  }
};