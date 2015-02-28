'use strict';
/**
 * @file file test
 * @module logger-request
 * @subpackage test
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
var logger = require('..');
var app = require('express')();
var request = require('supertest');
var assert = require('assert');
var fs = require('fs');

/*
 * test module
 */
describe('file', function() {

  before(function(done) {

    var log = logger({
      filename: 'ff.log',
      winston: {
        logger: 'ff'
      }
    });
    app.use(log).get('/f', function(req, res) {

      res.sendFile(require('path').resolve('README.md'));
    });
    done();
  });

  it('middleware - should read log of Send "/" 200', function(done) {

    request(app).get('/f').expect(200).end(function(err, res) {

      setTimeout(function() {

        fs.readFile('ff.log', function(err, data) {

          if (err) return done(err);
          var d = JSON.parse(data);
          assert.deepEqual(d.method, 'GET', 'method');
          assert.deepEqual(d.status, 200, 'status code');
          assert.deepEqual(d.url, '/f', 'url');
          assert.deepEqual(d.message, 'ff', 'logger');
          assert.deepEqual(d.level, 'info', 'log level');
          fs.unlink('ff.log', done);
        });
      }, 25);
    });
  });
});
