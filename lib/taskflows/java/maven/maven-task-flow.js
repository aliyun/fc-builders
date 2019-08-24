'use strict';

const TaskFlow = require('../../taskflow');
const CopySourceTask = require('../../copy-source-task');
const MavenCompileTask = require('./maven-compile-task');
const fileUtils = require('../../../utils/file');
const MavenCopyDependenciesTask = require('./maven-copy-dependencies-task');
const CopyMavenArtifactsTask = require('./copy-maven-artifacts-task');
const fs = require('fs-extra');

class MavenTaskFlow extends TaskFlow {

  constructor(serviceName, functionName, sourceDir, artifactDir) {
    super('MavenTaskFlow', serviceName, functionName, sourceDir, artifactDir);
    this.excludeFiles = ['target', '.fun'];
  }

  async init() {

    this.tmpDir = await fileUtils.generateTmpDir();

    this.tasks.push(new CopySourceTask(this.sourceDir, this.tmpDir, this.excludeFiles)); 
    this.tasks.push(new MavenCompileTask(this.tmpDir)); // 顺序
    this.tasks.push(new MavenCopyDependenciesTask(this.tmpDir));
    this.tasks.push(new CopyMavenArtifactsTask(this.tmpDir, this.artifactDir));
  }

  async afterRun() {
    await fs.remove(this.tmpDir);
  }
}

module.exports = MavenTaskFlow;