import Usuario from "../models/Usuario.js";

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contraseña, rol } = req.body;
    
    // Verificar si el usuario ya existe

    const correoNormalizado = correo.toLowerCase();

    const existente = await Usuario.findOne({ where: { correo: correoNormalizado } });
    if (existente) {
    return res.status(400).json({ msg: "El correo ya está registrado." });
}

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

    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado." });
    }

    // Comparar contraseña ingresada con la guardada en BD
    if (contraseña !== usuario.contraseña) {
      return res.status(401).json({ msg: "Contraseña incorrecta." });
    }

    // Si todo ok → respuesta
    res.json({
      msg: "Inicio de sesión exitoso.",
      usuario: {
        idUsuario: usuario.idUsuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
      }
    });

  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error);
    res.status(500).json({ msg: "Error en el servidor." });
  }
};
