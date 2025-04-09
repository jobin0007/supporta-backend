
const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    productName: String,
    description: String,
    price: Number,
    category: String,
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    productImage: String,
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }, { timestamps: true });
  module.exports = mongoose.model('Product', productSchema);