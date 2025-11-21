import express from "express";
import Usuario from "../models/Usuario.js";
import {registrarUsuario, iniciarSesion, cambiarRol, verPerfil} from "../controllers/usuarioController.js";
import autenticado from "../middleware/autenticado.js";

const router = express.Router();

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ msg: "Error al obtener usuarios" });
  }
});

router.delete("/e", async (req, res) => {
  try {
    await Usuario.destroy({
      where: {},
      truncate: true // reinicia la tabla
    });
    res.json({ msg: "Todos los usuarios fueron eliminados." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al borrar usuarios." });
  }
});

router.delete("/e/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Usuario.destroy({
      where: { idUsuario: id }
    });

    if (deleted) {
      res.json({ msg: `Usuario con ID ${id} eliminado.` });
    } else {
      res.status(404).json({ msg: "No existe un usuario con ese ID." });
    }

  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({ msg: "Error en el servidor." });
  }
});

router.post("/registro", registrarUsuario);

router.post("/login", iniciarSesion);

router.post("/cambiarRol", autenticado, cambiarRol);

router.post("/verPerfil", verPerfil);

router.get("/protegido", autenticado, (req, res) => {
    res.json({
        msg: "Acceso válido",
        usuario: req.usuario
    });
});

export default router;
