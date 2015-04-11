'use strict';
/**
 * @file basicauth example
 * @module logger-request
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
var logger = require('..'); // use require('logger-request') instead
var authentication = require('basic-authentication');
var app = require('express')();

// as middleware
app.use(logger({
  filename: 'basicauth.log',
  custom: {
    auth: true
  }
}));

app.use(authentication({
  suppress: true
})).get('/', function(req, res) {

  res.send('hello world!');
}).get('/err', function(req, res) {

  res.status(401).end('Unauthorized');
}).listen(3000);
console.log('starting server on port 3000');
