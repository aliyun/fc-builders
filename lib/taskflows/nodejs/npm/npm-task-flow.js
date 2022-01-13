'use strict';

const fs = require('fs-extra');
const path = require('path');
const TaskFlow = require('../../taskflow');
const CopySourceTask = require('../../copy-source-task');
const NpmInstallTask = require('./npm-install-task');
const { onlyCopyManifestFile } = require('../../../utils/utils');

class NpmTaskFlow extends TaskFlow {

  constructor(serviceName, functionName, sourceDir, artifactDir, stages) {
    super('NpmTaskFlow', serviceName, functionName, sourceDir, artifactDir, stages);

    this.excludeFiles.push('node_modules');
  }

  async init() {
    const copyManifestFileStatus = onlyCopyManifestFile(this.sourceDir, this.artifactDir, NpmTaskFlow.getManifestName());
    // Determine if you only need to copy the dependency manifest file
    if (!copyManifestFileStatus) {
      this.installTasks.push(new CopySourceTask(this.sourceDir, this.artifactDir, this.excludeFiles));
    } else {
      // If you only copy the dependency manifest file, you also need to try to copy the yarn.lock file (for supporting yarn download dependencies)
      if (fs.pathExistsSync(path.join(this.sourceDir, 'yarn.lock'))) {
        onlyCopyManifestFile(this.sourceDir, this.artifactDir, 'yarn.lock');
      }
    }
    this.installTasks.push(new NpmInstallTask(this.artifactDir, this.stages));
  }

  static getManifestName() {
    return 'package.json';
  }
}

module.exports = NpmTaskFlow;