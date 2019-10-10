'use strict';

const log = require('../utils/log');

class TaskFlow {
  constructor(name, serviceName, functionName, sourceDir, artifactDir, stages) {
    this.name = name;
    this.serviceName = serviceName;
    this.functionName = functionName;
    this.sourceDir = sourceDir;
    this.artifactDir = artifactDir;
    this.stages = stages || ['install', 'build'];
    this.installTasks = [];
    this.buildTasks = [];
    this.excludeFiles = ['.fun', 'Funfile', 'fun.yml', '.funignore'];
  }

  async initTask() {

  }

  async beforeRun() {
    log.info('running task flow %s', this.name);
  }

  async afterRun() {

  }

  async runInstall() {
    for (let task of this.installTasks) {
      await task.start();
    }
  }

  async runBuild() {
    for (let task of this.buildTasks) {
      await task.start();
    }
  }

  async start() {
    if (!this.inited) {
      await this.init();
      this.inited = true;
    }

    await this.beforeRun();

    for (const stage of this.stages) {
      if (stage === 'install') {
        await this.runInstall();
      } else if (stage === 'build') {
        await this.runBuild();
      } else {
        throw new Error(`not support stage ${stage}`);
      }
    }

    await this.afterRun();
  }

}

module.exports = TaskFlow;