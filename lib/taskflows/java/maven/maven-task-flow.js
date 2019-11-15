'use strict';

const TaskFlow = require('../../taskflow');
const MavenCompileTask = require('./maven-compile-task');
const MavenCopyDependenciesTask = require('./maven-copy-dependencies-task');
const CopyMavenArtifactsTask = require('./copy-maven-artifacts-task');

class MavenTaskFlow extends TaskFlow {

  constructor(serviceName, functionName, sourceDir, artifactDir, stages) {
    super('MavenTaskFlow', serviceName, functionName, sourceDir, artifactDir, stages);
    this.excludeFiles.push('target');
  }

  async init() {
    this.buildTasks.push(new MavenCompileTask(this.sourceDir)); 
    this.buildTasks.push(new MavenCopyDependenciesTask(this.sourceDir));
    this.buildTasks.push(new CopyMavenArtifactsTask(this.sourceDir, this.artifactDir));
  }

  static getManifestName() {
    return 'pom.xml';
  }
}

module.exports = MavenTaskFlow;