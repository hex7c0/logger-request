logger-request [![Build Status](https://travis-ci.org/hex7c0/logger-request.svg?branch=master)](https://travis-ci.org/hex7c0/logger-request) [![NPM version](https://badge.fury.io/js/logger-request.svg)](http://badge.fury.io/js/logger-request)
==============

logger middleware for [expressjs](http://expressjs.com/)

## API

```js
var app = require('express')();
var logger-request = require('logger-request');

app.use(logger-request({filename:'pippo.log'}));
```

### logger-request(options)

Setup logger with the given `options` (object).

#### Options

  - `filename` - The filename of the logfile to write output to.
  - `maxsize` - Max size in bytes of the logfile, if the size is exceeded then a new file is created.
  - `json` - If true, messages will be logged as JSON (default true).

releated to https://github.com/flatiron/winston#file-transport

#### Examples

Take a look at my [examples](https://github.com/hex7c0/logger-request/tree/master/examples)


## License
Copyright (c) 2014 hex7c0
Licensed under the GPLv3 license.
