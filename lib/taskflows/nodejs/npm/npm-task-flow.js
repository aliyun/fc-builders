'use strict';

const TaskFlow = require('../../taskflow');
const CopySourceTask = require('../../copy-source-task');
const NpmInstallTask = require('./npm-install-task');

class NpmTaskFlow extends TaskFlow {

  constructor(serviceName, functionName, sourceDir, artifactDir, stages) {
    super('NpmTaskFlow', serviceName, functionName, sourceDir, artifactDir, stages);
    
    this.excludeFiles = ['node_modules'];
  }

  async init() {    
    this.installTasks.push(new CopySourceTask(this.sourceDir, this.artifactDir, this.excludeFiles));
    this.installTasks.push(new NpmInstallTask(this.artifactDir)); 
  }
}

module.exports = NpmTaskFlow;