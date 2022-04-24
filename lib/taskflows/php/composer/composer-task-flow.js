'use strict';

const TaskFlow = require('../../taskflow');
const CopySourceTask = require('../../copy-source-task');
const ComposerInstallTask = require('./composer-install-task');
const { onlyCopyManifestFile } = require('../../../utils/utils');

class ComposerTaskFlow extends TaskFlow {

  constructor(serviceName, functionName, sourceDir, artifactDir, stages, otherPayload = {}) {
    super('ComposerTaskFlow', serviceName, functionName, sourceDir, artifactDir, stages);
    this.otherPayload = otherPayload;
    this.excludeFiles.push('vendor');
  }

  async init() {
    const copyManifestFileStatus = onlyCopyManifestFile(this.sourceDir, this.artifactDir, ComposerTaskFlow.getManifestName());
    if (!copyManifestFileStatus) {
      this.installTasks.push(new CopySourceTask(this.sourceDir, this.artifactDir, this.excludeFiles));
    }
    this.installTasks.push(new ComposerInstallTask(this.artifactDir, this.otherPayload.additionalArgs));
  }

  static getManifestName() {
    return 'composer.json';
  }
}

module.exports = ComposerTaskFlow;