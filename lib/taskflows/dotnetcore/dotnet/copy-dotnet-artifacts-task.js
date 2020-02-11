'use strict';

const fs = require('fs-extra');
const fileUitls = require('../../../utils/file');
const Task = require('../../task');
const { generatePublishedArtifactsDir } = require('./dotnet');

class CopyDotnetArtifactsTask extends Task {
  constructor(sourceDir, targetDir, runtime, config = 'Release') {
    super('CopyDotnetArtifacts');
    this.sourceDir = sourceDir;
    this.targetDir = targetDir;
    this.runtime = runtime;
    this.config = config;
  }

  async run() {
    const artifactsDir = generatePublishedArtifactsDir(this.sourceDir, this.runtime, this.config);

    if (!await fs.pathExists(artifactsDir)) {
      throw new Error(`could not find ${artifactsDir}`);
    }

    await fileUitls.copySourceTo(artifactsDir, this.targetDir);

  }
}

module.exports = CopyDotnetArtifactsTask;