const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getWeatherRecommendations
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');

// Public routes
router.get('/', getProducts);
router.get('/recommendations/weather', getWeatherRecommendations);
router.get('/:id', getProduct);

// Admin only routes
router.post('/', protect, authorize('admin'), validateProduct, createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;