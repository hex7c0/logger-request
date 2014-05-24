"use strict";
/**
 * logger-request
 * 
 * @package logger-request
 * @subpackage index
 * @version 1.0.9
 * @author hex7c0 <0x7c0@teboss.tk>
 * @license GPLv3
 * @copyright hex7c0 2014
 */

/**
 * initialize module
 * 
 * @global
 */
// import
try{
    // personal
    var LOG = require('winston');
} catch (MODULE_NOT_FOUND){
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

function logger(options){
    /**
     * option setting
     * 
     * @param object options: various options. Check README.md
     * @return function
     */

    var options = options || {};
    var my = {
        logger: options.logger || 'logger-request',
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

    if (my.silent){
        // remove obsolete
        LOG = my = options = null;

        return function logging(req,res,next){
            /**
             * logging none
             * 
             * @param object req: request
             * @param object res: response
             * @param object next: continue routes
             * @return function
             */

            return next();
        };
    }
    // setting
    LOG.loggers.add(options.logger,{
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
    var logger = LOG.loggers.get(my.logger)[my.level];
    // remove obsolete
    LOG = options = my = null;

    if (standalone){
        return logger;
    }
    return function logging(req,res,next){
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
        res.end = function finale(){
            /**
             * end of job. Get response time and status code
             * 
             * @return void
             */

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
            return;
        };
        res.end();
        return next();
    };
}

/**
 * exports function
 */
module.exports = logger;
