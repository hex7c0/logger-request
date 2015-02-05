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
try {
  var logger = require('..'); // use require('logger-request')
  var app = require('express')();
  var cookie = require('cookie-parser');
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
describe('options', function() {

  before(function(done) {

    app.use(cookie('foo'));
    app.use(logger({
      filename: 'ro.log',
      winston: {
        logger: 'ro'
      },
      custom: {
        pid: true,
        bytesReq: true,
        bytesRes: true,
        agent: true,
        lang: true,
        cookie: true,
        version: true,
        headers: true
      }
    }));
    app.get('/', function(req, res) {

      res.send('hello world!');
    });
    done();
  });

  it('should read log options of "/" 200', function(done) {

    request(app).get('/').set('Cookie', 'cc=XX; Max-Age=31536000; Path=/;')
    .set('user-agent', 'SuPeR').set('Accept-Language',
      'it-IT,it;q=0.8,en-US;q=0.6,en;q=0.4').expect(200).end(
      function(err, res) {

        setTimeout(function() {

          fs.readFile('ro.log', {
            encoding: 'utf8'
          }, function(err, data) {

            if (err) return done(err);
            var d = JSON.parse(data);
            assert.deepEqual(d.method, 'GET', 'method');
            assert.deepEqual(d.status, 200, 'status code');
            assert.deepEqual(d.url, '/', 'url');

            assert.deepEqual(d.bytesReq, 207, 'bytes requested');
            assert.deepEqual(d.bytesRes, 191, 'bytes sent');
            assert.deepEqual(d.level, 'info', 'log level');
            assert.deepEqual(d.agent, 'SuPeR', 'user agent');
            assert.deepEqual(d.version, '1.1', 'http version');
            assert.deepEqual(d.lang, 'it-IT,it;q=0.8,en-US;q=0.6,en;q=0.4',
              'browser language');
            assert.deepEqual(d.cookie, {
              cc: 'XX',
              'Max-Age': '31536000',
              Path: '/'
            }, 'cookie');
            var h = d.headers;
            assert.deepEqual(h['accept-encoding'], 'gzip, deflate');
            assert.deepEqual(h['cookie'], 'cc=XX; Max-Age=31536000; Path=/;');
            assert.deepEqual(h['user-agent'], 'SuPeR');
            assert.deepEqual(h['accept-language'],
              'it-IT,it;q=0.8,en-US;q=0.6,en;q=0.4');
            assert.deepEqual(h['connection'], 'close');
            assert.deepEqual(d.pid, process.pid, 'pid');
            fs.unlink('ro.log', function() {

              done();
            });
          });
        }, 120);
      });
  });

});
