'use strict';

const _ = require('lodash');
const { AptTask, PipTask, NpmTask } = require('./task');
const log = require('../utils/log');

class PackageSolution {
  constructor(pkgName, cwd, env, target) {
    this.pkgName = pkgName;
    this.cwd = cwd;
    this.env = env;
    this.target = target;
    this.tasks = [];

    this.init();
  }

  init() { } 

  async install() {
    for (const task of this.tasks) {
      log.debug("task", task);
      await task.run();
    }
  }

  static getPkgType() { }
  static getName() { }
}

class NpmPuppeteerSolution extends PackageSolution {
  constructor(cwd, env, target) {
    super('puppeteer', cwd, env, target);
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
      new AptTask(this.cwd, 'libXtst6', this.env, this.target),
      new AptTask(this.cwd, 'libnss3', this.env, this.target),
      new AptTask(this.cwd, 'libxss1', this.env, this.target),
      new AptTask(this.cwd, 'libasound2', this.env, this.target),
      new AptTask(this.cwd, 'libatk-bridge2.0-0', this.env, this.target),
      new AptTask(this.cwd, 'libgtk-3-0', this.env, this.target),

      new NpmTask(this.cwd, 'puppeteer', this.env, this.target));
  }
}

class NpmDefaultSolution extends PackageSolution {
  constructor(pkgName, cwd, env, target) {
    super(pkgName, cwd, env, target);
  }

  init() {
    this.tasks.push(new NpmTask(this.cwd,
      this.pkgName, this.env, this.target));
  }

  static getName() {
    return 'NpmDefaultSolution';
  }

  static getPkgType() {
    return 'npm';
  }
}


class AptDefaultSolution extends PackageSolution {
  constructor(pkgName, cwd, env, target) {
    super(pkgName, cwd, env, target);
  }

  init() {
    this.tasks.push(new AptTask(this.cwd,
      this.pkgName, this.env, this.target));
  }

  static getPkgType() {
    return 'apt';
  }

  static getName() {
    return 'AptDefaultSolution';
  }
}

class PipDefaultSolution extends PackageSolution {
  constructor(pkgName, cwd, env, target) {
    super(pkgName, cwd, env, target);
  }

  init() {
    this.tasks.push(new PipTask(this.cwd,
      this.pkgName, this.env, this.target));
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

const packageSolutionFactory = (pkgType, pkgName, cwd, env, target) => {
  for (const solution of solutions) {
    if (solution.getPkgType() === pkgType && solution.getPkgName() === pkgName) {
      log.debug("selected solution is: ", solution);
      return new solution(cwd, env, target);
    }
  }

  for (const defaultSolution of defaultSolutions) {
    if (defaultSolution.getPkgType() === pkgType) {
      return new defaultSolution(pkgName, cwd, env, target);
    }
  }

  throw new Error(`unknow package type ${pkgType}`);
}

module.exports = { packageSolutionFactory };