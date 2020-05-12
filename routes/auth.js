//Rutas para autentificar usuario
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

//iniciar Sesion
///api/auth
router.post(
  "/",

  authController.autentificarUsuario
);

//Obtiene el usuario autenticado
router.get("/", auth, authController.usuarioAutenticado);

module.exports = router;
