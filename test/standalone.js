'use strict';
/**
 * @file standalone test
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
var assert = require('assert');
var fs = require('fs');

/*
 * test module
 */
describe('standalone', function() {

  var log;
  before(function(done) {

    log = logger({
      filename: 'ss.log',
      standalone: true,
      winston: {
        logger: 'ss'
      }
    });
    done();
  });

  it('should write random log', function(done) {

    log('ciao');
    setTimeout(done, 50);
  });
  it('should read random log', function(done) {

    fs.readFile('ss.log', function(err, data) {

      assert.ifError(err);
      var d = JSON.parse(data);
      assert.equal(d.message, 'ciao');
      done();
    });
  });
  it('should remove random log', function(done) {

    fs.unlink('ss.log', done);
  });
});
