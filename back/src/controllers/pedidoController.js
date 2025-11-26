// src/controllers/pedidoController.js
import Usuario from "../models/Usuario.js";
import Pedido from "../models/Pedido.js";
import PedidoItem from "../models/PedidoItem.js";
import Carrito from "../models/Carrito.js";
import Producto from "../models/Producto.js";
import Notificacion from "../models/Notification.js";
import { DataTypes, Op } from "sequelize";

export const crearPedido = async (req, res) => { //por carrito
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

export const crearPedidoIndividual = async (req, res) => {
    try {
        const { idProducto, cantidad = 1 } = req.body;
        const idUsuario = req.usuario.idUsuario;

        // Verificar que el producto existe
        const producto = await Producto.findByPk(idProducto);
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Verificar stock si es vinilo
        if (producto.tipo === "vinilo" && producto.stock < cantidad) {
            return res.status(400).json({ error: "Stock insuficiente" });
        }

        const totalP = producto.precio * cantidad;

        const esMP3 = producto.tipo === "mp3";
        const estado = esMP3 ? "aprobado" : "pendiente";

        const idVendedor = producto.idVendedor || (esMP3 ? null : idUsuario);

        // Crear el pedido
        const pedido = await Pedido.create({
            estado: estado,
            idUsuario,
            idVendedor: parseInt(idVendedor), 
            total: totalP
        });

        console.log("Pedido creado:", {
            id: pedido.idPedido,
            estado: pedido.estado, // ← Verificar qué estado se guardó
            idVendedor: pedido.idVendedor
        });

        // Agregar el producto al pedido
        await PedidoItem.create({
            idPedido: pedido.idPedido,
            idProducto,
            cantidad,
            precioUnitario: producto.precio
        });

        // Calcular total
        const total = producto.precio * cantidad;

        // Actualizar pedido con total
        await pedido.update({ total });

        // Actualizar stock si es vinilo
        if (producto.tipo === "vinilo") {
            await producto.update({
                stock: producto.stock - cantidad
            });
        }

        await Notificacion.create({
        idUsuario,
        mensaje: `Tu pedido #${pedido.idPedido} fue creado y está pendiente.`,
        tipo: "pedido_comprador",
        refId: pedido.idPedido
        });

        // Crear notificación para el vendedor
        if (producto.idVendedor && !esMP3) {
            await Notificacion.create({
                mensaje: `Nuevo pedido #${pedido.idPedido} recibido para el producto: ${producto.nombreProducto}. ¿Aceptas o rechazas?`,
                tipo: "pedido_vendedor",
                refId: pedido.idPedido,
                idUsuario: producto.idVendedor
            });
        }

        res.json({
            mensaje: `Pedido individual creado correctamente${esMP3 ? " y aprobado automáticamente" : ""}`,
            idPedido: pedido.idPedido,
            total,
            estado: pedido.estado
        });

    } catch (err) {
        console.error("Error al crear pedido individual:", err);
        res.status(500).json({ error: err.message });
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


export const obtenerPedidosUsuario = async (req, res) => {
    try {
        const idUsuario = req.usuario.idUsuario;

        const pedidos = await Pedido.findAll({
            where: { idUsuario },
            include: [
                {
                    model: PedidoItem,
                    as: "PedidoItems", // ← USAR ESTE ALIAS
                    include: [{
                        model: Producto,
                        as: "producto",
                        attributes: ['idProducto', 'nombreProducto', 'precio', 'tipo', 'artista', 'imagenUrl']
                    }]
                },
                {
                    model: Usuario,
                    as: "Vendedor",
                    attributes: ['idUsuario', 'nombreUsuario']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(pedidos);
    } catch (err) {
        console.error("Error al obtener pedidos:", err);
        res.status(500).json({ error: err.message });
    }
};

export const obtenerPedidosVendedor = async (req, res) => {
    try {
        const idVendedor = req.usuario.idUsuario;

        const pedidos = await Pedido.findAll({
            where: { idVendedor },
            include: [
                {
                    model: PedidoItem,
                    as: "PedidoItems", // ← USAR ESTE ALIAS
                    include: [{
                        model: Producto,
                        as: "producto",
                        attributes: ['idProducto', 'nombreProducto', 'precio', 'tipo', 'artista']
                    }]
                },
                {
                    model: Usuario,
                    as: "Comprador",
                    attributes: ['idUsuario', 'nombreUsuario', 'correo']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(pedidos);
    } catch (err) {
        console.error("Error al obtener pedidos vendedor:", err);
        res.status(500).json({ error: err.message });
    }
};

export const obtenerPedidoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const idUsuario = req.usuario.idUsuario;

        const pedido = await Pedido.findOne({
            where: { 
                idPedido: id,
                [Op.or]: [
                    { idUsuario },
                    { idVendedor: idUsuario }
                ]
            },
            include: [
                {
                    model: PedidoItem,
                    as: "PedidoItems", // ← USAR ESTE ALIAS
                    include: [{
                        model: Producto,
                        as: "producto",
                        attributes: ['idProducto', 'nombreProducto', 'precio', 'tipo', 'artista', 'imagenUrl']
                    }]
                },
                {
                    model: Usuario,
                    as: "Comprador",
                    attributes: ['idUsuario', 'nombreUsuario', 'correo']
                },
                {
                    model: Usuario,
                    as: "Vendedor",
                    attributes: ['idUsuario', 'nombreUsuario', 'correo']
                }
            ]
        });

        if (!pedido) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }

        res.json(pedido);
    } catch (err) {
        console.error("Error al obtener pedido:", err);
        res.status(500).json({ error: err.message });
    }
};