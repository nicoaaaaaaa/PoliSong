import express from "express";
import { obtenerNotificaciones, marcarLeida } from "../controllers/notificacionController.js";
import autenticado from "../middleware/autenticado.js";

const router = express.Router();

router.get("/ver", autenticado, obtenerNotificaciones, (req, res) => {
    console.log("Headers recibidos:", req.headers);
});
router.put("/ver/:id", autenticado, marcarLeida);

export default router;
