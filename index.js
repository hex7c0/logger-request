'use strict';
/**
 * @file logger-request main
 * @module logger-request
 * @package logger-request
 * @subpackage main
 * @version 3.2.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * functions
 */
/**
 * builder from option
 * 
 * @function info
 * @param {Object} my - user options
 * @return {Function}
 */
function info(my) {

  var promise = Array.call();
  if (my.pid) {
    promise.push([ 'pid', function() {

      return process.pid;
    } ]);
  }
  if (my.bytesReq) {
    promise.push([ 'bytesReq', function(req) {

      return req.socket.bytesRead;
    } ]);
  }
  if (my.bytesRes) {
    promise.push([ 'bytesRes', function(req) {

      return req.socket._bytesDispatched;
    } ]);
  }
  if (my.referer) {
    promise.push([ 'referer', function(req) {

      return req.headers.referer || req.headers.referrer;
    } ]);
  }
  if (my.auth) {
    var mod0 = require('basic-authentication')({
      legacy: true
    });
    promise.push([ 'auth', function(req) {

      return mod0(req).user;
    } ]);
  }
  if (my.transfer) {
    var mod1 = require('transfer-rate')();
    promise.push([ 'transfer', function(req) {

      return mod1(req, req.start);
    } ]);
  }
  if (my.agent) {
    promise.push([ 'agent', function(req) {

      return req.headers['user-agent'];
    } ]);
  }
  if (my.lang) {
    promise.push([ 'lang', function(req) {

      return req.headers['accept-language'];
    } ]);
  }
  if (my.cookie) {
    promise.push([ 'cookie', function(req) {

      return req.cookies;
    } ]);
  }
  if (my.headers) {
    promise.push([ 'headers', function(req) {

      return req.headers;
    } ]);
  }
  if (my.version) {
    promise.push([ 'version', function(req) {

      return req.httpVersionMajor + '.' + req.httpVersionMinor;
    } ]);
  }
  if (my.callback) {
    promise.push([ 'callback', function(req) {

      return my.callback(req);
    } ]);
  }
  var l = promise.length;

  if (l === 0) {
    return function(req, statusCode, end) {

      var diff = end[0] * 1e3 + end[1] * 1e-6;
      return {
        ip: req.remoteAddr || req.ip,
        method: req.method,
        status: statusCode,
        url: req.url,
        response: diff.toFixed(2)
      };
    };
  }
  return function(req, statusCode, end) {

    var diff = end[0] * 1e3 + end[1] * 1e-6;
    var out = {
      ip: req.remoteAddr || req.ip,
      method: req.method,
      status: statusCode,
      url: req.url,
      response: diff.toFixed(2)
    };
    for (var i = 0; i < l; i++) {
      var p = promise[i];
      out[p[0]] = p[1](req);
    }
    return out;
  };
}

/**
 * function wrapper for multiple require
 * 
 * @function wrapper
 * @param {Function} log - logging function
 * @param {Object} my - parsed options
 * @param {Function} io - extra function
 * @return {Function}
 */
function wrapper(log, my, io) {

  var finished = require('on-finished');

  /**
   * end of job (closures). Get response time and status code
   * 
   * @function finale
   * @param {Object} req - client request
   * @param {Integr} code - statusCode
   * @param {Array} start - hrtime
   */
  function finale(req, statusCode, start) {

    var end = process.hrtime(start);
    req.start = start;
    return log(my.logger, io(req, statusCode, end));
  }

  if (my.deprecated) {
    /**
     * logging all route
     * 
     * @deprecated
     * @function deprecated
     * @param {Object} req - client request
     * @param {Object} res - response to client
     * @param {Function} next - continue routes
     */
    return require('util').deprecate(function deprecated(req, res, next) {

      var start = process.hrtime();
      req.remoteAddr = req.ip;
      if (res._headerSent) { // function
        finale(req, res.statusCode, start); // after res.end()
      } else { // middleware
        var buffer = res.end;
        /**
         * middle of job. Set right end function (closure)
         * 
         * @function
         * @param {String} chunk - data sent
         * @param {String} encoding - data encoding
         * @return {Boolean}
         */
        res.end = function(chunk, encoding) {

          res.end = buffer;
          var b = res.end(chunk, encoding);
          // res.end(chunk,encoding,finale) // callback available only
          // with node 0.11
          finale(req, res.statusCode, start); // write after sending
          // all stuff, instead of callback
          return b;
        };
      }

      if (next) {
        next();
      }
      return;
    }, '`logger-request` option is deprecated');
  }

  if (my.functions) {
    /**
     * logging all route without next callback
     * 
     * @function logging
     * @param {Object} req - client request
     * @param {Object} res - response to client
     */
    return function logging(req, res) {

      req.remoteAddr = req.ip;
      var start = process.hrtime();
      return finale(req, res.statusCode, start);
    };
  }

  /**
   * logging all route
   * 
   * @function logging
   * @param {Object} req - client request
   * @param {Object} res - response to client
   * @param {Function} next - continue routes
   */
  return function logging(req, res, next) {

    var start;
    req.remoteAddr = req.ip;
    finished(res, function() {

      return finale(req, res.statusCode, start);
    });
    start = process.hrtime();
    return next();
  };
}

/**
 * option setting
 * 
 * @exports logger
 * @function logger
 * @param {Object} opt - various options. Check README.md
 * @return {Function|Object}
 */
function logger(opt) {

  var options = opt || Object.create(null);
  var my = {
    filename: require('path').resolve(String(options.filename || 'route.log'))
  };
  if (Boolean(options.deprecated)) {
    my.deprecated = true;
  } else if (Boolean(options.functions)) {
    my.functions = true;
  }

  // winston
  options.winston = options.winston || Object.create(null);
  var winston = {
    filename: my.filename,
    logger: String(options.winston.logger || 'logger-request'),
    level: String(options.winston.level || 'info'),
    silent: Boolean(options.winston.silent),
    colorize: Boolean(options.winston.colorize),
    timestamp: options.winston.timestamp || true,
    maxsize: Number(options.winston.maxsize) || 8388608,
    maxFiles: Number(options.winston.maxFiles) || null,
    json: options.winston.json === false ? false : true,
    raw: options.winston.raw === false ? false : true
  };
  my.logger = winston.logger;

  var log = require('winston').loggers.add(winston.logger, {
    console: {
      level: winston.level,
      silent: !Boolean(options.console),
      colorize: winston.colorize,
      timestamp: winston.timestamp,
      json: winston.json,
      raw: winston.raw,
      showLevel: false
    },
    file: {
      level: winston.level,
      silent: winston.silent,
      colorize: winston.colorize,
      timestamp: winston.timestamp,
      filename: winston.filename,
      maxsize: winston.maxsize,
      maxFiles: winston.maxFiles,
      json: winston.json,
      showLevel: false
    }
  })[winston.level];

  if (Boolean(options.standalone)) {
    return log;
  }

  // custom
  options = options.custom || Object.create(null);
  var io = info({
    pid: Boolean(options.pid),
    bytesReq: Boolean(options.bytesReq),
    bytesRes: Boolean(options.bytesRes),
    referer: Boolean(options.referer),
    auth: Boolean(options.auth),
    transfer: Boolean(options.transfer),
    agent: Boolean(options.agent),
    lang: Boolean(options.lang),
    cookie: Boolean(options.cookie),
    headers: Boolean(options.headers),
    version: Boolean(options.version),
    callback: Boolean(options.callback) ? options.callback : false
  });

  return wrapper(log, my, io);
}
module.exports = logger;
