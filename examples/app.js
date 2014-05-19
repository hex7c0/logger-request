"use strict";
/**
 * example with express
 * 
 * @package logger-request
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <0x7c0@teboss.tk>
 * @license GPLv3
 */

/**
 * initialize module
 */
// import
try {
    var app = require('express')();
    var logger = require('../index.js'); // use 'logger-request' instead
} catch (MODULE_NOT_FOUND) {
    console.log(MODULE_NOT_FOUND);
    process.exit(1);
}

// using middleware
app.use(logger({
    filename : 'example.log'
}));

// express routing
app.get('/', function(req, res) {
    res.send('hello world!');
});

// server starting
app.listen(3000);
console.log('starting server on port 3000');
