// Server.js is responsible for listening on the port 3000 for requests 

const http = require('http')           
const app = require('./app')

const server = http.createServer(app)  // Create HTTP server using http.createSever() and assign app.js as request handler 


server.listen(3000)                     // Server starts listening on port 3000


