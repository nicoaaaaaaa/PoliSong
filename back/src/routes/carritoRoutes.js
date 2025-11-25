// src/routes/carritoRoutes.js
import express from "express";
import { agregarAlCarrito, verCarrito, actualizarCantidad, eliminarItem } from "../controllers/carritoController.js";
import autenticado from "../middleware/autenticado.js";

const router = express.Router();

router.post("/agregar", autenticado, agregarAlCarrito);
router.get("/ver", autenticado, verCarrito);
router.put("/actualizar", autenticado, actualizarCantidad);
router.delete("/eliminar/:idCarrito", autenticado, eliminarItem);

export default router;
