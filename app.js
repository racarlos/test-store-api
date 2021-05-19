// When server.js encounters a request, it is then handled by app.js

const express = require('express')
const app = express()                           // spin-up express application
const morgan = require('morgan')                // morgan is used for logging
const bodyParser = require('body-parser')       // Used for parsing body requests
const mongoose = require('mongoose')


const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')

// Connect to cloud database
mongoose.connect('mongodb+srv://test:test@test-shop.a5yqo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,                          // Enable new parameters
    useUnifiedTopology: true,
    },
    () => console.log("Connected to Database") 
)

// Use morgan as middleware to log HTTP requests
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Append headers to avoid CORS Errors
app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*')              // Allow any origin to send requests
    res.header('Access-Control-Allow-Headers','*')              // Define which kind of headers to accept
    
    // Handles OPTIONS method which asks for HTTP methods supported in the app
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods','PUT','POST','PATCH','DELETE','GET')  // HTTP methods supported
        return res.status(200).json({})                                     
    }
    next()
})

// Routes for handling requests
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

// Handling Errors, requests which are not handled above are handled here
app.use((req,res,next) => {
    const error = new Error('Not Found')    // Create new Error Object
    error.status = 404                      // Assign status code 
    next(error)                             
})

app.use((error,req,res,next) => {
    res.status(error.status || 500)         // return error's own status or 500 if undefinable
    
    res.json({                              // Error response to be sent back 
        error: {
            message: error.message,
            status: error.status
        }
    })

})

module.exports = app