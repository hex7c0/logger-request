'use strict';
/**
 * @file transport test
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
var winston = require('winston');

describe('transport', function() {

  describe('console', function() {

    before(function(done) {

      app.use(logger({
        console: true,
        filename: false,
        winston: {
          colorize: true,
          logger: 'tc'
        }
      })).get('/', function(req, res) {

        res.send('hello');
      });
      done();
    });

    it('should print log output to console', function(done) {

      request(app).get('/').expect(200, done);
    });
  });

  describe('webhook', function() {

    before(function(done) {

      app.use(logger({
        transports: [ winston.transports.Http ],
        winston: {
          host: '127.0.0.1',
          port: 3001,
          path: '/hook'
        }
      })).listen(3001);
      done();
    });

    it('should trigger webhook', function(done) {

      request(app).get('/').expect(200, done);
      app.post('/hook', function(req, res) {

        done();
      });
    });
  });
});
