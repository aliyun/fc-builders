'use strict';

const TaskFlow = require('../../taskflow');
const DotnetPublishTask = require('./dotnet-publish-task');
const CopyDotnetArtifactsTask = require('./copy-dotnet-artifacts-task');

const DOTNET_RELEASE_CONFIG_PUBLISH = 'publish';
const DOTNET_RELEASE_CONFIG_DEBUG = 'Debug';

class DotnetTaskFlow extends TaskFlow {

  constructor(serviceName, functionName, sourceDir, artifactDir, stages, runtime) {
    super('DotnetTaskFlow', serviceName, functionName, sourceDir, artifactDir, stages);
    this.runtime = runtime;
  }

  async init() {
    this.buildTasks.push(new DotnetPublishTask(this.sourceDir, this.runtime, DOTNET_RELEASE_CONFIG_PUBLISH));
    this.buildTasks.push(new CopyDotnetArtifactsTask(this.sourceDir, this.artifactDir, this.runtime, DOTNET_RELEASE_CONFIG_PUBLISH));
    this.localTasks.push(new DotnetPublishTask(this.sourceDir, this.runtime, DOTNET_RELEASE_CONFIG_DEBUG));
  }

  static getManifestName() {
    return '*.csproj';
  }
}

module.exports = DotnetTaskFlow;
