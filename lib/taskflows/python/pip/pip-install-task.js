'use strict';

const fs = require('fs-extra');

const Task = require('../../task');
const path = require('path');
const cmd = require('../../../utils/command');
const log = require('../../../utils/log');
const { getToolCachePath } = require('../../../utils/utils');

const manifestFileName = 'requirements.txt';

class PipInstallTask extends Task {
  constructor(sourceDir, artifactDir, additionalArgs = []) {
    super('PipInstall', additionalArgs);
    this.sourceDir = sourceDir;
    this.manifestFile = path.join(this.sourceDir, manifestFileName);
    this.artifactDir = artifactDir;
    this.pythonUserBase = path.join(this.artifactDir, getToolCachePath(), 'python');
  }

  async run() {
    if (!await fs.pathExists(this.manifestFile)) {
      log.info('pip requirements.txt dont exist, no need to run pip task');
      return;
    }

    await fs.ensureDir(this.pythonUserBase);

    const command = 'pip';

    let commandArgs = [];
    // if in conda or virtual env, not need use --user
    if ('CONDA_DEFAULT_ENV' in process.env || 'VIRTUAL_ENV' in process.env) {
      const target = path.join(this.pythonUserBase, 'lib', 'python', 'site-packages');
      commandArgs = ['install', '-t', target, '-r', this.manifestFile, ...this.additionalArgs];
    } else {
      commandArgs = ['install', '--user', '-r', this.manifestFile, ...this.additionalArgs];
    }

    await cmd.execCommand(command, commandArgs, process.cwd(), Object.assign({
      'PIP_NO_WARN_SCRIPT_LOCATION': 0,
      'PIP_DISABLE_PIP_VERSION_CHECK': '1',
      'PYTHONUSERBASE': this.pythonUserBase
    }));
  }
}

module.exports = PipInstallTask;