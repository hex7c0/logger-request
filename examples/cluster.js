'use strict';
/**
 * @file cluster example
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
var express = require('express');
var cluster = require('cluster');
var cpu = require('os').cpus().length;

if (cluster.isMaster) { // father
  for (var i = 0; i < cpu; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {

    console.log('worker ' + worker.process.pid + ' died');
  });

} else { // child
  var app = express();

  // as middleware
  app.use(logger({
    filename: 'cluster.log',
    custom: {
      pid: true, // activate pid logs
      bytesReq: true,
      bytesRes: true,
    }
  })).get('/', function(req, res) {

    res.send('hello world!');
  }).get('/err', function(req, res) {

    res.status(401).end('Unauthorized');
  }).listen(3000);
  console.log('starting server on port 3000, pid:' + process.pid);

}
