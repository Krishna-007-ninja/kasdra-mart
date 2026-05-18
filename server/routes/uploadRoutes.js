const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

// Cloudinary Configuration
// These should be in your .env file eventually
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecart_products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), (req, res) => {
  console.log('Upload Request Received');
  if (req.file && req.file.path) {
    console.log('File Uploaded to Cloudinary:', req.file.path);
    res.json({ url: req.file.path }); // Send JSON instead of plain string
  } else {
    console.error('File Upload Failed or no file found');
    res.status(400).send({ message: 'No image uploaded or Cloudinary error' });
  }
});

module.exports = router;
