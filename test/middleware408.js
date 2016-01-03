'use strict';
/**
 * @file middleware408 test
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
var timeout = require('timeout-request');
var request = require('supertest');
var assert = require('assert');
var fs = require('fs');

/*
 * test module
 */
describe('408', function() {

  before(function(done) {

    app.use(timeout({
      milliseconds: 1800,
      callback: function(req, res) {

        res.status(408).send('timeout');
      }
    })).use(logger({
      filename: 'r8.log',
      winston: {
        logger: 'r8'
      }
    })).get('/', function(req, res) {

      // wait timeout-request callback
    });
    done();
  });
  it('should read log of GET "/" 408', function(done) {

    request(app).get('/').expect(408).end(function(err, res) {

      assert.ifError(err);
      setTimeout(function() {

        fs.readFile('r8.log', function(err, data) {

          assert.ifError(err);
          var d = JSON.parse(data);
          assert.deepEqual(d.method, 'GET', 'method');
          assert.deepEqual(d.status, 408, 'status code');
          assert.deepEqual(d.url, '/', 'url');
          assert.deepEqual(d.message, 'r8', 'logger');
          assert.deepEqual(d.level, 'info', 'log level');
          fs.unlink('r8.log', done);
        });
      }, 50);
    });
  });
});
