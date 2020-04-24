'use strict';

const log = require('../utils/log');

class Task {

  constructor(name) {
    this.name = name;
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