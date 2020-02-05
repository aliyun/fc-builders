'use strict';

const TaskFlow = require('../../taskflow');
const DotnetPublishTask = require('./dotnet-publish-task');
const CopyDotnetArtifactsTask = require('./copy-dotnet-artifacts-task');

class DotnetTaskFlow extends TaskFlow {

  constructor(serviceName, functionName, sourceDir, artifactDir, stages, runtime) {
    super('DotnetTaskFlow', serviceName, functionName, sourceDir, artifactDir, stages);
    this.runtime = runtime;
  }

  async init() {
    this.buildTasks.push(new DotnetPublishTask(this.sourceDir, this.runtime));
    this.buildTasks.push(new CopyDotnetArtifactsTask(this.sourceDir, this.artifactDir, this.runtime));
  }

  static getManifestName() {
    return '*.csproj';
  }
}

module.exports = DotnetTaskFlow;
