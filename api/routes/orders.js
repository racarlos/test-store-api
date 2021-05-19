const express = require('express') 
const orderRouter = express.Router()
const mongoose = require('mongoose')
const { resource } = require('../../app')

const Order = require('../models/orderSchema')
const Product = require('../models/productSchema')

// Handle incoming GET requests to /orders
orderRouter.get("/", (req, res, next) => {
    Order.find()
    .select("product quantity _id")                         // show only product quantity and order id
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {                                    // Return order id, product id
                    _id: doc._id,                           // quantity
                    product: doc.product,                   // request details
                    quantity: doc.quantity,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/orders/" + doc._id
                    }
                }
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

orderRouter.get('/:orderId', (req,res,next) => {    // Getting a particular order     
    Order.findById(req.params.orderId)
    .exec()
    .then(order => {
        if(!order) {                                  // If Order does not exist return err message
            res.status(404).json({
                message: 'Order not Found'
            })
        } else {                                      // If an Order is found
            res.status(200).json({
                order: order
            })
        }

    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })

})

orderRouter.post('/', (req,res,next) => {           // Handles creation of new Orders
    Product.findById(req.body.productId)
    .then( product => {
        if(!product){
            return res.status(404).json({
                message: 'Product ID not Found', 
            })
        } else {
            const order = new Order({                       // Instantiate object to be saved
                _id : mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity 
            })
            return order.save()
        }
    })
    .then(result => {
        console.log('Result',result)
        res.status(201).json({
            message: 'Order Sucessfully Created',
            result: result,
            createdOrder: {
                _id : result._id,
                product : result.product,
                quantity: result.quantity
            },
            request : {
                type: 'GET',
                url: 'http://localhost:3000/products/' + result._id 
            }
        })
    })

    .catch(error => {
        res.status(500).json({           
            message: 'Product ID not Found', 
            error: error
        }) 
    })
})

orderRouter.delete('/:orderId', (req,res,next) => {  // Deleting an order
    Order.remove({_id:req.params.orderId})
    .exec()
    .then( result => {
        res.status(200).json({
            message: 'Order Deleted',
            result: result
        })
    })
    .catch(error => {
        res.status(500).json({           
            message: 'Product ID not Found', 
            error: error
        }) 
    })

})

// Export the configured /orders router
module.exports = orderRouter