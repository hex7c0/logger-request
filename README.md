# [logger-request](https://github.com/hex7c0/logger-request)
[![NPM version](https://badge.fury.io/js/logger-request.svg)](http://badge.fury.io/js/logger-request)
[![Build Status](https://travis-ci.org/hex7c0/logger-request.svg?branch=master)](https://travis-ci.org/hex7c0/logger-request)
[![devDependency Status](https://david-dm.org/hex7c0/logger-request/dev-status.svg)](https://david-dm.org/hex7c0/logger-request#info=devDependencies)

HTTP request logger middleware for [nodejs](http://nodejs.org/).
Save logs to file or show to console.
Look at [`logger-request-cli`](https://github.com/hex7c0/logger-request-cli) for Parser.

## Installation

Install through NPM

```
npm install logger-request
```
or
```
git clone git://github.com/hex7c0/logger-request.git
```
or
```
http://supergiovane.tk/#/logger-request
```

## API

inside expressjs project
```js
var logger = require('logger-request');
var app = require('express')();

app.use(logger({
    filename : 'foo.log',
}));
```

### logger(options)

#### options

 - `console` - **Boolean** If true, it displays log also to console *(default "false")*
 - `standalone` - **Boolean** If true, return logger function instead expressjs callback *(default "false")*
 - `filename` - **String** Filename of the logfile to write output to *(default "route.log")*
 
 
 
 - `winston` - **Object** Setting for logger
  - `logger` - **String** Logger option related to [`winston`](https://github.com/flatiron/winston#working-with-multiple-loggers-in-winston) *(default "logger-request")*
  - `level` - **String** Level of messages that this transport should log *(default "info")*
  - `silent` - **Boolean** Flag indicating whether to suppress output *(default "false")*
  - `colorize` - **Boolean** Flag indicating if we should colorize output *(default "false")*
  - `timestamp` - **Boolean|Function** Flag indicating if we should prepend output with timestamps *(default "true")*. If function is specified, its return value will be used instead of timestamps
  - `maxsize` - **Number** Max size in bytes of the logfile, if the size is exceeded then a new file is created *(default "8388608" [8Mb])*
  - `maxFiles` - **Number** Limit the number of files created when the size of the logfile is exceeded *(default "no limit")*
  - `json` - **Boolean** If true, messages will be logged as JSON *(default "true")*
  - `raw` - **Boolean** If true, raw messages will be logged to console *(default "false")*
 
releated to https://github.com/flatiron/winston#file-transport

 - `custom` - **Object** Setting for add customization to log
  - `pid` - **Boolean** Flag for `process.pid` *(default "disabled")*
  - `bytesReq` - **Boolean** Flag for `req.socket.bytesRead` *(default "disabled")*
  - `bytesRes` - **Boolean** Flag for `req.socket._bytesDispatched` *(default "disabled")*
  - `referrer` - **Boolean** Flag for `req.headers['referrer']` *(default "disabled")*
  - `auth` - **Boolean** Flag for `basic-authentication` *(default "disabled")*
  - `agent` - **Boolean** Flag for `req.headers['user-agent']` *(default "disabled")*
  - `lang` - **Boolean** Flag for `req.headers['accept-language']` *(default "disabled")*
  - `cookie` - **Boolean** Flag for `req.cookies` *(default "disabled")*
  - `headers` - **Boolean** Flag for `req.headers` *(default "disabled")*
  - `version` - **Boolean** Flag for `req.httpVersionMajor` *(default "disabled")*

#### Examples

Take a look at my [examples](https://github.com/hex7c0/logger-request/tree/master/examples)

## License
Copyright (c) 2014 hex7c0

Licensed under the GPLv3 license
