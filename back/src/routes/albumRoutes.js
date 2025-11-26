import { Router } from "express";
import { crearAlbum, obtenerAlbumes, obtenerAlbumPorId } from "../controllers/albumController.js";
import autenticado from "../middleware/autenticado.js";
import { isVendedor } from "../middleware/isVendedor.js";
import uploadMultiple from "../middleware/upload.js";
import uploadImage from "../middleware/uploadImages.js";
import uploadAlbum from "../middleware/uploadAlbum.js";

const router = Router();

router.post("/crear", autenticado, isVendedor, uploadAlbum.any('imagenAlbum'), crearAlbum);

router.get("/ver", obtenerAlbumes);

router.get("/ver/:id", obtenerAlbumPorId);


export default router;
