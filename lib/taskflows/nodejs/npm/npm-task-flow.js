'use strict';

const TaskFlow = require('../../taskflow');
const CopySourceTask = require('../../copy-source-task');
const NpmInstallTask = require('./npm-install-task');
const { onlyCpoyManifestFile } = require('../../../utils/utils');

class NpmTaskFlow extends TaskFlow {

  constructor(serviceName, functionName, sourceDir, artifactDir, stages) {
    super('NpmTaskFlow', serviceName, functionName, sourceDir, artifactDir, stages);

    this.excludeFiles.push('node_modules');
  }

  async init() {
    const cpoyManifestFileStatus = onlyCpoyManifestFile(this.sourceDir, this.artifactDir, NpmTaskFlow.getManifestName())
    if (!cpoyManifestFileStatus) {
      this.installTasks.push(new CopySourceTask(this.sourceDir, this.artifactDir, this.excludeFiles));
    }
    this.installTasks.push(new NpmInstallTask(this.artifactDir, this.stages));
  }

  static getManifestName() {
    return 'package.json';
  }
}

module.exports = NpmTaskFlow;