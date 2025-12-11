const express = require("express");
const router = express.Router();
const cartClient = require("../grpc/cartClient");
const { protect } = require("../middleware/authMiddelware"); // Asegúrate de tener este middleware

// Helper para promesas gRPC (gRPC usa callbacks por defecto, esto lo hace async/await)
const grpcAsync = (method, payload) => {
  return new Promise((resolve, reject) => {
    cartClient[method](payload, (err, response) => {
      if (err) reject(err);
      else resolve(response);
    });
  });
};

// Obtener Carrito
router.get("/", protect, async (req, res) => {
  try {
    const response = await grpcAsync("GetCart", { userId: req.user._id });
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Agregar Item
router.post("/add", protect, async (req, res) => {
  try {
    // req.body trae productId, quantity, etc.
    // req.user._id viene del token
    const payload = { userId: req.user._id, ...req.body };
    const response = await grpcAsync("AddItem", payload);
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Borrar Item
router.delete("/:productId", protect, async (req, res) => {
  try {
    const payload = { userId: req.user._id, productId: req.params.productId };
    const response = await grpcAsync("RemoveItem", payload);
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
