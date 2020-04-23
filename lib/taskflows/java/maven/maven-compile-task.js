'use strict';

const fs = require('fs-extra');

const Task = require('../../task');
const path = require('path');
const cmd = require('../../../utils/command');
const log = require('../../../utils/log');

const manifestFileName = 'pom.xml';

class MavenCompileTask extends Task {
  constructor(artifactDir) {
    super('MavenCompileTask');
    this.artifactDir = artifactDir;
    this.manifestFile = path.join(this.artifactDir, manifestFileName);
  }

  async run() {

    if (!await fs.pathExists(this.manifestFile)) {
      log.info('manifestFile is ' + this.manifestFile);
      log.info(`manifestFile dont exist, no need to run ${this.name} task`);
      return;
    }

    const command = 'mvn';
    const commandArgs = ['clean', 'compile'];

    await cmd.execCommand(command, commandArgs, path.resolve(this.artifactDir));
  }
}

module.exports = MavenCompileTask;