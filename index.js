"use strict";
/**
 * @file logger-request main
 * @module logger-request
 * @version 1.1.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/**
 * initialize module
 * 
 * @requires winston
 */
// import
try {
    // personal
    /**
     * @global
     */
    var LOG = require('winston');
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}
// load
/**
 * @global
 */
var logger = null;

/**
 * logging all route
 * 
 * @function logging
 * @param {object} req - client request
 * @param {object} res - response to client
 * @param {next} next - continue routes
 * @return
 */
function logging(req,res,next) {

    var start = process.hrtime();
    var buffer = res.end;

    /**
     * end of job. Get response time and status code
     * 
     * @param {string} chunk - data sent
     * @param {string} encoding - data encoding
     * @return
     */
    res.end = function finale(chunk,encoding) {

        var diff = process.hrtime(start);
        logger('logger-request',{
            pid: process.pid,
            method: req.method,
            status: res.statusCode,
            ip: req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress,
            url: req.url,
            agent: req.headers['user-agent'],
            lang: req.headers['accept-language'],
            cookie: req.cookies,
            response: diff[0] * 1e9 + diff[1],
        });

        res.end = buffer;
        res.end(chunk,encoding);
        return;
    };

    return next();
}
/**
 * logging none
 * 
 * @function empty
 * @param {object} req - client request
 * @param {object} res - response to client
 * @param {next} next - continue routes
 * @return
 */
function empty(req,res,next) {

    return next();

}
/**
 * option setting
 * 
 * @function main
 * @param {object} options - various options. Check README.md
 * @return {function|object}
 */
function main(options) {

    var options = options || {};
    var my = {
        logger: String(options.logger || 'logger-request'),
        // winston
        level: String(options.level || 'info'),
        silent: Boolean(options.silent),
        colorize: Boolean(options.colorize),
        timestamp: options.timestamp == false ? false : true,
        filename: String(options.filename || 'route.log'),
        maxsize: parseInt(options.maxsize) || 8388608,
        maxFiles: parseInt(options.maxFiles) || null,
        json: options.json == false ? false : true,
        raw: options.raw == false ? false : true,
        // override
        console: options.console == true ? false : true,
    };
    var standalone = options.standalone == true ? true : false;

    if (my.silent) {
        // remove obsolete
        LOG = main = logging = null;
        return empty;
    }
    // setting
    LOG.loggers.add(my.logger,{
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
    });
    logger = LOG.loggers.get(my.logger)[my.level];

    // remove obsolete
    LOG = main = empty = null;
    if (standalone) {
        logging = null;
        return logger;
    }
    return logging;
}

/**
 * exports function
 * 
 * @exports logger-request
 */
module.exports = main;
