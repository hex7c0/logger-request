"use strict";
/**
 * @file basicauth test
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
    var express = require('express');
    var authentication = require('basic-authentication');
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
describe('basic authentication', function() {

    before(function(done) {

        done();
    });

    it('auth - should read log of "/" 200', function(done) {

        var app = express();
        app.use(logger({
            filename: 'rb.log',
            winston: {
                logger: '200b'
            },
            custom: {
                auth: true,
            }
        }));
        app.use(authentication({
            user: 'admin3',
            password: 'foo',
            suppress: true,
        }));
        app.get('/', function(req, res) {

            res.send('hello world!');
        });

        var p = 'Basic ' + new Buffer('admin3:foo').toString('base64');
        request(app).get('/').set('Authorization', p).expect(200).end(
                function(err, res) {

                    // pass
                });

        setTimeout(function() {

            fs.readFile('rb.log', {
                encoding: 'utf8'
            }, function(err, data) {

                if (err)
                    return done(err);
                var d = JSON.parse(data);
                assert.deepEqual(d.method, 'GET', 'method');
                assert.deepEqual(d.status, 200, 'status code');
                assert.deepEqual(d.auth, 'admin3', 'status code');
                fs.unlink('rb.log', function() {

                    done();
                });
            });
        }, 100);
    });

    it('auth - should read log of "/" 401', function(done) {

        var app = express();
        app.use(logger({
            filename: 'fb.log',
            winston: {
                logger: '401b'
            },
            custom: {
                auth: true,
            }
        }));
        app.use(authentication({
            user: 'admin3',
            password: 'foo',
            suppress: true,
        }));
        app.get('/', function(req, res) {

            res.send('hello world!');
        });

        var p = 'Basic ' + new Buffer('admin:foo').toString('base64');
        request(app).get('/').set('Authorization', p).expect(401).end(
                function(err, res) {

                    // pass
                });

        setTimeout(function() {

            fs.readFile('fb.log', {
                encoding: 'utf8'
            }, function(err, data) {

                if (err)
                    return done(err);
                var d = JSON.parse(data);
                assert.deepEqual(d.method, 'GET', 'method');
                assert.deepEqual(d.status, 401, 'status code');
                assert.deepEqual(d.auth, 'admin', 'status code');
                fs.unlink('fb.log', function() {

                    done();
                });
            });
        }, 100);
    });
});
