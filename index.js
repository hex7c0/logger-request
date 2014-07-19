"use strict";
/**
 * @file logger-request main
 * @module logger-request
 * @package logger-request
 * @subpackage main
 * @version 1.2.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    var LOG = require('winston');
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}
// load
var log;
var story = 0;

/*
 * functions
 */
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
    var headers = req.headers;
    log(__filename,{
        pid: process.pid,
        method: req.method,
        status: statusCode,
        byte: req.socket._bytesDispatched - story,
        ip: headers['x-forwarded-for'] || req.ip || headers['host'],
        url: req.url,
        agent: headers['user-agent'],
        lang: headers['accept-language'],
        // cookie: req.cookies,
        response: (diff[0] * 1e9 + diff[1]) / 1000000,
    });
    story = req.socket._bytesDispatched;
    return;
};

/**
 * logging all route
 * 
 * @function logging
 * @param {Object} req - client request
 * @param {Object} res - response to client
 * @param {next} next - continue routes
 * @return {next}
 */
function logging(req,res,next) {

    var start = process.hrtime();
    var buffer = res.end;
    var fin = finale;

    /**
     * middle of job. Set right end function (closure)
     * 
     * @function
     * @param {String} chunk - data sent
     * @param {String} encoding - data encoding
     * @return
     */
    res.end = function(chunk,encoding) {

        res.end = buffer;
        res.end(chunk,encoding);
        // res.end(chunk,encoding,finale) // callback available only with node 0.11
        fin(req,res.statusCode,start); // write after sending all stuff, instead of callback
        return;
    };

    try {
        return next();
    } catch (TypeError) {
        return;
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

    var options = options || {};
    var my = {
        console: !Boolean(options.console),
        standalone: Boolean(options.standalone),
        // winston
        logger: String(options.logger || 'logger-request'),
        level: String(options.level || 'info'),
        silent: Boolean(options.silent),
        colorize: Boolean(options.colorize),
        timestamp: options.timestamp || true,
        filename: String(options.filename || 'route.log'),
        maxsize: Number(options.maxsize) || 8388608,
        maxFiles: Number(options.maxFiles) || null,
        json: options.json == false ? false : true,
        raw: options.raw == false ? false : true,
    };

    if (my.silent) {
        LOG = log = logging = finale = null;
        return function(req,res,next) {

            return next();
        };
    }
    log = LOG.loggers.add(my.logger,{
        console: {
            level: my.level,
            silent: my.console,
            colorize: my.colorize,
            timestamp: my.timestamp,
            json: my.json,
            raw: my.raw,
        },
        file: {
            level: my.level,
            silent: my.silent,
            colorize: my.colorize,
            timestamp: my.timestamp,
            filename: my.filename,
            maxsize: my.maxsize,
            maxFiles: my.maxFiles,
            json: my.json,
        }
    })[my.level];

    LOG = null;
    if (my.standalone) {
        logging = finale = null;
        return log;
    }
    return logging;
};
