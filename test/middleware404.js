'use strict';
/**
 * @file middleware404 test
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
describe('404', function() {

  before(function(done) {

    var loggerf = logger({
      filename: 'f4.log',
      winston: {
        logger: 'f4'
      },
      functions: true
    });
    var loggerr = logger({
      filename: 'r4.log',
      winston: {
        logger: 'r4'
      }
    });
    app.use(loggerr).get('/', function(req, res) {

      res.status(404).send('hello world!');
    }).post('/f', function(req, res) {

      res.status(404).end('hello world!');
      loggerf(req, res); // after res.end()
    });
    done();
  });

  it('should read log of GET "/" 404', function(done) {

    request(app).get('/').expect(404).end(function(err, res) {

      assert.ifError(err);
      setTimeout(function() {

        fs.readFile('r4.log', function(err, data) {

          assert.ifError(err);
          var d = JSON.parse(data);
          assert.deepEqual(d.method, 'GET', 'method');
          assert.deepEqual(d.status, 404, 'status code');
          assert.deepEqual(d.url, '/', 'url');
          assert.deepEqual(d.message, 'r4', 'logger');
          assert.deepEqual(d.level, 'info', 'log level');
          fs.unlink('r4.log', done);
        });
      }, 50);
    });
  });
  it('should read log of POST "/" 404', function(done) {

    request(app).post('/f').expect(404).end(function(err, res) {

      assert.ifError(err);
      setTimeout(function() {

        fs.readFile('f4.log', function(err, data) {

          assert.ifError(err);
          var d = JSON.parse(data);
          assert.deepEqual(d.method, 'POST', 'method');
          assert.deepEqual(d.status, 404, 'status code');
          assert.deepEqual(d.url, '/f', 'url');
          assert.deepEqual(d.message, 'f4', 'logger');
          assert.deepEqual(d.level, 'info', 'log level');
          fs.unlink('f4.log', done);
        });
      }, 50);
    });
  });
});
