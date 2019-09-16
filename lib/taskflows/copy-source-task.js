'use strict';

const { copySourceTo } = require('../utils/file');
const Task = require('./task');
const log = require('../utils/log');

class CopySourceTask extends Task {
  constructor(sourceDir, targetDir, excludeFiles) {
    super('CopySource');
    
    this.sourceDir = sourceDir;
    this.targetDir = targetDir;
    this.excludeFiles = excludeFiles;
  }

  async run() {    
    if (this.sourceDir === this.targetDir) {
      log.debug('Skipping copy, the source dir is %s, the target dir is %s', this.sourceDir, this.targetDir); 
    } else {
      await copySourceTo(this.sourceDir, this.targetDir, this.excludeFiles);
    }
  }
}

module.exports = CopySourceTask;