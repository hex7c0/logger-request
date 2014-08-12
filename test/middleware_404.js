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
describe('404', function() {

    before(function(done) {

        var loggerf = logger({
            filename: 'f4.log',
            winston: {
                logger: 'f4'
            }
        })
        var loggerr = logger({
            filename: 'r4.log',
            winston: {
                logger: 'r4'
            }
        })
        app.use(loggerr);
        app.get('/', function(req, res) {

            res.status(404).end('hello world!');
            logger(req, res); // after res.end()
        });
        app.get('/f', function(req, res) {

            res.status(404).end('hello world!');
            loggerf(req, res); // after res.end()
        });
        done();
    });

    it('middleware - should read log of "/" 404', function(done) {

        request(app).get('/').expect(404).end(function(err, res) {

            // pass
        });

        setTimeout(function() {

            fs.readFile('r4.log', {
                encoding: 'utf8'
            }, function(err, data) {

                if (err)
                    return done(err);
                var d = JSON.parse(data);
                assert.deepEqual(d.method, 'GET', 'method');
                assert.deepEqual(d.status, 404, 'status code');
                assert.deepEqual(d.url, '/', 'url');
                assert.deepEqual(d.message, 'r4', 'logger');
                assert.deepEqual(d.level, 'info', 'log level');
                fs.unlink('r4.log', function() {

                    done();
                });
            });
        }, 100);
    });

    it('function - should read log of "/" 404', function(done) {

        request(app).get('/f').expect(404).end(function(err, res) {

            // pass
        });

        setTimeout(function() {

            fs.readFile('f4.log', {
                encoding: 'utf8'
            }, function(err, data) {

                if (err)
                    return done(err);
                var d = JSON.parse(data);
                assert.deepEqual(d.method, 'GET', 'method');
                assert.deepEqual(d.status, 404, 'status code');
                assert.deepEqual(d.url, '/f', 'url');
                assert.deepEqual(d.message, 'f4', 'logger');
                assert.deepEqual(d.level, 'info', 'log level');
                fs.unlink('f4.log', function() {

                    done();
                });
            });
        }, 100);
    });
});
