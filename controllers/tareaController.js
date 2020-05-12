const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

//Crea una nueva Tarea
exports.crearTarea = async (req, res) => {
  //Si hay Errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    //Comprobar si existe el Proyecto
    const { proyecto } = req.body;

    const proyectoExiste = await Proyecto.findById(proyecto);
    if (!proyectoExiste) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //Revisar si el proyecto actual pertenece al usuario autentificado
    if (proyectoExiste.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    //Crear Tarea
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Obtiene las Tareas pro proyecto
exports.obtenerTareas = async (req, res) => {
  try {
    //Comprobar si existe el Proyecto
    const { proyecto } = req.query;

    const proyectoExiste = await Proyecto.findById(proyecto);
    if (!proyectoExiste) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //Revisar si el proyecto actual pertenece al usuario autentificado
    if (proyectoExiste.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    //Obtener las tareas por proyecto
    const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).send("hubo un error");
  }
};

//Actualizar una tarea
exports.actualizarTarea = async (req, res) => {
  try {
    //Comprobar si existe el Proyecto
    const { proyecto, nombre, estado } = req.body;

    //Si la tarea Existe o no
    let tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({ msg: "No Existe esa Tarea" });
    }

    const proyectoExiste = await Proyecto.findById(proyecto);

    //Revisar si el proyecto actual pertenece al usuario autentificado
    if (proyectoExiste.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    //Crear Objeto con la nueva informacion
    const nuevaTarea = {};

    nuevaTarea.nombre = nombre != null ? nombre : tarea.nombre;
    nuevaTarea.estado = estado != null ? estado : tarea.estado;

    //Actualizar la tarea en la base de Datos
    await Tarea.updateOne({ _id: req.params.id }, nuevaTarea, { new: true });

    tarea = await Tarea.findById(req.params.id);

    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("hubo un error");
  }
};

//Eliminar una tarea
exports.eliminarTarea = async (req, res) => {
  try {
    //Comprobar si existe el Proyecto
    const { proyecto } = req.query;

    //Si la tarea Existe o no
    let tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({ msg: "No Existe esa Tarea" });
    }

    const proyectoExiste = await Proyecto.findById(proyecto);

    //Revisar si el proyecto actual pertenece al usuario autentificado
    if (proyectoExiste.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    //Eliminar
    await Tarea.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Tarea Eliminada" });
  } catch (error) {
    console.log(error);
    res.status(500).send("hubo un error");
  }
};
