'use strict';

const TaskFlow = require('../../taskflow');
const CopySourceTask = require('../../copy-source-task');
const MavenCompileTask = require('./maven-compile-task');
const fileUtils = require('../../../utils/file');
const MavenCopyDependenciesTask = require('./maven-copy-dependencies-task');
const CopyMavenArtifactsTask = require('./copy-maven-artifacts-task');
const fs = require('fs-extra');

class MavenTaskFlow extends TaskFlow {

  constructor(serviceName, functionName, sourceDir, artifactDir, stages) {
    super('MavenTaskFlow', serviceName, functionName, sourceDir, artifactDir, stages);
    this.excludeFiles = ['target', '.fun'];
  }

  async init() {

    this.tmpDir = await fileUtils.generateTmpDir();

    this.buildTasks.push(new CopySourceTask(this.sourceDir, this.tmpDir, this.excludeFiles)); 
    this.buildTasks.push(new MavenCompileTask(this.tmpDir)); 
    this.buildTasks.push(new MavenCopyDependenciesTask(this.tmpDir));
    this.buildTasks.push(new CopyMavenArtifactsTask(this.tmpDir, this.artifactDir));
  }

  async afterRun() {
    await fs.remove(this.tmpDir);
  }
}

module.exports = MavenTaskFlow;