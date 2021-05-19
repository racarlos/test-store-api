const mongoose = require('mongoose');

// Contains the Schema of the Product Objects 
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,            // Unique ID
    name: String,
    price: Number
})

// Product is the name of the Model
module.exports = mongoose.model('Product',productSchema)