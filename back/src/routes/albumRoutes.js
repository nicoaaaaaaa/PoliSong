import { Router } from "express";
import { crearAlbum, obtenerAlbumes } from "../controllers/albumController.js";
import autenticado from "../middleware/autenticado.js";
import { isVendedor } from "../middleware/isVendedor.js";
import uploadMultiple from "../middleware/upload.js";

const router = Router();

router.post("/crear", autenticado, isVendedor, uploadMultiple.any(), crearAlbum);

router.get("/ver", obtenerAlbumes);

export default router;
