'use strict';

const log = require('../utils/log');
const { packageSolutionFactory } = require('../install/solutions');
const path = require('path');
const fs = require('fs-extra');

// todo: add more parser support
const manifestItemParser = {
  'package.json': {
    parse: (manifestFilePath, cwd) => {
      const solutions = [];
      try {
        const dependencyManagerName = 'npm';

        const packageJson = require(manifestFilePath);

        const dependencies = packageJson.dependencies;
        if (dependencies) {
          for (const name of Object.keys(dependencies)) {
            solutions.push(packageSolutionFactory(dependencyManagerName, name, {
              cwd: cwd
            }));
          }
        }
      } catch (e) {
        log.error('parse manifestItem error', e);
      }

      return solutions;
    }
  }
};

class TaskFlow {
  constructor(name, serviceName, functionName, sourceDir, artifactDir, stages) {
    this.name = name;
    this.serviceName = serviceName;
    this.functionName = functionName;
    this.sourceDir = sourceDir;
    this.artifactDir = artifactDir;
    this.stages = stages || ['install', 'build'];
    this.installTasks = [];
    this.buildTasks = [];
    this.localTasks = [];

    if (process.env.BUILD_EXCLIUDE_FILES) {
      this.excludeFiles = process.env.BUILD_EXCLIUDE_FILES.split(';');
    } else {
      this.excludeFiles = [
        path.join('.fun', 'build'),
        path.join('.fun', 'nas'),
        path.join('.fun', 'tmp'),
        'Funfile',
        'fun.yml',
        '.funignore',
        'template.yml'
      ];
    }
  }

  async initTask() {

  }

  async beforeRun() {
    log.info('running task: flow %s', this.name);

    const manifestFileName = this.constructor.getManifestName();
    if (!manifestFileName) {
      log.debug('skipping prepare solution stage, taskflow is', this);
      return ;
    }

    const parser = manifestItemParser[manifestFileName];
    if (!parser) { return ; }

    const manifestFilePath = path.join(this.sourceDir, manifestFileName);

    if (await fs.pathExists(manifestFilePath)) {
      const solutions = parser.parse(manifestFilePath, this.sourceDir);
      for (const solution of solutions) {
        await solution.prepare();
      }
    }
  }

  async afterRun() {

  }

  async runInstall() {
    for (let task of this.installTasks) {
      await task.start();
    }
  }

  async runBuild() {
    for (let task of this.buildTasks) {
      await task.start();
    }
  }

  async runLocal() {
    for (let task of this.localTasks) {
      await task.start();
    }
  }

  async start() {
    if (!this.inited) {
      await this.init();
      this.inited = true;
    }

    await this.beforeRun();

    for (const stage of this.stages) {
      if (stage === 'install') {
        await this.runInstall();
      } else if (stage === 'build') {
        await this.runBuild();
      } else if (stage === 'local') {
        await this.runLocal();
      } else {
        throw new Error(`not support stage ${stage}`);
      }
    }

    await this.afterRun();
  }

  static getManifestName() { }
}

module.exports = TaskFlow;