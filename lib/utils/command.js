'use strict';

const child_process = require('child_process');
const log = require('../utils/log');
const { addEnv } = require('../install/env');
const { Transform } = require('stream');
const _ = require('lodash');

class ChunkSplitTransform extends Transform {
  constructor(options) {
    super(options);
    this._buffer = '';
    this._separator = options.separator || '\n';
  }

  _transform(chunk, encoding, done) {
    let sepPos;
    this._buffer += chunk.toString();

    while ((sepPos = this._buffer.indexOf(this._separator)) != -1) {
      const portion = this._buffer.substr(0, sepPos);
      this.push(portion);
      this._buffer = this._buffer.substr(sepPos + this._separator.length);
    }

    done();
  }

  _flush(done) {
    this.push(this._buffer);
    done();
  }
}

async function execCommand(command, commandArgs, cwd, env) {
  return new Promise((resolve, reject) => {
    const resolvedEnv = addEnv(env);

    const child = child_process.spawn(command, commandArgs, {
      cwd,
      env: resolvedEnv
    });

    const errorMsgs = [];

    const stdoutChunker = new ChunkSplitTransform({
      separator: '\n'
    });

    const stderrChunker = new ChunkSplitTransform({
      separator: '\n'
    });

    stdoutChunker.on('data', (chunk) => {
      if (log.isDebugEnabled()) {
        log.debug(chunk.toString());
      } else {
        errorMsgs.push(chunk);
      }
    });

    stderrChunker.on('data', (chunk) => {
      if (log.isDebugEnabled()) {
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

function registerCommandChecker(program) {
  // Print help information if commands are unknown.
  program.on('command:*', (cmds) => {
    if (!_.flatMap(program.commands, (command) => {
      return [command.name(), command.alias()];
    }).includes(cmds[0])) {
      console.error();
      console.error("  error: unknown command '%s'", cmds[0]);
      program.help();
    }
  });
}



module.exports = {
  execCommand, registerCommandChecker
};