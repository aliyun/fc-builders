'use strict';

const Task = require('../task');
const path = require('path');
const install = require('../../install/install');

class FunYmlInstallTask extends Task {
  constructor(buildDir) {
    super('FunYmlInstall');
    this.buildDir = buildDir;
    this.manifestFile = path.join(buildDir, 'fun.yml');
  }

  async run() {    
    await install.installFromYaml(this.manifestFile);
  }
}

module.exports = FunYmlInstallTask;