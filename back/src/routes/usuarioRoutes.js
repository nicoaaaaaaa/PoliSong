import express from "express";
import Usuario from "../models/Usuario.js";

const router = express.Router();

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({ msg: "Error al obtener usuarios" });
  }
});

// Registrar un usuario
router.post("/registro", async (req, res) => {
  try {
    const { nombre, correo, contraseña } = req.body;
    const nuevoUsuario = await Usuario.create({ nombre, correo, contraseña });
    res.json({ msg: "Usuario registrado exitosamente", usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ msg: "Error al registrar usuario", error });
  }
});

export default router;
