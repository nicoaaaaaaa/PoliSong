// routes/pedidoRoutes.js
import express from "express";
import { crearPedido } from "../controllers/pedidoController.js";
import autenticado from "../middleware/autenticado.js";

const router = express.Router();

router.post("/crear", autenticado, crearPedido);

export default router;
