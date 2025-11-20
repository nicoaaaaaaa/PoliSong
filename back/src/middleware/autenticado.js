import jwt from "jsonwebtoken";

const autenticado = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ msg: "No autorizado. Falta token." });
    }

    // El token viene como: "Bearer as87asd87a8sd7as8d7"
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // <-- aquí queda la info del usuario del token
        next();
    } catch (error) {
        return res.status(401).json({ msg: "Token inválido o expirado." });
    }
};

export default autenticado;
