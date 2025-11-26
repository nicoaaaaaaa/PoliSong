// src/controllers/productoController.js
import Producto from "../models/Producto.js";
import Album from "../models/Album.js";
import fs from "fs";
import path from "path";
import { Op } from 'sequelize';

export const publicarVinilo = async (req, res) => {

  try {
    console.log("📥 Body recibido:", req.body);
    console.log("📁 Archivo recibido:", req.file);

    // ✅ VERIFICAR SI req.body ESTÁ VACÍO
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        error: "Datos del formulario no recibidos. ¿Estás usando FormData en el frontend?" 
      });
    }
    //const { idUsuario, nombre, precio, artista, año, genero, stock, descripcion } = req.body;

    const { idVendedor, nombreProducto, precio, artista, year, genero, stock, descripcion } = req.body;
    
    if (!idVendedor || !nombreProducto || !precio || !artista || !year || !genero || !stock) {
      return res.status(400).json({ 
        error: "Faltan campos requeridos",
        camposRecibidos: req.body
      });
    }

    let imagenUrl = "";
    if (req.file) {
      imagenUrl = `/uploads/images/${req.file.filename}`;
    }

    const albumCoincidente = await Album.findOne({
      where: {
        nombreAlbum: nombreProducto, // El nombre del vinilo = nombre del álbum
        artistaAlbum: artista,
        yearAlbum: year,
        generoAlbum: genero
      }
    });

    let idAlbum = null;
    let mensajeExtra = "";

    if (albumCoincidente) {
      idAlbum = albumCoincidente.idAlbum;
      mensajeExtra = ` y asociado automáticamente al álbum "${albumCoincidente.nombreAlbum}"`;
      
      console.log(`✅ Vinilo asociado automáticamente al álbum ID: ${idAlbum}`);
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
      imagenUrl: "",
      idAlbum: idAlbum || null,
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

    const nuevoNombre = `${nuevo.idProducto}_${nombreProducto.replace(/[^a-z0-9]/gi, "_")}.png`;

    const oldPath = req.file.path;
    const newPath = path.join(path.dirname(oldPath), nuevoNombre);

    // Renombrar archivo en la carpeta
    fs.renameSync(oldPath, newPath);

    // Actualizar producto con la URL final
    nuevo.imagenUrl = `/uploads/images/${nuevoNombre}`;
    await nuevo.save();

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
    const { nombreProducto, precio, artista, year, genero, trackNumber, idAlbum } = req.body;

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
      idAlbum
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

export const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll({
            include: [{
                model: Album,
                as: 'Album' // Asegúrate de que esta asociación exista
            }]
        });
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id, {
            include: [{
                model: Album,
                as: 'Album'
            }]
        });

        if (!producto) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }

        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};