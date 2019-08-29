'use strict';

const child_process = require('child_process');
const log = require('../utils/log');
const { addEnv } = require('../install/env');

function trimChunk(chunk) {
  let data = '' + chunk;
  if (data.endsWith('\n')) { data = data.trimRight(); }
  return data;
}

async function execCommand(command, commandArgs, cwd, env) {
  return new Promise((resolve, reject) => {
    const resolvedEnv = addEnv(env);

    const child = child_process.spawn(command, commandArgs, {
      cwd,
      env: resolvedEnv
    });

    child.stdout.setEncoding('utf8');

    child.stdout.on('data', (chunk) => {
      log.debug(trimChunk(chunk));
    });

    const errorMsg = [];

    child.stderr.on('data', (chunk) => {

      if (log.level === 'debug') {
        log.error(trimChunk(chunk));
      } else {
        errorMsg.push(chunk);
      }
    });

    child.on('close', (code) => {
      if (code === 0) { resolve(); }
      else {
        if (log.level !== 'debug') {
          log.error(errorMsg.join(''));
        }

        // todo: ctrl + c will error
        reject('');
      }
    });
  });
}

module.exports = {
  execCommand
};