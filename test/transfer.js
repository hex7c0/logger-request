'use strict';
/**
 * @file transfer test
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

describe('express #2433', function() {

  var size = 12582912;
  var file = __dirname + '/aa.pdf';
  var logfile = __dirname + '/tt.log';

  before(function(done) {

    app.use(logger({
      filename: logfile,
      winston: {
        logger: 'tt'
      },
      custom: {
        transfer: true,
        bytesRes: true
      }
    })).get('/', function(req, res) {

      res.sendFile(file);
    }).listen(3000);
    done();
  });

  it('should write 12mb fake pdf', function(done) {

    this.timeout(7000);
    var e = 'e';
    fs.writeFile(file, e.repeat(size), done);
  });
  it('should return 1° 200 chunk', function(done) {

    request(app).get('/')
    // .set('Connection', 'keep-alive')
    .expect(200).expect('Content-Type', 'application/pdf')
    // .expect('Content-Length', size)
    // .expect('Connection', 'keep-alive')
    .end(done);
  });
  it('should return 1° 206 chunk', function(done) {

    request(app).get('/').set('Range', 'bytes=0-32767').expect(206).expect(
      'Content-Type', 'application/pdf').expect('Content-Range',
      'bytes 0-32767/12582912').end(done);
    // .expect('Content-Length', 32768)
  });
  it('should return 2° 206 chunk', function(done) {

    request(app).get('/').set('Range', 'bytes=32768-12582911').expect(206)
        .expect('Content-Type', 'application/pdf').expect('Content-Range',
          'bytes 32768-12582911/12582912').end(done);
    // .expect('Content-Length', 12550144)
  });
  it('should read logfile', function(done) {

    setTimeout(function() {

      fs.readFile(logfile, {
        encoding: 'utf8' // force encoding for multiple lines
      }, function(err, data) {

        assert.ifError(err);
        assert.notEqual(data, null);
        var d = data.split('\n');

        // 1° 200 chunk
        var c = JSON.parse(d[0]);
        assert.equal(c.method, 'GET');
        assert.equal(c.status, 200);
        assert.equal(c.message, 'tt');
        assert.equal(/^1258319/.test(c.bytesRes), true);
        assert.equal(/^[0-9]*.[0-9]{0,2} KB\/s$/.test(c.transfer), true);

        // 1° 206 chunk
        var c = JSON.parse(d[1]);
        assert.equal(c.method, 'GET');
        assert.equal(c.status, 206);
        assert.equal(c.message, 'tt');
        assert.equal(/^3310/.test(c.bytesRes), true);
        assert.equal(/^[0-9]*.[0-9]{0,2} KB\/s$/.test(c.transfer), true);

        // 2° 206 chunk
        var c = JSON.parse(d[2]);
        assert.equal(c.method, 'GET');
        assert.equal(c.status, 206);
        assert.equal(c.message, 'tt');
        assert.equal(/^12550490/.test(c.bytesRes), true);
        assert.equal(/^[0-9]*.[0-9]{0,2} KB\/s$/.test(c.transfer), true);

        done();
      });
    }, 100);
  });
  it('should delete files', function(done) {

    fs.unlink(file, function() {

      fs.unlink(logfile, done);
    });
  });
});
