'use strict';

const MavenTaskFlow = require('./taskflows/java/maven/maven-task-flow');
const NpmTaskFlow = require('./taskflows/nodejs/npm/npm-task-flow');
const ComposerTaskFlow = require('./taskflows/php/composer/composer-task-flow');
const PipTaskFlow = require('./taskflows/python/pip/pip-task-flow');
const DefaultTaskFlow = require('./taskflows/default-task-flow');

const _ = require('lodash');
const path = require('path');
const fs = require('fs-extra');
const log = require('./utils/log');

const runtimeTaskFlows = {
  'java8': {
    'pom.xml': MavenTaskFlow
  },
  'nodejs8': {
    'package.json': NpmTaskFlow
  },
  'nodejs6': {
    'package.json': NpmTaskFlow
  },
  'nodejs10': {
    'package.json': NpmTaskFlow
  },
  'python2.7': {
    'requirements.txt': PipTaskFlow
  },
  'python3': {
    'requirements.txt': PipTaskFlow
  },
  'php7.2': {
    'composer.json': ComposerTaskFlow
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
      const taskFlow = new TaskFlow(this.serviceName, this.functionName, this.sourceDir, this.artifactDir);

      await taskFlow.start();
    }
  }

  static async detectTaskFlow(runtime, sourceDir) {

    const detectTaskFlows = [];

    const taskFlows = runtimeTaskFlows[runtime];
  
    const TaskFlow = _.find(taskFlows, (taskFlow, manifest) => {
      const manifestFile = path.join(sourceDir, manifest);
      
      if (fs.pathExistsSync(manifestFile)) { return true; }
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
