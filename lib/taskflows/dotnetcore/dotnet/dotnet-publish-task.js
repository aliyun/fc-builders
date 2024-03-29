'use strict';

const Task = require('../../task');
const cmd = require('../../../utils/command');
const path = require('path');
const { generatePublishedArtifactsDir } = require('./dotnet');

class DotnetPublishTask extends Task {
  constructor(sourceDir, runtime, config = 'Release', additionalArgs = []) {
    super('DotnetPublishTask', additionalArgs);
    this.sourceDir = sourceDir;
    this.runtime = runtime;
    this.config = config;
  }

  async run() {
    const command = 'dotnet';
    const commandArgs = [
      'publish', '-c', this.config, '-o', generatePublishedArtifactsDir(this.sourceDir, this.runtime, this.config), ...this.additionalArgs
    ];

    await cmd.execCommand(command, commandArgs, path.resolve(this.sourceDir));
  }
}

module.exports = DotnetPublishTask;