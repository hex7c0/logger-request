v2.0.0 / 2014-07-22
==================

  * Add `custom` object. Now can change log output
  * Change API. This setting now, are under `winston` object
   * `logger`
   * `level`
   * `silent`
   * `colorize`
   * `timestamp`
   * `maxsize`
   * `maxFiles`
   * `json`
   * `raw`

v1.3.0 / 2014-07-19
==================

  * (log) Rename 'byte' to 'bytesRes', bytes read
  * (log) New 'bytesReq', bytes dispatched
  * (log) New '__filename', who wrote log
  * Now working even as a function

v1.2.0 / 2014-07-17
==================

  * Don't store 'cookie' anymore
  * Minor var to function
  * Change MINOR version, due critical issue with node 0.11

v1.1.9 / 2014-07-16
==================

  * Improve performance (remove closure)
  * Write log, after sending all stuff to client

v1.1.8 / 2014-07-09
==================

  * Fix critical issue with node 0.10.29 (callback)

v1.1.7 / 2014-06-29
==================

  * Remove anonymous function
  * Update [`express`](https://github.com/visionmedia/express) @ 4.4.5

1.1.5 / 2014-06-18
==================

  * Clean code

1.1.4 / 2014-06-15
==================

  * Small improvements
  * Print output bytes

1.1.3 / 2014-06-08
==================

  * Improve closures functions

1.1.2 / 2014-06-08
==================

  * Various fixes

1.1.1 / 2014-06-05
==================

  * Best callback function

1.1.0 / 2014-05-27
==================

  * Fix status code
  * JsDoc improvement

1.0.10 / 2014-05-25
==================

  * Fix 'logger' arg

1.0.9 / 2014-05-24
==================

  * Better use of memory
  * 'raw' option

1.0.8 / 2014-05-21
==================

  * Logger option related to [this](https://github.com/flatiron/winston#working-with-multiple-loggers-in-winston)

1.0.7 / 2014-05-21
==================

  * Standalone options flag

1.0.6 / 2014-05-21
==================

  * Validate options flag
  * Update Expressjs to 4.3.0

1.0.5 / 2014-05-19
==================

  * Timestamp option not require a Boolean

1.0.4 / 2014-05-16
==================

  * More Options, releated to 'winston' module

1.0.3 / 2014-05-14
==================

  * Using nanosecond for respose time

1.0.2 / 2014-05-13
==================

  * Fix filename option

1.0.1 / 2014-05-13
==================

  * Fix

1.0.0 / 2014-05-13
==================

  * Project start
