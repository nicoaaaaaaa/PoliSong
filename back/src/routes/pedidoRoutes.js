// routes/pedidoRoutes.js
import express from "express";
import { crearPedido, crearPedidoIndividual, aceptarPedido, rechazarPedido,
    obtenerPedidosUsuario, obtenerPedidosVendedor, obtenerPedidoPorId
 } from "../controllers/pedidoController.js";
import autenticado from "../middleware/autenticado.js";
import { isVendedor } from "../middleware/isVendedor.js";

const router = express.Router();

router.post("/crear", autenticado, crearPedido);
router.post("/crearIndividual", autenticado, crearPedidoIndividual)

router.get("/mispedidos", autenticado, obtenerPedidosUsuario);
router.get("/vendedor/pedidos", autenticado, isVendedor, obtenerPedidosVendedor);
router.get("/:id", autenticado, obtenerPedidoPorId);

router.put("/aceptar/:id", autenticado, aceptarPedido);
router.put("/rechazar/:id", autenticado, rechazarPedido);


export default router;
