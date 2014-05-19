logger-request [![Build Status](https://travis-ci.org/hex7c0/logger-request.svg?branch=master)](https://travis-ci.org/hex7c0/logger-request) [![NPM version](https://badge.fury.io/js/logger-request.svg)](http://badge.fury.io/js/logger-request)
==============

logger middleware for [expressjs](http://expressjs.com/)

## API

```js
var app = require('express')();
var logger = require('logger-request');

app.use(logger({
    filename : 'pippo.log'
}));
```

### logger-request(options)

Setup logger with the given `options` (object).

#### Options

  - `level` - Level of messages that this transport should log
  - `silent` - Boolean flag indicating whether to suppress output
  - `colorize` - Boolean flag indicating if we should colorize output
  - `timestamp` - Boolean flag indicating if we should prepend output with timestamps (default true). If function is specified, its return value will be used instead of timestamps
  - `filename` - The filename of the logfile to write output to
  - `maxsize` - Max size in bytes of the logfile, if the size is exceeded then a new file is created
  - `maxFiles` - Limit the number of files created when the size of the logfile is exceeded
  - `json` - If true, messages will be logged as JSON (default true)
  - `console` - If you want use console too

releated to https://github.com/flatiron/winston#file-transport

#### Examples

Take a look at my [examples](https://github.com/hex7c0/logger-request/tree/master/examples)

## License
Copyright (c) 2014 hex7c0

Licensed under the GPLv3 license.
