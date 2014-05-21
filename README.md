logger-request [![Build Status](https://travis-ci.org/hex7c0/logger-request.svg?branch=master)](https://travis-ci.org/hex7c0/logger-request) [![NPM version](https://badge.fury.io/js/logger-request.svg)](http://badge.fury.io/js/logger-request)

logger middleware for [expressjs](http://expressjs.com/)

## API

inside expressjs project
```js
var app = require('express')();
var logger = require('logger-request');

app.use(logger({
    filename : 'pippo.log'
}));
```

### logger(options)

#### Options

 - `level` - **String** Level of messages that this transport should log *(default 'info')*
 - `silent` - **Boolean** Flag indicating whether to suppress output
 - `colorize` - **Boolean** Flag indicating if we should colorize output
 - `timestamp` - **Boolean** Flag indicating if we should prepend output with timestamps *(default 'true')*. If function is specified, its return value will be used instead of timestamps
 - `filename` - **String** Filename of the logfile to write output to *(default 'route.log')*
 - `maxsize` - **Integer** Max size in bytes of the logfile, if the size is exceeded then a new file is created *(default '8388608' [8Mb])*
 - `maxFiles` - **Integer** Limit the number of files created when the size of the logfile is exceeded
 - `json` - **Boolean** If true, messages will be logged as JSON *(default 'true')*
 - `standalone` - **Boolean** If true, return logger function instead expressjs callback *(default 'false')*
 - `console` - **Boolean** If true, it displays log also to console *(default 'false')*

releated to https://github.com/flatiron/winston#file-transport

#### Examples

Take a look at my [examples](https://github.com/hex7c0/logger-request/tree/master/examples)

## License
Copyright (c) 2014 hex7c0

Licensed under the GPLv3 license.
