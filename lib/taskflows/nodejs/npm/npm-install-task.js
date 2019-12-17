'use strict';

const fs = require('fs-extra');

const Task = require('../../task');
const path = require('path');
const cmd = require('../../../utils/command');
const log = require('../../../utils/log');

const _ = require('lodash');

const manifestFileName = 'package.json';

class NpmInstallTask extends Task {
  constructor(artifactDir, stages) {
    super('NpmInstall');
    this.artifactDir = artifactDir;
    this.stages = stages;
    this.manifestFile = path.join(this.artifactDir, manifestFileName);
  }

  async run() {
    if (!await fs.pathExists(this.manifestFile)) {
      log.info('manifestFile is ' + this.manifestFile);
      log.info('package.json dont exist, no need to run npm task');
      return;
    }

    const command = 'npm';

    let commandArgs;

    if (_.includes(this.stages, 'build')) {
      commandArgs = ['install', '-q', '--no-audit', '--no-save', '--production'];
    } else {
      commandArgs = ['install', '-q', '--no-audit', '--no-save'];
    }

    await cmd.execCommand(command, commandArgs, path.resolve(this.artifactDir));
  }
}

module.exports = NpmInstallTask;