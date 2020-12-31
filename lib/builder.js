'use strict';

const MavenTaskFlow = require('./taskflows/java/maven/maven-task-flow');
const NpmTaskFlow = require('./taskflows/nodejs/npm/npm-task-flow');
const ComposerTaskFlow = require('./taskflows/php/composer/composer-task-flow');
const PipTaskFlow = require('./taskflows/python/pip/pip-task-flow');
const DotnetTaskFlow = require('./taskflows/dotnetcore/dotnet/dotnet-task-flow');
const DefaultTaskFlow = require('./taskflows/default-task-flow');

const _ = require('lodash');
const log = require('./utils/log');
const glob = require('glob');

const runtimeTaskFlows = {
  'java8': {
    [MavenTaskFlow.getManifestName()]: MavenTaskFlow
  },
  'java11': {
    [MavenTaskFlow.getManifestName()]: MavenTaskFlow
  },
  'nodejs8': {
    [NpmTaskFlow.getManifestName()]: NpmTaskFlow
  },
  'nodejs6': {
    [NpmTaskFlow.getManifestName()]: NpmTaskFlow
  },
  'nodejs10': {
    [NpmTaskFlow.getManifestName()]: NpmTaskFlow
  },
  'nodejs12': {
    [NpmTaskFlow.getManifestName()]: NpmTaskFlow
  },
  'python2.7': {
    [PipTaskFlow.getManifestName()]: PipTaskFlow
  },
  'python3': {
    [PipTaskFlow.getManifestName()]: PipTaskFlow
  },
  'php7.2': {
    [ComposerTaskFlow.getManifestName()]: ComposerTaskFlow
  },
  'custom': {
    [NpmTaskFlow.getManifestName()]: NpmTaskFlow,
    [PipTaskFlow.getManifestName()]: PipTaskFlow,
    [MavenTaskFlow.getManifestName()]: MavenTaskFlow,
    [ComposerTaskFlow.getManifestName()]: ComposerTaskFlow
  },
  'dotnetcore2.1': {
    [DotnetTaskFlow.getManifestName()]: DotnetTaskFlow
  }
};

class Builder {
  constructor(serviceName, functionName, sourceDir, runtime, artifactDir, verbose, stages = ['install', 'build']) {
    this.serviceName = serviceName;
    this.functionName = functionName;
    this.sourceDir = sourceDir;
    this.runtime = runtime;
    this.artifactDir = artifactDir;
    this.verbose = verbose;
    this.stages = stages;
    
    if (this.verbose) {
      log.level = 'debug';
    }
  }

  async build() {
    log.debug('builder begin to build, runtime is: %s, sourceDir: ', this.runtime, this.sourceDir);
    const taskFlows = await Builder.detectTaskFlow(this.runtime, this.sourceDir);

    if (!taskFlows) {
      throw new Error('could not find TaskFlow for ' + this.runtime);
    }

    for (let TaskFlow of taskFlows) {
      const taskFlow = new TaskFlow(this.serviceName, this.functionName, this.sourceDir, this.artifactDir, this.stages, this.runtime);

      await taskFlow.start();
    }
  }

  static async detectTaskFlow(runtime, sourceDir) {
    const detectTaskFlows = [];

    const taskFlows = runtimeTaskFlows[runtime];
  
    const TaskFlow = _.find(taskFlows, (taskFlow, manifest) => {
      const res = glob.sync(manifest, {
        cwd: sourceDir
      });
      
      if (res && res.length) { return true; }
    });

    if (TaskFlow) {
      detectTaskFlows.push(TaskFlow);
    } else {
      detectTaskFlows.push(DefaultTaskFlow);
    }

    return detectTaskFlows;
  }
}

module.exports = Builder;
