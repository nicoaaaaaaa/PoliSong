// routes/pedidoRoutes.js
import express from "express";
import { crearPedido, aceptarPedido, rechazarPedido } from "../controllers/pedidoController.js";
import autenticado from "../middleware/autenticado.js";

const router = express.Router();

router.post("/crear", autenticado, crearPedido);

router.put("/aceptar/:id", autenticado, aceptarPedido);
router.put("/rechazar/:id", autenticado, rechazarPedido);


export default router;
