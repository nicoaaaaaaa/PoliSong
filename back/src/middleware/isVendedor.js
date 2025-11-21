// src/middleware/isVendedor.js
import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";

export const isVendedor = (req, res, next) => {
    try {
        const auth = req.headers.authorization;

        if (!auth || !auth.startsWith("Bearer ")) {
            return res.status(401).json({ mensaje: "No autorizado. Falta token" });
        }

        const token = auth.split(" ")[1];

        // Asegúrate que tu .env tenga JWT_SECRET y NO WT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verifica que el usuario sea vendedor
        if (decoded.rol !== "vendedor") {
            return res.status(403).json({ mensaje: "Acceso denegado: no eres vendedor" });
        }

        // Guardamos la info del usuario para el controlador
        req.user = decoded;

        next();

    } catch (error) {
        console.error("Error en isVendedor:", error);
        return res.status(401).json({ mensaje: "Token inválido o expirado" });
    }
};
