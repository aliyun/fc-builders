'use strict';

const log4js = require('log4js');
const path = require('path');

// try to load fun error-processor appender
// https://github.com/alibaba/funcraft/blob/master/lib/appenders/error-processor
const errorProcessorType = '../lib/appenders/error-processor';

function customAppenderExist() {
  if (!require.main) { return false; }

  const appenderLoadPath = path.join(path.dirname(require.main.filename), errorProcessorType);
  try {
    require(appenderLoadPath);
  } catch (e) {
    return false;
  }
  return true;
}


function getAppenders() {
  const appenders = {
    out: { type: 'stdout', layout: { type: 'messagePassThrough' } }
  };

  if (customAppenderExist()) {
    appenders['errorTransform'] = { type: errorProcessorType, layout: { type: 'messagePassThrough' } };
  }

  return appenders;
}

function getAppendersNames() {
  const appenderNames = ['out'];
  
  if (customAppenderExist()) {
    appenderNames.push('errorTransform');
  }

  return appenderNames;
}

// log4js loading mechanism
// https://github.com/log4js-node/log4js-node/blob/master/docs/writing-appenders.md
log4js.configure({
  appenders: getAppenders(),
  categories: { default: { appenders: getAppendersNames(), level: 'info' } }
});

const log = log4js.getLogger();

module.exports = log;