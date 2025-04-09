const express = require('express');
const authRoutes = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authenticator');
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

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

authRoutes.post('/register', upload.single('profilePhoto'), authController.registerUser);
authRoutes.post('/login', authController.loginUser);
authRoutes.post('/refresh-token', authController.refreshToken);
authRoutes.patch('/update-profile', authMiddleware, upload.single('profilePhoto'), authController.updateProfile);
authRoutes.delete('/delete-profile', authMiddleware, authController.deleteProfile);
authRoutes.post('/logout', authMiddleware, authController.logoutUser);

module.exports = authRoutes;
