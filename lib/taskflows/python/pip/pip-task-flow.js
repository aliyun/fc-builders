'use strict';

const TaskFlow = require('../../taskflow');

const CopySourceTask = require('../../copy-source-task');
const fs = require('fs-extra');
const PipInstallTask = require('./pip-install-task');
const { onlyCopyManifestFile } = require('../../../utils/utils');

class PipTaskFlow extends TaskFlow {

  constructor(serviceName, functionName, sourceDir, artifactDir, stages, otherPayload = {}) {
    super('PipTaskFlow', serviceName, functionName, sourceDir, artifactDir, stages);
    this.otherPayload = otherPayload;
    this.excludeFiles.push('requirements.txt');
  }

  async init() {
    const { additionalArgs } = this.otherPayload;

    // make sure artifactDir exist
    await fs.mkdirp(this.artifactDir);
    const copyManifestFileStatus = onlyCopyManifestFile(this.sourceDir, this.artifactDir, PipTaskFlow.getManifestName());
    if (!copyManifestFileStatus) {
      this.installTasks.push(new PipInstallTask(this.sourceDir, this.artifactDir, additionalArgs));
    }

    this.installTasks.push(new PipInstallTask(this.sourceDir, this.artifactDir, additionalArgs));
    this.installTasks.push(new CopySourceTask(this.sourceDir, this.artifactDir, this.excludeFiles));
  }

  static getManifestName() {
    return 'requirements.txt';
  }
}

module.exports = PipTaskFlow;