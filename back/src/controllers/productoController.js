// src/controllers/productoController.js
import Producto from "../models/Producto.js";
import Album from "../models/Album.js";
import Pedido from "../models/Pedido.js";
import PedidoItem from "../models/PedidoItem.js";
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
                as: 'Album',
                attributes: ['idAlbum', 'nombreAlbum', 'artistaAlbum', 'yearAlbum', 'generoAlbum', 'imagenUrl']
            }]
        });
        res.json(productos);
    } catch (err) {
        console.error("Error al obtener productos:", err);
        res.status(500).json({ error: err.message });
    }
};

export const obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await Producto.findByPk(id, {
            include: [{
                model: Album,
                as: 'Album', // Asegúrate de que este alias coincida con tu relación
                attributes: ['idAlbum', 'nombreAlbum', 'artistaAlbum', 'yearAlbum', 'generoAlbum', 'imagenUrl']
            }]
        });

        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json(producto);

    } catch (err) {
        console.error("Error al obtener producto:", err);
        res.status(500).json({ error: err.message });
    }
};

export const descargarMP3 = async (req, res) => {
    try {
        const { id } = req.params;
        const idUsuario = req.usuario.idUsuario;

        console.log("=== DEBUG DESCARGAR MP3 ===");
        console.log("ID Producto:", id);
        console.log("ID Usuario:", idUsuario);

        // Verificar que el producto existe y es MP3
        const producto = await Producto.findByPk(id);
        if (!producto) {
            console.log("❌ Producto no encontrado");
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        console.log("✅ Producto encontrado:", {
            nombre: producto.nombreProducto,
            tipo: producto.tipo,
            archivoUrl: producto.archivoUrl
        });

        if (producto.tipo !== "mp3") {
            console.log("❌ No es MP3:", producto.tipo);
            return res.status(400).json({ error: "Solo se pueden descargar archivos MP3" });
        }

        // Verificar permiso de descarga
        const pedidoItem = await PedidoItem.findOne({
            where: { idProducto: id },
            include: [{
                model: Pedido,
                where: { idUsuario }
            }]
        });

        console.log("✅ Resultado de verificación de permiso:", {
            pedidoItem: pedidoItem ? "Encontrado" : "No encontrado",
            pedidoEstado: pedidoItem?.Pedido?.estado,
            pedidoId: pedidoItem?.Pedido?.idPedido
        });

        if (!pedidoItem) {
            console.log("❌ No se encontró pedidoItem - Usuario no tiene permiso");
            return res.status(403).json({ error: "No tienes permiso para descargar este archivo" });
        }

        // Construir la ruta del archivo
        const filePath = path.join(process.cwd(),'..', producto.archivoUrl);
        console.log("📁 Ruta del archivo:", filePath);
        
        // Verificar que el archivo existe
        if (!fs.existsSync(filePath)) {
            console.log("❌ Archivo no existe en el sistema de archivos");
            return res.status(404).json({ error: "Archivo no encontrado" });
        }

        console.log("✅ Archivo encontrado, iniciando descarga...");

        // Configurar headers para descarga
        const filename = `${producto.nombreProducto.replace(/[^a-z0-9]/gi, "_")}.mp3`;
        
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'audio/mpeg');
        
        // Enviar el archivo
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

    } catch (err) {
        console.error("❌ Error al descargar MP3:", err);
        res.status(500).json({ error: err.message });
    }
};