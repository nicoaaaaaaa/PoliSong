// src/routes/productoRoutes.js
import Producto from "../models/Producto.js";
import express from "express";
import { descargarMP3, obtenerProductos, publicarmp3, publicarVinilo,
  obtenerProductoPorId
 } from "../controllers/productoController.js";
import { isVendedor } from "../middleware/isVendedor.js";
import autenticado from "../middleware/autenticado.js";
import uploadSingle from "../middleware/upload.js";
import uploadImage from "../middleware/uploadImages.js";
import { obtenerAlbumPorId } from "../controllers/albumController.js";

const router = express.Router();

// Solo vendedores pueden publicar
router.post("/publicarV", autenticado, isVendedor, uploadImage.single('imagen'),publicarVinilo);

router.post("/publicarM", autenticado, isVendedor, uploadSingle.single("archivo"),publicarmp3);

router.get("/descargar/:id", autenticado, descargarMP3)

router.get("/ver", obtenerProductos);

router.get("/ver/:id", obtenerProductoPorId);

router.delete("/e", async (req, res) => {
  try {
    await Producto.destroy({
      where: {},
      truncate: true // reinicia la tabla
    });
    res.json({ msg: "Todos los productos fueron eliminados." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al borrar productos." });
  }
});

router.delete("/e/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Producto.destroy({
      where: { idProducto: id }
    });

    if (deleted) {
      res.json({ msg: `Producto con ID ${id} eliminado.` });
    } else {
      res.status(404).json({ msg: "No existe un Producto con ese ID." });
    }

  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    res.status(500).json({ msg: "Error en el servidor." });
  }
});

export default router;
