'use strict';
/**
 * @file file test
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
describe('file', function() {

    before(function(done) {

        var log = logger({
            filename: 'ff.log',
            winston: {
                logger: 'ff'
            }
        });
        app.use(log);
        app.get('/f', function(req, res) {

            res.sendFile(require('path').resolve('README.md'));
        });
        done();
    });

    it('middleware - should read log of Send "/" 200', function(done) {

        request(app).get('/f').expect(200).end(function(err, res) {

            setTimeout(function() {

                fs.readFile('ff.log', {
                    encoding: 'utf8'
                }, function(err, data) {

                    if (err)
                        return done(err);
                    var d = JSON.parse(data);
                    assert.deepEqual(d.method, 'GET', 'method');
                    assert.deepEqual(d.status, 200, 'status code');
                    assert.deepEqual(d.url, '/f', 'url');
                    assert.deepEqual(d.message, 'ff', 'logger');
                    assert.deepEqual(d.level, 'info', 'log level');
                    fs.unlink('ff.log', function() {

                        done();
                    });
                });
            }, 25);
        });
    });
});
