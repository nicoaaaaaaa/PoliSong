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
    const archivos = req.files;

    let imagenUrl = "";
    if (req.file) {
      imagenUrl = `/uploads/images/${req.file.filename}`;
    }

    const album = await Album.create({
      nombreAlbum,
      artistaAlbum,
      yearAlbum,
      generoAlbum,
      imagenUrl: ""
    });

    const imagenAlbumFile = archivos.find(file => file.fieldname === 'imagenAlbum');
    if (imagenAlbumFile) {
      const nuevoNombreImagen = `${album.idAlbum}_${nombreAlbum.replace(/[^a-z0-9]/gi, "_")}.png`;
      const oldPathImagen = imagenAlbumFile.path;
      const newPathImagen = path.join(path.dirname(oldPathImagen), nuevoNombreImagen);

      // Renombrar archivo
      fs.renameSync(oldPathImagen, newPathImagen);

      // ✅ ACTUALIZAR ÁLBUM CON LA URL FINAL
      album.imagenUrl = `/uploads/images/${nuevoNombreImagen}`;
      await album.save();
      
      console.log(`✅ Imagen de álbum renombrada: ${imagenAlbumFile.filename} → ${nuevoNombreImagen}`);
    }

    

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
        idAlbum: album.idAlbum, // Asegurar que el nombre coincide con el modelo
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

export const obtenerAlbumPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const album = await Album.findByPk(id, {
      include: [{
        model: Producto,
        as: 'Productos'
      }]
    });

    if (!album) {
      return res.status(404).json({ msg: "Álbum no encontrado" });
    }

    res.json(album);

  } catch (err) {
    console.error("Error al obtener álbum:", err);
    res.status(500).json({ error: err.message });
  }
};


