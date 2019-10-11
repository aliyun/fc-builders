'use strict';

const child_process = require('child_process');
const log = require('../utils/log');
const { addEnv } = require('../install/env');
const chunkingStreams = require('chunking-streams');

async function execCommand(command, commandArgs, cwd, env) {
  return new Promise((resolve, reject) => {
    const resolvedEnv = addEnv(env);

    const child = child_process.spawn(command, commandArgs, {
      cwd,
      env: resolvedEnv
    });

    const errorMsgs = [];

    const stdoutChunker = new chunkingStreams.SeparatorChunker({
      separator: '\n',
      flushTail: false
    });

    const stderrChunker = new chunkingStreams.SeparatorChunker({
      separator: '\n',
      flushTail: false
    });

    stdoutChunker.on('data', (chunk) => {
      if (log.level === 'debug') {
        log.debug(chunk.toString());
      } else {
        errorMsgs.push(chunk);
      }
    });

    stderrChunker.on('data', (chunk) => {
      if (log.level === 'debug') {
        log.debug(chunk.toString());
      } else {
        errorMsgs.push(chunk);
      }
    });

    child.on('close', (code) => {
      if (code === 0) { resolve(); }
      else {
        if (errorMsgs.length !== 0) {
          log.error(errorMsgs.join('\n'));
        }
        
        // todo: ctrl + c will error
        reject('');
      }
    });

    child.stdout.pipe(stdoutChunker);
    child.stderr.pipe(stderrChunker);
  });
}

module.exports = {
  execCommand
};