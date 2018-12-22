/*
 * Primary server file 
 *
 */

// Dependencies
const http = require('http');
const https = require('https');
const config = require('../config');
const fs = require('fs');
const listener = require('./controllers/listener');
const router = require('./controllers/router');
const port = process.argv[2];
const sport = Number(port) + 100;

// Container
const server = {};

 // Instantiate the HTTP server
const httpServer = http.createServer(function(req,res){
  unifiedServer(req,res);
});


// Instantiate the HTTPS server
const httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsServerOptions,function(req,res){
  unifiedServer(req,res);
});

server.init =function(){
    // Start the HTTP server
    httpServer.listen(port,function(){
        console.log('The HTTP server is running on port '+port);
      });
      
    // Start the HTTPS server
    httpsServer.listen(sport,function(){
     console.log('The HTTPS server is running on port '+sport);
    });
}

// All the server logic for both the http and https server
const unifiedServer = function(req,res){
  listener(router,req,res);
};

module.exports = server;