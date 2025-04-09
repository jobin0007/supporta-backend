const Brand = require('../models/Brand');
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;

const brandController = {
  createBrand: asyncHandler(async (req, res) => {
    const { brandName, categories } = req.body;
    if (!brandName || !categories || !req.file) {
      throw new Error('Brand name, categories, and logo are required');
    }

    const brandExists = await Brand.findOne({ brandName });
    if (brandExists) throw new Error('Brand already exists');

    const logoUpload = await cloudinary.uploader.upload(req.file.path);

    const brand = await Brand.create({
      brandName,
      brandLogo: logoUpload.secure_url,
      categories: categories.split(',').map((c) => c.trim()),
    });

    res.status(201).json({ message: 'Brand created successfully', brand });
  }),

  getBrands: asyncHandler(async (req, res) => {
    const brands = await Brand.find();
    res.json(brands);
  }),
};

module.exports = brandController;