const express = require("express");
const router = express.Router();
const tareaController = require("../controllers/tareaController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

//Crear una tarea
// api/tareas

router.post(
  "/",
  auth,
  [
    check("nombre", "El nombre es Obligatorio").not().isEmpty(),
    check("proyecto", "El proyecto es Obligatorio").not().isEmpty(),
  ],
  tareaController.crearTarea
);

//Obtener las tareas por proyecto
router.get("/", auth, tareaController.obtenerTareas);

//Actualizar Tarea
router.put("/:id", auth, tareaController.actualizarTarea);

//Eliminar tarea
router.delete("/:id", auth, tareaController.eliminarTarea);

module.exports = router;
