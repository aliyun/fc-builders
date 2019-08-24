'use strict';

const TaskFlow = require('../taskflow');
const fileUtils = require('../../utils/file');
const fs = require('fs-extra');
const FunYmlInstallTask = require('./fun-yml-install-task');

class FunYmlTaskFlow extends TaskFlow {

  constructor(serviceName, functionName, sourceDir, artifactDir) {
    super('FunYmlTaskFlow', serviceName, functionName, sourceDir, artifactDir);
  }

  async init() {

    this.tmpDir = await fileUtils.generateTmpDir();
    
    this.tasks.push(new FunYmlInstallTask(this.sourceDir));
  }

  async afterRun() {
    await fs.remove(this.tmpDir);
  }
}

module.exports = FunYmlTaskFlow;