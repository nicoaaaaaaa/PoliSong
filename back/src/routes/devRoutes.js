import express from "express";
import Usuario from "../models/Usuario.js";
// Importa aquí Producto, Pedido, etc. cuando los tengas.

const router = express.Router();

// Borrar todos los usuarios
router.delete("/usuarios", async (req, res) => {
  try {
    await Usuario.destroy({ where: {}, truncate: true });
    res.json({ msg: "Todos los usuarios fueron eliminados." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar usuarios." });
  }
});

// Borrar usuario por ID
router.delete("/usuarios/:idUsuario", async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const deleted = await Usuario.destroy({ where: { idUsuario } });

    deleted
      ? res.json({ msg: `Usuario ${idUsuario} eliminado.` })
      : res.json({ msg: "No existe un usuario con ese ID." });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar usuario." });
  }
});

// Obtener usuarios actuales
router.get("/usuarios", async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
});

export default router;
