'use strict';

const fs = require('fs-extra');

const Task = require('../../task');
const path = require('path');
const cmd = require('../../../utils/command');
const log = require('../../../utils/log');

const manifestFileName = 'composer.json';

class ComposerInstallTask extends Task {
  constructor(artifactDir) {
    super('ComposerInstallTask');
    this.artifactDir = artifactDir;
    this.manifestFile = path.join(this.artifactDir, manifestFileName);
  }

  async run() {

    if (!await fs.pathExists(this.manifestFile)) {
      log.info('manifestFile is ' + this.manifestFile);
      log.info('package.json dont exist, no need to run npm task');
      return;
    }

    const command = 'composer';
    const commandArgs = ['install', '--no-dev', '--no-interaction', '--prefer-dist'];

    await cmd.execCommand(command, commandArgs, path.resolve(this.artifactDir));
  }
}

module.exports = ComposerInstallTask;