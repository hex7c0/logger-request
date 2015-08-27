'use strict';
/**
 * @file middleware200 test
 * @module logger-request
 * @subpackage test
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
var logger = require('..');
var app = require('express')();
var request = require('supertest');
var assert = require('assert');
var fs = require('fs');

/*
 * test module
 */
describe('200', function() {

  before(function(done) {

    var loggerf = logger({
      filename: 'f2.log',
      winston: {
        logger: 'f2'
      },
      functions: true
    });
    var loggerr = logger({
      filename: 'r2.log',
      winston: {
        logger: 'r2'
      }
    });
    app.use(loggerr).get('/', function(req, res) {

      res.send('hello world!');
    }).post('/f', function(req, res) {

      res.end('hello world!');
      loggerf(req, res); // after res.end()
    });
    done();
  });

  it('should read log of GET "/" 200', function(done) {

    request(app).get('/').expect(200).end(function(err, res) {

      setTimeout(function() {

        fs.readFile('r2.log', function(err, data) {

          assert.equal(err, null);
          var d = JSON.parse(data);
          assert.deepEqual(d.method, 'GET', 'method');
          assert.deepEqual(d.status, 200, 'status code');
          assert.deepEqual(d.url, '/', 'url');
          assert.deepEqual(d.message, 'r2', 'logger');
          assert.deepEqual(d.level, 'info', 'log level');
          fs.unlink('r2.log', done);
        });
      }, 50);
    });
  });
  it('should read log of POST "/" 200', function(done) {

    request(app).post('/f').expect(200).end(function(err, res) {

      setTimeout(function() {

        fs.readFile('f2.log', function(err, data) {

          assert.equal(err, null);
          var d = JSON.parse(data);
          assert.deepEqual(d.method, 'POST', 'method');
          assert.deepEqual(d.status, 200, 'status code');
          assert.deepEqual(d.url, '/f', 'url');
          assert.deepEqual(d.message, 'f2', 'logger');
          assert.deepEqual(d.level, 'info', 'log level');
          fs.unlink('f2.log', done);
        });
      }, 50);
    });
  });
});
