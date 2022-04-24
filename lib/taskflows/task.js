'use strict';

const log = require('../utils/log');

class Task {

  constructor(name, additionalArgs = []) {
    this.name = name;
    this.additionalArgs = additionalArgs;
  }

  async beforeRun() {
    log.info('running task: ' + this.name);
  }

  async run() {}

  async afterRun() {}

  async start() {
    await this.beforeRun();
    await this.run();
    await this.afterRun();
  }
}

module.exports = Task;