"use strict";
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
    var logger = require('../index.min.js'); // use require('logger-request')
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
describe('200', function() {

    before(function(done) {

        var loggerf = logger({
            filename: 'f2.log',
            winston: {
                logger: 'f2'
            }
        });
        var loggerr = logger({
            filename: 'r2.log',
            winston: {
                logger: 'r2'
            }
        });
        app.use(loggerr);
        app.get('/', function(req, res) {

            res.send('hello world!');
        });
        app.get('/f', function(req, res) {

            res.send('hello world!');
            res.end();
            loggerf(req, res); // after res.end()
        });
        done();
    });

    it('middleware - should read log of "/" 200', function(done) {

        request(app).get('/').expect(200).end(function(err, res) {

            setTimeout(function() {

                fs.readFile('r2.log', {
                    encoding: 'utf8'
                }, function(err, data) {

                    if (err)
                        return done(err);
                    var d = JSON.parse(data);
                    assert.deepEqual(d.method, 'GET', 'method');
                    assert.deepEqual(d.status, 200, 'status code');
                    assert.deepEqual(d.url, '/', 'url');
                    assert.deepEqual(d.message, 'r2', 'logger');
                    assert.deepEqual(d.level, 'info', 'log level');
                    fs.unlink('r2.log', function() {

                        done();
                    });
                });
            }, 25);
        });
    });

    it('function - should read log of "/" 200', function(done) {

        request(app).get('/f').expect(200).end(function(err, res) {

            setTimeout(function() {

                fs.readFile('f2.log', {
                    encoding: 'utf8'
                }, function(err, data) {

                    if (err)
                        return done(err);
                    var d = JSON.parse(data);
                    assert.deepEqual(d.method, 'GET', 'method');
                    assert.deepEqual(d.status, 200, 'status code');
                    assert.deepEqual(d.url, '/f', 'url');
                    assert.deepEqual(d.message, 'f2', 'logger');
                    assert.deepEqual(d.level, 'info', 'log level');
                    fs.unlink('f2.log', function() {

                        done();
                    });
                });
            }, 25);
        });
    });
});
