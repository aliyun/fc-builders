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

    let phpIniScanDir = process.env.PHP_INI_SCAN_DIR;

    if (phpIniScanDir) {
      phpIniScanDir = `${phpIniScanDir}${path.delimiter}${this.artifactDir}${path.sep}extension`;
    } else {
      phpIniScanDir = `${this.artifactDir}${path.sep}extension`;
    }

    const command = 'composer';
    const commandArgs = ['install', '--no-dev', '--no-interaction', '--prefer-dist'];

    await this.replaceIni('/code/', path.resolve(this.artifactDir) + '/');
    await cmd.execCommand(command, commandArgs, path.resolve(this.artifactDir), {
      'PHP_INI_SCAN_DIR': phpIniScanDir
    });
    await this.replaceIni(path.resolve(this.artifactDir) + '/', '/code/');
  }

  async replaceIni(search, replace) {
    const extensionDir = path.join(path.resolve(this.artifactDir), 'extension');

    if (fs.existsSync(extensionDir) && fs.lstatSync(extensionDir).isDirectory()) {
      const files = await fs.readdir(extensionDir);

      for (let fileName of files) {
        if (fileName.endsWith('.ini') || fileName.endsWith('.INI')) {
          const file = path.join(extensionDir, fileName);
          const content = await fs.readFile(file, 'utf8');
          const replacedContent = content.replace(new RegExp(search, 'g'), replace);
          await fs.outputFile(file, replacedContent);
        }
      }
    }
  }
}

module.exports = ComposerInstallTask;