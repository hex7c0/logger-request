'use strict';
/**
 * @file options test
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
var logger = require('..');
var app = require('express')();
var cookie = require('cookie-parser');
var request = require('supertest');
var assert = require('assert');
var fs = require('fs');

/*
 * test module
 */
describe('options', function() {

  before(function(done) {

    app.use(cookie('foo')).get('/', logger({
      filename: 'ro.log',
      winston: {
        logger: 'ro'
      },
      custom: {
        pid: true,
        bytesReq: true,
        bytesRes: true,
        referer: true,
        auth: true,
        transfer: true,
        agent: true,
        lang: true,
        cookie: true,
        headers: true,
        version: true,
        callback: function(req) {

          return 'cod ' + req.res._headers['x-count'];
        }
      }
    }), function(req, res) {

      res.setHeader('x-count', 123);
      res.send('hello world!');
    }).get('/deprecated', logger({
      filename: 'rod.log',
      deprecated: true,
      winston: {
        logger: 'rod'
      },
      custom: {
        pid: true,
        bytesReq: true,
        bytesRes: true,
        referer: true,
        auth: true,
        transfer: true,
        agent: true,
        lang: true,
        cookie: true,
        headers: true,
        version: true,
        callback: function(req) {

          return 'cod ' + req.res._headers['x-count'];
        }
      }
    }), function(req, res) {

      res.setHeader('x-count', 123);
      res.send('hello world!');
    });
    done();
  });

  it('should read log options of "/" 200', function(done) {

    request(app).get('/').set('Cookie', 'cc=XX; Max-Age=31536000; Path=/;')
    .set('user-agent', 'SuPeR').set('Accept-Language',
      'it-IT,it;q=0.8,en-US;q=0.6,en;q=0.4').set('Referer', 'website').expect(
      200).end(
      function(err, res) {

        setTimeout(function() {

          fs.readFile('ro.log', {
            encoding: 'utf8'
          }, function(err, data) {

            assert.equal(err, null);
            var d = JSON.parse(data);
            assert.equal(d.method, 'GET', 'method');
            assert.equal(d.status, 200, 'status code');
            assert.equal(d.url, '/', 'url');

            // assert.equal(d.bytesReq, 225, 'bytes requested');
            assert.equal(d.bytesRes, 205, 'bytes sent');
            assert.equal(d.agent, 'SuPeR', 'user agent');
            assert.equal(d.referer, 'website', 'http referer');
            assert.equal(d.version, '1.1', 'http version');
            assert.equal(d.pid, process.pid, 'pid');
            assert.equal(d.callback, 'cod 123', 'callback');
            assert.equal(d.lang, 'it-IT,it;q=0.8,en-US;q=0.6,en;q=0.4',
              'browser language');
            assert.deepEqual(d.cookie, {
              cc: 'XX',
              'Max-Age': '31536000',
              Path: '/'
            }, 'cookie');
            var h = d.headers;
            assert.equal(h['accept-encoding'], 'gzip, deflate');
            assert.equal(h['cookie'], 'cc=XX; Max-Age=31536000; Path=/;');
            assert.equal(h['user-agent'], 'SuPeR');
            assert.equal(h['accept-language'],
              'it-IT,it;q=0.8,en-US;q=0.6,en;q=0.4');
            assert.equal(h['connection'], 'close');

            assert.equal(d.level, 'info', 'winston level');
            assert.equal(d.message, 'ro', 'winston logger');
            assert.notEqual(d.timestamp, undefined, 'winston timestamp');

            fs.unlink('ro.log', function() {

              done();
            });
          });
        }, 120);
      });
  });

  it('should read log options of "/deprecated" 200', function(done) {

    request(app).get('/deprecated').set('Cookie',
      'cc=XX; Max-Age=31536000; Path=/;').set('user-agent', 'SuPeR').set(
      'Accept-Language', 'it-IT,it;q=0.8,en-US;q=0.6,en;q=0.4').set('Referer',
      'website').expect(200).end(
      function(err, res) {

        setTimeout(function() {

          fs.readFile('rod.log', {
            encoding: 'utf8'
          }, function(err, data) {

            assert.equal(err, null);
            var d = JSON.parse(data);
            assert.equal(d.method, 'GET', 'method');
            assert.equal(d.status, 200, 'status code');
            assert.equal(d.url, '/deprecated', 'url');

            // assert.equal(d.bytesReq, 235, 'bytes requested');
            assert.equal(d.bytesRes, 205, 'bytes sent');
            assert.equal(d.level, 'info', 'log level');
            assert.equal(d.agent, 'SuPeR', 'user agent');
            assert.equal(d.referer, 'website', 'http referer');
            assert.equal(d.version, '1.1', 'http version');
            assert.equal(d.pid, process.pid, 'pid');
            assert.equal(d.callback, 'cod 123', 'callback');
            assert.equal(d.lang, 'it-IT,it;q=0.8,en-US;q=0.6,en;q=0.4',
              'browser language');
            assert.deepEqual(d.cookie, {
              cc: 'XX',
              'Max-Age': '31536000',
              Path: '/'
            }, 'cookie');
            var h = d.headers;
            assert.equal(h['accept-encoding'], 'gzip, deflate');
            assert.equal(h['cookie'], 'cc=XX; Max-Age=31536000; Path=/;');
            assert.equal(h['user-agent'], 'SuPeR');
            assert.equal(h['accept-language'],
              'it-IT,it;q=0.8,en-US;q=0.6,en;q=0.4');
            assert.equal(h['connection'], 'close');

            fs.unlink('rod.log', function() {

              done();
            });
          });
        }, 120);
      });
  });

});
