'use strict';

const TaskFlow = require('../../taskflow');
const MavenCompileTask = require('./maven-compile-task');
const MavenCopyDependenciesTask = require('./maven-copy-dependencies-task');
const CopyMavenArtifactsTask = require('./copy-maven-artifacts-task');

class MavenTaskFlow extends TaskFlow {

  constructor(serviceName, functionName, sourceDir, artifactDir, stages, otherPayload = {}) {
    super('MavenTaskFlow', serviceName, functionName, sourceDir, artifactDir, stages);
    this.otherPayload = otherPayload;
    this.excludeFiles.push('target');
  }

  async init() {
    const { additionalArgs } = this.otherPayload;
    this.buildTasks.push(new MavenCompileTask(this.sourceDir, additionalArgs));
    this.buildTasks.push(new MavenCopyDependenciesTask(this.sourceDir, additionalArgs));
    this.buildTasks.push(new CopyMavenArtifactsTask(this.sourceDir, this.artifactDir, additionalArgs));
  }

  static getManifestName() {
    return 'pom.xml';
  }
}

module.exports = MavenTaskFlow;