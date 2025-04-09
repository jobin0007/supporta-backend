const express = require('express');
const brandController = require('../controllers/brandController');
const authenticate = require('../middleware/authenticator');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|svg|bmp|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) cb(null, true);
  else cb(new Error('Only image files are allowed!'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

const brandRoutes = express.Router();

brandRoutes.post('/create-brand', authenticate, upload.single('brandLogo'), brandController.createBrand);
brandRoutes.get('/get-all-brands', brandController.getBrands);

module.exports = brandRoutes;