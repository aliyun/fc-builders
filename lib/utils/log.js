'use strict';

const log4js = require('log4js');

log4js.configure({
  appenders: {
    out: { type: 'stdout', layout: { type: 'messagePassThrough' }}
  },
  categories: { default: { appenders: ['out'], level: 'info' } }
});

const log = log4js.getLogger();

module.exports = log;