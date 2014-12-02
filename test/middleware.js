'use strict';
/**
 * @file middleware test
 * @module logger-request
 * @package logger-request
 * @subpackage test
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
  var logger = require('..'); // use require('logger-request')
  var app = require('express')();
  var request = require('supertest');
  var assert = require('assert');
  var fs = require('fs');
} catch (MODULE_NOT_FOUND) {
  console.error(MODULE_NOT_FOUND);
  process.exit(1);
}

/*
 * test module
 */
describe('0.11 fix', function() {

  before(function(done) {

    var log = logger({
      filename: 'f.log',
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

  it('middleware - should read log of GET "/" 403 after end', function(done) {

    request(app).get('/').expect(403).end(function(err, res) {

      setTimeout(function() {

        fs.readFile('f.log', {
          encoding: 'utf8'
        }, function(err, data) {

          if (err)
            return done(err);
          var d = JSON.parse(data);
          assert.deepEqual(d.method, 'GET', 'method');
          assert.deepEqual(d.status, 403, 'status code');
          assert.deepEqual(d.url, '/', 'url');
          assert.deepEqual(d.message, 'f', 'logger');
          assert.deepEqual(d.level, 'info', 'log level');
          assert.deepEqual(d.callback, 'pluto', 'callback');
          fs.unlink('f.log', function() {

            done();
          });
        });
      }, 25);
    });
  });
});
