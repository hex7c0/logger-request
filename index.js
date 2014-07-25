"use strict";
/**
 * @file logger-request main
 * @module logger-request
 * @package logger-request
 * @subpackage main
 * @version 2.1.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * functions
 */
/**
 * function wrapper for multiple require
 * 
 * @function wrapper
 * @param {Function} logger - logging function
 * @param {Object} cst - custom object parsed
 * @return {Function}
 */
function wrapper(logger,cst) {

    var mod;
    var log = logger
    var oi = info(cst);
    var storyReq = 0, storyRes = 0;

    /**
     * builder of option
     * 
     * @function info
     * @param {Object} my - user options
     * @return {Object}
     */
    function info(my) {

        var out = Object.create(null);
        var promise = new Array();

        if (my.pid) {
            promise.push(['pid',function(req) {

                return process.pid;
            }]);
        }
        if (my.bytesReq) {
            promise.push(['bytesReq',function(req) {

                var s = req.socket.bytesRead - storyReq;
                storyReq = req.socket.bytesRead;
                return s;
            }]);
        }
        if (my.bytesRes) {
            promise.push(['bytesRes',function(req) {

                var s = req.socket._bytesDispatched - storyRes;
                storyRes = req.socket._bytesDispatched;
                return s;
            }]);
        }
        if (my.referrer) {
            promise.push(['referrer',function(req) {

                return req.headers['referer'] || req.headers['referrer'];
            }]);
        }
        if (my.auth) {
            mod = require('basic-authentication')({
                legacy: true
            });
            promise.push(['auth',function(req) {

                return mod(req).user;
            }]);
        }
        if (my.agent) {
            promise.push(['agent',function(req) {

                return req.headers['user-agent'];
            }]);
        }
        if (my.lang) {
            promise.push(['lang',function(req) {

                return req.headers['accept-language'];
            }]);
        }
        if (my.cookie) {
            promise.push(['cookie',function(req) {

                return req.cookies;
            }]);
        }
        if (my.version) {
            promise.push(['version',function(req) {

                return req.httpVersionMajor + '.' + req.httpVersionMinor;
            }]);
        }

        return function(req,statusCode,start) {

            var re = req.req || req;
            var prom = promise;
            out.ip = re.headers['x-forwarded-for'] || re.ip
                    || re.connection.remoteAddress;
            out.method = re.method;
            out.status = statusCode;
            out.url = re.url;
            out.response = start.toFixed(3);
            for (var i = 0, ii = prom.length; i < ii; i++) {
                var p = prom[i];
                out[p[0]] = p[1](re);
            }
            return out;
        };
    }

    /**
     * end of job (closures). Get response time and status code
     * 
     * @function finale
     * @param {Object} req - client request
     * @param {Integr} code - statusCode
     * @param {Array} start - hrtime
     * @return
     */
    function finale(req,statusCode,start) {

        var diff = process.hrtime(start);
        return log(oi(req,statusCode,(diff[0] * 1e9 + diff[1]) / 1000000));
    }

    /**
     * logging all route
     * 
     * @function logging
     * @param {Object} req - client request
     * @param {Object} res - response to client
     * @param {next} next - continue routes
     * @return {next}
     */
    return function logging(req,res,next) {

        var start = process.hrtime();

        if (res._headerSent) { // function
            finale(req,res.statusCode,start); // after res.end()
        } else { // middleware
            var buffer = res.end;
            var fin = finale;

            /**
             * middle of job. Set right end function (closure)
             * 
             * @function
             * @param {String} chunk - data sent
             * @param {String} encoding - data encoding
             * @return {Boolean}
             */
            res.end = function(chunk,encoding) {

                res.end = buffer;
                var b = res.end(chunk,encoding);
                // res.end(chunk,encoding,finale) // callback available only with node 0.11
                fin(req,res.statusCode,start); // write after sending all stuff, instead of
                // callback
                return b;
            };
        }

        try {
            return next();
        } catch (TypeError) {
            return;
        }
    }
}

/**
 * option setting
 * 
 * @exports logger
 * @function logger
 * @param {Object} options - various options. Check README.md
 * @return {Function|Object}
 */
module.exports = function logger(options) {

    var options = options || Object.create(null);
    var my = {
        console: !Boolean(options.console),
        filename: require('path').resolve(
                String(options.filename || 'route.log')),
    };

    // winston
    options.winston = options.winston || Object.create(null);
    my.winston = {
        logger: String(options.winston.logger || 'logger-request'),
        level: String(options.winston.level || 'info'),
        silent: Boolean(options.winston.silent),
        colorize: Boolean(options.winston.colorize),
        timestamp: options.winston.timestamp || true,
        maxsize: Number(options.winston.maxsize) || 8388608,
        maxFiles: Number(options.winston.maxFiles) || null,
        json: options.winston.json == false ? false : true,
        raw: options.winston.raw == false ? false : true,
    };
    var log = require('winston').loggers.add(my.logger,{
        console: {
            level: my.winston.level,
            silent: my.console,
            colorize: my.winston.colorize,
            timestamp: my.winston.timestamp,
            json: my.winston.json,
            raw: my.winston.raw,
        },
        file: {
            level: my.winston.level,
            silent: my.winston.silent,
            colorize: my.winston.colorize,
            timestamp: my.winston.timestamp,
            filename: my.filename,
            maxsize: my.winston.maxsize,
            maxFiles: my.winston.maxFiles,
            json: my.winston.json,
        }
    })[my.winston.level];

    if (Boolean(options.standalone)) {
        return log;
    }

    // custom
    options.custom = options.custom || Object.create(null);
    my.custom = {
        pid: Boolean(options.custom.pid),
        bytesReq: Boolean(options.custom.bytesReq),
        bytesRes: Boolean(options.custom.bytesRes),
        referrer: Boolean(options.custom.referrer),
        auth: Boolean(options.custom.auth),
        agent: Boolean(options.custom.agent),
        lang: Boolean(options.custom.lang),
        cookie: Boolean(options.custom.cookie),
        version: Boolean(options.custom.version),
    };

    return wrapper(log,my.custom);
};
