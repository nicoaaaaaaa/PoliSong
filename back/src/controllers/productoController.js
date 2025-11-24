// src/controllers/productoController.js
import Producto from "../models/Producto.js";
import Album from "../models/Album.js";
import fs from "fs";
import path from "path";
import { Op } from 'sequelize';

export const publicarVinilo = async (req, res) => {

  try {
    //const { idUsuario, nombre, precio, artista, año, genero, stock, descripcion } = req.body;

    const { idVendedor, nombreProducto, precio, artista, year, genero, stock, descripcion } = req.body;
    
    const albumCoincidente = await Album.findOne({
      where: {
        nombreAlbum: nombreProducto, // El nombre del vinilo = nombre del álbum
        artistaAlbum: artista,
        yearAlbum: year,
        generoAlbum: genero
      }
    });

    let IdAlbum = null;
    let mensajeExtra = "";

    if (albumCoincidente) {
      IdAlbum = albumCoincidente.idAlbum;
      mensajeExtra = ` y asociado automáticamente al álbum "${albumCoincidente.nombreAlbum}"`;
      
      console.log(`✅ Vinilo asociado automáticamente al álbum ID: ${IdAlbum}`);
    } else {
      console.log("ℹ️ No se encontró álbum coincidente para asociar automáticamente");
    }

    const nuevo = await Producto.create({
      nombreProducto,
      descripcion,
      precio,
      tipo: "vinilo",
      artista,
      year,
      genero,
      stock,
      IdAlbum: IdAlbum || null,
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

/*export const publicarmp3 = async (req, res) => {
  try{
  const { nombre, precio, artista, year, genero} =req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No se subió ningún archivo MP3" });
    }

    const archivoUrl = `/uploads/mp3/${req.file.filename}`;

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
};*/

export const publicarmp3 = async (req, res) => {
  try {
    const { nombreProducto, precio, artista, year, genero, trackNumber, IdAlbum } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No se subió ningún archivo MP3" });
    }

    // Primero se guarda el producto SIN archivoUrl
    const nuevo = await Producto.create({
      nombreProducto,
      precio,
      tipo: "mp3",
      artista,
      year,
      genero,
      archivoUrl: "", // temporal
      trackNumber,
      IdAlbum
    });

    // Nuevo nombre basado en id + nombre canción
    const nuevoNombre = `${nuevo.idProducto}_${nombreProducto.replace(/[^a-z0-9]/gi, "_")}.mp3`;

    const oldPath = req.file.path;
    const newPath = path.join(path.dirname(oldPath), nuevoNombre);

    // Renombrar archivo en la carpeta
    fs.renameSync(oldPath, newPath);

    // Actualizar producto con la URL final
    nuevo.archivoUrl = `/uploads/mp3/${nuevoNombre}`;
    await nuevo.save();

    res.json({
      mensaje: "MP3 publicado correctamente",
      producto: nuevo,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
