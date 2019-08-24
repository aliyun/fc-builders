'use strict';

const { copySourceTo } = require('../utils/file');
const Task = require('./task');

class CopySourceTask extends Task {
  constructor(sourceDir, targetDir, excludeFiles) {
    super('CopySource');
    
    this.sourceDir = sourceDir;
    this.targetDir = targetDir;
    this.excludeFiles = excludeFiles;
  }

  async run() {
    await copySourceTo(this.sourceDir, this.targetDir, this.excludeFiles);
  }
}

module.exports = CopySourceTask;