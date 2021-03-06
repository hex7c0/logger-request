'use strict';
/**
 * @file daily middleware example
 * @module logger-request
 * @subpackage examples
 * @version 0.0.4
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
var logger = require('logger-request'); // use require('logger-request') instead
var app = require('express')();

// as middleware
app.use(logger({
  filename: 'foo.log',
  daily: true
})).get('/', function(req, res) {

  res.send('hello world!');
}).get('/err', function(req, res) {

  res.status(401).end('Unauthorized');
}).listen(3000);
console.log('starting server on port 3000');
