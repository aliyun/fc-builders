'use strict';

const TaskFlow = require('../../taskflow');
const CopySourceTask = require('../../copy-source-task');
const ComposerInstallTask = require('./composer-install-task');

class ComposerTaskFlow extends TaskFlow {

  constructor(serviceName, functionName, sourceDir, artifactDir) {
    super('ComposerTaskFlow', serviceName, functionName, sourceDir, artifactDir);
    this.excludeFiles = [ 'vendor'];
  }
  async init() {
      
    this.tasks.push(new CopySourceTask(this.sourceDir, this.artifactDir, this.excludeFiles)); 
    this.tasks.push(new ComposerInstallTask(this.artifactDir)); 
  }
}

module.exports = ComposerTaskFlow;