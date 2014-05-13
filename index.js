"use strict";
/**
 * logger-request
 * 
 * @package logger-request
 * @subpackage index
 * @version 1.0.1
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
     * setting options
     * 
     * @param string filename: name of log
     * @param integer maxsize: max size of log
     * @param bollean json: if write data with json format
     */

    var options = options || {};
    var filename = options.filename || 'route.log';
    var maxsize = options.maxsize || 8388608;
    var json = options.json || true;

    // setting
    LOG.loggers.add('_route', {
        console : {
            silent : true,
        },
        file : {
            filename : filename,
            maxsize : maxsize,
            json : json,
        }
    });
    var logger = LOG.loggers.get('_route').info;

    return function logging(req, res, next) {
        /**
         * logging all routing
         * 
         * @param object req: request
         * @param object res: response
         * @param object next: continue routes
         */

        var start = Date.now();
        var buffer = res.end;

        res.end = function final() {
            /**
             * end of job. Get response time and status code
             */

            logger('routes', {
                pid : process.pid,
                method : req.method,
                status : res.statusCode,
                response : Date.now() - start,
                ip : req.headers['x-forwarded-for'] || req.ip
                        || req.connection.remoteAddress,
                url : req.url,
                userAgent : req.headers['user-agent'],
                lang : req.headers['accept-language'],
                cookie : req.cookies,
            });

            res.end = buffer;
        }
        res.end()

        next();
    };
};

/**
 * exports function
 */
exports = module.exports = logger;
