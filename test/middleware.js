'use strict';
/**
 * @file middleware test
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
describe('0.11 fix', function() {

  var f = 'f.log';

  before(function(done) {

    var log = logger({
      filename: f,
      custom: {
        callback: function(req) {

          return req.res._headers['x-pippo'];
        }
      },
      winston: {
        logger: 'f'
      }
    });
    app.get('/', function(req, res) {

      res.setHeader('x-pippo', 'pluto');
      res.status(403).end('hello world!');
      log(req, res, function() {

        return;
      });
    });
    done();
  });

  it('should read log of GET "/" 403 after end', function(done) {

    request(app).get('/').expect(403).end(function(err, res) {

      assert.ifError(err);
      setTimeout(function() {

        fs.readFile(f, function(err, data) {

          assert.ifError(err);
          var d = JSON.parse(data);
          assert.deepEqual(d.method, 'GET', 'method');
          assert.deepEqual(d.status, 403, 'status code');
          assert.deepEqual(d.url, '/', 'url');
          assert.deepEqual(d.message, 'f', 'logger');
          assert.deepEqual(d.level, 'info', 'log level');
          assert.deepEqual(d.callback, 'pluto', 'callback');
          fs.unlink(f, done);
        });
      }, 100);
    });
  });
});
