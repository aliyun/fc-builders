'use strict';

const Task = require('../../task');
const cmd = require('../../../utils/command');
const path = require('path');
const { generatePublishedArtifactsDir } = require('./dotnet');

class DotnetPublishTask extends Task {
  constructor(sourceDir, runtime) {
    super('DotnetPublishTask');
    this.sourceDir = sourceDir;
    this.runtime = runtime;
  }

  async run() {
    const command = 'dotnet';
    const commandArgs = [
      'publish', '-c', 'Release', '-o', generatePublishedArtifactsDir(this.sourceDir, this.runtime)
    ];

    await cmd.execCommand(command, commandArgs, path.resolve(this.sourceDir));
  }
}

module.exports = DotnetPublishTask;