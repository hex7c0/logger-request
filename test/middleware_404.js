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
describe('404',function() {

    before(function(done) {

        app.use(logger({
            filename: 'r.log'
        }));
        app.get('/',function(req,res) {

            res.status(404).end('hello world!');
        });
        done();
    });

    it('should read log of "/" 404',function(done) {

        request(app).get('/').expect(404).end(function(err,res) {

            // pass
        });

        setTimeout(function() {

            fs.readFile('r.log',{
                encoding: 'utf8'
            },function(err,data) {

                if (err)
                    return done(err);
                var d = JSON.parse(data);
                assert.deepEqual(d.method,'GET','method');
                assert.deepEqual(d.status,404,'status code');
                assert.deepEqual(d.url,'/','url');
                assert.deepEqual(d.level,'info','log level');
                fs.unlink('r.log',function() {

                    done();
                });
            });
        },20);
    });
});
