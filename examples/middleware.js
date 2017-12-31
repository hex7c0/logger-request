'use strict';
/**
 * @file middleware example
 * @module logger-request
 * @subpackage examples
 * @version 0.0.4
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
var logger = require('..'); // use require('logger-request') instead
var app = require('express')();

// as middleware
var p = require('body-parser');
app.use(logger()).use(p.urlencoded({extended: false})).use(p.json({ type2: 'application/*+json' })).post('/', function(req, res) {
//app.use(logger()).use(p.urlencoded({extended: false})).use(p.json({ type: 'application/*+json' })).post('/', function(req, res) {
console.log(req.body);
  res.send('hello world!');
}).get('/err', function(req, res) {

  res.status(401).end('Unauthorized');
}).listen(3000);
console.log('starting server on port 3000');
