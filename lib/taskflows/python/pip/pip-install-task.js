'use strict';

const fs = require('fs-extra');

const Task = require('../../task');
const path = require('path');
const cmd = require('../../../utils/command');
const log = require('../../../utils/log');

const manifestFileName = 'requirements.txt';

class PipInstallTask extends Task {
  constructor(sourceDir, artifactDir) {
    super('PipInstall');
    this.sourceDir = sourceDir;
    this.manifestFile = path.join(this.sourceDir, manifestFileName);
    this.artifactDir = artifactDir;
  }

  async run() {

    if (!await fs.pathExists(this.manifestFile)) {
      log.info('pip requirements.txt dont exist, no need to run pip task');
      return;
    }

    const command = 'pip';

    const commandArgs = ['install', '--disable-pip-version-check', '-t', this.artifactDir, '-r', this.manifestFile];

    await cmd.execCommand(command, commandArgs);
  }
}

module.exports = PipInstallTask;