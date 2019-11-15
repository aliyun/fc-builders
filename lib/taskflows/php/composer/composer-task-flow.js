'use strict';

const TaskFlow = require('../../taskflow');
const CopySourceTask = require('../../copy-source-task');
const ComposerInstallTask = require('./composer-install-task');

class ComposerTaskFlow extends TaskFlow {

  constructor(serviceName, functionName, sourceDir, artifactDir, stages) {
    super('ComposerTaskFlow', serviceName, functionName, sourceDir, artifactDir, stages);
    this.excludeFiles.push('vendor');
  }

  async init() {
    this.installTasks.push(new CopySourceTask(this.sourceDir, this.artifactDir, this.excludeFiles)); 
    this.installTasks.push(new ComposerInstallTask(this.artifactDir)); 
  }

  static getManifestName() {
    return 'composer.json';
  }
}

module.exports = ComposerTaskFlow;