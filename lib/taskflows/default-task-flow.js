'use strict';

const TaskFlow = require('./taskflow');
const CopySourceTask = require('./copy-source-task');

class DefaultTaskFlow extends TaskFlow {

  constructor(serviceName, functionName, sourceDir, artifactDir, stages) {
    super('DefaultTaskFlow', serviceName, functionName, sourceDir, artifactDir, stages);
  }

  async init() {
    this.buildTasks.push(new CopySourceTask(this.sourceDir, this.artifactDir, this.excludeFiles));
  }
}

module.exports = DefaultTaskFlow;