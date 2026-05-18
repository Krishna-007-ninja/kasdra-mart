const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isDeliveryBoy: user.isDeliveryBoy,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isDeliveryBoy: user.isDeliveryBoy,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Forgot password
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    // In a real app, you would generate a token and send an email.
    // Here we just return a success message for simplicity.
    res.json({ message: 'If a user with that email exists, a reset link has been sent.' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Reset password
// @route   PUT /api/users/resetpassword
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body; // In real app, use token from URL
  const user = await User.findOne({ email });

  if (user) {
    user.password = password;
    await user.save();
    res.json({ message: 'Password reset successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user wishlist
// @route   GET /api/auth/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');

  if (user) {
    res.json(user.wishlist);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add product to wishlist
// @route   POST /api/auth/wishlist/:id
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const alreadyAdded = user.wishlist.find(
      (id) => id.toString() === req.params.id.toString()
    );

    if (alreadyAdded) {
      res.status(400);
      throw new Error('Product already in wishlist');
    }

    user.wishlist.push(req.params.id);
    await user.save();
    res.json({ message: 'Product added to wishlist' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Remove product from wishlist
// @route   DELETE /api/auth/wishlist/:id
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.params.id.toString()
    );
    await user.save();
    res.json({ message: 'Product removed from wishlist' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all delivery boys with stats
// @route   GET /api/users/deliveryboys
// @access  Private/Admin
const getDeliveryBoys = asyncHandler(async (req, res) => {
  const deliveryBoys = await User.find({ isDeliveryBoy: true }).select('-password');
  
  // Enhance with stats
  const enhancedDeliveryBoys = await Promise.all(deliveryBoys.map(async (boy) => {
    const totalOrders = await Order.countDocuments({ deliveryBoy: boy._id });
    const completedOrders = await Order.countDocuments({ deliveryBoy: boy._id, status: 'Delivered' });
    const activeOrders = await Order.countDocuments({ deliveryBoy: boy._id, status: { $nin: ['Delivered', 'Cancelled'] } });
    
    return {
      ...boy._doc,
      totalOrders,
      completedOrders,
      activeOrders
    };
  }));

  res.json(enhancedDeliveryBoys);
});

// @desc    Register a new delivery boy
// @route   POST /api/users/deliveryboys
// @access  Private/Admin
const registerDeliveryBoy = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    isDeliveryBoy: true,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isDeliveryBoy: user.isDeliveryBoy,
    });
  } else {
    res.status(400);
    throw new Error('Invalid delivery boy data');
  }
});

// @desc    Delete delivery boy
// @route   DELETE /api/users/deliveryboys/:id
// @access  Private/Admin
const deleteDeliveryBoy = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user && user.isDeliveryBoy) {
    await user.deleteOne();
    res.json({ message: 'Delivery boy removed' });
  } else {
    res.status(404);
    throw new Error('Delivery boy not found');
  }
});

module.exports = {
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
};
