"use strict";
/**
 * logger-request
 * 
 * @package logger-request
 * @subpackage index
 * @version 1.0.6
 * @author hex7c0 <0x7c0@teboss.tk>
 * @license GPLv3
 * @overview main module
 * @copyright hex7c0 2014
 */

/**
 * initialize module
 */
// import
try {
    // personal
    var LOG = require('winston');
} catch (MODULE_NOT_FOUND) {
    console.log(MODULE_NOT_FOUND);
    process.exit(1);
}

function logger(options) {
    /**
     * option setting
     * 
     * @param object options: various options. Check README.md
     * @return function
     */

    var options = options || {};
    // winston
    options.level = String(options.level || 'info');
    options.silent = Boolean(options.silent);
    options.colorize = Boolean(options.colorize);
    options.timestamp = options.timestamp == false ? false : true;
    options.filename = String(options.filename || 'route.log');
    options.maxsize = parseInt(options.maxsize) || 8388608;
    options.maxFiles = parseInt(options.maxFiles) || null;
    options.json = options.json == false ? false : true;
    // override
    options.console = options.console == true ? false : true;

    if (options.silent) {
        return function logging(req, res, next) {
            /**
             * logging all routing
             * 
             * @param object req: request
             * @param object res: response
             * @param object next: continue routes
             * @return function
             */

            return next();
        };
    } else {
        // setting
        LOG.loggers.add('_route', {
            console : {
                level : options.level,
                silent : options.console,
                colorize : options.colorize,
                timestamp : options.timestamp,
            },
            file : {
                level : options.level,
                silent : options.silent,
                colorize : options.colorize,
                timestamp : options.timestamp,
                filename : options.filename,
                maxsize : options.maxsize,
                maxFiles : options.maxFiles,
                json : options.json,
            }
        });
        var logger = LOG.loggers.get('_route')[options.level];

        return function logging(req, res, next) {
            /**
             * logging all routing
             * 
             * @param object req: request
             * @param object res: response
             * @param object next: continue routes
             * @return function
             */

            var start = process.hrtime();
            var buffer = res.end;

            res.end = function finale() {
                /**
                 * end of job. Get response time and status code
                 * 
                 * @return void
                 */

                var diff = process.hrtime(start)
                logger('logger-reques', {
                    pid : process.pid,
                    method : req.method,
                    status : res.statusCode,
                    response : diff[0] * 1e9 + diff[1],
                    ip : req.headers['x-forwarded-for'] || req.ip
                            || req.connection.remoteAddress,
                    url : req.url,
                    agent : req.headers['user-agent'],
                    language : req.headers['accept-language'],
                    cookie : req.cookies,
                });

                res.end = buffer;
                return;
            }
            res.end()

            return next();
        };
    }
};

/**
 * exports function
 */
exports = module.exports = logger;
