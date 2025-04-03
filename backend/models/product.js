const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    imageUrl: { type: String },
});

// Prevent model overwrite error
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
module.exports = Product;
