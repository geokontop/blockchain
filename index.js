/*
 * Primary file for API
 *
 */

 // Dependencies
 const server = require('./dev/server');

// App container
const app = {};

// Init function
app.init = ()=>{
    // Start servers
    server.init();
}

// Execute
app.init();

// Export app
module.exports = app;
