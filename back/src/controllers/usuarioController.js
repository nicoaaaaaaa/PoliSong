import Usuario from "../models/Usuario.js";

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contraseña, rol } = req.body;

    // Verificar si el usuario ya existe
    const existente = await Usuario.findOne({ where: { correo } });
    if (existente) {
      return res.status(400).json({ msg: "El correo ya está registrado." });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      correo,
      contraseña: hashedPassword,
      rol
    });

    res.status(201).json({
      msg: "Usuario registrado exitosamente.",
      usuario: { id: nuevoUsuario.id, nombre, correo, rol }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor." });
  }
};

/*export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contraseña } = req.body;

    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    // Simulación de registro sin base de datos
    console.log("Datos recibidos:", { nombre, correo, contraseña });

    res.status(201).json({
      mensaje: "Usuario registrado correctamente (prueba)",
      usuario: { nombre, correo }
    });
  } catch (error) {
    console.error("Error al registrar:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

export const loginUsuario = async (req, res) => {
  res.send("Login en construcción");
};*/


// Iniciar sesión
export const iniciarSesion = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado." });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!validPassword) {
      return res.status(401).json({ msg: "Contraseña incorrecta." });
    }

    res.json({
      msg: "Inicio de sesión exitoso.",
      usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor." });
  }
};