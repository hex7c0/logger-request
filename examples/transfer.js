'use strict';
/**
 * @file transfer example
 * @module logger-request
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
var logger = require('..'); // use require('logger-request') instead
var app = require('express')();

// using middleware
app.use(logger({
  filename: 'transfer.log',
  custom: {
    transfer: true,
    bytesRes: true
  }
}));

// express routing
app.get('/', function(req, res) {

  res.sendFile(__dirname + '/a.pdf');
}).get('/err', function(req, res) {

  res.status(401).end('Unauthorized');
});

// server starting
app.listen(3000);
console.log('starting server on port 3000');
