"use strict";
/**
 * @file logger-request main
 * @module logger-request
 * @package logger-request
 * @subpackage main
 * @version 1.1.2
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
var log = null;

/*
 * functions
 */
/**
 * logging all route
 * 
 * @function logging
 * @param {Object} req - client request
 * @param {Object} res - response to client
 * @param {next} next - continue routes
 * @return
 */
function logging(req,res,next) {

    var start = process.hrtime();
    var cache0 = log;
    var buffer = res.end;
    /**
     * end of job. Get response time and status code
     * 
     * @param {String} chunk - data sent
     * @param {String} encoding - data encoding
     * @return
     */
    res.end = function finale(chunk,encoding) {

        var cache1 = cache0;
        res.end = buffer;
        res.end(chunk,encoding,function() {

            var diff = process.hrtime(start);
            cache1({
                pid: process.pid,
                method: req.method,
                status: res.statusCode,
                ip: req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress,
                url: req.url,
                original: req.originalUrl,
                agent: req.headers['user-agent'],
                lang: req.headers['accept-language'],
                cookie: req.cookies,
                response: (diff[0] * 1e9 + diff[1]) / 1000000,
            });
            return;
        });
        return;
    };
    return next();
}
/**
 * logging none
 * 
 * @function empty
 * @param {Object} req - client request
 * @param {Object} res - response to client
 * @param {next} next - continue routes
 * @return
 */
function empty(req,res,next) {

    return next();
}
/**
 * option setting
 * 
 * @exports main
 * @function main
 * @param {Object} options - various options. Check README.md
 * @return {function|Object}
 */
var main = module.exports = function(options) {

    var options = options || {};
    var my = {
        logger: String(options.logger || 'logger-request'),
        // winston
        level: String(options.level || 'info'),
        silent: Boolean(options.silent),
        colorize: Boolean(options.colorize),
        timestamp: options.timestamp || true,
        filename: String(options.filename || 'route.log'),
        maxsize: Number(options.maxsize) || 8388608,
        maxFiles: Number(options.maxFiles) || null,
        json: options.json == false ? false : true,
        raw: options.raw == false ? false : true,
        // override
        console: Boolean(options.console),
        standalone: Boolean(options.standalone),
    };

    if (my.silent) {
        LOG = log = logging = null;
        return empty;
    }
    log = LOG.loggers.add(my.logger,{
        console: {
            level: my.level,
            silent: !my.console,
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
    LOG = empty = null;
    if (my.standalone) {
        logging = null;
        return log;
    }
    return logging;
};
