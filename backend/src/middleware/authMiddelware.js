const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // 1. Verificar si hay header Authorization con Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Obtener el token (quitar la palabra "Bearer ")
      token = req.headers.authorization.split(" ")[1];

      // 3. Decodificar el token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secreto_super_seguro" // Debe coincidir con el que usaste al crear el token
      );

      // 4. Buscar el usuario en la DB y adjuntarlo a la request (sin el password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "No autorizado, usuario no encontrado" });
      }

      next(); // Todo bien, pase adelante
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "No autorizado, token fallido" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "No autorizado, no hay token" });
  }
};

module.exports = { protect };
