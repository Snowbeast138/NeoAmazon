const express = require("express");
const router = express.Router();

// Importamos las funciones del controlador que creamos en el paso anterior
// Asegúrate de que el archivo authController.js exista en ../controllers/
const { registerUser, loginUser } = require("../controllers/authController");

// Definimos las rutas
// Ruta: POST /api/users/register
router.post("/register", registerUser);

// Ruta: POST /api/users/login
router.post("/login", loginUser);

module.exports = router;
