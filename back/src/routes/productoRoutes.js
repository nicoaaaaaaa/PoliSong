// src/routes/productoRoutes.js
import { Router } from "express";
import { publicarVinilo } from "../controllers/productoController.js";
import { isVendedor } from "../middleware/isVendedor.js";

const router = Router();

// Solo vendedores pueden publicar
router.post("/publicar-vinilo", isVendedor, publicarVinilo);

export default router;
