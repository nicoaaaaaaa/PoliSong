// src/controllers/productoController.js
import Producto from "../models/Producto.js";

export const publicarVinilo = async (req, res) => {
  try {
    const { idUsuario, nombre, precio, artista, año, genero, stock } = req.body;

    const nuevo = await Producto.create({
      nombre,
      precio,
      tipo: "vinilo",
      artista,
      año,
      genero,
      stock,
      vendedorId: idUsuario,
    });

    res.json({
      mensaje: "Vinilo publicado correctamente",
      producto: nuevo,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
