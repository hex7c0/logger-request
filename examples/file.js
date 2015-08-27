'use strict';
/**
 * @file file example
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
var app = require('express')();

// as middleware
app.use(logger({
  filename: 'file.log',
  deprecated: false,
  custom: {
    bytesReq: true,
    bytesRes: true, // 12Mb
  }
})).get('/', function(req, res) {

  res.sendFile(__dirname + '/a.pdf'); // 12Mb file
}).listen(3000);
console.log('starting "hello world" on port 3000');
