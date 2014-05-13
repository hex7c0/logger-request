"use strict";
/**
 * express-logger
 * 
 * @package express-logger
 * @subpackage index
 * @version 0.0.1
 * @author hex7c0 <carniellifrancesco@gmail.com>
 * @copyright GPLv3
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
    var options = options || {};
    var filename = options.store || 'route.log';
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
                url : req.url,
                ip : req.headers['x-forwarded-for'] || req.ip
                        || req.connection.remoteAddress,
                cookie : req.cookies,
                response : Date.now() - start,
                userAgent : req.headers['user-agent'],
                lang : req.headers['accept-language']
            });

            res.end = buffer;
        }
        res.end()

        next();
    };
};

/**
 * exports functions
 */
module.exports = logger;
