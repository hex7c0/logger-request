'use strict';
/**
 * @file standalone test
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
    setTimeout(done, 100);
  });

  it('should read random log', function(done) {

    fs.readFile('ss.log', {
      encoding: 'utf8'
    }, function(err, data) {

      assert.equal(err, null);
      var d = JSON.parse(data);
      assert.equal(d.message, 'ciao');

      fs.unlink('ss.log', function() {

        done();
      });
    });
  });

});
