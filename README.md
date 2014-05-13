express-logger
==============

simple logger middleware for express

## API

```js
var express = require('express');
var express-logger = require('express-logger');

var app = express();

app.use(express-logger());
```

### express-logger(options)

#### Options

  - `filename` - The filename of the logfile to write output to.
  - `maxsize` - Max size in bytes of the logfile, if the size is exceeded then a new file is created.
  - `json` - If true, messages will be logged as JSON (default true).

releated to https://github.com/flatiron/winston#file-transport