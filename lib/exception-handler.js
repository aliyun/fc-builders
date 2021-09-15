'use strict';

const handler = function (err) {
  if (err.stack) {
    console.error(err.stack);
  } else {
    console.error(err.message || '');
  }
  process.exitCode = 1;
};

module.exports = handler;

