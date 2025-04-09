const Product = require('../models/Product');
const Brand = require('../models/Brand');
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;
const User = require('../models/User');

const productController = {
    createProduct: asyncHandler(async (req, res) => {
        const { productName, description, price, category, brand } = req.body;
        const userId = req.user?.id;
      
        console.log({ productName, description, price, category, brand, file: req.file });
      
        if (!productName || !description || !price || !category || !brand || !req.file) {
          throw new Error('All fields including image are required');
        }
      
        const brandExists = await Brand.findOne({ brandName: brand });
        if (!brandExists) throw new Error('Brand does not exist');
        if (!brandExists.categories.includes(category)) {
          throw new Error('Category is not valid under this brand');
        }
      
        const imageUpload = await cloudinary.uploader.upload(req.file.path);
      
        const product = await Product.create({
          productName,
          description,
          price,
          category,
          brand: brandExists._id,
          productImage: imageUpload.secure_url,
          addedBy: userId, 
        });
      
        res.status(201).json({ message: 'Product created successfully', product });
      })
      ,
     getAllProducts : asyncHandler(async (req, res) => {
        const { sortBy, order, brand, category } = req.query;
        const userId = req.user.id; 
        const filter = { addedBy: { $nin: [] } };
      
        if (brand) filter.brand = brand;
        if (category) filter.category = category;
      
        const sortOptions = {};
        if (sortBy) sortOptions[sortBy] = order === 'desc' ? -1 : 1;
      
    
        const blockedBy = await User.find({ blockedUsers: userId }).select('_id');
        filter.addedBy.$nin = blockedBy.map((u) => u._id);
      
        const products = await Product.find(filter).sort(sortOptions);
      
        res.json(products);
      }),
      


     getMyProducts : asyncHandler(async (req, res) => {
        const userId = req.user.id; 
        const products = await Product.find({ addedBy: userId });
        res.json(products);
      }),
      

  updateProduct: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');
    if (product.addedBy.toString() !== req.user) {
      throw new Error('Not authorized to update this product');
    }

    Object.assign(product, req.body);
    await product.save();

    res.json({ message: 'Product updated', product });
  }),

  deleteProduct: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');
    if (product.addedBy.toString() !== req.user) {
      throw new Error('Not authorized to delete this product');
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  })
};

module.exports = productController;