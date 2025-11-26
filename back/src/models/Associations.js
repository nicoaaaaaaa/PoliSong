import Carrito from "./Carrito.js";
import Producto from "./Producto.js";
import Usuario from "./Usuario.js";
import PedidoItem from "./PedidoItem.js";
import Pedido from "./Pedido.js";

// Carrito → Producto
Carrito.belongsTo(Producto, {
  foreignKey: "idProducto",
  as: "producto"
});

Producto.hasMany(Carrito, {
  foreignKey: "idProducto",
  as: "Carritos"
});

// Carrito → Usuario
Carrito.belongsTo(Usuario, {
  foreignKey: "idUsuario",
  as: "usuario"
});

Usuario.hasMany(Carrito, {
  foreignKey: "idUsuario",
  as: "carritos"
});

// Pedido pertenece a un usuario
Pedido.belongsTo(Usuario, { foreignKey: "idUsuario" });

// Relación pedido → items
Pedido.hasMany(PedidoItem, { foreignKey: "idPedido" , as: "PedidoItems"});
PedidoItem.belongsTo(Pedido, { foreignKey: "idPedido" });

// Item → Producto
PedidoItem.belongsTo(Producto, { foreignKey: "idProducto" , as: "producto" });
