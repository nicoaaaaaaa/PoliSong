import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contraseña, rol } = req.body;
    
    // Verificar si el usuario ya existe

    const correoNormalizado = correo.toLowerCase();

    const existente = await Usuario.findOne({ where: { correo: correoNormalizado } });
    if (existente) {
    return res.status(400).json({ msg: "El correo ya está registrado." });
}

    // Verificar si la contraseña es valida

   if (!contraseña || contraseña.length < 6) {
  return res.status(400).json({
    msg: "La contraseña debe tener al menos 6 caracteres."
  });
}
    // Crear nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      correo: correoNormalizado,
      contraseña,
      rol
    });

    res.status(201).json({
      msg: "Usuario registrado exitosamente.",
      usuario: { idUsuario: nuevoUsuario.idUsuario, nombre, correo, rol }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor." });
  }
};

// Iniciar sesión
export const iniciarSesion = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado." });
    }

    if (contraseña !== usuario.contraseña) {
      return res.status(401).json({ msg: "Contraseña incorrecta." });
    }

    // Crear token JWT
    const token = jwt.sign(
        {
            idUsuario: usuario.idUsuario,
            nombre: usuario.nombre,
            rol: usuario.rol
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );

    res.json({
      msg: "Inicio de sesión exitoso.",
      token,
      usuario: {
        idUsuario: usuario.idUsuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error);
    res.status(500).json({ msg: "Error en el servidor." });
  }
};

// Cambiar rol

export const cambiarRol = async (req, res) => {
  try {
    const { nuevoRol } = req.body;
    const usuarioId = req.user.idUsuario; // viene del middleware de auth

    if (!["comprador", "vendedor"].includes(nuevoRol)) {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const usuario = await Usuario.findByPk(usuarioId);

    usuario.rol = nuevoRol;
    await usuario.save();

    return res.json({ message: "Rol actualizado", rol: nuevoRol });
  } catch (error) {
    console.log("Error al cambiar rol:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Ver perfil

export const verPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.idUsuario);

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.json({
      usuario: {
        idUsuario: usuario.idUsuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener perfil" });
  }
};
