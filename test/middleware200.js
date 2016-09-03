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

  var f0 = 'f2.log';
  var f1 = 'r2.log';

  before(function(done) {

    var loggerf = logger({
      filename: f0,
      winston: {
        logger: 'f2'
      },
      functions: true
    });
    var loggerr = logger({
      filename: f1,
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

      assert.ifError(err);
      setTimeout(function() {

        fs.readFile(f1, function(err, data) {

          assert.ifError(err);
          var d = JSON.parse(data);
          assert.deepEqual(d.method, 'GET', 'method');
          assert.deepEqual(d.status, 200, 'status code');
          assert.deepEqual(d.url, '/', 'url');
          assert.deepEqual(d.message, 'r2', 'logger');
          assert.deepEqual(d.level, 'info', 'log level');
          fs.unlink(f1, done);
        });
      }, 100);
    });
  });
  it('should read log of POST "/" 200', function(done) {

    request(app).post('/f').expect(200).end(function(err, res) {

      assert.ifError(err);
      setTimeout(function() {

        fs.readFile(f0, function(err, data) {

          assert.ifError(err);
          var d = JSON.parse(data);
          assert.deepEqual(d.method, 'POST', 'method');
          assert.deepEqual(d.status, 200, 'status code');
          assert.deepEqual(d.url, '/f', 'url');
          assert.deepEqual(d.message, 'f2', 'logger');
          assert.deepEqual(d.level, 'info', 'log level');
          fs.unlink(f0, done);
        });
      }, 100);
    });
  });
});
