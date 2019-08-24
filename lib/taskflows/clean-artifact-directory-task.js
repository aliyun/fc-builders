'use strict';

const { cleanDirectory } = require('../utils/file');
const Task = require('./task');

class CleanArtifactDirectoryTask extends Task {
  constructor(artifact) {
    super('CleanArtifactDirectoryTask');
    
    this.artifact = artifact;
  }

  async run() {
    await cleanDirectory(this.artifact);
  }
}

module.exports = CleanArtifactDirectoryTask;