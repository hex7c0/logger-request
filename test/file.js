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
var logger = require('..');
var express = require('express');
var request = require('supertest');
var assert = require('assert');
var fs = require('fs');

/*
 * test module
 */
describe('file', function() {

  var f = 'ff.log';

  describe('filename', function() {

    var app = express();

    before(function(done) {

      var log = logger({
        filename: f,
        winston: {
          logger: 'ff'
        }
      });
      app.use(log).get('/f', function(req, res) {

        res.sendFile(require('path').resolve('README.md'));
      });
      done();
    });

    it('should read log of Send "/" 200', function(done) {

      request(app).get('/f').expect(200).end(function(err, res) {

        assert.ifError(err);
        setTimeout(function() {

          fs.readFile(f, function(err, data) {

            assert.ifError(err);
            var d = JSON.parse(data);
            assert.deepEqual(d.method, 'GET', 'method');
            assert.deepEqual(d.status, 200, 'status code');
            assert.deepEqual(d.url, '/f', 'url');
            assert.deepEqual(d.message, 'ff', 'logger');
            assert.deepEqual(d.level, 'info', 'log level');
            fs.unlink(f, done);
          });
        }, 100);
      });
    });
  });

  describe('daily', function() {

    var app = express();

    before(function(done) {

      var log = logger({
        filename: f,
        daily: true,
        winston: {
          logger: 'ffD'
        }
      });
      app.use(log).get('/fd', function(req, res) {

        res.sendFile(require('path').resolve('README.md'));
      });
      done();
    });

    it('should read log of Send "/" 200', function(done) {

      var pad = function(val, len) {

        var val = String(val);
        var len = len || 2;
        while (val.length < len) {
          val = '0' + val;
        }
        return val;
      };

      request(app).get('/fd').expect(200).end(
        function(err, res) {

          assert.ifError(err);
          setTimeout(function() {

            var date = new Date();
            var dailyF = date.getUTCFullYear() + '-'
              + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate())
              + '.' + f;
            fs.readFile(dailyF, function(err, data) {

              assert.ifError(err);
              var d = JSON.parse(data);
              assert.deepEqual(d.method, 'GET', 'method');
              assert.deepEqual(d.status, 200, 'status code');
              assert.deepEqual(d.url, '/fd', 'url');
              assert.deepEqual(d.message, 'ffD', 'logger');
              assert.deepEqual(d.level, 'info', 'log level');
              fs.unlink(dailyF, done);
            });
          }, 100);
        });
    });
  });
});
