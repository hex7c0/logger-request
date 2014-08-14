"use strict";
/**
 * @file file example
 * @module logger-request
 * @package logger-request
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    var logger = require('../index.min.js'); // use require('logger-request')
    var app = require('express')();
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

// customization
// using middleware
app.use(logger({
    filename: 'file.log',
    deprecated: true,
    custom: {
        bytesReq: true,
        bytesRes: true,
    }
}));

// routing
app.get('/', function(req, res) {

    res.sendFile(require('path').resolve('a.pdf'));
});
// server starting
app.listen(3000);
console.log('starting "hello world" on port 3000');
