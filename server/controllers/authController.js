const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

const generateTokens = (userId) => ({
  accessToken: jwt.sign({ id: userId }, process.env.ACCESS_SECRET, { expiresIn: '15m' }),
  refreshToken: jwt.sign({ id: userId }, process.env.REFRESH_SECRET, { expiresIn: '7d' })
});

const authController = {
    registerUser: asyncHandler(async (req, res) => {
        const { username, email, password } = req.body;
        if (!username || !email || !password || !req.file) {
          throw new Error('All fields including profile photo are required');
        }
      
        const userExists = await User.findOne({ email });
        if (userExists) throw new Error('User already exists');
      
        const hashedPassword = await bcrypt.hash(password, 10);
        const uploadResult = await cloudinary.uploader.upload(req.file.path);
      
        const user = await User.create({
          username,
          email,
          password: hashedPassword,
          profilePhoto: uploadResult.secure_url,
        });
      
        const { accessToken, refreshToken } = generateTokens(user._id);
      
     
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          maxAge: 15 * 60 * 1000, 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
      
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
      
        res.status(201).json({
          message: 'User registered successfully',
          user: { id: user._id, username, email, profilePhoto: user.profilePhoto }
        });
      }),
      

      loginUser: asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
          throw new Error('Invalid credentials');
        }
      
        const { accessToken, refreshToken } = generateTokens(user._id);
      

        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          maxAge: 15 * 60 * 1000,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
      
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
      
        res.json({
          message: 'Login successful',
          user: { id: user._id, username: user.username, email: user.email, profilePhoto: user.profilePhoto }
        });
      }),
      

      refreshToken: asyncHandler(async (req, res) => {
        const token = req.cookies.refreshToken; 
        if (!token) throw new Error('Refresh token required');
      
        try {
          const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
      
          const accessToken = jwt.sign({ id: decoded.id }, process.env.ACCESS_SECRET, {
            expiresIn: '15m',
          });
      
      
          res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
          });
      
          res.json({ message: 'Access token refreshed', accessToken });
        } catch (err) {
          throw new Error('Invalid or expired refresh token');
        }
      }),
      

  updateProfile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error('User not found');

    const { username, email, password } = req.body;

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      user.profilePhoto = uploadResult.secure_url;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  }),

  deleteProfile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error('User not found');

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  }),

  logoutUser: (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  }



};



module.exports = authController;
