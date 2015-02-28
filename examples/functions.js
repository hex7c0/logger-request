'use strict';
/**
 * @file functions example
 * @module logger-request
 * @package logger-request
 * @subpackage examples
 * @version 0.0.2
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/**
 * initialize module
 */
// import
var logger = require('..'); // use require('logger-request') instead
var app = require('express')();

// using function
logger = logger({
  filename: 'functions.log',
  functions: true
});

// express routing
app.get('/', function(req, res) {

  res.send('hello world!');
  res.end();

  logger(req, res); // after res.end()

}).get('/err', function(req, res) {

  res.status(401).end('Unauthorized');

  logger(req, res); // after res.end()

});

// server starting
app.listen(3000);
console.log('starting server on port 3000');
