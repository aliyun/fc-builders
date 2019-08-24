'use strict';

const TaskFlow = require('../../taskflow');
const CopySourceTask = require('../../copy-source-task');
const NpmInstallTask = require('./npm-install-task');

class NpmTaskFlow extends TaskFlow {

  constructor(serviceName, functionName, sourceDir, artifactDir) {
    super('NpmTaskFlow', serviceName, functionName, sourceDir, artifactDir);
    
    this.excludeFiles = ['node_modules'];
  }

  async init() {    
    this.tasks.push(new CopySourceTask(this.sourceDir, this.artifactDir, this.excludeFiles));
    this.tasks.push(new NpmInstallTask(this.artifactDir)); 
  }
}

module.exports = NpmTaskFlow;