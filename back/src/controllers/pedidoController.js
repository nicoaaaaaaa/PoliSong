// src/controllers/pedidoController.js
import Usuario from "../models/Usuario.js";
import Pedido from "../models/Pedido.js";
import PedidoItem from "../models/PedidoItem.js";
import Carrito from "../models/Carrito.js";
import Producto from "../models/Producto.js";
import Notificacion from "../models/Notification.js";

export const crearPedido = async (req, res) => {
  try {
    const idUsuario = req.usuario.idUsuario;

    const carrito = await Carrito.findAll({
      where: { idUsuario },
      include: [{ 
        model: Producto, 
        as: "producto"
      }]
    });

    if (carrito.length === 0) {
      return res.status(400).json({ msg: "El carrito está vacío" });
    }

    const productosConVendedor = {};
    const productosSinVendedor = [];
    
    carrito.forEach(item => {
      if (!item.producto) {
        console.log(`Producto con id ${item.idProducto} no encontrado`);
        return;
      }
      
      const idVendedor = item.producto.idVendedor;
      
      if (idVendedor) {
        // Producto con vendedor (vinilos)
        if (!productosConVendedor[idVendedor]) {
          productosConVendedor[idVendedor] = [];
        }
        productosConVendedor[idVendedor].push(item);
      } else {
        // Producto sin vendedor (canciones MP3)
        productosSinVendedor.push(item);
      }
    });

    const pedidosCreados = [];

    // Notificacion con mensaje al vendedor

    for (const [idVendedor, items] of Object.entries(productosConVendedor)) {

      const totalVendedor = items.reduce((sum, item) => {
        return sum + (item.cantidad * item.producto.precio);
      }, 0);

      const pedido = await Pedido.create({
        idUsuario,
        idVendedor: parseInt(idVendedor),
        total: totalVendedor,
        estado: "pendiente"
      });

      for (const item of items) {
        await PedidoItem.create({
          idPedido: pedido.idPedido,
          idProducto: item.idProducto,
          cantidad: item.cantidad,
          precioUnitario: item.producto.precio
        });
      }

      pedidosCreados.push(pedido);

      await Notificacion.create({
        idUsuario,
        mensaje: `Tu pedido #${pedido.idPedido} fue creado y está pendiente.`,
        tipo: "pedido_comprador",
        refId: pedido.idPedido
      });

      await Notificacion.create({
        idUsuario: parseInt(idVendedor),
        mensaje: `Nuevo pedido #${pedido.idPedido} recibido. ¿Aceptas o rechazas?`,
        tipo: "pedido_vendedor",  // ← Esto activará los botones
        refId: pedido.idPedido    // ← ID para las funciones aceptar/rechazar
      });
    }

    // Notificacion sin mensaje al vendedor

    if (productosSinVendedor.length > 0) {
      const totalMP3 = productosSinVendedor.reduce((sum, item) => {
        return sum + (item.cantidad * item.producto.precio);
      }, 0);

      const pedidoMP3 = await Pedido.create({
        idUsuario,
        idVendedor: idUsuario, 
        total: totalMP3,
        estado: "aprobado"
      });

      for (const item of productosSinVendedor) {
        await PedidoItem.create({
          idPedido: pedidoMP3.idPedido,
          idProducto: item.idProducto,
          cantidad: item.cantidad,
          precioUnitario: item.producto.precio
        });
      }

      pedidosCreados.push(pedidoMP3);

      await Notificacion.create({
        idUsuario,
        mensaje: `Tu compra de canciones digitales (pedido #${pedidoMP3.idPedido}) fue aprobada automáticamente.`,
        tipo: "sistema",
        refId: pedidoMP3.idPedido
      });
    }

    // Vaciar carrito
    await Carrito.destroy({ where: { idUsuario } });

    res.json({ 
      msg: "Pedidos creados correctamente", 
      pedidos: pedidosCreados,
      resumen: {
        pedidosConVendedor: Object.keys(productosConVendedor).length,
        pedidosMP3: productosSinVendedor.length > 0 ? 1 : 0
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear pedido" });
  }
};

export const aceptarPedido = async (req, res) => {
    try {
        const idPedido = req.params.id;
        const idVendedor = req.usuario.idUsuario;

        const pedido = await Pedido.findOne({ where: { idPedido } });

        if (!pedido) {
            return res.status(404).json({ msg: "Pedido no encontrado" });
        }

        if (pedido.idVendedor !== idVendedor) {
            return res.status(403).json({ msg: "No tienes permiso para aceptar este pedido" });
        }

        pedido.estado = "aprobado";
        await pedido.save();

        await Notificacion.create({
            idUsuario: pedido.idUsuario,
            mensaje: `Tu pedido #${pedido.idPedido} ha sido **aprobado** por el vendedor.`,
            tipo: "pedido_comprador",
            refId: pedido.idPedido
        });

        res.json({ msg: "Pedido aprobado con éxito" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al aprobar pedido" });
    }
};

export const rechazarPedido = async (req, res) => {
    try {
        const idPedido = req.params.id;
        const idVendedor = req.usuario.idUsuario;

        const pedido = await Pedido.findOne({ where: { idPedido } });

        if (!pedido) {
            return res.status(404).json({ msg: "Pedido no encontrado" });
        }

        if (pedido.idVendedor !== idVendedor) {
            return res.status(403).json({ msg: "No tienes permiso para rechazar este pedido" });
        }

        pedido.estado = "rechazado";
        await pedido.save();

        await Notificacion.create({
            idUsuario: pedido.idUsuario,
            mensaje: `Tu pedido #${pedido.idPedido} ha sido **rechazado** por el vendedor.`,
            tipo: "pedido_comprador",
            refId: pedido.idPedido
        });

        res.json({ msg: "Pedido rechazado con éxito" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al rechazar pedido" });
    }
};
