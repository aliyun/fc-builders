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

    this.yarnLockFile = path.join(this.artifactDir, 'yarn.lock');
  }

  async run() {
    if (!await fs.pathExists(this.manifestFile)) {
      log.info('manifestFile is ' + this.manifestFile);
      log.info('package.json dont exist, no need to run npm task');
      return;
    }

    // if there is a yarn.lock file, which means the user prefer yarn then npm
    // then we use yarn to install dependencies.
    // Otherwise, no matter there is a package-lock.json or not (before npm 5).
    // install dependencies with npm like before.

    // NOTE: since yarn 2+ is coming, it would be better if we implement a selector to choose witch `install` action
    // should be performed.
    if (this.hasYarnLock()) {
      const command = 'yarn';

      let commandArgs;

      if (_.includes(this.stages, 'build')) {
        commandArgs = [
          'install', // install dependencies, https://classic.yarnpkg.com/en/docs/cli/install
          '--silent', // keep quite, https://classic.yarnpkg.com/en/docs/cli/install#toc-yarn-install-silent
          // '--no-audit', // auditing is disabled by default, https://classic.yarnpkg.com/en/docs/cli/install#toc-yarn-install-audit
          '--pure-lockfile', // disable yarn.lock generation, https://classic.yarnpkg.com/en/docs/cli/install#toc-yarn-install-pure-lockfile
          '--production' // only `dependencies` will be installed, https://classic.yarnpkg.com/en/docs/cli/install#toc-yarn-install-production-true-false
        ];
      } else {
        commandArgs = ['install', '--silent', /*'--no-audit',*/ '--pure-lockfile'];
      }

      await cmd.execCommand(command, commandArgs, path.resolve(this.artifactDir));
    } else {
      const command = 'npm';

      let commandArgs;

      if (_.includes(this.stages, 'build')) {
        commandArgs = [
          'install', // install dependencies, https://docs.npmjs.com/cli/v7/commands/npm-install
          '-q', // keep quite ?
          '--no-audit', // disable auditing, https://docs.npmjs.com/cli/v7/commands/npm-install#audit
          '--no-save', // disable package-lock.json generation, https://docs.npmjs.com/cli/v7/commands/npm-install#save
          '--production' // only `dependencies` will be installed, https://docs.npmjs.com/cli/v7/commands/npm-install#description
        ];
      } else {
        commandArgs = ['install', '-q', '--no-audit', '--no-save'];
      }

      await cmd.execCommand(command, commandArgs, path.resolve(this.artifactDir));
    }

  }

  hasYarnLock() {
    return fs.pathExists(this.yarnLockFile);
  }
}

module.exports = NpmInstallTask;
