const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getDeliveryBoys,
  registerDeliveryBoy,
  deleteDeliveryBoy,
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

// Validation rules
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Public routes
router.post('/login', loginValidation, validate, authUser);
router.post('/', registerValidation, validate, registerUser);
router.post('/forgotpassword', [body('email').isEmail()], validate, forgotPassword);
router.put('/resetpassword', [body('password').isLength({ min: 6 })], validate, resetPassword);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/wishlist')
  .get(protect, getWishlist);

router.route('/wishlist/:id')
  .post(protect, addToWishlist)
  .delete(protect, removeFromWishlist);

// Admin only routes for delivery boys
router.route('/deliveryboys')
  .get(protect, admin, getDeliveryBoys)
  .post(protect, admin, registerValidation, validate, registerDeliveryBoy);

router.route('/deliveryboys/:id')
  .delete(protect, admin, deleteDeliveryBoy);

module.exports = router;
