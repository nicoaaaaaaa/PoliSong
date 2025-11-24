import Album from "../models/Album.js";
import Producto from "../models/Producto.js";
import fs from 'fs';
import path from 'path';

export const crearAlbum = async (req, res) => {
  try {
    const { nombreAlbum, artistaAlbum, yearAlbum, generoAlbum } = req.body;
    
    if (!req.body.canciones) {
      return res.status(400).json({ error: "No se proporcionaron canciones" });
    }
    
    const canciones = JSON.parse(req.body.canciones);

    const album = await Album.create({
      nombreAlbum,
      artistaAlbum,
      yearAlbum,
      generoAlbum
    });

    const archivos = req.files;

    if (!archivos || archivos.length === 0) {
        return res.status(400).json({ error: "No se subieron archivos MP3" });
    }

    for (let i = 0; i < canciones.length; i++) {
      const cancion = canciones[i];
      const archivo = archivos.find(f => f.fieldname === `cancion${i}`);

      if (!archivo) {
        // Si falta un archivo, eliminar el álbum creado y cancelar
        await Album.destroy({ where: { idAlbum: album.idAlbum } });
        return res.status(400).json({
          error: `Falta archivo de la canción ${i + 1}: ${cancion.nombre}`
        });
      }

      const producto = await Producto.create({
        nombreProducto: cancion.nombre,
        tipo: "mp3",
        precio: parseFloat(cancion.precio),
        artista: cancion.artista || artistaAlbum, // Usar datos del álbum si no hay específicos
        year: cancion.year || yearAlbum,
        genero: cancion.genero || generoAlbum,
        archivoUrl: "",
        trackNumber: i + 1,
        IdAlbum: album.idAlbum, // Asegurar que el nombre coincide con el modelo
      });
      // Generar nuevo nombre con ID + nombre canción
      const nuevoNombre = `${producto.idProducto}_${cancion.nombre.replace(/[^a-z0-9]/gi, "_")}.mp3`;
      const oldPath = archivo.path;
      const newPath = path.join(path.dirname(oldPath), nuevoNombre);

      // Renombrar archivo
      fs.renameSync(oldPath, newPath);

      // Actualizar producto con URL final
      producto.archivoUrl = `/uploads/mp3/${nuevoNombre}`;
      await producto.save();
    }

    res.json({
      mensaje: "Álbum completo publicado correctamente",
      album: {
        ...album.toJSON(),
        canciones: canciones.length
      }
    });

  } catch (err) {
    console.error("Error al crear álbum:", err);
    res.status(500).json({ error: "Error interno del servidor: " + err.message });
  }
};

export const obtenerAlbumes = async (req, res) => {
  try {
    const albumes = await Album.findAll({
      include: [{
        model: Producto,
        as: 'Productos'
      }]
    });

    res.json(albumes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

