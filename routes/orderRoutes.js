const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validation');

router.route('/')
  .post(protect, validateOrder, createOrder)
  .get(protect, getOrders);

router.route('/:id')
  .get(protect, getOrder)
  .put(protect, updateOrder)
  .delete(protect, deleteOrder);

module.exports = router;