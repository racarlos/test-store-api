const mongoose = require('mongoose');

// Contains the Schema of the order Objects 
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,                    // Unique ID
    type: mongoose.Schema.Types.ObjectId,
    product: {type:mongoose.Schema.Types.ObjectId, ref:'Product', required: true},
    quantity: {type: Number, default: 1}                // Default quantity of 1 for an order 
})

// Order is the name of the Model
module.exports = mongoose.model('Order',orderSchema)