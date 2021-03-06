'use strict';
/**
 * @file basicauth test
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
var authentication = require('basic-authentication');
var request = require('supertest');
var assert = require('assert');
var fs = require('fs');

/*
 * test module
 */
describe('basic authentication', function() {

  it('should read log of "/" 200', function(done) {

    var f = 'rb.log';
    var app = express();
    app.use(logger({
      filename: f,
      winston: {
        logger: '200b'
      },
      custom: {
        auth: true,
      }
    })).use(authentication({
      user: 'admin3',
      password: 'foo',
      suppress: true,
    })).get('/', function(req, res) {

      res.send('hello world!');
    });

    var p = 'Basic ' + new Buffer('admin3:foo').toString('base64');
    request(app).get('/').set('Authorization', p).expect(200).end(
      function(err, res) {

        assert.ifError(err);
        setTimeout(function() {

          fs.readFile(f, function(err, data) {

            assert.ifError(err);
            var d = JSON.parse(data);
            assert.deepEqual(d.method, 'GET', 'method');
            assert.deepEqual(d.status, 200, 'status code');
            assert.deepEqual(d.auth, 'admin3', 'status code');
            fs.unlink(f, done);
          });
        }, 100);
      });
  });

  it('should read log of "/" 401', function(done) {

    var f = 'fb.log';
    var app = express();
    app.use(logger({
      filename: f,
      winston: {
        logger: '401b'
      },
      custom: {
        auth: true,
      }
    })).use(authentication({
      user: 'admin3',
      password: 'foo',
      suppress: true,
    })).get('/', function(req, res) {

      res.send('hello world!');
    });

    var p = 'Basic ' + new Buffer('admin:foo').toString('base64');
    request(app).get('/').set('Authorization', p).expect(401).end(
      function(err, res) {

        assert.ifError(err);
        setTimeout(function() {

          fs.readFile(f, function(err, data) {

            assert.ifError(err);
            var d = JSON.parse(data);
            assert.deepEqual(d.method, 'GET', 'method');
            assert.deepEqual(d.status, 401, 'status code');
            assert.deepEqual(d.auth, 'admin', 'status code');
            fs.unlink(f, done);
          });
        }, 100);
      });
  });
});
