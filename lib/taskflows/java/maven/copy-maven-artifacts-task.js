'use strict';

const fs = require('fs-extra');

const Task = require('../../task');
const path = require('path');
const fileUitls = require('../../../utils/file');

class CopyMavenArtifactsTask extends Task {
  constructor(sourceDir, targetDir) {
    super('MavenCopyDependencies');
    this.sourceDir = sourceDir;
    this.targetDir = targetDir;
  }

  async run() {

    const classesDir = path.join(this.sourceDir, 'target', 'classes');

    if (!await fs.pathExists(classesDir)) {
      throw new Error('could not found ' + classesDir);
    }

    await fileUitls.copySourceTo(classesDir, this.targetDir);

    const dependenciesDir = path.join(this.sourceDir, 'target', 'dependency');

    if (!fs.pathExists(dependenciesDir)) {
      throw new Error('could not found ' + dependenciesDir);
    }

    await fileUitls.copySourceTo(dependenciesDir, path.join(this.targetDir, 'lib'));
  }
}

module.exports = CopyMavenArtifactsTask;