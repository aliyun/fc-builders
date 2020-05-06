'use strict';

const fs = require('fs-extra');
const Task = require('../../task');
const path = require('path');
const cmd = require('../../../utils/command');
const log = require('../../../utils/log');

const { readLines } = require('../../../utils/file');
const { red } = require('colors');

const _ = require('lodash');

const manifestFileName = 'requirements.txt';
const NEED_USE_DOCKER_PKG = ['pymssql'];

class PipInstallTask extends Task {
  constructor(sourceDir, artifactDir) {
    super('PipInstall');
    this.sourceDir = sourceDir;
    this.manifestFile = path.join(this.sourceDir, manifestFileName);
    this.artifactDir = artifactDir;
    this.pythonUserBase = path.join(this.artifactDir, '.fun', 'python');
  }

  async run() {
    if (!await fs.pathExists(this.manifestFile)) {
      log.info('pip requirements.txt dont exist, no need to run pip task');
      return;
    }

    const contents = await readLines(this.manifestFile);

    if (!_.isEmpty(contents.filter(f => { return NEED_USE_DOCKER_PKG.indexOf(f) > -1; }))) {
      console.warn(red(`DetectionWarning: You need to use docker to install '${contents.join(',')}' in requirements.txt.`));
    }

    await fs.ensureDir(this.pythonUserBase);

    const command = 'pip';

    const commandArgs = ['install', '--user', '-r', this.manifestFile];

    await cmd.execCommand(command, commandArgs, process.cwd(), Object.assign({
      'PIP_NO_WARN_SCRIPT_LOCATION': 0,
      'PIP_DISABLE_PIP_VERSION_CHECK': '1',
      'PYTHONUSERBASE': this.pythonUserBase
    }));
  }
}

module.exports = PipInstallTask;