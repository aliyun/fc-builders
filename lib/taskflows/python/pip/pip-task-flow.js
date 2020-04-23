'use strict';

const TaskFlow = require('../../taskflow');

const CopySourceTask = require('../../copy-source-task');
const fs = require('fs-extra');
const PipInstallTask = require('./pip-install-task');

class PipTaskFlow extends TaskFlow {

  constructor(serviceName, functionName, sourceDir, artifactDir, stages) {
    super('PipTaskFlow', serviceName, functionName, sourceDir, artifactDir, stages);
    this.excludeFiles.push('requirements.txt');
  }

  async init() {

    // make sure artifactDir exist
    await fs.mkdirp(this.artifactDir);

    this.installTasks.push(new PipInstallTask(this.sourceDir, this.artifactDir));
    this.installTasks.push(new CopySourceTask(this.sourceDir, this.artifactDir, this.excludeFiles));
  }

  static getManifestName() {
    return 'requirements.txt';
  }
}

module.exports = PipTaskFlow;