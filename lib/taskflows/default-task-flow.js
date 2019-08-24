'use strict';

const TaskFlow = require('./taskflow');
const CopySourceTask = require('./copy-source-task');

class DefaultTaskFlow extends TaskFlow {

  constructor(serviceName, functionName, sourceDir, artifactDir) {
    super('DefaultTaskFlow', serviceName, functionName, sourceDir, artifactDir);
  }

  async init() {
    this.tasks.push(new CopySourceTask(this.sourceDir, this.artifactDir, this.excludeFiles));
  }
}

module.exports = DefaultTaskFlow;