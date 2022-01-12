'use strict';

const TaskFlow = require('../../taskflow');
const CopySourceTask = require('../../copy-source-task');
const ComposerInstallTask = require('./composer-install-task');
const { onlyCpoyManifestFile } = require('../../../utils/utils');

class ComposerTaskFlow extends TaskFlow {

  constructor(serviceName, functionName, sourceDir, artifactDir, stages) {
    super('ComposerTaskFlow', serviceName, functionName, sourceDir, artifactDir, stages);
    this.excludeFiles.push('vendor');
  }

  async init() {
    const cpoyManifestFileStatus = onlyCpoyManifestFile(this.sourceDir, this.artifactDir, ComposerTaskFlow.getManifestName());
    if (!cpoyManifestFileStatus) {
      this.installTasks.push(new CopySourceTask(this.sourceDir, this.artifactDir, this.excludeFiles)); 
    }
    this.installTasks.push(new ComposerInstallTask(this.artifactDir)); 
  }

  static getManifestName() {
    return 'composer.json';
  }
}

module.exports = ComposerTaskFlow;