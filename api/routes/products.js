const { request } = require('express')
const express = require('express')
const productRouter = express.Router()

const mongoose = require('mongoose')
const Product = require('../models/productSchema')

// Handles incoming get requests for /products
productRouter.get('/',(req,res,next) => {
    Product.find()
    .select('_id name price')                           // Specifying the fields you want to return
    .exec()
    .then(docs => {
        const response = {                              // Return number of products
            count: docs.length,                         // and array of products
            products: docs.map( doc => {

                return{                                 // Return response of product name, price, id 
                    name: doc.name,                     // as well method and url to get more info about the product 
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        method:'GET',
                        url: 'http://localhost:3000/products/' + doc._id 
                    }
                }

            })
        }

        if(docs.length > 0 ){                           // Only return contents if list of entries is more than 0 
            res.status(201).json(response)
        } else{
            res.status(404).json({                      // Return 404 if there are no entries 
                message: 'No Entries Found'
            })
        }
    })
})

productRouter.get('/:productId',(req,res,next) => {
    const id = req.params.productId                     // extract productId from request params
    Product.findById(id)
    .exec()
    .then(doc => {
        if(doc){
            res.status(201).json({
                message: 'Entry Found',
                product: doc
            })
        } else{
            res.status(404).json({
                message: 'Cannot GET, No valid entry found'
            })
        }
        
    }) 
    .catch(err => {
        console.log(error)
        res.status(500).json({
            error: err
        })
    });
})

productRouter.patch('/:productId',(req,res,next) => {               // Handles modifying product values
    const id = req.params.productId                                 // Get the id of the Product to be modified
    console.log('Request: ',req.body)

    if(req.body.name && req.body.price){       // if both fields for name and price are sent 
        newName = req.body.name
        newPrice = req.body.price
        Product.updateOne({_id:id}, {$set:{name: newName, price: newPrice}})
        .exec()
        .then( result => {
            res.status(200).json({
                message: 'Updated product name and price!',
                result: result
            });
        })
        .catch( error => {
            console.log(error)
            res.status(500).json({
                error: error
            })
        })
    } else if(req.body.name ){                                                           // Change name only
        newName = req.body.name
        Product.updateOne({_id:id}, {$set:{name: newName}})
        .exec()
        .then( result => {
            res.status(200).json({
                message: 'Updated product name!',
                result: result
            });
        })
        .catch( error => {
            console.log(error)
            res.status(500).json({
                error: error
            })
        })
    } else if (req.body.price){                                                           // Change price only
        newPrice = req.body.price

        Product.updateOne({_id:id}, {$set:{price: newPrice}})
        .exec()
        .then( result => {
            res.status(200).json({
                message: 'Updated product price!',
                result: result
            });
        })
        .catch( error => {
            console.log(error)
            res.status(500).json({
                error: error
            })
        })
    } else {
        console.log('Else Errors')
        console.log(error)
        res.status(500).json({
            error: error
        })
    }
})

productRouter.delete('/:productId',(req,res,next) => {
    const id = req.params.productId
    Product.remove({_id:id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Entry with id: ' + id + ' sucessfully deleted.',
            result: result
        })
    })
    .catch(error => {
        console.log(error)
        res.status(404).json({                                      // If a resource is not found
            message: 'Cannot DELETE, No valid entry found'
        })
    })
})

// Handles creation of new products
productRouter.post('/',(req,res,next) => {

    const product = new Product({               // Instantiate new Product to be saved
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })

    product.save()
    .then(result => {             // Save product to db and log result with error catching 
        res.status(201).json({
            message: 'Product is Created',
            createdProduct: {
                _id : result._id,
                name : result.name,
                price: result.price,
                request : {
                    method: 'GET',
                    url: 'http://localhost:3000/products/' + result._id 
                }
            }
        });
    }).catch(error => console.log(error))


})






// Export the configured /products router
module.exports = productRouter