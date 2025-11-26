import Notificacion from "../models/Notification.js";

export const obtenerNotificaciones = async (req, res) => {
  try {
    const idUsuario = req.usuario.idUsuario;

    const notificaciones = await Notificacion.findAll({
      where: { idUsuario },
      order: [["createdAt", "DESC"]]
    });

    res.json(notificaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener notificaciones" });
  }
};

export const marcarLeida = async (req, res) => {
  try {
    const { id } = req.params;

    const notif = await Notificacion.findByPk(id);
    if (!notif) return res.status(404).json({ msg: "Notificación no encontrada" });

    notif.leida = true;
    await notif.save();

    res.json({ msg: "Notificación marcada como leída" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar notificación" });
  }
};
