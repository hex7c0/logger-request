#logger-request [![Build Status](https://travis-ci.org/hex7c0/logger-request.svg?branch=master)](https://travis-ci.org/hex7c0/logger-request) [![NPM version](https://badge.fury.io/js/logger-request.svg)](http://badge.fury.io/js/logger-request)

logger middleware for [expressjs](http://expressjs.com/)

## Installation

Install through NPM

```
npm install logger-request
```
or
```
git clone git://github.com/hex7c0/logger-request.git
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

 - `logger` - **String** Logger option related to [`winston`](https://github.com/flatiron/winston#working-with-multiple-loggers-in-winston) *(default "logger-request")*

 - `level` - **String** Level of messages that this transport should log *(default "info")*
 - `silent` - **Boolean** Flag indicating whether to suppress output *(default "false")*
 - `colorize` - **Boolean** Flag indicating if we should colorize output *(default "false")*
 - `timestamp` - **Boolean|Function** Flag indicating if we should prepend output with timestamps *(default "true")*. If function is specified, its return value will be used instead of timestamps
 - `filename` - **String** Filename of the logfile to write output to *(default "route.log")*
 - `maxsize` - **Number** Max size in bytes of the logfile, if the size is exceeded then a new file is created *(default "8388608" [8Mb])*
 - `maxFiles` - **Number** Limit the number of files created when the size of the logfile is exceeded *(default "no limit")*
 - `json` - **Boolean** If true, messages will be logged as JSON *(default "true")*
 - `raw` - **Boolean** If true, raw messages will be logged to console *(default "false")*
 
releated to https://github.com/flatiron/winston#file-transport

#### Examples

Take a look at my [examples](https://github.com/hex7c0/logger-request/tree/master/examples)

## License
Copyright (c) 2014 hex7c0

Licensed under the GPLv3 license
