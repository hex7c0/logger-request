"use strict";
/**
 * @file logger-request main
 * @module logger-request
 * @package logger-request
 * @subpackage main
 * @version 2.2.1
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
 * @return {Object}
 */
function info(my) {

    var out = Object.create(null);
    var promise = new Array();

    if (my.pid) {
        promise.push([ 'pid', function(req) {

            return process.pid;
        } ]);
    }
    if (my.bytesReq) {
        promise.push([ 'bytesReq', function(req) {

            // console.log(process.pid)
            // console.log(req.connection.bytesRead)
            // console.log(req.client.bytesRead)
            // console.log(req.socket.bytesRead)
            // console.log()
            // var s = req.socket.bytesRead - storyReq;
            // storyReq = req.socket.bytesRead;
            // return s;
            return req.socket.bytesRead;
        } ]);
    }
    if (my.bytesRes) {
        promise.push([ 'bytesRes', function(req) {

            // console.log(process.pid)
            // console.log(req.connection._bytesDispatched)
            // console.log(req.client._bytesDispatched)
            // console.log(req.socket._bytesDispatched)
            // console.log()
            // var s = req.socket._bytesDispatched - storyRes;
            // storyRes = req.socket._bytesDispatched;
            // return s;
            return req.socket._bytesDispatched;
        } ]);
    }
    if (my.referrer) {
        promise.push([ 'referrer', function(req) {

            return req.headers['referer'] || req.headers['referrer'];
        } ]);
    }
    if (my.auth) {
        var mod = require('basic-authentication')({
            legacy: true
        });
        promise.push([ 'auth', function(req) {

            return mod(req).user;
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
    if (my.cookie) {
        promise.push([ 'headers', function(req) {

            return req.headers;
        } ]);
    }
    if (my.version) {
        promise.push([ 'version', function(req) {

            return req.httpVersionMajor + '.' + req.httpVersionMinor;
        } ]);
    }

    return function(req, statusCode, end) {

        var req = req.req || req;
        out.ip = req.headers['x-forwarded-for'] || req.ip;
        out.method = req.method;
        out.status = statusCode;
        out.url = req.url;
        out.response = end.toFixed(3);
        for (var i = 0, ii = promise.length; i < ii; i++) {
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
 * @param {Function} logger - logging function
 * @param {Object} cst - custom object parsed
 * @return {Function}
 */
function wrapper(log, my) {

    var who = my.logger;
    var oi = info(my.custom);
    // var storyReq = 0, storyRes = 0;

    /**
     * end of job (closures). Get response time and status code
     * 
     * @function finale
     * @param {Object} req - client request
     * @param {Integr} code - statusCode
     * @param {Array} start - hrtime
     */
    function finale(req, statusCode, start) {

        var diff = process.hrtime(start);
        return log(who,
                oi(req, statusCode, (diff[0] * 1e9 + diff[1]) / 1000000));
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
    return function logging(req, res, next) {

        var start = process.hrtime();

        if (res._headerSent) { // function
            finale(req, res.statusCode, start); // after res.end()
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
            res.end = function(chunk, encoding) {

                res.end = buffer;
                var b = res.end(chunk, encoding);
                // res.end(chunk,encoding,finale) // callback available only
                // with node 0.11
                fin(req, res.statusCode, start); // write after sending all
                // stuff, instead of
                // callback
                return b;
            };
        }

        try {
            return next();
        } catch (TypeError) {
            return;
        }
    };
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
                String(options.filename || 'route.log'))
    };

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
        json: options.winston.json == false ? false : true,
        raw: options.winston.raw == false ? false : true
    };
    my.logger = winston.logger;

    var log = require('winston').loggers.add(winston.logger, {
        console: {
            level: winston.level,
            silent: my.console,
            colorize: winston.colorize,
            timestamp: winston.timestamp,
            json: winston.json,
            raw: winston.raw
        },
        file: {
            level: winston.level,
            silent: winston.silent,
            colorize: winston.colorize,
            timestamp: winston.timestamp,
            filename: winston.filename,
            maxsize: winston.maxsize,
            maxFiles: winston.maxFiles,
            json: winston.json
        }
    })[winston.level];

    if (Boolean(options.standalone)) {
        return log;
    }

    // custom
    options = options.custom || Object.create(null);
    my.custom = {
        pid: Boolean(options.pid),
        bytesReq: Boolean(options.bytesReq),
        bytesRes: Boolean(options.bytesRes),
        referrer: Boolean(options.referrer),
        auth: Boolean(options.auth),
        agent: Boolean(options.agent),
        lang: Boolean(options.lang),
        cookie: Boolean(options.cookie),
        headers: Boolean(options.headers),
        version: Boolean(options.version)
    };

    return wrapper(log, my);
};
