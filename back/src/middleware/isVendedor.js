// src/middleware/isVendedor.js
import Usuario from "../models/Usuario.js";

export const isVendedor = async (req, res, next) => {
  const { idUsuario } = req.body;

  const user = await Usuario.findByPk(idUsuario);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  if (user.rol !== "vendedor") {
    return res.status(403).json({ error: "No tienes permisos para publicar productos" });
  }

  next();
};
