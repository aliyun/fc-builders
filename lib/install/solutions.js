'use strict';

const { AptTask, PipTask, NpmTask } = require('./task');
const log = require('../utils/log');

class PackageSolution {
  constructor(pkgName, context) {
    this.pkgName = pkgName;
    this.context = context;
    this.tasks = [];

    this.init();
  }

  init() { } 

  async install() {
    for (const task of this.tasks) {
      await task.run();
    }
  }

  static getPkgType() { }
  static getName() { }
}

class NpmPuppeteerSolution extends PackageSolution {
  constructor(context) {
    super('puppeteer', context);
  }

  static getPkgType() {
    return 'npm';
  }

  static getName() {
    return 'NpmPuppeteerSolution';
  }

  static getPkgName() {
    return 'puppeteer';
  }

  init() {

    this.tasks.push(
      new AptTask('libXtst6', this.context),
      new AptTask('libnss3', this.context),
      new AptTask('libxss1', this.context),
      new AptTask('libasound2', this.context),
      new AptTask('libatk-bridge2.0-0', this.context),
      new AptTask('libgtk-3-0', this.context),

      new NpmTask('puppeteer', this.context));
  }
}

class NpmDefaultSolution extends PackageSolution {
  constructor(pkgName, context) {
    super(pkgName, context);
  }

  init() {
    this.tasks.push(new NpmTask(this.pkgName, this.context));
  }

  static getName() {
    return 'NpmDefaultSolution';
  }

  static getPkgType() {
    return 'npm';
  }
}


class AptDefaultSolution extends PackageSolution {
  constructor(pkgName, context) {
    super(pkgName, context);
  }

  init() {
    this.tasks.push(new AptTask(this.pkgName, this.context));
  }

  static getPkgType() {
    return 'apt';
  }

  static getName() {
    return 'AptDefaultSolution';
  }
}

class PipDefaultSolution extends PackageSolution {
  constructor(pkgName, context) {
    super(pkgName, context);
  }

  init() {
    this.tasks.push(new PipTask(this.pkgName, this.context));
  }

  static getPkgType() {
    return 'pip';
  }

  static getName() {
    return 'PipDefaultSolution';
  }
}

const solutions = [ NpmPuppeteerSolution ];
const defaultSolutions = [ AptDefaultSolution, NpmDefaultSolution, PipDefaultSolution ];

const packageSolutionFactory = (pkgType, pkgName, context) => {
  for (const solution of solutions) {
    if (solution.getPkgType() === pkgType && solution.getPkgName() === pkgName) {
      log.debug('selected solution is: ', solution);
      return new solution(context);
    }
  }

  for (const defaultSolution of defaultSolutions) {
    if (defaultSolution.getPkgType() === pkgType) {
      return new defaultSolution(pkgName, context);
    }
  }

  throw new Error(`unknow package type ${pkgType}`);
};

module.exports = { packageSolutionFactory };