"use strict";
/**
 * @file middleware example
 * @module logger-request
 * @package logger-request
 * @subpackage examples
 * @version 0.0.4
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/**
 * initialize module
 */
// import
try {
    var logger = require('../index.min.js'); // use require('logger-request') instead
    var app = require('express')();
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

// using middleware
app.use(logger({
    filename: 'middleware.log',
    custom: {
        pid: true,
        bytesReq: true,
        bytesRes: true,
    }
}));

// express routing
app.get('/',function(req,res) {

    res.send('hello world!');
});
app.get('/err',function(req,res) {

    res.status(401).end('Unauthorized');
});
// server starting
app.listen(3000);
console.log('starting server on port 3000');
