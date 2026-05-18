const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderStatus,
  deleteOrder,
  assignDeliveryBoy,
  getDeliveryOrders,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/delivery/myorders').get(protect, getDeliveryOrders);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/status').put(protect, updateOrderStatus); // Remove admin from here so delivery boy can update
router.route('/:id/assign').put(protect, admin, assignDeliveryBoy);
router.route('/:id').get(protect, getOrderById).delete(protect, deleteOrder);

module.exports = router;
