// src/controllers/productoController.js
import Producto from "../models/Producto.js";

export const publicarVinilo = async (req, res) => {

  try {
    //const { idUsuario, nombre, precio, artista, año, genero, stock, descripcion } = req.body;

    const { idVendedor, nombre, precio, artista, year, genero, stock, descripcion } = req.body;

    const nuevo = await Producto.create({
      nombre,
      descripcion,
      precio,
      tipo: "vinilo",
      artista,
      year,
      genero,
      stock,
      idVendedor,
    });

    /*const nuevo = await Producto.create({
      nombre,
      precio,
      tipo: "vinilo",
      artista,
      año,
      genero,
      stock,
      descripcion,
      vendedorId: idUsuario
    });*/

    /*const nuevo = await Producto.create({
      idUsuario,
      nombre,
      precio,
      tipo: "vinilo",
      artista,
      año,
      genero,
      stock,
      descripcion
    });*/


    res.json({
      mensaje: "Vinilo publicado correctamente",
      producto: nuevo,
    });

    console.log("📥 Datos recibidos en POST /publicar:");
    console.log(req.body); // <-- IMPORTANTE

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  
};

export const publicarmp3 = async (req, res) => {
  try{
  const { nombre, precio, artista, year, genero, archivoUrl} =req.body;

    const nuevo = await Producto.create({
      nombre,
      precio,
      tipo: "mp3",
      artista,
      year,
      genero,
      archivoUrl
    });

    res.json({
    mensaje: "Mp3 publicado correctamente",
    producto: nuevo,
    });
  } catch (err){
    res.status(500).json({ error: err.mensaje});
  }
};