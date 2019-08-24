'use strict';

const log = require('../utils/log');

class TaskFlow {
  constructor(name, serviceName, functionName, sourceDir, artifactDir) {
    this.name = name;
    this.serviceName = serviceName;
    this.functionName = functionName;
    this.sourceDir = sourceDir;
    this.artifactDir = artifactDir;
    this.tasks = [];
  }

  async initTask() {

  }

  async beforeRun() {
    log.info('running task flow %s', this.name);
  }

  async afterRun() {

  }

  async run() {
    for (let task of this.tasks) {
      await task.start();
    }
  }

  async start() {
    if (!this.inited) {
      await this.init();
      this.inited = true;
    }

    await this.beforeRun();
    await this.run();
    await this.afterRun();
  }

}

module.exports = TaskFlow;