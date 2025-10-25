const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

const prefix = "/products";

// Create a new product
router.post(`${prefix}`, productController.createProduct);

// Get all products
router.get(`${prefix}`, productController.getProducts);

// Get a product by ID
router.get(`${prefix}/:id`, productController.getProductById);

// Update a product by ID
router.put(`${prefix}/:id`, productController.updateProduct);

// Delete a product by ID
router.delete(`${prefix}/:id`, productController.deleteProduct);

module.exports = router;
