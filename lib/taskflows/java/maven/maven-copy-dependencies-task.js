'use strict';

const fs = require('fs-extra');

const Task = require('../../task');
const path = require('path');
const cmd = require('../../../utils/command');
const log = require('../../../utils/log');

const manifestFileName = 'pom.xml';

class MavenCopyDependenciesTask extends Task {
  constructor(buildDir) {
    super('MavenCopyDependencies');
    this.buildDir = buildDir;
    this.manifestFile = path.join(this.buildDir, manifestFileName);
  }

  async run() {
    
    if (!await fs.pathExists(this.manifestFile)) {
      log.info('manifestFile is ' + this.manifestFile);
      log.info(`manifestFile dont exist, no need to run ${this.name} task`);
      return;
    }

    const command = 'mvn';
    const commandArgs = ['dependency:copy-dependencies', '-DincludeScope=compile'];
    
    await cmd.execCommand(command, commandArgs, path.resolve(this.buildDir));
  }
}

module.exports = MavenCopyDependenciesTask;