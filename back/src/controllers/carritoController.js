// src/controllers/carritoController.js
import Usuario from "../models/Usuario.js";
import Carrito from "../models/Carrito.js";
import Producto from "../models/Producto.js";

export const agregarAlCarrito = async (req, res) => {
  try {
    const { idProducto, cantidad } = req.body;
    const idUsuario = req.usuario.idUsuario;

    console.log("Contenido de req.usuario:", req.usuario);


    const producto = await Producto.findByPk(idProducto);

    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    // Validación solo para vinilos
    if (producto.tipo === "vinilo") {

      if (producto.stock <= 0) {
        return res.status(400).json({ msg: "Este vinilo está agotado" });
      }

      if (cantidad > producto.stock) {
        return res.status(400).json({
          msg: `Solo hay ${producto.stock} unidades disponibles`
        });
      }
    }

    // Verificar si ya existe en el carrito
    const existe = await Carrito.findOne({
        include: [
        { model: Producto, as: "producto" }
    ],
      where: { idUsuario, idProducto }
    });

    if (existe) {
      existe.cantidad += cantidad || 1;
      await existe.save();
      return res.json({ msg: "Cantidad actualizada", item: existe });
    }

    const item = await Carrito.create({
      idUsuario,
      idProducto,
      cantidad: cantidad || 1
    });

    res.json({ msg: "Producto agregado al carrito", item });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al agregar al carrito" });
  }
};


export const verCarrito = async (req, res) => {
  try {
    const idUsuario = req.usuario.idUsuario;

    const carrito = await Carrito.findAll({
      where: { idUsuario },
      include: [
        {
          model: Producto,
          as: "producto"   
        },
        {
          model: Usuario,
          as: "usuario"    
        }
      ]
    });

    res.json(carrito);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener carrito" });
  }
};


export const actualizarCantidad = async (req, res) => {
  try {
    const { idCarrito, cantidad } = req.body;

    const item = await Carrito.findByPk(idCarrito);

    if (!item) {
      return res.status(404).json({ msg: "Item no encontrado" });
    }

    item.cantidad = cantidad;
    await item.save();

    res.json({ msg: "Cantidad actualizada", item });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar cantidad" });
  }
};


export const eliminarItem = async (req, res) => {
  try {
    const { idCarrito } = req.params;

    const item = await Carrito.findByPk(idCarrito);

    if (!item) {
      return res.status(404).json({ msg: "Item no encontrado" });
    }

    await item.destroy();
    res.json({ msg: "Item eliminado del carrito" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar item" });
  }
};
